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

## Deux mouvements complémentaires

Genesis ne cherche pas encore à finir un jeu ; il cherche le jeu qui donnera une bonne raison d'être fini.

Le laboratoire alterne deux mouvements :

`EXPLORER LARGEMENT → sélectionner un pari → PROTOTYPER TRÈS PETIT → tester humainement → apprendre → KEEP/PROMOTE-PARTIAL/PARK/DROP → rouvrir l'espace → éventuellement combiner les meilleures primitives`.

Une primitive validée reste disponible sans devenir automatiquement « le jeu Genesis ». Après une séquence d'approfondissement, et particulièrement lorsqu'un langage fondamental vient d'être validé, faire explicitement un point avant l'expérience suivante :
- qu'avons-nous réellement appris ?
- quelle primitive mérite d'être conservée ?
- l'incertitude la plus importante est-elle encore dans cette famille ?
- ou faut-il rouvrir une exploration externe vers une famille de plaisir très différente ?

L'exploration externe peut regarder jeux mobiles/web, petits indés, game jams, prototypes, postmortems et retours de joueurs. Chercher des **sources élémentaires de plaisir**, pas seulement des genres : envie de toucher, retry, surprise compréhensible, maîtrise, profondeur à peu de règles, adéquation tactile, génération de situations sans gros volume d'assets/contenu.

Préférer vingt jouets minuscules bien choisis à la construction progressive d'un jeu moyen parce que la première mécanique fonctionnait. Inversement, ne pas jeter une primitive comprise : elle peut être recombinée plus tard.

## Tests : vérité ≠ fun

Les tests automatisés vérifient déterminisme, transitions, règles et invariants. Ils ne prouvent pas qu'une mécanique est intéressante. Une question de compréhension/plaisir peut exiger une observation humaine ciblée.

## Trace obligatoire

Le dépôt doit permettre de retrouver : testé / appris / abandonné / promu / état actuel / prochaine hypothèse. Une passation de boucle doit en plus rendre visibles **objectif / dernière boucle / preuve / prochaine décision**.

Test final : une nouvelle conversation doit pouvoir partir de ce fichier, découvrir Grand Père, vérifier le dépôt réel et reprendre la recherche sans reconstruire l'histoire orale.
