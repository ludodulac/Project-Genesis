# Current State

## État réel

Le dépôt contient maintenant un prototype vivant basé sur EXP-006/007, tandis qu'EXP-008 compare expérimentalement deux verbes de sculpture sans encore modifier la version jouable.

### Présent dans la version jouable
- runtime Phaser 4 + TypeScript + Vite ;
- état du monde sérialisable ;
- simulation séparée du rendu ;
- action tactile unique `RAISE_CELL` ;
- plateau orthogonal de 20 × 12 cellules ;
- grille carrée alignée horizontalement/verticalement ;
- terrain plein écran avec bords latéraux hors champ ;
- petite marche visible au bord inférieur du monde ;
- relief initial déterministe ;
- trois petits êtres autonomes ;
- chaque action produit une étape de déplacement déterministe ;
- décisions de mouvement calculées depuis un même état du terrain, indépendamment de l'ordre du tableau des agents ;
- une source d'eau explicite ;
- un être peut transporter l'eau ;
- trois cases-graine fixes et visibles ;
- un être porteur d'eau qui atteint une graine consomme l'eau, transforme la graine en pousse et augmente légèrement la hauteur de cette cellule ;
- retour visuel distinct pour eau, graines, pousses et agents chargés ;
- interaction tactile plein écran ;
- tests de simulation couvrant déformation, déplacement, collecte d'eau, floraison et indépendance vis-à-vis de l'ordre des agents ;
- workflow CI + GitHub Pages.

### Gouvernance du laboratoire

`AI_START_HERE.md` définit désormais explicitement le mode **laboratoire autonome de game design** :

`hypothèse → prototype minimal → test → observation → décision → conservation/abandon → expérience suivante`

Une expérience n'est jamais automatiquement le jeu. Les mécaniques ne sont promues dans `GAMEPLAY.md` qu'après preuve suffisante de valeur ludique.

### Expérience jouable active

**EXP-007 — Faire pousser le monde**

Boucle actuelle :

`terrain → déplacement → eau → croissance → nouveau terrain`

Le scénario contrôlé confirme que la croissance laisse bien une trace spatiale. Un premier reroutage dans la même étape a été rejeté parce qu'il dépendait d'un ordre interne invisible des agents. La simulation a été corrigée pour rendre cette priorité explicite et indépendante de l'ordre du tableau.

### Expérience de comparaison active

**EXP-008 — Sculpter plutôt qu'empiler**

La version jouable conserve encore `RAISE_CELL` tel qu'il existe aujourd'hui.

Dans `src/experiments/exp008Terrain.ts`, deux variantes sont comparées sans contaminer le moteur retenu :

- `accumulate` : la cible et ses voisins gagnent de la hauteur ;
- `redistribute` : la cible monte en prélevant approximativement la même quantité de matière à ses voisins.

Les scénarios automatisés comparent conservation de hauteur moyenne, amplitude du relief et création de minima locaux. Ces mesures servent à caractériser les variantes, pas à décider laquelle est amusante.

### Vérifié
- EXP-006 et la première version jouable de la boucle eau/graines ont déjà passé CI et déploiement ;
- la séparation des mouvements et interactions est couverte par une sentinelle d'indépendance à l'ordre des agents ;
- les derniers changements doivent toujours être considérés vérifiés uniquement si leur run CI associé est vert.

### À vérifier humainement sur téléphone
Le prochain test humain devra rester court. Observer principalement :

1. est-ce que l'on commence spontanément à anticiper les trajectoires avant de toucher ?
2. est-ce que le cycle eau → graine → pousse crée une conséquence suffisamment lisible et satisfaisante pour donner envie de la provoquer volontairement ?

### Non promu / encore incertain
- déplacement autonome comme mécanique définitive ;
- eau ;
- graines / croissance ;
- `RAISE_CELL` dans sa forme actuelle ;
- redistribution de matière d'EXP-008.

### Absent volontairement
- feu ;
- autres éléments ;
- combat ;
- adversaire ;
- condition de victoire ;
- score ;
- backend ;
- comptes ;
- multijoueur ;
- progression ;
- boutique ;
- cartes ;
- grosse infrastructure ;
- assets définitifs.

## Ordre de recherche

La chaîne `terrain → mouvement → transport → interaction → objectif → adversité` reste une heuristique, pas une roadmap obligatoire.

La prochaine hypothèse active est EXP-008 : **le verbe de sculpture devient-il plus profond si soulever une zone crée automatiquement un creux ou un coût spatial ailleurs ?**

Si la réponse contrôlée est prometteuse, la variante sera rendue jouable pour comparaison tactile. Sinon elle sera parkée ou abandonnée sans toucher à la fondation.
