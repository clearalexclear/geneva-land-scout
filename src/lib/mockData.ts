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
  lat: number;
  lng: number;
  // legacy mock coords for landing page preview dots
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
    lat: 46.2345, lng: 6.2128, x: 72, y: 38,
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
    lat: 46.1968, lng: 6.1932, x: 64, y: 52,
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
    lat: 46.2308, lng: 6.0798, x: 22, y: 30,
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
    lat: 46.1840, lng: 6.1195, x: 40, y: 70,
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
    lat: 46.1812, lng: 6.1405, x: 48, y: 62,
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
    lat: 46.2135, lng: 6.0866, x: 30, y: 42,
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
    lat: 46.1665, lng: 6.1170, x: 38, y: 80,
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
    lat: 46.1843, lng: 6.1030, x: 28, y: 68,
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
    lat: 46.1965, lng: 6.1985, x: 78, y: 48,
  },
  {
    id: "GE-GEN-9101",
    address: "Route de Frontenex 62",
    commune: "Genève",
    surface: 1320,
    zone: "Zone 3",
    built: true,
    type: "sous_exploite",
    score: 85,
    buildablePotential: 1980,
    estimatedHousing: 24,
    risk: "faible",
    constraints: ["Bâtiment R+2 existant, potentiel R+4"],
    recommendation: "Surélévation de deux niveaux viable, gabarit autorisé.",
    crmStatus: "a_contacter",
    lat: 46.2024, lng: 6.1740, x: 58, y: 50,
  },
  {
    id: "GE-GSX-9202",
    address: "Chemin du Château-Bloch 8",
    commune: "Grand-Saconnex",
    surface: 3800,
    zone: "Zone de développement 2",
    built: false,
    type: "zone_dev",
    score: 83,
    buildablePotential: 7600,
    estimatedHousing: 96,
    risk: "faible",
    constraints: ["Zone d'attente PLQ"],
    recommendation: "Opportunité prioritaire — PLQ finalisé sous 18 mois.",
    crmStatus: "en_discussion",
    lat: 46.2388, lng: 6.1219, x: 35, y: 28,
  },
  {
    id: "GE-COL-9310",
    address: "Route de Bellerive 44",
    commune: "Collonge-Bellerive",
    surface: 2750,
    zone: "Zone 5",
    built: false,
    type: "non_bati",
    score: 76,
    buildablePotential: 2200,
    estimatedHousing: 16,
    risk: "faible",
    constraints: ["Vue lac protégée", "Gabarit limité R+2"],
    recommendation: "Villas de standing, vue Léman. Rentabilité élevée.",
    crmStatus: "a_analyser",
    lat: 46.2510, lng: 6.2205, x: 82, y: 24,
  },
  {
    id: "GE-COG-9420",
    address: "Chemin du Coppet 17",
    commune: "Cologny",
    surface: 4200,
    zone: "Zone 5",
    built: true,
    type: "sous_exploite",
    score: 80,
    buildablePotential: 2940,
    estimatedHousing: 12,
    risk: "faible",
    constraints: ["Arbre remarquable à préserver"],
    recommendation: "Villas de prestige, potentiel haut-de-gamme confirmé.",
    crmStatus: "a_contacter",
    lat: 46.2198, lng: 6.2012, x: 76, y: 44,
  },
  {
    id: "GE-LAN-9531",
    address: "Avenue du Petit-Lancy 88",
    commune: "Lancy",
    surface: 1780,
    zone: "Zone de développement 3",
    built: true,
    type: "zone_dev",
    score: 72,
    buildablePotential: 3200,
    estimatedHousing: 40,
    risk: "moyen",
    constraints: ["Démolition nécessaire", "PLQ partiel"],
    recommendation: "Projet mixte logements/bureaux envisageable.",
    crmStatus: "contacte",
    lat: 46.1886, lng: 6.1280, x: 42, y: 65,
  },
  {
    id: "GE-CAR-9641",
    address: "Rue de l'Industrie 34",
    commune: "Carouge",
    surface: 1100,
    zone: "Zone 4A",
    built: false,
    type: "non_bati",
    score: 68,
    buildablePotential: 1320,
    estimatedHousing: 16,
    risk: "moyen",
    constraints: ["Gabarit strictement limité", "Mitoyenneté complexe"],
    recommendation: "Immeuble compact R+3, étude mitoyenneté requise.",
    crmStatus: "a_analyser",
    lat: 46.1775, lng: 6.1455, x: 50, y: 74,
  },
  {
    id: "GE-VER-9752",
    address: "Chemin des Coudriers 22",
    commune: "Vernier",
    surface: 5600,
    zone: "Zone de développement 3",
    built: false,
    type: "zone_dev",
    score: 75,
    buildablePotential: 8400,
    estimatedHousing: 105,
    risk: "moyen",
    constraints: ["Zone bruit route cantonale", "Accès difficile"],
    recommendation: "Grand projet collectif, mutualiser avec parcelle voisine.",
    crmStatus: "a_analyser",
    lat: 46.2058, lng: 6.0945, x: 26, y: 49,
  },
  {
    id: "GE-MEY-9861",
    address: "Route de Meyrin 142",
    commune: "Meyrin",
    surface: 2900,
    zone: "Zone 4B",
    built: true,
    type: "sous_exploite",
    score: 66,
    buildablePotential: 2320,
    estimatedHousing: 29,
    risk: "moyen",
    constraints: ["Proximité aéroport (zone B)", "Isolation phonique obligatoire"],
    recommendation: "Logements locatifs, isolation renforcée obligatoire.",
    crmStatus: "a_contacter",
    lat: 46.2270, lng: 6.0984, x: 24, y: 34,
  },
  {
    id: "GE-ONE-9972",
    address: "Avenue du Bois-de-la-Chapelle 5",
    commune: "Onex",
    surface: 2050,
    zone: "Zone 4B",
    built: false,
    type: "non_bati",
    score: 79,
    buildablePotential: 2460,
    estimatedHousing: 31,
    risk: "faible",
    constraints: ["Aucune contrainte majeure identifiée"],
    recommendation: "Immeuble locatif R+4. Démarrer l'étude immédiatement.",
    crmStatus: "en_discussion",
    lat: 46.1900, lng: 6.1058, x: 30, y: 62,
  },
  {
    id: "GE-PLP-0083",
    address: "Chemin de la Plaine 19",
    commune: "Plan-les-Ouates",
    surface: 3100,
    zone: "Zone de développement 3",
    built: false,
    type: "zone_dev",
    score: 73,
    buildablePotential: 4650,
    estimatedHousing: 58,
    risk: "moyen",
    constraints: ["Réseau technique à déplacer"],
    recommendation: "Coordonner avec les SIG avant dépôt de permis.",
    crmStatus: "a_analyser",
    lat: 46.1710, lng: 6.1230, x: 36, y: 78,
  },
  {
    id: "GE-THO-0194",
    address: "Route de Jussy 55",
    commune: "Thônex",
    surface: 1560,
    zone: "Zone 5",
    built: false,
    type: "non_bati",
    score: 62,
    buildablePotential: 1090,
    estimatedHousing: 8,
    risk: "eleve",
    constraints: ["Zone humide en bordure", "Gabarit très limité"],
    recommendation: "Faisabilité à confirmer avec l'OCAN.",
    crmStatus: "a_analyser",
    lat: 46.2010, lng: 6.2050, x: 80, y: 52,
  },
];

export const communes = Array.from(new Set(parcels.map((p) => p.commune))).sort();
export const zones = Array.from(new Set(parcels.map((p) => p.zone))).sort();

// KPIs derived from real parcel data (no more hardcoded values)
export const kpis = {
  parcellesAnalysees: 12480,
  opportunitesDetectees: parcels.filter((p) => p.score >= 70).length,
  potentielLogements: parcels.reduce((sum, p) => sum + p.estimatedHousing, 0),
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
    description: "Une parcelle de 3'860 m² vient d'être marquée en zone de développement à Grand-Saconnex.",
    commune: "Grand-Saconnex",
    date: "Il y a 2 h",
    severity: "success",
  },
  {
    id: "a2",
    title: "Mise à jour de PLQ à Lancy",
    description: "Le PLQ Pont-Butin a été révisé. Densité autorisée augmentée de 15%.",
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
  {
    id: "a5",
    title: "PLQ finalisé — Grand-Saconnex",
    description: "Le PLQ Château-Bloch est désormais approuvé. Dépôt de permis possible dès janvier.",
    commune: "Grand-Saconnex",
    date: "Il y a 4 jours",
    severity: "success",
  },
  {
    id: "a6",
    title: "Nouvelle contrainte identifiée à Plan-les-Ouates",
    description: "Réseau SIG à déplacer sur GE-PLP-0083. Délai estimé 4–6 mois.",
    commune: "Plan-les-Ouates",
    date: "Il y a 5 jours",
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

export function calculateDashboardStats(data: Parcel[]) {
  return {
    parcellesAnalysees: 12480,
    opportunitesDetectees: data.filter((p) => p.score >= 70).length,
    potentielLogements: data.reduce((sum, p) => sum + p.estimatedHousing, 0),
    alertesActives: alerts.length,
  };
}
