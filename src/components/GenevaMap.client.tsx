import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Parcel, scoreColor } from "@/lib/mockData";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

const GENEVA_CENTER: [number, number] = [46.2044, 6.1432];
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [45.95, 5.85],
  [46.45, 6.55],
];

const colorFor = (score: number) => {
  const c = scoreColor(score);
  if (c === "success") return "oklch(0.62 0.13 155)";
  if (c === "warning") return "oklch(0.75 0.15 65)";
  if (c === "destructive") return "oklch(0.58 0.22 25)";
  return "oklch(0.5 0.02 250)";
};

function FlyTo({ parcel }: { parcel: Parcel | null }) {
  const map = useMap();
  useEffect(() => {
    if (parcel) map.flyTo([parcel.lat, parcel.lng], 15, { duration: 0.6 });
  }, [parcel, map]);
  return null;
}

export default function GenevaMapClient({
  parcels,
  selected,
  onSelect,
}: {
  parcels: Parcel[];
  selected: Parcel | null;
  onSelect: (p: Parcel) => void;
}) {
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
      {parcels.map((p) => {
        const isSel = selected?.id === p.id;
        const color = colorFor(p.score);
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={isSel ? 11 : 8}
            pathOptions={{
              color: isSel ? "oklch(0.22 0.05 255)" : "#ffffff",
              weight: isSel ? 3 : 2,
              fillColor: color,
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
      <FlyTo parcel={selected} />
    </MapContainer>
  );
}
