import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { parcels, riskLabel, typeLabel, scoreColor } from "@/lib/mockData";
import { ArrowLeft, FileDown, Plus, User, MapPin } from "lucide-react";

export const Route = createFileRoute("/_app/parcelle/$id")({
  loader: ({ params }) => {
    const parcel = parcels.find((p) => p.id === params.id);
    if (!parcel) throw notFound();
    return { parcel };
  },
  component: ParcelDetailPage,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <h1 className="text-xl font-semibold">Parcelle introuvable</h1>
      <p className="mt-2 text-muted-foreground">Cette parcelle n'existe pas ou a été archivée.</p>
      <Button asChild className="mt-4"><Link to="/opportunites">Retour aux opportunités</Link></Button>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="p-10 text-center">
      <h1 className="text-xl font-semibold">Erreur de chargement</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-4">Réessayer</Button>
    </div>
  ),
});

function ParcelDetailPage() {
  const { parcel: p } = Route.useLoaderData();
  const c = scoreColor(p.score);
  const scoreBg =
    c === "success" ? "bg-success/15 text-success" :
    c === "warning" ? "bg-warning/25 text-warning-foreground" :
    c === "destructive" ? "bg-destructive/15 text-destructive" :
    "bg-muted text-muted-foreground";

  const breakdown = [
    { label: "Surface & forme", value: 88 },
    { label: "Zonage", value: 82 },
    { label: "Densification possible", value: 91 },
    { label: "Accessibilité", value: 76 },
    { label: "Contraintes patrimoine", value: p.risk === "faible" ? 90 : p.risk === "moyen" ? 65 : 40 },
    { label: "Voisinage", value: 70 },
  ];

  return (
    <>
      <PageHeader
        title={p.address}
        description={`${p.id} · ${p.commune} · ${p.zone}`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/opportunites"><ArrowLeft className="h-4 w-4" /> Retour</Link>
            </Button>
            <Button variant="outline"><Plus className="h-4 w-4" /> Ajouter au CRM</Button>
            <Button><FileDown className="h-4 w-4" /> Exporter la fiche PDF</Button>
          </>
        }
      />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Map preview */}
          <Card className="overflow-hidden">
            <div className="relative aspect-[16/7] bg-[linear-gradient(180deg,#eef2f7,#dbe3ec)]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <g stroke="#c8d3e1" strokeWidth="0.15">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line key={"v" + i} x1={i * 5} y1="0" x2={i * 5} y2="100" />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <line key={"h" + i} x1="0" y1={i * 5} x2="100" y2={i * 5} />
                  ))}
                </g>
                <rect x="44" y="40" width="14" height="14" fill="oklch(0.62 0.13 155 / 0.35)" stroke="oklch(0.62 0.13 155)" strokeWidth="0.5" />
              </svg>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-card/90 px-2 py-1 text-xs text-muted-foreground backdrop-blur">
                <MapPin className="h-3 w-3" /> {p.commune}
              </div>
            </div>
          </Card>

          {/* Score breakdown */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Score d'opportunité</h2>
                <div className={`flex h-12 w-12 items-center justify-center rounded-md text-lg font-semibold ${scoreBg}`}>
                  {p.score}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                {breakdown.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-sm">
                      <span>{b.label}</span>
                      <span className="font-medium">{b.value}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-success" style={{ width: `${b.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risks */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-base font-semibold">Risques & contraintes</h2>
              <p className="text-xs text-muted-foreground">Niveau global : {riskLabel(p.risk)}</p>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-2">
                {p.constraints.map((ct: string) => (
                  <Badge key={ct} variant="secondary">{ct}</Badge>
                ))}
              </div>
              <div className="mt-4 rounded-md border bg-muted/30 p-3 text-sm">
                <span className="font-medium">Recommandation :</span> {p.recommendation}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-base font-semibold">Notes</h2>
              <Textarea className="mt-3" rows={4} placeholder="Ajouter une note interne..." />
              <div className="mt-3 flex justify-end">
                <Button size="sm">Enregistrer</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-base font-semibold">Informations</h2>
              <Separator className="my-4" />
              <dl className="space-y-3 text-sm">
                <Row k="ID parcelle" v={p.id} />
                <Row k="Commune" v={p.commune} />
                <Row k="Surface" v={`${p.surface.toLocaleString("fr-CH")} m²`} />
                <Row k="Bâti existant" v={p.built ? "Oui" : "Non"} />
                <Row k="Type" v={typeLabel(p.type)} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-base font-semibold">Zonage</h2>
              <Separator className="my-4" />
              <dl className="space-y-3 text-sm">
                <Row k="Zone" v={p.zone} />
                <Row k="Potentiel SBP" v={`${p.buildablePotential.toLocaleString("fr-CH")} m²`} />
                <Row k="Logements estimés" v={p.estimatedHousing.toString()} />
                <Row k="Niveau de risque" v={riskLabel(p.risk)} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-base font-semibold">Propriétaire</h2>
              <Separator className="my-4" />
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">Information confidentielle</div>
                  <div className="text-xs text-muted-foreground">Disponible sur le plan Pro+ via le registre foncier.</div>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">Demander les coordonnées</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}
