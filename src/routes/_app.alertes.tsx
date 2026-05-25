import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { alerts } from "@/lib/mockData";
import { Bell, Sparkles, AlertCircle, Settings2 } from "lucide-react";

export const Route = createFileRoute("/_app/alertes")({
  component: AlertesPage,
});

const iconBySev = {
  success: Sparkles,
  info: Bell,
  warning: AlertCircle,
} as const;

function AlertesPage() {
  return (
    <>
      <PageHeader
        title="Alertes"
        description="Toutes vos détections automatiques."
        actions={<Button variant="outline"><Settings2 className="h-4 w-4" /> Configurer mes alertes</Button>}
      />
      <div className="space-y-3 p-6">
        {alerts.map((a) => {
          const Icon = iconBySev[a.severity];
          const tone =
            a.severity === "success" ? "text-success bg-success/15" :
            a.severity === "warning" ? "text-warning-foreground bg-warning/25" :
            "text-primary bg-accent";
          return (
            <Card key={a.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-start gap-4 p-5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold">{a.title}</h3>
                    <Badge variant="outline" className="text-[10px]">{a.commune}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">{a.date}</div>
                </div>
                <Button variant="ghost" size="sm">Voir</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
