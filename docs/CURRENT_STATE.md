# Current State

## État réel

Le dépôt contient maintenant un prototype vivant basé sur EXP-006/007, avec **EXP-008 — Sculpter plutôt qu'empiler** rendu jouable et déployé.

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
- workflow CI + GitHub Pages.

### Verbe de sculpture actuellement testé

EXP-008 remplace temporairement l'ancienne accumulation par une redistribution de matière :

- la case touchée monte ;
- ses quatre voisines directes descendent légèrement ;
- la case touchée ne gagne que la quantité réellement prélevée aux voisines ;
- la hauteur moyenne du terrain reste approximativement conservée ;
- aucune nouvelle commande n'a été ajoutée.

Le but n'est pas de déclarer cette variante meilleure, mais de vérifier si un toucher produit davantage l'impression de **sculpter une décision** que d'ajouter une bosse.

### Résultat contrôlé EXP-008

Sur une séquence identique de huit touches appliquée à un monde 14 × 10 :

- terrain initial : amplitude ≈ `0.416`, minima locaux `8` ;
- ancienne accumulation : amplitude ≈ `0.888`, minima locaux `8`, hauteur moyenne en hausse ;
- redistribution : amplitude ≈ `0.712`, minima locaux `13`, hauteur moyenne conservée.

Observation : la redistribution ne crée pas les pics les plus extrêmes, mais crée davantage de bassins locaux. C'est une différence de géographie, pas une preuve de fun.

### Robustesse de la simulation

Un premier comportement de réaction en chaîne d'EXP-007 a été rejeté parce qu'il dépendait de l'ordre des agents dans le tableau. La simulation est maintenant phasée :

1. modification du terrain ;
2. calcul simultané des intentions de déplacement ;
3. application des déplacements ;
4. résolution stable des interactions eau/graine.

Une sentinelle vérifie que réordonner le tableau des agents ne change pas leurs décisions de mouvement.

### Vérifié

Le run CI associé à la version jouable EXP-008 a réussi :
- tests de simulation : succès ;
- tests comparatifs EXP-008 : succès ;
- build Vite : succès ;
- déploiement GitHub Pages : succès.

### Gouvernance du laboratoire

`AI_START_HERE.md` définit désormais explicitement le mode **laboratoire autonome de game design** :

`hypothèse → prototype minimal → test → observation → décision → conservation/abandon → expérience suivante`

Une expérience n'est jamais automatiquement le jeu. Les mécaniques ne sont promues dans `GAMEPLAY.md` qu'après preuve suffisante de valeur ludique.

### Expérience jouable active

**EXP-008 — Sculpter plutôt qu'empiler**

La boucle complète encore présente est :

`sculpture du terrain → déplacement → eau → croissance → nouveau terrain`

EXP-006 et EXP-007 restent des sources d'apprentissage, pas des fondations intouchables.

### À vérifier humainement sur téléphone

Le prochain test humain devra rester très court. Observer principalement :

1. un toucher donne-t-il davantage l'impression de créer **une montagne et une vallée en même temps** ?
2. cette redistribution rend-elle les trajectoires plus intéressantes à anticiper, ou simplement plus chaotiques ?

### Non promu / encore incertain
- déplacement autonome comme mécanique définitive ;
- eau ;
- graines / croissance ;
- redistribution de matière ;
- importance réelle des minima locaux pour le plaisir de jeu.

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

## Prochaine hypothèse

Avant d'ajouter un nouvel élément, chercher si le nouveau verbe de sculpture peut produire une première **situation de compromis** uniquement avec terrain + plusieurs êtres : une modification utile à un être doit pouvoir créer simultanément une opportunité ou un danger pour un autre.

Si cette profondeur n'apparaît pas, simplifier ou changer le mouvement avant d'ajouter de nouvelles couches.
