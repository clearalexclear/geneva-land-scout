# FoncierRadar — Plan d'intégration backend

Ce document décrit les prochaines étapes techniques pour passer du MVP mock à une plateforme connectée à des données réelles.

---

## Étape 1 — Base de données : Supabase + PostGIS

- Créer un projet Supabase (supabase.com)
- Activer l'extension PostGIS : `CREATE EXTENSION postgis;`
- Créer la table `parcels` avec une colonne `geometry` de type `geography(Point, 4326)`
- Remplacer `src/lib/mockData.ts` par des appels `supabase.from('parcels').select('*')`
- Utiliser `@tanstack/react-query` (déjà installé) pour le cache et les états de chargement

```sql
CREATE TABLE parcels (
  id TEXT PRIMARY KEY,
  address TEXT,
  commune TEXT,
  surface_m2 INTEGER,
  zone TEXT,
  built BOOLEAN,
  type TEXT CHECK (type IN ('non_bati', 'sous_exploite', 'zone_dev')),
  score INTEGER,
  buildable_potential_m2 INTEGER,
  estimated_housing INTEGER,
  risk TEXT CHECK (risk IN ('faible', 'moyen', 'eleve')),
  constraints TEXT[],
  recommendation TEXT,
  crm_status TEXT,
  location geography(Point, 4326),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX parcels_location_idx ON parcels USING GIST (location);
```

---

## Étape 2 — Import des données SITG (cadastre genevois)

- Source : SITG (Système d'Information du Territoire à Genève) — sitg.ch
- Données à importer :
  - **Cadastre** : couche `PARCELLE` (limites, surface, identifiant officiel EGRID)
  - **Zonage** : couche `ZONE_AFFECTATION` (zone 3, 4A, 4B, 5, zone de développement)
  - **Bâtiments** : couche `BATIMENT` (empreinte, hauteur, date de construction, SBP)
  - **PLQ** : couche `PLQ` (plans localisés de quartier en vigueur et en cours)
  - **Patrimoine** : couche `HERITAGE_CLASSE` (bâtiments et sites protégés)

- Import via script Python avec `geopandas` + `psycopg2` :

```python
import geopandas as gpd
from sqlalchemy import create_engine

gdf = gpd.read_file("SITG_PARCELLE.gpkg")
gdf = gdf.to_crs("EPSG:4326")
engine = create_engine("postgresql://...")
gdf.to_postgis("parcels_raw", engine, if_exists="replace")
```

---

## Étape 3 — Calcul du score d'opportunité

Le score (0–100) est calculé automatiquement côté serveur via une fonction SQL ou edge function :

| Critère | Poids |
|---|---|
| Surface de la parcelle | 15% |
| Zone d'affectation | 20% |
| Ratio SBP existant / potentiel | 25% |
| Absence de contraintes (patrimoine, servitudes) | 20% |
| Accessibilité (transports publics TPG) | 10% |
| PLQ en cours ou finalisé | 10% |

Implémenter dans une Supabase Edge Function (`score-parcels`) déclenchée à chaque mise à jour.

---

## Étape 4 — Couches de zonage sur la carte

- Charger les couches GeoJSON du SITG directement dans Leaflet avec `react-leaflet` :
  - `GeoJSON` component de react-leaflet pour le zonage
  - `Pane` pour contrôler l'ordre d'affichage
- Utiliser la librairie `chroma-js` pour la coloration des zones

---

## Étape 5 — Détection automatique des parcelles sous-exploitées

- Requête PostGIS : comparer la SBP réelle (couche bâtiments) avec la SBP maximale autorisée (couche zonage × IUS)
- Si `sbp_actuelle / sbp_max < 0.5` → type = `sous_exploite`
- Si `sbp_actuelle = 0` → type = `non_bati`
- Calculer `estimated_housing` depuis la SBP constructible ÷ 75 m² par logement

---

## Étape 6 — Alertes automatiques

- Utiliser les Supabase Realtime + pg_cron pour déclencher des alertes :
  - Nouveau PLQ mis en vigueur → alerte `zone_dev`
  - Parcelle qui change de zone → recalcul du score
  - Score > 75 pour une nouvelle parcelle → notification push / email

---

## Étape 7 — Authentification

- Supabase Auth (magic link ou OAuth Google/Microsoft)
- Row-Level Security (RLS) pour isoler les données par équipe
- Plans d'abonnement via Stripe + webhook Supabase

---

## Fichiers à modifier pour la migration

| Fichier actuel | Action |
|---|---|
| `src/lib/mockData.ts` | Remplacer les données statiques par `supabase.from(...).select()` |
| `src/components/GenevaMap.tsx` | Ajouter couches GeoJSON SITG |
| `src/routes/_app.dashboard.tsx` | Utiliser `useQuery` pour KPIs temps réel |
| `src/routes/_app.carte.tsx` | Pagination et filtres côté serveur |
| `src/routes/_app.opportunites.tsx` | Filtres + tri côté Supabase |

---

## Stack cible

```
Frontend     React + TanStack Router + react-leaflet
Backend      Supabase (PostgreSQL + PostGIS + Auth + Realtime)
Données      SITG (cadastre, zonage, bâtiments, PLQ)
Score        Supabase Edge Functions (Deno)
Alertes      pg_cron + Supabase Realtime
Paiement     Stripe
Déploiement  Cloudflare Pages (déjà configuré)
```
