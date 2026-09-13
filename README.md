# Project Genesis

Project Genesis est désormais organisé pour accueillir plusieurs jeux/prototypes sous une même GitHub Pages.

## Point d’entrée public

`https://ludodulac.github.io/Project-Genesis/`

La racine affiche le hub **Genesis Multijoueur**. Chaque jeu est enregistré dans `src/games/registry.ts` et possède sa propre route via le paramètre `?game=`.

Jeux actuellement préparés :
- `?game=duel-v0` — prototype Duel contre la machine, main de 4 cartes ;
- `?game=duel-lab-v0` — ancien laboratoire de duel conservé pour référence ;
- `?game=living-watershed` — accès direct au prototype existant tant qu’il n’est pas encore promu dans le hub.

## Ajouter un jeu

1. ranger sa logique dans un dossier dédié sous `src/` ;
2. conserver simulation et présentation séparées lorsque le jeu en a besoin ;
3. ajouter son entrée dans `src/games/registry.ts` ;
4. ajouter sa route dans `src/main.ts` ;
5. ajouter tests et assets dédiés sans modifier les autres jeux inutilement.

Le déploiement GitHub Pages reste géré par `.github/workflows/ci-pages.yml` lors d’un push sur `main`.
