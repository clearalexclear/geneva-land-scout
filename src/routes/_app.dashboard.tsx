import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parcels, scoreColor, typeLabel, calculateDashboardStats } from "@/lib/mockData";
import { ArrowUpRight, Layers, MapPin, Sparkles, Bell, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

const stats_ = calculateDashboardStats(parcels);
const stats = [
  { label: "Parcelles analysées", value: stats_.parcellesAnalysees.toLocaleString("fr-CH"), delta: "+312 ce mois", icon: Layers },
  { label: "Opportunités détectées", value: stats_.opportunitesDetectees.toString(), delta: `sur ${parcels.length} parcelles`, icon: Sparkles },
  { label: "Potentiel logements estimé", value: stats_.potentielLogements.toLocaleString("fr-CH"), delta: "toutes parcelles confondues", icon: TrendingUp },
  { label: "Alertes actives", value: stats_.alertesActives.toString(), delta: "2 non lues", icon: Bell },
];

function DashboardPage() {
  const top = [...parcels].sort((a, b) => b.score - a.score).slice(0, 5);
  return (
    <>
      <PageHeader
        title="Bonjour Julien"
        description="Voici la synthèse du marché foncier genevois pour aujourd'hui."
        actions={
          <Button asChild>
            <Link to="/carte"><MapPin className="h-4 w-4" /> Ouvrir la carte</Link>
          </Button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary">
                    <s.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 font-serif text-3xl tracking-tight">{s.value}</div>
                <div className="mt-1 text-xs text-success">{s.delta}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">Top opportunités</h2>
                  <p className="text-xs text-muted-foreground">Classées par score d'opportunité</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/opportunites">Tout voir <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              <div className="mt-4 divide-y">
                {top.map((p) => (
                  <Link
                    key={p.id}
                    to="/parcelle/$id"
                    params={{ id: p.id }}
                    className="flex items-center gap-4 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-md"
                  >
                    <ScoreBadge score={p.score} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{p.address}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.commune} · {p.surface.toLocaleString("fr-CH")} m² · {typeLabel(p.type)}
                      </div>
                    </div>
                    <Badge variant="outline" className="hidden sm:inline-flex">{p.zone}</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-base font-semibold">Activité récente</h2>
              <p className="text-xs text-muted-foreground">Détections automatiques</p>
              <ul className="mt-4 space-y-4 text-sm">
                <ActivityItem dot="success" title="3 nouvelles parcelles à Meyrin" sub="Il y a 2 h" />
                <ActivityItem dot="warning" title="PLQ révisé à Lancy" sub="Hier" />
                <ActivityItem dot="success" title="Score augmenté pour GE-MEY-0815" sub="Il y a 3 jours" />
                <ActivityItem dot="muted" title="Parcelle archivée à Plan-les-Ouates" sub="Il y a 5 jours" />
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const c = scoreColor(score);
  const bg =
    c === "success" ? "bg-success/15 text-success" :
    c === "warning" ? "bg-warning/20 text-warning-foreground" :
    c === "destructive" ? "bg-destructive/15 text-destructive" :
    "bg-muted text-muted-foreground";
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-semibold ${bg}`}>
      {score}
    </div>
  );
}

function ActivityItem({ dot, title, sub }: { dot: "success" | "warning" | "muted"; title: string; sub: string }) {
  const cls =
    dot === "success" ? "bg-success" : dot === "warning" ? "bg-warning" : "bg-muted-foreground/50";
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-1.5 h-2 w-2 rounded-full ${cls}`} />
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </li>
  );
}
