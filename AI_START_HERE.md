# AI START HERE

Ce fichier est le routeur de reprise du projet. Il n'est pas une nouvelle source de vérité.

## Avant de modifier

1. Vérifier le vrai dépôt, la branche `main`, les commits récents, PR/issues éventuelles et l'état réellement déployé.
2. Lire `PROJECT_PRINCIPLES.md`.
3. Lire `docs/CURRENT_STATE.md`.
4. Lire uniquement la documentation pertinente à la zone touchée.
5. Inspecter le code réel avant de proposer une architecture ou une correction.
6. Distinguer moteur retenu, expérience de laboratoire, idée garée et ancien essai.
7. Identifier la source de vérité affectée.
8. Chercher la plus petite modification cohérente et réversible.
9. Valider au niveau proportionnel au risque.

## Hiérarchie de vérité

1. Comportement réel : code + tests + état déployé.
2. Invariants : `PROJECT_PRINCIPLES.md`.
3. Architecture : `docs/ARCHITECTURE.md`.
4. État opérationnel : `docs/CURRENT_STATE.md`.
5. Mécaniques retenues : `docs/GAMEPLAY.md`.
6. Expériences et apprentissages : `docs/LAB.md`.
7. Idées non engagées : `docs/PARKED_IDEAS.md`.

## Règle de recherche

Avant d'inventer une solution technique non triviale, rechercher les références pertinentes (documentation officielle, exemples Phaser, techniques éprouvées, projets open source compatibles), puis adapter la solution à nos frontières plutôt que copier une architecture entière.

Une référence externe est une source d'inspiration, jamais automatiquement une dépendance ni une règle du projet.

## Avant de terminer une session

- vérifier ce qui fonctionne réellement ;
- distinguer fait, hypothèse et ressenti ;
- inscrire les mécaniques conservées dans `GAMEPLAY.md` ;
- inscrire les expériences dans `LAB.md` ;
- mettre `CURRENT_STATE.md` à jour si l'état opérationnel a changé ;
- transformer une régression reproductible importante en test/sentinelle lorsque raisonnable ;
- signaler explicitement ce qui n'a pas été vérifié ;
- laisser une prochaine action claire.

Test final : une nouvelle conversation sans contexte doit pouvoir lire ce fichier, vérifier le dépôt réel et reprendre le travail sans reconstruire l'histoire orale du projet.
