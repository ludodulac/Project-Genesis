# Current State

## État réel
Genesis travaille sur une seule question : **le joueur peut-il prédire le prochain déplacement avant d'agir ?**

Le laboratoire multi-agent reste conservé mais hors de la version jouable.

## EXP-021 — échec humain
Le joueur ne savait pas influencer la boule et la voyait changer de direction de manière apparemment arbitraire. La mémoire anti-ping-pong est abandonnée dans la branche jouable.

Principe canonique : **déterminisme logiciel ≠ prédictibilité humaine**.

## EXP-022a — résultat automatique utile
La première version sans mémoire faisait descendre la boule vers le voisin le plus bas, mais la CI a révélé que notre propre intuition sur le geste de sculpture était fausse : relever une case voisine drainait la case sous la boule et pouvait la laisser dans un bassin. La logique était déterministe mais le geste restait indirect.

Nous ne corrigeons pas le test pour faire semblant que cette interaction est intuitive.

## Version expérimentale active — EXP-022b
Pour isoler la causalité, le geste jouable est temporairement inversé :
- toucher une case l'enfonce directement ;
- la matière retirée est redistribuée vers ses voisines ;
- si la case touchée est adjacente à la boule, elle devient une vallée directement visible ;
- la boule descend vers l'unique voisin le plus bas ;
- si les meilleures descentes sont exactement à égalité, elle ne choisit pas arbitrairement et reste sur place ;
- aucune mémoire, destination, inertie ou pathfinding n'intervient.

Ce n'est pas encore le choix définitif du verbe du jeu. C'est l'expérience la plus petite trouvée pour tester `je creuse là → elle roule là`.

## Critère humain
Avant le toucher, le joueur doit indiquer où il pense que la boule va aller. Plusieurs prédictions correctes dans des directions différentes sont nécessaires avant de réintroduire du caractère ou de la profondeur.

## Toujours absent
Deuxième entité, ressources, objectif, tutoriel permanent, score, combat, progression, backend et toute nouvelle règle invisible.
