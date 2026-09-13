# Project Genesis

Project Genesis est organisé comme un hub extensible capable d'accueillir plusieurs jeux sous une même GitHub Pages.

## Point d’entrée public

`https://ludodulac.github.io/Project-Genesis/`

La racine affiche le hub **Genesis Multijoueur**. Chaque jeu public est enregistré dans `src/games/registry.ts` et possède sa propre route via le paramètre `?game=`.

## Jeux actuellement disponibles

- `?game=duel-v0` — Duel contre la machine avec 4 cartes visibles en main.

Les anciens prototypes et scènes de laboratoire ne sont plus exposés dans l'interface publique.

## Ajouter un jeu

1. ranger le nouveau jeu dans un dossier dédié ;
2. conserver sa logique isolée des autres jeux ;
3. ajouter son entrée dans `src/games/registry.ts` ;
4. ajouter sa route dans `src/main.ts` ;
5. ajouter ses tests et assets dédiés sans modifier inutilement les autres jeux.

Le déploiement GitHub Pages est géré par `.github/workflows/ci-pages.yml` lors d’un push sur `main`.
