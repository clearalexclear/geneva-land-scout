/**
 * GenevaMap — SSR-safe wrapper.
 *
 * Leaflet accesses `window` at import time and crashes during server-side
 * rendering. This wrapper uses ClientOnly + React.lazy so the real map
 * implementation (GenevaMap.client.tsx) is only ever loaded in the browser.
 */
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { Parcel } from "@/lib/mockData";
import type { SitgParcel } from "@/types/sitg";

const GenevaMapClient = lazy(() => import("./GenevaMap.client"));

const Fallback = () => (
  <div className="h-full w-full" style={{ background: "#dbe3ec" }} />
);

export interface GenevaMapProps {
  /** Mock parcels (shown as circle markers in mock mode) */
  parcels: Parcel[];
  selected: Parcel | null;
  onSelect: (p: Parcel) => void;

  /** Real SITG parcels (shown as polygon fills) */
  sitgParcels?: SitgParcel[];
  selectedSitg?: SitgParcel | null;
  onSelectSitg?: (p: SitgParcel) => void;

  /** Called on map moveend / zoomend for future viewport-driven loading */
  onBoundsChange?: (bbox: [number, number, number, number]) => void;
}

export function GenevaMap(props: GenevaMapProps) {
  return (
    <ClientOnly fallback={<Fallback />}>
      <Suspense fallback={<Fallback />}>
        <GenevaMapClient {...props} />
      </Suspense>
    </ClientOnly>
  );
}
