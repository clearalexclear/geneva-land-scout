// Mock data for FoncierRadar MVP. Replace with real API calls once backend is wired.

export type OpportunityType = "non_bati" | "sous_exploite" | "zone_dev";
export type RiskLevel = "faible" | "moyen" | "eleve";
export type CrmStatus = "a_analyser" | "a_contacter" | "contacte" | "en_discussion" | "abandonne";

export interface Parcel {
  id: string;
  address: string;
  commune: string;
  surface: number; // m²
  zone: string;
  built: boolean;
  type: OpportunityType;
  score: number; // 0-100
  buildablePotential: number; // m² SBP
  estimatedHousing: number;
  risk: RiskLevel;
  constraints: string[];
  recommendation: string;
  crmStatus: CrmStatus;
  // map mock coords (percentage within map container)
  x: number;
  y: number;
}

export const parcels: Parcel[] = [
  {
    id: "GE-VAN-1042",
    address: "Chemin de la Vignette 12",
    commune: "Vandoeuvres",
    surface: 2430,
    zone: "Zone 5",
    built: true,
    type: "sous_exploite",
    score: 87,
    buildablePotential: 1680,
    estimatedHousing: 22,
    risk: "faible",
    constraints: ["Pente modérée", "Voisinage sensible"],
    recommendation: "Proposer une densification douce avec villas mitoyennes.",
    crmStatus: "a_contacter",
    x: 72, y: 38,
  },
  {
    id: "GE-CHB-2210",
    address: "Route de Chêne 188",
    commune: "Chêne-Bougeries",
    surface: 1850,
    zone: "Zone 4B",
    built: false,
    type: "non_bati",
    score: 82,
    buildablePotential: 2220,
    estimatedHousing: 28,
    risk: "faible",
    constraints: ["Aucun arbre protégé"],
    recommendation: "Lancer une étude de faisabilité R+3.",
    crmStatus: "a_analyser",
    x: 64, y: 52,
  },
  {
    id: "GE-MEY-0815",
    address: "Avenue de Vaudagne 24",
    commune: "Meyrin",
    surface: 4100,
    zone: "Zone de développement 3",
    built: false,
    type: "zone_dev",
    score: 78,
    buildablePotential: 6150,
    estimatedHousing: 78,
    risk: "moyen",
    constraints: ["PLQ en cours", "Proximité voie ferrée"],
    recommendation: "Suivre l'évolution du PLQ et préparer une offre.",
    crmStatus: "en_discussion",
    x: 22, y: 30,
  },
  {
    id: "GE-LAN-3301",
    address: "Route du Pont-Butin 9",
    commune: "Lancy",
    surface: 1200,
    zone: "Zone 3",
    built: true,
    type: "sous_exploite",
    score: 74,
    buildablePotential: 1450,
    estimatedHousing: 18,
    risk: "moyen",
    constraints: ["Bâtiment existant à démolir"],
    recommendation: "Approche propriétaire — potentiel surélévation.",
    crmStatus: "contacte",
    x: 40, y: 70,
  },
  {
    id: "GE-CAR-4420",
    address: "Rue de la Tambourine 5",
    commune: "Carouge",
    surface: 980,
    zone: "Zone 4A",
    built: true,
    type: "sous_exploite",
    score: 71,
    buildablePotential: 920,
    estimatedHousing: 12,
    risk: "moyen",
    constraints: ["Zone patrimoine"],
    recommendation: "Étudier rénovation lourde avec extension.",
    crmStatus: "a_analyser",
    x: 48, y: 62,
  },
  {
    id: "GE-VER-5582",
    address: "Chemin du Foron 14",
    commune: "Vernier",
    surface: 3260,
    zone: "Zone de développement 3",
    built: false,
    type: "zone_dev",
    score: 69,
    buildablePotential: 4520,
    estimatedHousing: 55,
    risk: "moyen",
    constraints: ["Bruit aéroport"],
    recommendation: "Évaluer typologies adaptées au bruit.",
    crmStatus: "a_analyser",
    x: 30, y: 42,
  },
  {
    id: "GE-PLP-6710",
    address: "Route de Saint-Julien 220",
    commune: "Plan-les-Ouates",
    surface: 5200,
    zone: "Zone industrielle",
    built: true,
    type: "sous_exploite",
    score: 64,
    buildablePotential: 3800,
    estimatedHousing: 0,
    risk: "eleve",
    constraints: ["Affectation à modifier", "Sol pollué présumé"],
    recommendation: "Dossier complexe — patience longue.",
    crmStatus: "abandonne",
    x: 38, y: 80,
  },
  {
    id: "GE-ONE-7821",
    address: "Chemin Pré-du-Couvent 3",
    commune: "Onex",
    surface: 1640,
    zone: "Zone 4B",
    built: false,
    type: "non_bati",
    score: 61,
    buildablePotential: 1480,
    estimatedHousing: 18,
    risk: "moyen",
    constraints: ["Servitude de passage"],
    recommendation: "Négocier la levée de servitude.",
    crmStatus: "a_contacter",
    x: 28, y: 68,
  },
  {
    id: "GE-THO-8930",
    address: "Route d'Hermance 102",
    commune: "Thônex",
    surface: 2100,
    zone: "Zone 5",
    built: true,
    type: "sous_exploite",
    score: 58,
    buildablePotential: 1260,
    estimatedHousing: 14,
    risk: "eleve",
    constraints: ["Refus voisinage probable"],
    recommendation: "Approche prudente, long terme.",
    crmStatus: "a_analyser",
    x: 78, y: 48,
  },
];

export const communes = Array.from(new Set(parcels.map((p) => p.commune))).sort();
export const zones = Array.from(new Set(parcels.map((p) => p.zone))).sort();

export const kpis = {
  parcellesAnalysees: 12480,
  opportunitesDetectees: 186,
  potentielLogements: 2340,
  alertesActives: 24,
};

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  commune: string;
  date: string;
  severity: "info" | "success" | "warning";
}

export const alerts: AlertItem[] = [
  {
    id: "a1",
    title: "Nouvelle parcelle détectée — zone de développement",
    description: "Une parcelle de 3'860 m² vient d'être marquée en zone de développement à Genève.",
    commune: "Genève",
    date: "Il y a 2 h",
    severity: "success",
  },
  {
    id: "a2",
    title: "Mise à jour de PLQ à Lancy",
    description: "Le PLQ Pont-Butin a été révisé. Densité autorisée augmentée.",
    commune: "Lancy",
    date: "Hier",
    severity: "info",
  },
  {
    id: "a3",
    title: "Parcelle sous-exploitée à Chêne-Bougeries",
    description: "Bâtiment ancien sur grande parcelle, ratio SBP/surface très faible.",
    commune: "Chêne-Bougeries",
    date: "Il y a 2 jours",
    severity: "success",
  },
  {
    id: "a4",
    title: "Score d'opportunité augmenté",
    description: "GE-MEY-0815 passe de 71 à 78 suite à une révision du zonage.",
    commune: "Meyrin",
    date: "Il y a 3 jours",
    severity: "warning",
  },
];

export const crmColumns: { id: CrmStatus; label: string }[] = [
  { id: "a_analyser", label: "À analyser" },
  { id: "a_contacter", label: "À contacter" },
  { id: "contacte", label: "Contacté" },
  { id: "en_discussion", label: "En discussion" },
  { id: "abandonne", label: "Abandonné" },
];

export function scoreColor(score: number): "success" | "warning" | "destructive" | "muted" {
  if (score >= 80) return "success";
  if (score >= 70) return "warning";
  if (score >= 60) return "destructive";
  return "muted";
}

export function typeLabel(t: OpportunityType): string {
  return t === "non_bati" ? "Non bâti" : t === "sous_exploite" ? "Sous-exploité" : "Zone développement";
}

export function riskLabel(r: RiskLevel): string {
  return r === "faible" ? "Faible" : r === "moyen" ? "Moyen" : "Élevé";
}
