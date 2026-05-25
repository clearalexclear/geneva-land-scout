import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useMemo } from "react";
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
import { loadSitgData, SITG_COMMUNES } from "@/lib/sitgApi";
import type { SitgParcel } from "@/types/sitg";
import {
  X, MapPin, ArrowUpRight, Database, FlaskConical,
  Loader2, AlertTriangle, ExternalLink,
} from "lucide-react";
import { GenevaMap } from "@/components/GenevaMap";

export const Route = createFileRoute("/_app/carte")({
  component: CartePage,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DataSrc = "mock" | "sitg";

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

function CartePage() {
  // ── Data source toggle ───────────────────────────────────────────────────
  const [dataSrc, setDataSrc] = useState<DataSrc>("sitg");

  // ── Shared filters ───────────────────────────────────────────────────────
  const [commune, setCommune] = useState<string>("all");
  const [zone, setZone] = useState<string>("all");
  const [minSurface, setMinSurface] = useState("");
  const [minScore, setMinScore] = useState([50]);
  const [onlyNonBati, setOnlyNonBati] = useState(false);
  const [onlySousExp, setOnlySousExp] = useState(false);
  const [onlyZoneDev, setOnlyZoneDev] = useState(false);
  const [onlyPLQ, setOnlyPLQ] = useState(false);
  const [onlyLowConstraint, setOnlyLowConstraint] = useState(false);

  // ── Mock parcel selection ────────────────────────────────────────────────
  const [selected, setSelected] = useState<Parcel | null>(null);

  // ── SITG state ───────────────────────────────────────────────────────────
  const [sitgCommune, setSitgCommune] = useState<string>("Carouge");
  const [sitgParcels, setSitgParcels] = useState<SitgParcel[]>([]);
  const [sitgLoading, setSitgLoading] = useState(false);
  const [sitgError, setSitgError] = useState<string | null>(null);
  const [sitgTruncated, setSitgTruncated] = useState(false);
  const [selectedSitg, setSelectedSitg] = useState<SitgParcel | null>(null);

  // ── SITG data loader ─────────────────────────────────────────────────────
  const loadSitg = useCallback(async (comm: string, surfaceMin: number) => {
    setSitgLoading(true);
    setSitgError(null);
    setSitgParcels([]);
    setSelectedSitg(null);

    try {
      const { parcels: loaded, truncated } = await loadSitgData(comm, surfaceMin);
      setSitgParcels(loaded);
      setSitgTruncated(truncated);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("[SITG] Load error:", err);
      setSitgError(msg);
    } finally {
      setSitgLoading(false);
    }
  }, []);

  // ── Filtered mock parcels ────────────────────────────────────────────────
  const filteredMock = useMemo(() => {
    if (dataSrc !== "mock") return [];
    return parcels.filter((p) => {
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
  }, [dataSrc, commune, zone, minSurface, minScore, onlyNonBati, onlySousExp, onlyZoneDev, onlyPLQ, onlyLowConstraint]);

  // ── Filtered SITG parcels (client-side after fetch) ──────────────────────
  const filteredSitg = useMemo(() => {
    if (dataSrc !== "sitg") return [];
    return sitgParcels.filter((p) => {
      if (minSurface && p.surface < Number(minSurface)) return false;
      if (p.score < minScore[0]) return false;
      // Non bâti = not built
      if (onlyNonBati && p.isBuilt) return false;
      // Sous-exploité = built but large parcel (heuristic: built + surface >= 1000)
      if (onlySousExp && !(p.isBuilt && p.surface >= 1000)) return false;
      // Zone de développement = has a dev zone label
      if (onlyZoneDev && p.zoneLabel === null) return false;
      // Contraintes faibles ≈ score >= 70 (heuristic)
      if (onlyLowConstraint && p.score < 70) return false;
      return true;
    });
  }, [dataSrc, sitgParcels, minSurface, minScore, onlyNonBati, onlySousExp, onlyZoneDev, onlyLowConstraint]);

  // ── Visible count label ──────────────────────────────────────────────────
  const countLabel = dataSrc === "sitg"
    ? sitgLoading
      ? "Chargement…"
      : sitgError
      ? "Erreur de chargement"
      : `${filteredSitg.length.toLocaleString("fr-CH")} parcelles réelles SITG — ${sitgCommune}`
    : `${filteredMock.length} parcelles mock visibles`;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleToggle = (src: DataSrc) => {
    setDataSrc(src);
    setSelected(null);
    setSelectedSitg(null);
  };

  const handleSitgLoad = () => {
    loadSitg(sitgCommune, minSurface ? Number(minSurface) : 0);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <PageHeader
        title="Carte foncière"
        description={countLabel}
        actions={
          <DataSourceToggle current={dataSrc} onChange={handleToggle} />
        }
      />
      <div className="flex flex-1 overflow-hidden">
        {/* ── Filters sidebar ─────────────────────────────────────────────── */}
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r bg-card/50 md:block">
          <div className="space-y-5 p-5">

            {/* SITG-specific controls */}
            {dataSrc === "sitg" && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                  <Database className="h-3.5 w-3.5" />
                  Source SITG réelle
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Commune</Label>
                  <Select value={sitgCommune} onValueChange={setSitgCommune}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SITG_COMMUNES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleSitgLoad}
                  disabled={sitgLoading}
                >
                  {sitgLoading
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Chargement…</>
                    : "Charger les données SITG"}
                </Button>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  Données cadastrales réelles — SITG ArcGIS FeatureServer.
                  Scores préliminaires, non validés.
                </p>
              </div>
            )}

            {/* Commune filter (mock mode only) */}
            {dataSrc === "mock" && (
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
            )}

            {/* Zone filter (mock mode only) */}
            {dataSrc === "mock" && (
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
            )}

            {/* Surface minimum — works in both modes */}
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Surface minimum (m²)
                {dataSrc === "sitg" && <span className="ml-1 normal-case text-primary">(filtre SITG)</span>}
              </Label>
              <Input
                type="number"
                placeholder="ex. 1000"
                value={minSurface}
                onChange={(e) => setMinSurface(e.target.value)}
                className="mt-1.5"
              />
            </div>

            {/* Score minimum */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Score minimum
                  {dataSrc === "sitg" && (
                    <span className="ml-1 normal-case text-muted-foreground">(préliminaire)</span>
                  )}
                </Label>
                <span className="text-sm font-medium">{minScore[0]}</span>
              </div>
              <Slider min={0} max={100} step={1} value={minScore} onValueChange={setMinScore} className="mt-3" />
            </div>

            <Separator />

            {/* Type filters */}
            <div className="space-y-3">
              <FilterCheck checked={onlyNonBati} onChange={setOnlyNonBati}
                label="Non bâti"
                note={dataSrc === "sitg" ? "approx." : undefined} />
              <FilterCheck checked={onlySousExp} onChange={setOnlySousExp}
                label="Sous-exploité"
                note={dataSrc === "sitg" ? "approx." : undefined} />
              <FilterCheck checked={onlyZoneDev} onChange={setOnlyZoneDev}
                label="Zone de développement"
                note={dataSrc === "sitg" ? "niveau commune" : undefined} />
              {dataSrc === "mock" && (
                <FilterCheck checked={onlyPLQ} onChange={setOnlyPLQ} label="PLQ en cours" />
              )}
              <FilterCheck checked={onlyLowConstraint} onChange={setOnlyLowConstraint}
                label="Contraintes faibles"
                note={dataSrc === "sitg" ? "score ≥ 70" : undefined} />
            </div>

            {dataSrc === "sitg" && sitgParcels.length > 0 && (
              <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground space-y-1">
                <div className="font-medium text-foreground">{sitgParcels.length.toLocaleString("fr-CH")} parcelles chargées</div>
                {sitgTruncated && <div className="text-warning-foreground">⚠ Résultat tronqué à 8 000 parcelles maximum.</div>}
                <div>Données cadastrales réelles · Source : SITG</div>
              </div>
            )}
          </div>
        </aside>

        {/* ── Map area ────────────────────────────────────────────────────── */}
        <div className="relative flex-1 overflow-hidden">

          {/* Loading overlay */}
          {sitgLoading && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <Card className="shadow-lg">
                <CardContent className="flex items-center gap-3 px-6 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <div>
                    <div className="text-sm font-medium">Chargement des parcelles SITG…</div>
                    <div className="text-xs text-muted-foreground">{sitgCommune} — données cadastrales réelles</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error banner */}
          {sitgError && !sitgLoading && (
            <div className="absolute top-3 left-1/2 z-[1000] -translate-x-1/2">
              <Card className="border-destructive/40 bg-destructive/10 shadow-lg">
                <CardContent className="flex items-center gap-2 px-4 py-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Erreur de chargement des données SITG : {sitgError}</span>
                  <Button size="sm" variant="outline" className="ml-2" onClick={handleSitgLoad}>
                    Réessayer
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty state in SITG mode before first load */}
          {dataSrc === "sitg" && !sitgLoading && !sitgError && sitgParcels.length === 0 && (
            <div className="absolute top-3 left-1/2 z-[1000] -translate-x-1/2">
              <Card className="shadow-md border-primary/20">
                <CardContent className="flex items-center gap-2 px-4 py-2 text-sm">
                  <Database className="h-4 w-4 text-primary shrink-0" />
                  <span>Sélectionnez une commune puis cliquez sur <strong>Charger les données SITG</strong></span>
                </CardContent>
              </Card>
            </div>
          )}

          <GenevaMap
            parcels={dataSrc === "mock" ? filteredMock : []}
            selected={selected}
            onSelect={setSelected}
            sitgParcels={dataSrc === "sitg" ? filteredSitg : []}
            selectedSitg={selectedSitg}
            onSelectSitg={setSelectedSitg}
          />

          {/* Legend */}
          <Card className="absolute bottom-4 left-4 z-[500] w-auto">
            <CardContent className="flex items-center gap-4 p-3 text-xs">
              <LegendDot c="bg-[#22c55e]" label="Score ≥ 80" />
              <LegendDot c="bg-[#f59e0b]" label="65–79" />
              <LegendDot c="bg-[#ef4444]" label="50–64" />
              <LegendDot c="bg-slate-400" label="< 50" />
            </CardContent>
          </Card>
        </div>

        {/* ── Side panel (mock parcel) ─────────────────────────────────────── */}
        {selected && dataSrc === "mock" && (
          <MockSidePanel parcel={selected} onClose={() => setSelected(null)} />
        )}

        {/* ── Side panel (SITG parcel) ─────────────────────────────────────── */}
        {selectedSitg && dataSrc === "sitg" && (
          <SitgSidePanel parcel={selectedSitg} onClose={() => setSelectedSitg(null)} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DataSourceToggle({ current, onChange }: { current: DataSrc; onChange: (s: DataSrc) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1 text-xs">
      <button
        onClick={() => onChange("sitg")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
          current === "sitg"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Database className="h-3.5 w-3.5" />
        Données réelles SITG
      </button>
      <button
        onClick={() => onChange("mock")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
          current === "mock"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <FlaskConical className="h-3.5 w-3.5" />
        Mock data
      </button>
    </div>
  );
}

function MockSidePanel({ parcel: p, onClose }: { parcel: Parcel; onClose: () => void }) {
  return (
    <aside className="w-full max-w-sm shrink-0 overflow-y-auto border-l bg-card">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FlaskConical className="h-4 w-4 text-muted-foreground" />
          <span>Données mock</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-5 p-5">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.id}</div>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">{p.address}</h2>
          <div className="mt-1 text-sm text-muted-foreground">{p.commune}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-success/15 text-lg font-semibold text-success">
            {p.score}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Score d'opportunité</div>
            <div className="text-sm">Risque <span className="font-medium">{riskLabel(p.risk)}</span></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Surface" value={`${p.surface.toLocaleString("fr-CH")} m²`} />
          <Info label="Zone" value={p.zone} />
          <Info label="Bâti existant" value={p.built ? "Oui" : "Non"} />
          <Info label="Type" value={typeLabel(p.type)} />
          <Info label="Potentiel SBP" value={`${p.buildablePotential.toLocaleString("fr-CH")} m²`} />
          <Info label="Logements estimés" value={p.estimatedHousing.toString()} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Contraintes</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.constraints.map((c) => (
              <Badge key={c} variant="secondary">{c}</Badge>
            ))}
          </div>
        </div>
        <div className="rounded-md border bg-muted/30 p-3 text-sm">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Action recommandée</div>
          <p className="mt-1">{p.recommendation}</p>
        </div>
        <Button className="w-full" asChild>
          <Link to="/parcelle/$id" params={{ id: p.id }}>
            Ouvrir la fiche complète <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </aside>
  );
}

function SitgSidePanel({ parcel: p, onClose }: { parcel: SitgParcel; onClose: () => void }) {
  const scoreClass =
    p.score >= 80 ? "bg-green-100 text-green-700" :
    p.score >= 65 ? "bg-amber-100 text-amber-700" :
    p.score >= 50 ? "bg-red-100 text-red-700" :
    "bg-slate-100 text-slate-600";

  return (
    <aside className="w-full max-w-sm shrink-0 overflow-y-auto border-l bg-card">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Donnée cadastrale réelle</span>
          <Badge variant="outline" className="text-[10px] text-primary border-primary/30">SITG</Badge>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-5 p-5">

        {/* Header */}
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            IDEDDP {p.ideddp}
          </div>
          <h2 className="mt-1 font-serif text-2xl tracking-tight">
            Parcelle {p.no_parcelle}
          </h2>
          <div className="mt-1 text-sm text-muted-foreground">{p.commune}</div>
        </div>

        {/* Preliminary score */}
        <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-lg font-semibold ${scoreClass}`}>
            {p.score}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Score préliminaire
            </div>
            <div className="mt-0.5 text-xs text-amber-700">
              Heuristique surface + bâti + zone. Non validé.
              Potentiel à analyser.
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="EGRID" value={p.egrid} />
          <Info label="Surface" value={`${p.surface.toLocaleString("fr-CH")} m²`} />
          <Info label="Statut" value={p.validite} />
          <Info label="Type propriété" value={p.type_propri ?? "Non renseigné"} />
          <Info label="Parcelle bâtie" value={p.isBuilt ? "Oui (approx.)" : "Non bâtie (approx.)"} />
          <Info
            label="Zone dév."
            value={p.zoneAbrv ? `${p.zoneAbrv}` : "Aucune"}
          />
        </div>

        {/* Dev zone details */}
        {p.zoneLabel && (
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
            <div className="text-xs font-medium uppercase tracking-wider text-primary">Zone de développement</div>
            <p className="mt-1 text-foreground">{p.zoneLabel}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Correspondance au niveau de la commune — vérifier par intersection spatiale (PostGIS).
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Potentiel à analyser.</span>{" "}
          Ces données cadastrales sont réelles (source SITG). Le score est préliminaire
          et ne constitue pas un avis d'investissement. Vérifier zonage, servitudes et
          contraintes RDPPF avant toute démarche.
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {p.rdppf_url && (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={p.rdppf_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Extrait RDPPF (PDF officiel)
              </a>
            </Button>
          )}
          <Button className="w-full" variant="secondary" disabled>
            Ajouter au CRM
            <span className="ml-auto text-[10px] text-muted-foreground">(bientôt)</span>
          </Button>
        </div>

        <div className="text-[10px] text-muted-foreground">
          Source : SITG · CAD_PARCELLE_MENSU · {new Date().toLocaleDateString("fr-CH")}
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Tiny helper components
// ---------------------------------------------------------------------------

function FilterCheck({
  checked, onChange, label, note,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  note?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      <span>{label}</span>
      {note && <span className="text-[10px] text-muted-foreground">({note})</span>}
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
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 break-all font-medium text-sm">{value}</div>
    </div>
  );
}
