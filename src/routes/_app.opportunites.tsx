import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { parcels, communes, scoreColor, typeLabel, riskLabel, crmColumns } from "@/lib/mockData";
import { ArrowUpDown, FileDown } from "lucide-react";

export const Route = createFileRoute("/_app/opportunites")({
  component: OpportunitesPage,
});

type SortKey = "score" | "surface" | "commune";

function OpportunitesPage() {
  const [search, setSearch] = useState("");
  const [commune, setCommune] = useState("all");
  const [type, setType] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    let r = parcels.filter((p) => {
      if (commune !== "all" && p.commune !== commune) return false;
      if (type !== "all" && p.type !== type) return false;
      if (search && !`${p.address} ${p.commune} ${p.id}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      if (av < bv) return asc ? -1 : 1;
      if (av > bv) return asc ? 1 : -1;
      return 0;
    });
    return r;
  }, [search, commune, type, sortKey, asc]);

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) setAsc(!asc);
    else { setSortKey(k); setAsc(false); }
  };

  return (
    <>
      <PageHeader
        title="Opportunités"
        description="Toutes les parcelles classées par score d'opportunité."
        actions={<Button variant="outline"><FileDown className="h-4 w-4" /> Exporter</Button>}
      />
      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <Input
              placeholder="Rechercher une adresse, commune, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Select value={commune} onValueChange={setCommune}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Commune" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes communes</SelectItem>
                {communes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="non_bati">Non bâti</SelectItem>
                <SelectItem value="sous_exploite">Sous-exploité</SelectItem>
                <SelectItem value="zone_dev">Zone développement</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-sm text-muted-foreground">{rows.length} parcelles</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[80px]">
                  <button onClick={() => toggleSort("score")} className="inline-flex items-center gap-1">
                    Score <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Adresse / secteur</TableHead>
                <TableHead>
                  <button onClick={() => toggleSort("commune")} className="inline-flex items-center gap-1">
                    Commune <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button onClick={() => toggleSort("surface")} className="inline-flex items-center gap-1">
                    Surface <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead className="text-right">Potentiel</TableHead>
                <TableHead>Risque</TableHead>
                <TableHead>Statut CRM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => {
                const c = scoreColor(p.score);
                const bg =
                  c === "success" ? "bg-success/15 text-success" :
                  c === "warning" ? "bg-warning/25 text-warning-foreground" :
                  c === "destructive" ? "bg-destructive/15 text-destructive" :
                  "bg-muted text-muted-foreground";
                const crm = crmColumns.find((x) => x.id === p.crmStatus)?.label ?? "—";
                return (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-muted/40" asChild>
                    <Link to="/parcelle/$id" params={{ id: p.id }}>
                      <TableCell>
                        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold ${bg}`}>
                          {p.score}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{p.address}</TableCell>
                      <TableCell>{p.commune}</TableCell>
                      <TableCell className="text-right">{p.surface.toLocaleString("fr-CH")} m²</TableCell>
                      <TableCell><Badge variant="secondary">{typeLabel(p.type)}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.zone}</TableCell>
                      <TableCell className="text-right">{p.buildablePotential.toLocaleString("fr-CH")} m²</TableCell>
                      <TableCell>
                        <Badge variant={p.risk === "faible" ? "outline" : p.risk === "moyen" ? "secondary" : "destructive"}>
                          {riskLabel(p.risk)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{crm}</TableCell>
                    </Link>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}
