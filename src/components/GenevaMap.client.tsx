/**
 * GenevaMap.client — actual Leaflet implementation.
 *
 * Browser-only. Never import this file directly; always go through
 * GenevaMap.tsx which wraps it in ClientOnly + Suspense.
 */
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polygon,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Parcel, scoreColor } from "@/lib/mockData";
import type { SitgParcel } from "@/types/sitg";
import type { GenevaMapProps } from "./GenevaMap";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

const GENEVA_CENTER: [number, number] = [46.2044, 6.1432];
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [45.95, 5.85],
  [46.45, 6.55],
];

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

const SCORE_COLORS = {
  success: "oklch(0.62 0.13 155)",    // green  – score ≥ 80
  warning: "oklch(0.75 0.15 65)",     // orange – score 65–79
  destructive: "oklch(0.58 0.22 25)", // red    – score 50–64
  muted: "oklch(0.5 0.02 250)",       // grey   – score < 50
} as const;

function circleColor(score: number): string {
  const c = scoreColor(score);
  return SCORE_COLORS[c];
}

function polygonFill(score: number): string {
  if (score >= 80) return "#22c55e"; // green
  if (score >= 65) return "#f59e0b"; // amber
  if (score >= 50) return "#ef4444"; // red
  return "#94a3b8";                  // slate
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 16, { duration: 0.6 });
  }, [target, map]);
  return null;
}

/**
 * Fires onBoundsChange whenever the user pans or zooms.
 * Ready for viewport-driven SITG data loading (future improvement).
 */
function BoundsWatcher({
  onChange,
}: {
  onChange?: (bbox: [number, number, number, number]) => void;
}) {
  useMapEvents({
    moveend(e) {
      if (!onChange) return;
      const b = (e.target as L.Map).getBounds();
      onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
    },
    zoomend(e) {
      if (!onChange) return;
      const b = (e.target as L.Map).getBounds();
      onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
    },
  });
  return null;
}

// ---------------------------------------------------------------------------
// Main export (default, consumed by GenevaMap.tsx via React.lazy)
// ---------------------------------------------------------------------------

export default function GenevaMapClient({
  parcels,
  selected,
  onSelect,
  sitgParcels = [],
  selectedSitg = null,
  onSelectSitg,
  onBoundsChange,
}: GenevaMapProps) {
  // Fly target: SITG centroid takes priority over mock parcel coords
  const flyTarget: [number, number] | null =
    selectedSitg
      ? selectedSitg.centroid
      : selected
      ? [selected.lat, selected.lng]
      : null;

  return (
    <MapContainer
      center={GENEVA_CENTER}
      zoom={12}
      scrollWheelZoom
      maxBounds={MAX_BOUNDS}
      maxBoundsViscosity={0.8}
      className="h-full w-full"
      style={{ background: "#dbe3ec" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* ── SITG real parcels (polygon fills) ───────────────────────────── */}
      {sitgParcels.map((p) => {
        const isSel = selectedSitg?.objectid === p.objectid;
        return (
          <Polygon
            key={p.objectid}
            positions={p.latlngs}
            pathOptions={{
              color: isSel ? "#1e3a5f" : "#ffffff",
              weight: isSel ? 3 : 1,
              fillColor: polygonFill(p.score),
              fillOpacity: isSel ? 0.75 : 0.55,
              opacity: 0.9,
            }}
            eventHandlers={{ click: () => onSelectSitg?.(p) }}
          >
            <Tooltip direction="top" opacity={1} sticky>
              <div className="text-xs max-w-[180px]">
                <div className="font-semibold">{p.ideddp}</div>
                <div className="text-muted-foreground">
                  {p.commune} · {p.surface.toLocaleString("fr-CH")} m²
                </div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">
                  Score préliminaire : {p.score}
                </div>
              </div>
            </Tooltip>
          </Polygon>
        );
      })}

      {/* ── Mock parcels (circle markers) ───────────────────────────────── */}
      {parcels.map((p) => {
        const isSel = selected?.id === p.id;
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={isSel ? 11 : 8}
            pathOptions={{
              color: isSel ? "oklch(0.22 0.05 255)" : "#ffffff",
              weight: isSel ? 3 : 2,
              fillColor: circleColor(p.score),
              fillOpacity: 0.95,
            }}
            eventHandlers={{ click: () => onSelect(p) }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <div className="text-xs">
                <div className="font-semibold">{p.address}</div>
                <div className="text-muted-foreground">
                  {p.commune} · Score {p.score}
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}

      <FlyTo target={flyTarget} />
      <BoundsWatcher onChange={onBoundsChange} />
    </MapContainer>
  );
}
