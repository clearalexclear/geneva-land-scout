import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { crmColumns, parcels, typeLabel } from "@/lib/mockData";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/crm")({
  component: CrmPage,
});

function CrmPage() {
  return (
    <>
      <PageHeader
        title="CRM foncier"
        description="Suivez vos parcelles de la détection à la signature."
        actions={<Button><Plus className="h-4 w-4" /> Ajouter une parcelle</Button>}
      />
      <div className="p-6">
        <div className="flex gap-4 overflow-x-auto pb-3">
          {crmColumns.map((col) => {
            const items = parcels.filter((p) => p.crmStatus === col.id);
            return (
              <div key={col.id} className="flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between border-b bg-card px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{col.label}</span>
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                      {items.length}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 space-y-2 p-2">
                  {items.length === 0 && (
                    <div className="rounded-md border border-dashed py-8 text-center text-xs text-muted-foreground">
                      Aucune parcelle
                    </div>
                  )}
                  {items.map((p) => (
                    <Link
                      key={p.id}
                      to="/parcelle/$id"
                      params={{ id: p.id }}
                      className="block rounded-md border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{p.address}</div>
                          <div className="text-xs text-muted-foreground">{p.commune}</div>
                        </div>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-success/15 text-xs font-semibold text-success">
                          {p.score}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{p.surface.toLocaleString("fr-CH")} m²</span>
                        <Badge variant="outline" className="text-[10px]">{typeLabel(p.type)}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
