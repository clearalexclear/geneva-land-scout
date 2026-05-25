import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { parcels, communes, zones, typeLabel, riskLabel, Parcel } from "@/lib/mockData";
import { X, MapPin, ArrowUpRight } from "lucide-react";
import { GenevaMap } from "@/components/GenevaMap";

export const Route = createFileRoute("/_app/carte")({
  component: CartePage,
});

function CartePage() {
  const [commune, setCommune] = useState<string>("all");
  const [zone, setZone] = useState<string>("all");
  const [minSurface, setMinSurface] = useState("");
  const [minScore, setMinScore] = useState([60]);
  const [onlyNonBati, setOnlyNonBati] = useState(false);
  const [onlySousExp, setOnlySousExp] = useState(false);
  const [onlyZoneDev, setOnlyZoneDev] = useState(false);
  const [onlyPLQ, setOnlyPLQ] = useState(false);
  const [onlyLowConstraint, setOnlyLowConstraint] = useState(false);
  const [selected, setSelected] = useState<Parcel | null>(null);

  const filtered = parcels.filter((p) => {
    if (commune !== "all" && p.commune !== commune) return false;
    if (zone !== "all" && p.zone !== zone) return false;
    if (minSurface && p.surface < Number(minSurface)) return false;
    if (p.score < minScore[0]) return false;
    if (onlyNonBati && p.type !== "non_bati") return false;
    if (onlySousExp && p.type !== "sous_exploite") return false;
    if (onlyZoneDev && p.type !== "zone_dev") return false;
    if (onlyPLQ && !p.zone.toLowerCase().includes("développement")) return false;
    if (onlyLowConstraint && p.risk !== "faible") return false;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <PageHeader
        title="Carte foncière"
        description={`${filtered.length} parcelles visibles sur le canton de Genève`}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Filters */}
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r bg-card/50 md:block">
          <div className="space-y-5 p-5">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Commune</Label>
              <Select value={commune} onValueChange={setCommune}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {communes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Zone</Label>
              <Select value={zone} onValueChange={setZone}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {zones.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Surface minimum (m²)</Label>
              <Input
                type="number"
                placeholder="ex. 1000"
                value={minSurface}
                onChange={(e) => setMinSurface(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Score minimum</Label>
                <span className="text-sm font-medium">{minScore[0]}</span>
              </div>
              <Slider min={0} max={100} step={1} value={minScore} onValueChange={setMinScore} className="mt-3" />
            </div>
            <Separator />
            <div className="space-y-3">
              <FilterCheck checked={onlyNonBati} onChange={setOnlyNonBati} label="Non bâti" />
              <FilterCheck checked={onlySousExp} onChange={setOnlySousExp} label="Sous-exploité" />
              <FilterCheck checked={onlyZoneDev} onChange={setOnlyZoneDev} label="Zone de développement" />
              <FilterCheck checked={onlyPLQ} onChange={setOnlyPLQ} label="PLQ en cours" />
              <FilterCheck checked={onlyLowConstraint} onChange={setOnlyLowConstraint} label="Contraintes faibles uniquement" />
            </div>
          </div>
        </aside>

        {/* Map */}
        <div className="relative flex-1 overflow-hidden">
          <GenevaMap parcels={filtered} selected={selected} onSelect={setSelected} />



          {/* Legend */}
          <Card className="absolute bottom-4 left-4 w-auto">
            <CardContent className="flex items-center gap-4 p-3 text-xs">
              <LegendDot c="bg-success" label="Forte opportunité" />
              <LegendDot c="bg-warning" label="Moyenne" />
              <LegendDot c="bg-destructive" label="Contraintes" />
              <LegendDot c="bg-muted-foreground/60" label="Non pertinent" />
            </CardContent>
          </Card>
        </div>

        {/* Side panel */}
        {selected && (
          <aside className="w-full max-w-sm shrink-0 overflow-y-auto border-l bg-card">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-success" />
                Parcelle
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{selected.id}</div>
                <h2 className="mt-1 font-serif text-2xl tracking-tight">{selected.address}</h2>
                <div className="mt-1 text-sm text-muted-foreground">{selected.commune}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-success/15 text-lg font-semibold text-success">
                  {selected.score}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Score d'opportunité</div>
                  <div className="text-sm">Risque <span className="font-medium">{riskLabel(selected.risk)}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Surface" value={`${selected.surface.toLocaleString("fr-CH")} m²`} />
                <Info label="Zone" value={selected.zone} />
                <Info label="Bâti existant" value={selected.built ? "Oui" : "Non"} />
                <Info label="Type" value={typeLabel(selected.type)} />
                <Info label="Potentiel SBP" value={`${selected.buildablePotential.toLocaleString("fr-CH")} m²`} />
                <Info label="Logements estimés" value={selected.estimatedHousing.toString()} />
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Contraintes</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selected.constraints.map((c) => (
                    <Badge key={c} variant="secondary">{c}</Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Action recommandée</div>
                <p className="mt-1">{selected.recommendation}</p>
              </div>

              <Button className="w-full" asChild>
                <Link to="/parcelle/$id" params={{ id: selected.id }}>
                  Ouvrir la fiche complète
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function FilterCheck({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      <span>{label}</span>
    </label>
  );
}

function LegendDot({ c, label }: { c: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${c}`} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
