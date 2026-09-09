# Current State

## État réel
Genesis travaille actuellement sur le noyau le plus petit possible : **un monde, un geste, une seule chose mobile, une causalité à comprendre**.

Le laboratoire multi-agent EXP-010 à EXP-018 reste conservé comme connaissance. Il n'est pas la version jouable principale.

## Dernier résultat humain — EXP-021 échoue
Le joueur n'a pas l'impression de pouvoir influencer la boule. Même en répétant un toucher au même endroit, il la voit partir dans des directions différentes et ne sait pas comment la déplacer.

Conclusion : le moteur pouvait être déterministe tout en restant imprédictible pour un humain. La mémoire anti-ping-pong n'a pas rendu la causalité plus lisible ; elle est donc retirée de la règle expérimentale active.

## Version expérimentale active — EXP-022
- plateau orthogonal et relief visible ;
- une seule mote jaune ;
- aucune destination, ressource ou objectif caché ;
- une seule commande : sculpter une cellule par redistribution ;
- après la sculpture, la mote observe uniquement ses quatre voisines ;
- si une voisine est strictement plus basse, elle va vers la plus basse ;
- sinon elle reste sur place ;
- aucune mémoire de trajectoire n'intervient dans cette décision.

Règle recherchée : **ce que le joueur voit doit suffire à prédire ce qui va arriver**.

## Distinction désormais canonique
**Déterminisme logiciel ≠ prédictibilité humaine.**

Un test automatisé peut prouver que deux états identiques donnent le même résultat. Il ne peut pas prouver que le joueur sait lire l'état, comprendre la cause et anticiper ce résultat.

## Ce qui doit être prouvé avant toute profondeur supplémentaire
Le joueur doit pouvoir suivre la boucle :

`j'observe → je prédis → je sculpte → je constate`

Le prochain test humain ne demandera donc pas « peux-tu influencer la boule ? ». Avant de toucher, le joueur devra indiquer où il pense qu'elle va aller. Plusieurs prédictions régulièrement correctes seront le premier signal que le relief devient réellement un langage de contrôle.

## Interdits temporaires
Pas de nouvelle ressource, deuxième entité, destination, pathfinding, inertie supplémentaire, mémoire de mouvement, tutoriel permanent, score, combat ou progression tant que cette prédictibilité élémentaire n'est pas acquise.
