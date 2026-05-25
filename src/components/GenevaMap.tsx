import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { Parcel } from "@/lib/mockData";

const GenevaMapClient = lazy(() => import("./GenevaMap.client"));

const Fallback = () => <div className="h-full w-full" style={{ background: "#dbe3ec" }} />;

export function GenevaMap(props: {
  parcels: Parcel[];
  selected: Parcel | null;
  onSelect: (p: Parcel) => void;
}) {
  return (
    <ClientOnly fallback={<Fallback />}>
      <Suspense fallback={<Fallback />}>
        <GenevaMapClient {...props} />
      </Suspense>
    </ClientOnly>
  );
}
