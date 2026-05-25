import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Radar,
  MapPin,
  Gauge,
  Layers,
  Sparkles,
  Bell,
  FileDown,
  Check,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FoncierRadar — Le radar foncier des promoteurs à Genève" },
      {
        name: "description",
        content:
          "Identifiez les parcelles non bâties, sous-exploitées ou à fort potentiel constructible à Genève en quelques minutes.",
      },
      { property: "og:title", content: "FoncierRadar — Radar foncier Genève" },
      {
        property: "og:description",
        content:
          "Plateforme d'analyse foncière pour promoteurs immobiliers à Genève.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Logos />
      <Problem />
      <Solution />
      <Features />
      <Pricing />
      <CtaBand />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Radar className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            FoncierRadar
          </span>
          <Badge variant="secondary" className="ml-1 text-[10px]">
            Genève
          </Badge>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#solution" className="hover:text-foreground">Solution</a>
          <a href="#features" className="hover:text-foreground">Fonctionnalités</a>
          <a href="#pricing" className="hover:text-foreground">Tarifs</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">Se connecter</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard">
              Voir la démo
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-accent)_0%,_transparent_60%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge variant="outline" className="mb-5 gap-1.5 border-success/40 text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Disponible sur le canton de Genève
          </Badge>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Le radar foncier des{" "}
            <span className="text-success">promoteurs immobiliers</span> à Genève
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Identifiez les parcelles non bâties, sous-exploitées ou à fort
            potentiel constructible en quelques minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/dashboard">
                Voir la démo
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#pricing">Demander un accès</a>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <div>
              <div className="text-xl font-semibold text-foreground">12'480</div>
              parcelles analysées
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-xl font-semibold text-foreground">186</div>
              opportunités actives
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-xl font-semibold text-foreground">2'340</div>
              logements potentiels
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-xl border bg-card p-2 shadow-2xl shadow-primary/10">
            <div className="rounded-lg border bg-gradient-to-br from-accent via-background to-secondary p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-xs font-medium">Carte foncière — Genève</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">Live</Badge>
              </div>
              <MockMap small />
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-md border bg-card p-3">
                  <div className="text-muted-foreground">Score moyen</div>
                  <div className="mt-1 text-lg font-semibold">74</div>
                </div>
                <div className="rounded-md border bg-card p-3">
                  <div className="text-muted-foreground">Nouvelles</div>
                  <div className="mt-1 text-lg font-semibold text-success">+12</div>
                </div>
                <div className="rounded-md border bg-card p-3">
                  <div className="text-muted-foreground">À contacter</div>
                  <div className="mt-1 text-lg font-semibold">8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Logos() {
  return (
    <div className="border-b bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Utilisé par des promoteurs et régies à Genève
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-60">
          {["Helvetia Foncier", "Léman Développement", "Rhône Immobilier", "Genève Capital", "Mont-Blanc Estate"].map((n) => (
            <span key={n} className="text-sm font-medium text-muted-foreground">{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Problem() {
  return (
    <section className="border-b py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Le problème</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">
              Chercher du foncier à Genève prend des semaines.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Cadastre, SITG, PLQ, zonage, contraintes patrimoniales : les
              promoteurs croisent manuellement des dizaines de sources pour
              identifier quelques opportunités. Résultat : du temps perdu, des
              parcelles ratées et une concurrence qui agit avant vous.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { t: "Sources éparpillées", d: "SITG, registre foncier, PLQ, plans directeurs." },
              { t: "Analyse manuelle", d: "Excel, captures d'écran, calculs SBP à la main." },
              { t: "Concurrence rapide", d: "Les meilleures parcelles partent en quelques jours." },
              { t: "Risques cachés", d: "Servitudes, pollution, patrimoine, voisinage." },
            ].map((b) => (
              <Card key={b.t} className="border-border/70">
                <CardContent className="p-5">
                  <div className="text-sm font-semibold">{b.t}</div>
                  <div className="mt-1.5 text-xs text-muted-foreground">{b.d}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section id="solution" className="border-b bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">La solution</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight">
            Toutes vos opportunités foncières sur une seule carte.
          </h2>
          <p className="mt-4 text-muted-foreground">
            FoncierRadar combine cadastre, zonage et données urbanistiques pour
            classer automatiquement les parcelles à fort potentiel.
          </p>
        </div>
        <div className="mt-12 rounded-xl border bg-card p-3 shadow-xl shadow-primary/5">
          <MockMap />
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: MapPin, t: "Carte interactive des parcelles", d: "Visualisez en temps réel toutes les parcelles du canton avec leur statut." },
  { icon: Gauge, t: "Score d'opportunité foncière", d: "Un score 0–100 calculé sur 20+ critères : zonage, SBP, contraintes." },
  { icon: Layers, t: "Analyse des contraintes urbanistiques", d: "PLQ, servitudes, patrimoine, bruit, pollution — agrégés automatiquement." },
  { icon: Sparkles, t: "Détection des parcelles sous-exploitées", d: "Ratio SBP/surface, âge du bâti, potentiel de densification." },
  { icon: Bell, t: "Alertes sur nouvelles opportunités", d: "Email + dashboard dès qu'une parcelle correspond à vos critères." },
  { icon: FileDown, t: "Fiches parcelles exportables", d: "Rapports PDF prêts pour vos comités d'investissement." },
];

function Features() {
  return (
    <section id="features" className="border-b py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Fonctionnalités</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight">
            Pensé pour les promoteurs genevois.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.t} className="border-border/70 transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Starter",
    price: "CHF 299",
    desc: "Pour les indépendants et petites structures.",
    features: ["1 utilisateur", "Carte & opportunités", "10 fiches PDF / mois", "Alertes email"],
  },
  {
    name: "Pro",
    price: "CHF 699",
    desc: "Pour les promoteurs actifs sur Genève.",
    features: ["5 utilisateurs", "CRM foncier", "Fiches PDF illimitées", "Alertes personnalisées", "Export Excel"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sur demande",
    desc: "Pour les groupes et régies.",
    features: ["Utilisateurs illimités", "API & intégrations", "Support dédié", "Onboarding sur site"],
  },
];

function Pricing() {
  return (
    <section id="pricing" className="border-b bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tarifs</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight">
            Un abonnement, toutes les parcelles de Genève.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.name}
              className={
                p.highlight
                  ? "relative border-primary shadow-xl shadow-primary/10"
                  : "border-border/70"
              }
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                  Recommandé
                </div>
              )}
              <CardContent className="p-7">
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-serif text-4xl tracking-tight">{p.price}</span>
                  {p.price.startsWith("CHF") && (
                    <span className="text-sm text-muted-foreground">/ mois</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <Button
                  className="mt-6 w-full"
                  variant={p.highlight ? "default" : "outline"}
                  asChild
                >
                  <Link to="/dashboard">Demander un accès</Link>
                </Button>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="border-b bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
        <div>
          <h3 className="font-serif text-3xl tracking-tight">
            Prêt à voir toutes les opportunités foncières de Genève ?
          </h3>
          <p className="mt-2 text-sm text-primary-foreground/70">
            Démarrez en 5 minutes, sans installation.
          </p>
        </div>
        <Button size="lg" variant="secondary" asChild>
          <Link to="/dashboard">
            Demander un accès
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Radar className="h-4 w-4" />
          <span>© 2026 FoncierRadar · Genève, Suisse</span>
        </div>
        <div className="flex gap-5 text-xs text-muted-foreground">
          <a href="#">Mentions légales</a>
          <a href="#">Confidentialité</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function MockMap({ small = false }: { small?: boolean }) {
  const dots = [
    { x: 22, y: 30, c: "success" },
    { x: 30, y: 42, c: "warning" },
    { x: 28, y: 68, c: "warning" },
    { x: 38, y: 80, c: "destructive" },
    { x: 40, y: 70, c: "warning" },
    { x: 48, y: 62, c: "success" },
    { x: 64, y: 52, c: "success" },
    { x: 72, y: 38, c: "success" },
    { x: 78, y: 48, c: "muted" },
  ];
  return (
    <div
      className={
        "relative w-full overflow-hidden rounded-md border bg-[linear-gradient(180deg,#eef2f7,#dbe3ec)] " +
        (small ? "aspect-[4/3]" : "aspect-[16/9]")
      }
    >
      {/* faux Léman */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,20 Q30,28 55,22 Q80,18 100,28 L100,38 Q70,42 45,38 Q20,34 0,42 Z" fill="#9ec5e8" opacity="0.45" />
        <path d="M0,55 Q35,52 60,60 Q85,68 100,60" stroke="#9ec5e8" strokeWidth="0.3" fill="none" opacity="0.6" />
        <g stroke="#c8d3e1" strokeWidth="0.15">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={"v" + i} x1={i * 5} y1="0" x2={i * 5} y2="100" />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={"h" + i} x1="0" y1={i * 5} x2="100" y2={i * 5} />
          ))}
        </g>
      </svg>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${d.x}%`, top: `${d.y}%` }}
        >
          <span
            className={
              "block h-3 w-3 rounded-full ring-2 ring-white shadow " +
              (d.c === "success"
                ? "bg-success"
                : d.c === "warning"
                ? "bg-warning"
                : d.c === "destructive"
                ? "bg-destructive"
                : "bg-muted-foreground/60")
            }
          />
        </span>
      ))}
      <div className="absolute bottom-2 left-2 rounded-md bg-card/90 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">
        Genève · mock map
      </div>
    </div>
  );
}
