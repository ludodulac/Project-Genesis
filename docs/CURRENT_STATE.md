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

Le premier test humain a produit une compréhension spontanée prometteuse : **« je creuse quelque part et la bille tend à aller vers le creux »**. Cette causalité est `PROMOTE-PARTIAL`.

## Frontière isolée — toucher la case occupée
Le joueur s'attend spontanément à ce qu'une bille ronde touchée directement parte quelque part autour. Le comportement actuel la laisse sur la case creusée, ce qui donne une impression de bille collée.

La recherche a cependant montré qu'un simple tap centré ne contient aucune direction latérale. Avec les règles actuelles, creuser la case occupée enfonce encore la bille dans un minimum local ; une sortie gravitaire est pratiquement impossible. Une direction fixe, aléatoire, mémorisée ou choisie par un tie-break invisible est interdite.

Un prototype **non branché sur la version jouable** étudie le seul candidat encore cohérent : le contact fournirait l'impulsion, tandis que le relief visible choisirait l'unique bord voisin nettement le plus bas. Il refuse de bouger lorsque l'écart visuel entre les deux meilleurs bords est inférieur à environ 2 px. Les sentinelles vérifient qu'aucune direction n'est inventée sur terrain ambigu.

Ce candidat n'est pas promu : il peut faire sortir la bille d'un bassin en montant vers son bord, donc il introduit implicitement une impulsion. Tant que ce coût conceptuel n'est pas justifié, la production reste EXP-022b inchangée.

## Critère humain
Avant le toucher, le joueur doit indiquer où il pense que la boule va aller. Plusieurs prédictions correctes dans des directions différentes sont nécessaires avant de réintroduire du caractère ou de la profondeur.

## Toujours absent
Deuxième entité, ressources, objectif, tutoriel permanent, score, combat, progression, backend et toute nouvelle règle invisible.
