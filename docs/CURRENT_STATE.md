# Current State

## État réel
Genesis travaille sur une seule question : **le joueur peut-il prédire le prochain déplacement avant d'agir ?**

Le laboratoire multi-agent reste conservé mais hors de la version jouable.

## Connaissance acquise avant EXP-023
EXP-021 a échoué humainement : déterminisme logiciel ≠ prédictibilité humaine.

EXP-022b a ensuite produit la première formulation spontanée utile : **« je creuse quelque part et la bille tend à aller vers le creux »**. Cette causalité reste `PROMOTE-PARTIAL`.

Le cas de la cellule occupée a montré qu'un tap centré ne contient aucune direction latérale exploitable sans hasard, mémoire ou tie-break caché. Ces solutions sont interdites.

Une tentative de remplacer la bille par un acteur carré a également échoué humainement : le joueur a attendu des boutons pour le déplacer. Cette branche est `DROP` et son apprentissage est conservé.

## Signifiant actif figé — EXP-022e
Le cercle est maintenant creux : circularité conservée, terrain visible au centre. La simulation et le geste restent ceux d'EXP-022b.

Le test humain a produit une chaîne causale spontanée : le joueur dit qu'il baisse le terrain, que l'acteur « coule » dans ce relief et qu'il pense pouvoir ensuite modifier le terrain pour l'envoyer ailleurs.

Statut : `PROMOTE-PARTIAL`, **pas encore langage acquis**.

Le cercle creux est figé pendant les tests de prédiction. Aucun changement simultané de présentation, physique ou geste n'est autorisé.

## EXP-023 — expérience active
Objectif : essayer de **réfuter** la compréhension terrain → conséquence sur l'acteur.

Quatre scénarios déterministes sont disponibles via le harness de prédiction. Ils utilisent exactement le même moteur et le même signifiant ; seule la géométrie initiale varie. Une cellule est marquée avant l'action et une seule pression y est acceptée.

Les cas couvrent :
- déplacement vers une cellule adjacente touchée ;
- toucher adjacent sans déplacement ;
- déplacement à l'opposé du côté touché ;
- toucher de la cellule occupée sans direction latérale inventée.

Les tests automatiques vérifient les conséquences, mais ne valident pas la compréhension humaine.

## Critère humain de promotion
Avant chaque interaction, recueillir la prédiction du joueur sans expliquer la règle.

Le langage `terrain → conséquence sur l'acteur` ne sera considéré acquis que si le joueur prédit correctement plusieurs conséquences nouvelles, notamment au moins un cas qui contredit une heuristique superficielle comme « je touche près donc ça bouge » ou « l'objet va vers l'endroit touché ».

## Toujours absent
Deuxième entité, ressources, objectif, tutoriel permanent, boutons de mouvement, joystick, score, combat, progression, backend, mémoire de déplacement et toute nouvelle règle invisible.
