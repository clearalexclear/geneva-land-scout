/**
 * SITG ArcGIS REST API integration for FoncierRadar.
 *
 * SITG = Système d'Information du Territoire à Genève
 * Base: https://app2.ge.ch/tergeoservices/rest/services/Hosted/
 *
 * Coordinate system notes:
 *   - Internal CRS: EPSG:2056 (Swiss LV95)
 *   - We always request outSR=4326 (WGS84) so Leaflet can consume the data directly
 *   - Polygon rings come as [longitude, latitude] pairs → we transpose to [lat, lng]
 *
 * Current limitations / next steps:
 *   - Scoring is heuristic (no spatial joins). Import into Supabase/PostGIS for
 *     proper parcel × building × zone intersection analysis.
 *   - "isBuilt" uses egrid_centroide matching, which misses buildings whose centroid
 *     falls outside the parcel boundary.
 *   - Zone matching is commune-level, not spatial. A parcel might be near a dev zone
 *     without being inside it.
 *   - maxRecordCount=2000; we auto-paginate up to MAX_PAGES to handle large communes.
 */

import type {
  SitgParcel,
  SitgParcelFeature,
  SitgParcelResponse,
  SitgBuildingResponse,
  SitgZone,
  SitgZoneResponse,
} from "@/types/sitg";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BASE = "https://app2.ge.ch/tergeoservices/rest/services/Hosted";

const PARCELS_URL = `${BASE}/CAD_PARCELLE_MENSU/FeatureServer/0/query`;
const BUILDINGS_URL = `${BASE}/CAD_BATIMENT_HORSOL/FeatureServer/0/query`;
const ZONES_URL = `${BASE}/RDPPF_ZONES_DEV/FeatureServer/0/query`;

/** Maximum number of 2000-record pages to fetch per commune */
const MAX_PAGES = 4; // up to 8 000 parcels

/**
 * SITG communes available for fetching.
 * "Genève" maps to a LIKE query to cover all sub-communes (Cité, Eaux-Vives, etc.)
 */
export const SITG_COMMUNES: string[] = [
  "Carouge",
  "Chêne-Bougeries",
  "Cologny",
  "Collonge-Bellerive",
  "Genève",
  "Grand-Saconnex",
  "Lancy",
  "Meyrin",
  "Onex",
  "Plan-les-Ouates",
  "Thônex",
  "Vandoeuvres",
  "Vernier",
  "Bernex",
  "Bellevue",
  "Confignon",
  "Pregny-Chambésy",
  "Troinex",
  "Veyrier",
  "Versoix",
];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Build the SQL WHERE clause for a commune name */
function communeWhere(commune: string): string {
  // "Genève" in SITG is split into Genève-Cité, Genève-Eaux-Vives, etc.
  if (commune === "Genève") return "commune LIKE 'Genève%'";
  return `commune='${commune}'`;
}

/** Compute centroid of a polygon as the average of its outer-ring vertices */
function computeCentroid(rings: Array<Array<[number, number]>>): [number, number] {
  const ring = rings[0];
  if (!ring || ring.length === 0) return [46.2044, 6.1432]; // Geneva fallback
  const avgLng = ring.reduce((s, p) => s + p[0], 0) / ring.length;
  const avgLat = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  return [avgLat, avgLng];
}

/** Transpose SITG [lng, lat] rings to Leaflet [lat, lng] for the outer ring */
function toLatLngs(rings: Array<Array<[number, number]>>): Array<[number, number]> {
  return (rings[0] ?? []).map(([lng, lat]) => [lat, lng]);
}

/**
 * Heuristic opportunity score (0–100).
 *
 * This is a PRELIMINARY score based on surface, built status, and zone presence.
 * It is NOT a validated investment analysis — label clearly as "Score préliminaire".
 *
 * Proper scoring requires:
 *   - PostGIS spatial join: parcel ∩ building footprint → effective SBP coverage
 *   - Zoning rules: IUS × surface → theoretical max SBP
 *   - Ratio actual/max SBP → under-exploitation index
 *   - Additional criteria: heritage, noise, PLQ constraints
 */
function scoreParcel(
  surface: number,
  isBuilt: boolean,
  zoneAbrv: string | null,
  typePropri: string | null,
): number {
  let s = 40; // base score

  // Built status: unbuilt parcels have higher opportunity
  if (!isBuilt) s += 25;

  // Surface bonus
  if (surface >= 3000) s += 18;
  else if (surface >= 2000) s += 14;
  else if (surface >= 1000) s += 8;
  else if (surface < 400) s -= 10;

  // Development zone bonus
  if (zoneAbrv !== null) s += 15;

  // Private property bonus (public domain parcels are harder to acquire)
  if (typePropri && typePropri.toLowerCase().includes("priv")) s += 7;

  return Math.max(10, Math.min(100, s));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch all development zones (attribute-only, no geometry).
 * There are ~756 records total → fits in one request.
 * Returns a map: commune → best zone for that commune.
 */
export async function fetchSitgDevZones(): Promise<Map<string, SitgZone>> {
  const params = new URLSearchParams({
    where: "statut_jur='En vigueur'",
    outFields: "objectid,commune,abrv_zone,nom_zone,desc_zone,statut_jur,lien_plan,lien_loi,date_maj",
    returnGeometry: "false",
    f: "json",
    resultRecordCount: "1000",
  });

  console.log("[SITG] Fetching dev zones…");
  const res = await fetch(`${ZONES_URL}?${params}`);
  if (!res.ok) throw new Error(`SITG zones HTTP ${res.status}`);

  const data: SitgZoneResponse = await res.json();
  if (data.error) throw new Error(`SITG zones API error: ${data.error.message}`);

  const zoneMap = new Map<string, SitgZone>();
  for (const feat of data.features ?? []) {
    const a = feat.attributes;
    // Keep the first zone per commune (they may have multiple — we just need to know if zone exists)
    if (!zoneMap.has(a.commune)) {
      zoneMap.set(a.commune, {
        objectid: a.objectid,
        commune: a.commune,
        abrvZone: a.abrv_zone,
        nomZone: a.nom_zone,
        descZone: a.desc_zone,
        statutJur: a.statut_jur,
        lienPlan: a.lien_plan,
        lienLoi: a.lien_loi,
        dateMaj: a.date_maj ? new Date(a.date_maj) : null,
      });
    }
  }

  console.log(`[SITG] Dev zones loaded: ${zoneMap.size} communes with zones`);
  return zoneMap;
}

/**
 * Fetch the set of EGRIDs that have at least one building on them (for a given commune).
 * Uses egrid_centroide to approximate building presence on a parcel.
 *
 * TODO (Supabase): Replace with PostGIS ST_Within(building.geometry, parcel.geometry)
 * for accurate spatial coverage analysis.
 */
export async function fetchSitgBuiltEgrids(commune: string): Promise<Set<string>> {
  const params = new URLSearchParams({
    where: communeWhere(commune),
    outFields: "objectid,egrid_centroide",
    returnGeometry: "false",
    f: "json",
    resultRecordCount: "2000",
  });

  console.log(`[SITG] Fetching built EGRIDs for ${commune}…`);
  const res = await fetch(`${BUILDINGS_URL}?${params}`);
  if (!res.ok) throw new Error(`SITG buildings HTTP ${res.status}`);

  const data: SitgBuildingResponse = await res.json();
  if (data.error) throw new Error(`SITG buildings API error: ${data.error.message}`);

  const set = new Set<string>();
  for (const feat of data.features ?? []) {
    const eg = feat.attributes.egrid_centroide;
    if (eg) set.add(eg);
  }

  console.log(`[SITG] Built EGRIDs for ${commune}: ${set.size}`);
  return set;
}

/**
 * Fetch one page of raw parcel features for a commune.
 * Returns features + whether more pages exist.
 */
async function fetchParcelPage(
  commune: string,
  minSurface: number,
  offset: number,
): Promise<{ features: SitgParcelFeature[]; exceeded: boolean }> {
  const surfaceClause = minSurface > 0 ? ` AND surface>=${minSurface}` : "";
  const where = communeWhere(commune) + surfaceClause;

  const params = new URLSearchParams({
    where,
    outFields: "objectid,egrid,commune,no_comm,no_parcelle,ideddp,surface,type_propri,validite,extrait_rdppf_pdf",
    returnGeometry: "true",
    outSR: "4326",
    // Simplify vertices ~1 m tolerance — reduces payload while keeping shape accuracy
    maxAllowableOffset: "0.000009",
    f: "json",
    resultRecordCount: "2000",
    resultOffset: String(offset),
  });

  const res = await fetch(`${PARCELS_URL}?${params}`);
  if (!res.ok) throw new Error(`SITG parcels HTTP ${res.status}`);

  const data: SitgParcelResponse = await res.json();
  if (data.error) throw new Error(`SITG parcels API error: ${data.error.message}`);

  return {
    features: data.features ?? [],
    exceeded: data.exceededTransferLimit === true,
  };
}

/**
 * Fetch all parcels for a commune (with auto-pagination up to MAX_PAGES).
 * Enriches each parcel with built status, zone info, and preliminary score.
 *
 * @param commune - One of SITG_COMMUNES
 * @param minSurface - Minimum surface in m² (0 = no filter)
 * @param devZones - Zone map from fetchSitgDevZones()
 * @param builtEgrids - Set from fetchSitgBuiltEgrids()
 */
export async function fetchSitgParcels(
  commune: string,
  minSurface: number,
  devZones: Map<string, SitgZone>,
  builtEgrids: Set<string>,
): Promise<{ parcels: SitgParcel[]; truncated: boolean }> {
  let allFeatures: SitgParcelFeature[] = [];
  let truncated = false;

  for (let page = 0; page < MAX_PAGES; page++) {
    console.log(`[SITG] Fetching parcels page ${page + 1} for ${commune} (offset=${page * 2000})…`);
    const { features, exceeded } = await fetchParcelPage(commune, minSurface, page * 2000);
    allFeatures = allFeatures.concat(features);

    if (!exceeded) break;
    if (page === MAX_PAGES - 1) {
      truncated = true;
      console.warn(`[SITG] Hit max page limit (${MAX_PAGES} pages, ${allFeatures.length} parcels). Results truncated.`);
    }
  }

  // Resolve zone for each sub-commune variant
  // e.g. "Genève-Cité" → look up "Genève-Cité" first, then "Genève%"
  const getZone = (comm: string): SitgZone | undefined => {
    if (devZones.has(comm)) return devZones.get(comm);
    // Fallback: match any zone whose commune starts with the base name
    for (const [key, zone] of devZones) {
      if (comm.startsWith(key) || key.startsWith(comm)) return zone;
    }
    return undefined;
  };

  const parcels: SitgParcel[] = allFeatures
    .filter((f) => f.geometry?.rings?.length > 0)
    .map((f) => {
      const a = f.attributes;
      const rings = f.geometry.rings as Array<Array<[number, number]>>;
      const zone = getZone(a.commune);
      const isBuilt = builtEgrids.has(a.egrid);

      return {
        source: "sitg" as const,
        objectid: a.objectid,
        egrid: a.egrid,
        commune: a.commune,
        no_comm: a.no_comm,
        no_parcelle: a.no_parcelle,
        ideddp: a.ideddp,
        surface: a.surface,
        type_propri: a.type_propri,
        validite: a.validite,
        rdppf_url: a.extrait_rdppf_pdf,
        latlngs: toLatLngs(rings),
        centroid: computeCentroid(rings),
        isBuilt,
        zoneLabel: zone?.nomZone ?? null,
        zoneAbrv: zone?.abrvZone ?? null,
        score: scoreParcel(a.surface, isBuilt, zone?.abrvZone ?? null, a.type_propri),
      };
    });

  console.log(`[SITG] Normalized ${parcels.length} parcels for ${commune}`);
  return { parcels, truncated };
}

/**
 * Convenience: fetch everything needed for a commune in one call.
 * Runs devZones + buildings fetch in parallel, then parcels.
 */
export async function loadSitgData(
  commune: string,
  minSurface: number,
): Promise<{ parcels: SitgParcel[]; truncated: boolean }> {
  // Fetch zones + buildings in parallel (independent)
  const [devZones, builtEgrids] = await Promise.all([
    fetchSitgDevZones(),
    fetchSitgBuiltEgrids(commune),
  ]);

  // Parcels depend on zones + buildings for enrichment
  return fetchSitgParcels(commune, minSurface, devZones, builtEgrids);
}
