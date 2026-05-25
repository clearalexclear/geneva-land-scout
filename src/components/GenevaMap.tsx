import { lazy, Suspense, useEffect, useState } from "react";
import type { Parcel } from "@/lib/mockData";

const GenevaMapClient = lazy(() => import("./GenevaMap.client"));

export function GenevaMap(props: {
  parcels: Parcel[];
  selected: Parcel | null;
  onSelect: (p: Parcel) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-full w-full" style={{ background: "#dbe3ec" }} />;
  }

  return (
    <Suspense fallback={<div className="h-full w-full" style={{ background: "#dbe3ec" }} />}>
      <GenevaMapClient {...props} />
    </Suspense>
  );
}
