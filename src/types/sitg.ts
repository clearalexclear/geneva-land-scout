/**
 * SITG (Système d'Information du Territoire à Genève) type definitions.
 *
 * These types match the raw JSON returned by the SITG ArcGIS REST FeatureServer.
 * Field names are lowercase (as returned by the API, despite uppercase aliases).
 *
 * Next steps:
 * - Import these records into Supabase/PostGIS for spatial joins (parcel × building × zone)
 * - Compute proper opportunity scores server-side using PostGIS ST_Intersects
 * - Replace heuristic scoring with multi-criteria analysis (see BACKEND_INTEGRATION_PLAN.md)
 */

// ---------------------------------------------------------------------------
// Raw API response shapes
// ---------------------------------------------------------------------------

/** Raw attributes returned by CAD_PARCELLE_MENSU FeatureServer */
export interface SitgParcelAttributes {
  objectid: number;
  egrid: string;
  commune: string;
  no_comm: number;
  no_parcelle: number;
  /** Human-readable parcel ID, e.g. "21:7322" */
  ideddp: string;
  /** Surface in m² */
  surface: number;
  /** Property type, e.g. "DP communal", "Propriété privée" */
  type_propri: string | null;
  /** Legal status, e.g. "en vigueur" */
  validite: string;
  /** URL to the RDPPF (Restrictions de droit public à la propriété foncière) extract PDF */
  extrait_rdppf_pdf: string | null;
}

/** Polygon geometry as returned by the API (WGS84 when outSR=4326) */
export interface SitgPolygonGeometry {
  /** Outer ring first, holes after. Each point is [longitude, latitude]. */
  rings: Array<Array<[number, number]>>;
}

export interface SitgParcelFeature {
  attributes: SitgParcelAttributes;
  geometry: SitgPolygonGeometry;
}

export interface SitgParcelResponse {
  features: SitgParcelFeature[];
  /** True when the server hit maxRecordCount and there are more records */
  exceededTransferLimit?: boolean;
  error?: { code: number; message: string };
}

// ---------------------------------------------------------------------------

/** Raw attributes returned by CAD_BATIMENT_HORSOL FeatureServer */
export interface SitgBuildingAttributes {
  objectid: number;
  /** EGRID of the parcel this building's centroid falls on */
  egrid_centroide: string | null;
  /** Footprint area in m² */
  surface: number;
  niveaux_horsol: number | null;
  hauteur: number | null;
  destination: string | null;
}

export interface SitgBuildingFeature {
  attributes: SitgBuildingAttributes;
}

export interface SitgBuildingResponse {
  features: SitgBuildingFeature[];
  exceededTransferLimit?: boolean;
  error?: { code: number; message: string };
}

// ---------------------------------------------------------------------------

/** Raw attributes returned by RDPPF_ZONES_DEV FeatureServer */
export interface SitgZoneAttributes {
  objectid: number;
  commune: string;
  abrv_zone: string;
  nom_zone: string;
  desc_zone: string | null;
  statut_jur: string;
  lien_plan: string | null;
  lien_loi: string | null;
  /** Unix timestamp (ms) */
  date_maj: number | null;
}

export interface SitgZoneFeature {
  attributes: SitgZoneAttributes;
}

export interface SitgZoneResponse {
  features: SitgZoneFeature[];
  exceededTransferLimit?: boolean;
  error?: { code: number; message: string };
}

// ---------------------------------------------------------------------------
// Normalized display types (post-processing)
// ---------------------------------------------------------------------------

/**
 * Normalized SITG parcel ready for rendering on the map and in the side panel.
 *
 * Scoring is PRELIMINARY and heuristic — not suitable for investment decisions.
 * Proper scoring requires PostGIS spatial joins (see BACKEND_INTEGRATION_PLAN.md).
 */
export interface SitgParcel {
  /** Discriminator so code can tell mock from real data at runtime */
  source: "sitg";

  // Cadastral identity
  objectid: number;
  egrid: string;
  commune: string;
  no_comm: number;
  no_parcelle: number;
  ideddp: string;

  // Core attributes
  surface: number;
  type_propri: string | null;
  validite: string;
  rdppf_url: string | null;

  // Polygon geometry
  /** Outer ring in Leaflet [lat, lng] format (already transposed from SITG [lng, lat]) */
  latlngs: Array<[number, number]>;
  /** Centroid as [lat, lng] for map fly-to */
  centroid: [number, number];

  // Derived / enriched fields
  /** True if at least one building has egrid_centroide matching this parcel's EGRID */
  isBuilt: boolean;
  /** Zone de développement label if the parcel's commune has a matching dev zone, else null */
  zoneLabel: string | null;
  /** Zone abbreviation, e.g. "D3", "D4A" */
  zoneAbrv: string | null;

  // Preliminary scoring
  /** 0–100 heuristic score. Label clearly as preliminary. */
  score: number;
}

/**
 * Normalized development zone (attribute-only, no geometry).
 * Stored keyed by commune for O(1) lookup.
 */
export interface SitgZone {
  objectid: number;
  commune: string;
  abrvZone: string;
  nomZone: string;
  descZone: string | null;
  statutJur: string;
  lienPlan: string | null;
  lienLoi: string | null;
  dateMaj: Date | null;
}
