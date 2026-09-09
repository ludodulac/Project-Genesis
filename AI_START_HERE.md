# AI START HERE — Project Genesis

Ce fichier est le routeur de reprise du projet. Il n'est pas une nouvelle source de vérité.

## Contexte transversal

Genesis appartient à l'écosystème **`ludodulac/Grand-p-re-`** ; le slug GitHub de « Grand Père » utilise des tirets à la place des caractères accentués. En nouvelle conversation, lire d'abord Grand Père `AI_START_HERE.md`, la fiche Genesis via `projects/_INDEX.md` et `LOOP_ENGINEERING.md`, puis revenir ici. **Genesis reste la source de vérité de son moteur, de ses expériences, tests et état déployé.**

## Avant de modifier

1. vérifier vrai dépôt, `main`, commits/PR/issues et état déployé ;
2. lire `PROJECT_PRINCIPLES.md` ;
3. lire `docs/CURRENT_STATE.md` ;
4. utiliser `docs/_INDEX.md` et seulement la documentation pertinente ;
5. distinguer moteur retenu, expérience de laboratoire, idée garée et ancien essai ;
6. choisir la plus petite modification/expérience cohérente et réversible ;
7. valider proportionnellement.

## Hiérarchie de vérité

code + tests + état déployé → principes → architecture → CURRENT_STATE → gameplay retenu → LAB → PARKED_IDEAS.

## Mode laboratoire autonome

Boucle locale : `observation → prédiction de l'utilisateur → geste → résultat → divergence du modèle mental → plus petite expérience suivante`.

Elle complète la boucle transversale de Grand Père : `objectif → état réel → écart → couche responsable → expérience minimale → preuve → CONTINUE/PIVOT/STOP`.

L'IA peut enchaîner des expériences réversibles sans demander après chaque étape. Elle ne doit pas transformer une hypothèse en vérité sans test, ni ajouter prématurément backend, comptes, multijoueur, boutique ou grosse infrastructure.

**Déterminisme ≠ prédictibilité humaine. Une règle correcte ≠ une règle lisible.** Si le joueur ne comprend pas une règle fondamentale, ne pas ajouter texte, flèches ou effets pour masquer le problème avant d'avoir testé la règle elle-même.

EXP-XXX n'est jamais le jeu. Une expérience peut être promue, partiellement conservée, parkée ou abandonnée.

## Tests : vérité ≠ fun

Les tests automatisés vérifient déterminisme, transitions, règles et invariants. Ils ne prouvent pas qu'une mécanique est intéressante. Une question de compréhension/plaisir peut exiger une observation humaine ciblée.

## Trace obligatoire

Le dépôt doit permettre de retrouver : testé / appris / abandonné / promu / état actuel / prochaine hypothèse. Une passation de boucle doit en plus rendre visibles **objectif / dernière boucle / preuve / prochaine décision**.

Test final : une nouvelle conversation doit pouvoir partir de ce fichier, découvrir Grand Père, vérifier le dépôt réel et reprendre la recherche sans reconstruire l'histoire orale.
