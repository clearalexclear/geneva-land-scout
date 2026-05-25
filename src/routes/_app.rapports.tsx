import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/_app/rapports")({
  component: RapportsPage,
});

const reports = [
  { name: "Synthèse mensuelle — Octobre 2026", desc: "12 nouvelles opportunités, 4 PLQ révisés.", date: "01.11.2026" },
  { name: "Rapport secteur — Vandoeuvres / Chêne-Bougeries", desc: "Analyse de densification de la rive gauche.", date: "22.10.2026" },
  { name: "Étude marché — Zones de développement 3", desc: "Suivi des projets en cours sur Meyrin / Vernier.", date: "10.10.2026" },
  { name: "Export CRM — Pipeline Q3", desc: "Toutes les parcelles actives.", date: "30.09.2026" },
];

function RapportsPage() {
  return (
    <>
      <PageHeader title="Rapports" description="Vos exports et synthèses." />
      <div className="grid gap-3 p-6 md:grid-cols-2">
        {reports.map((r) => (
          <Card key={r.name}>
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{r.desc}</div>
                <div className="mt-2 text-[11px] text-muted-foreground">Généré le {r.date}</div>
              </div>
              <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" /> PDF</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
