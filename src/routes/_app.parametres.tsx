import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_app/parametres")({
  component: ParametresPage,
});

function ParametresPage() {
  return (
    <>
      <PageHeader title="Paramètres" description="Compte, notifications et préférences." />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold">Profil</h2>
            <p className="text-xs text-muted-foreground">Vos informations professionnelles.</p>
            <Separator className="my-4" />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Nom</Label>
                <Input defaultValue="Julien Dubois" className="mt-1.5" />
              </div>
              <div>
                <Label>Société</Label>
                <Input defaultValue="Helvetia Foncier SA" className="mt-1.5" />
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue="julien@helvetia-foncier.ch" className="mt-1.5" />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input defaultValue="+41 22 555 12 34" className="mt-1.5" />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button>Enregistrer</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-base font-semibold">Notifications</h2>
            <p className="text-xs text-muted-foreground">Alertes par email.</p>
            <Separator className="my-4" />
            <div className="space-y-4">
              <Toggle label="Nouvelles opportunités" defaultChecked />
              <Toggle label="Mises à jour de PLQ" defaultChecked />
              <Toggle label="Changement de score" />
              <Toggle label="Récapitulatif hebdomadaire" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold">Abonnement</h2>
            <p className="text-xs text-muted-foreground">Plan Pro · CHF 699 / mois</p>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Prochaine facturation : 01.12.2026</div>
              <div className="flex gap-2">
                <Button variant="outline">Changer de plan</Button>
                <Button variant="ghost">Annuler</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </label>
  );
}
