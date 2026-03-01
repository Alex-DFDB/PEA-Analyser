# CLAUDE.md — PEA Analyzer · Design System

> Référence de design pour toute génération ou modification d'UI sur le projet PEA Analyzer.

---

## 1. Identité visuelle

**Nom du produit :** PEA·ANALYSER  
**Positionnement :** Outil d'analyse de portefeuille PEA — premium, éditorial, sobre.  
**Ambiance :** Papier financier haut de gamme. Loin des fintech bleues génériques.

---

## 2. Palette de couleurs

### Fond & surfaces

| Token            | Hex       | Usage                      |
| ---------------- | --------- | -------------------------- |
| `--cream`        | `#F5F0E8` | Fond de page principal     |
| `--cream-dark`   | `#EDE7D9` | Fond des inputs, selectors |
| `--cream-darker` | `#E0D8C8` | Bordures, séparateurs      |

### Texte

| Token        | Hex       | Usage                       |
| ------------ | --------- | --------------------------- |
| `--ink`      | `#1A1714` | Titres, valeurs principales |
| `--ink-soft` | `#3D3830` | Corps de texte              |
| `--muted`    | `#8A8070` | Labels, métadonnées         |

### Accentuation

| Token           | Hex       | Usage                                  |
| --------------- | --------- | -------------------------------------- |
| `--gold`        | `#C4A86A` | Accent principal, graphes, dots actifs |
| `--gold-light`  | `#D4BC8A` | Hover, variantes claires               |
| `--green`       | `#4A7C59` | Performance positive, gains            |
| `--green-light` | `#6A9C79` | Badges hausse (fond)                   |
| `--red`         | `#8B3A3A` | Performance négative, pertes           |

### Sidebar

Fond `#1A1714` (ink) avec overlay de dots `#C4A86A` à 10% d'opacité.

---

## 3. Motif de points — règle centrale

Le motif de points (dot pattern) est **l'élément signature** du design. Il doit apparaître à **3 niveaux d'intensité** :

| Niveau      | Contexte                | Spec                                                           |
| ----------- | ----------------------- | -------------------------------------------------------------- |
| **Global**  | Fond de page entière    | `radial-gradient` 1px gold à 13%, `background-size: 24px 24px` |
| **Sidebar** | Overlay sur fond sombre | Même pattern, opacité 10%, `background-size: 18px 18px`        |
| **Micro**   | Coins des cards KPI     | Patch 60×60px, `background-size: 8px 8px`, opacité 30%         |

> Ne jamais surcharger — les dots doivent être **discrets et décoratifs**, jamais dominants.

Les dots sont aussi utilisés comme **éléments d'UI fonctionnels** :

- Point actif en fin de courbe de graphe (`r="5"`, filled gold)
- Cercles vides sur les points de données (`r="4"`, stroke gold, fill white)
- Dot de navigation dans la sidebar (indicateur d'item actif)
- Dots colorés dans les timelines (dividendes, allocations)
- Dots décoratifs autour du gauge de risque

---

## 4. Typographie

| Famille            | Usage                              | Poids              |
| ------------------ | ---------------------------------- | ------------------ |
| `Playfair Display` | Valeurs KPI, logo, titres premium  | 500, 600           |
| `Inter`            | Tout le reste (labels, corps, nav) | 300, 400, 500, 600 |

### Échelle typographique

- Logo : `20px` Playfair
- Titre de page : `28px` Playfair 500
- Valeur KPI : `26px` Playfair 500
- Titre de card : `14px` Inter 600
- Corps / tableau : `13px` Inter 400
- Labels / badges : `10–11px` Inter 500, `letter-spacing: 1–1.5px`, uppercase

---

## 5. Composants

### Layout général

- Grille : `220px sidebar | 1fr main`
- Padding main : `36px 40px`
- Fond : `--cream` + dot pattern fixe en `position: fixed`

### Cards

```css
background: white;
border-radius: 14px;
padding: 20–24px;
border: 1px solid var(--cream-darker);
```

Toujours avec `overflow: hidden`. Coin supérieur droit avec patch de dots micro.

### KPI Cards (4 colonnes)

- Label : `10px` uppercase muted
- Valeur : Playfair `26px`
- Delta : `11px` avec flèche ▲▼ et couleur sémantique
- Patch dots + halo doré en `::after` (pseudo-élément)

### Graphe d'évolution

- SVG avec `viewBox="0 0 500 140"`, `preserveAspectRatio="none"`
- Ligne : `stroke: gold`, `stroke-width: 2.5`, `stroke-linecap: round`
- Aire : `linearGradient` gold → transparent
- Grille : tirets `stroke-dasharray: 2,8`, gold à 30% d'opacité
- Points de données : cercles `r=4` blanc + stroke gold, dernier point filled

### Tableau de positions

- Headers : `10px` uppercase, `letter-spacing: 1px`, muted
- Séparateur lignes : `1px solid --cream-dark`
- Dot coloré par secteur (`8px`, `border-radius: 50%`)
- Badges performance : `border-radius: 20px`, fond teinté 9% opacité
- Sparklines inline : SVG `60×24px`, polyline verte ou rouge

### Barres d'allocation sectorielle

- Fond : `4px` height, `--cream-dark`, `border-radius: 2px`
- Barre : couleur par secteur, avec dot `8×8px` en `::after` à l'extrémité

### Timeline dividendes

- Structure verticale avec dot coloré + ligne de connexion `1px --cream-darker`
- Dernier item sans ligne
- Montant : vert, `13px` 600, aligné à droite

### Gauge de risque

- SVG custom semi-circulaire, `stroke-width: 12`, `stroke-linecap: round`
- Arc fond : `--cream-dark`
- Arc actif : `--gold`
- Dot filled à l'extrémité de l'arc actif
- Score centré : Playfair `32px`
- Grille de métriques : 2×2, cards `--cream` avec label + valeur

### Sélecteur de période

```css
background: --cream-dark;
border: 1px solid --cream-darker;
border-radius: 8px;
padding: 4px;
```

Bouton actif : fond `--ink`, texte `--gold`, `font-weight: 500`.

### Navigation sidebar

- Items inactifs : `#8A8070`
- Items actifs/hover : fond `rgba(196,168,106,0.12)`, texte gold
- Dot indicateur `6×6px` gold, visible uniquement à l'état actif/hover
- Icônes : caractères unicode cercles (`◈ ◉ ◎ ○ ◌ ⊙`)

---

## 6. Sémantique couleur

| État           | Couleur             | Usage                         |
| -------------- | ------------------- | ----------------------------- |
| Hausse / gain  | `--green` `#4A7C59` | Badges, sparklines, flèches ▲ |
| Baisse / perte | `--red` `#8B3A3A`   | Badges, sparklines, flèches ▼ |
| Neutre / info  | `--gold` `#C4A86A`  | Accent général, graphes       |
| Désactivé      | `--muted` `#8A8070` | Labels, métadonnées           |

---

## 7. Règles de style — à respecter absolument

1. **Jamais de bleu** dans l'interface — rupture avec les codes fintech standards.
2. **Jamais de shadow lourde** — au plus `box-shadow: 0 2px 8px rgba(0,0,0,0.06)`.
3. **Dots toujours présents** mais jamais à plus de 30% d'opacité sur fond clair.
4. **Playfair uniquement pour les chiffres et le logo** — pas dans les labels ou boutons.
5. **Border-radius : 14px** pour les cards, **8–10px** pour les éléments internes.
6. Les badges/pills ont toujours `border-radius: 20px` (forme pilule).
7. Toujours inclure un `letter-spacing` sur les labels uppercase.
8. Les graphes n'ont **pas de bords ni d'axes visibles** — grille en tirets discrets.

---

## 8. Pages prévues

| Page            | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| `/ (Dashboard)` | Vue d'ensemble — KPIs, graphe, allocation, positions, dividendes, risque |
| `/portfolio`    | Liste complète des positions avec filtres et tri                         |
| `/performance`  | Analyse comparative vs indices (CAC 40, S&P 500…)                        |
| `/dividendes`   | Calendrier, historique, rendement par ligne                              |
| `/fiscalite`    | Suivi plafond PEA, plus-values réalisées, simulation                     |
| `/alertes`      | Seuils de cours, objectifs, notifications                                |

---

## 9. Stack technique suggérée

- **Framework :** React + Vite
- **Styling :** CSS variables + modules (pas de Tailwind — trop générique pour ce design)
- **Graphes :** SVG natif ou Recharts avec theming custom
- **Fonts :** Google Fonts — `Playfair Display` + `Inter`
- **Icônes :** Unicode circles pour la nav, Lucide React pour les actions

---

_Toute nouvelle page ou composant doit respecter ce document avant d'être intégré._
