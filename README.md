# Guide opérationnel PND — POC

## En clair

On part d’un **annuaire structuré** (document Grist) et on **génère un PDF** du même esprit que le *Guide opérationnel des ressources mobilisables* : pages d’intro, sommaire, fiches toujours calées sur les mêmes rubriques.

Le produit du POC est un **custom widget Grist** (bouton + aperçu dans le document) : pas de clé API, les tables du document courant sont lues via `grist-plugin-api`. Ce n’est **pas** le widget Pilotage studios.

Ce n’est **pas** un produit national, **pas** un import des Excel départementaux, **pas** un clone pixel-perfect.

Succès visé : quelqu’un ouvre le PDF et se dit « Ah, oui, on voit le bout. »

- Dépôt : [DNUM-SocialGouv/pack_nouveau_depart](https://github.com/DNUM-SocialGouv/pack_nouveau_depart)
- Widget (GitHub Pages, après déploiement Actions) : [dnum-socialgouv.github.io/pack_nouveau_depart](https://dnum-socialgouv.github.io/pack_nouveau_depart/)
- Document Grist de démo : [Packnouveaudepart](https://grist.numerique.gouv.fr/o/docs/vygR8LGAq3an/Packnouveaudepart) (`vygR8LGAq3an`)

## Widget dans Grist (chemin principal)

1. Publier : push sur `main` → workflow **github-pages** (Settings → Pages → Source : GitHub Actions, une fois).
2. URL du widget : `https://dnum-socialgouv.github.io/pack_nouveau_depart/`
3. Dans le document Grist : **Ajouter une page** → **Personnalisé** → coller l’URL. Accès : **lecture des tables**.
4. Modifier une fiche dans Grist → **Actualiser les données** dans le widget → **Télécharger le PDF**.

L’interface du widget utilise le **DSFR** (notice, boutons, badges, alerte, callout). Le PDF reste un gabarit « guide », pas une brochure charte DGCS.

## Démo de mise à jour (la valeur métier)

1. Table `Fiches` : fiche **Accès aux droits — relais démo**.
2. Modifier **délais et modalités** (texte actuel : « Délai affiché : 10 jours… »).
3. Dans le widget : Actualiser, puis retélécharger le PDF.
4. Le champ modifié apparaît dans le PDF ; le gabarit est intact.

## Lancer en local (repli API, hors iframe Grist)

```bash
cp .env.example .env   # GRIST_API_KEY
npm install
npm run dev            # aperçu DSFR + proxy Grist
npm run generate-pdf   # dist/guide-demo.pdf (gitignoré)
```

## Ce que ce POC ne prouve pas

- Qualité « brochure institutionnelle » finale, charte DGCS, accessibilité PDF complète.
- Pagination parfaite du sommaire si on laisse le moteur décider tout seul (numéros **calculés** : 1 page / fiche courte, 2 pages si `pages_forcees = 2`).
- Que les Excel métier suffisent tels quels.

## Mais…

Le POC **prouve** : données structurées → guide régénérable (dans Grist, sans resaisie dans un PAO).

Il **ne prouve pas** :

1. Que les Excel actuels suffisent : ce sont souvent des mini-annuaires (noms, contacts), pas les 6 blocs métier. Le goulot, c’est **cadrer le canevas national** et **saisir / ranger** le contenu, pas le bouton PDF.
2. Qu’on peut avaler 101 fichiers de formes différentes sans travail d’harmonisation.
3. La qualité graphique « brochure institutionnelle » finale (accessibilité, charte, pagination parfaite du sommaire).
4. Le droit : données sensibles, pas d’open data par défaut, accès restreint (DDFE, professionnels).
5. Qu’il faille **uniquement** un PDF : une **vue web filtrable par thématique** serait un complément utile ; le PDF reste le livrable demandé.
6. Grist est le bon **socle de vérité** (import, droits, MAJ à plusieurs) ; le **moteur PDF** est le widget / la petite appli. Produit = Grist + générateur, pas Grist tout seul, **pas Pilotage studios**.

## Écarts assumés

- **Pas de JSON métier ni de PDF commité** (dépôt public).
- Textes **fictifs**.
- Pas de coordonnées réelles.
- DSFR 1.13 (la 1.15+ impose `npm create @gouvfr/dsfr`).

## Tables Grist (contrat)

- `Thematiques` : `libelle`, `ordre`, `couleur`
- `Pages_cadre` : `titre`, `corps`, `ordre`
- `Fiches` : une ligne = une fiche ; `thematique` ; `pages_forcees` (1 ou 2)

## Hors périmètre

Pas d’import Excel, pas de widget Pilotage, pas d’auth, pas de site public « annuaire », pas d’IA, pas d’écriture Grist depuis le widget.
