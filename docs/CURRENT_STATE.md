# Current State

## État réel

Genesis est actuellement revenu volontairement à son noyau Genesis-01 : **un monde, un geste, une seule chose mobile**.

Le laboratoire multi-agent EXP-010 à EXP-018 reste conservé comme connaissance et comme tests, mais il n'est plus la version jouable principale après l'échec humain d'EXP-019.

## Version jouable actuelle — EXP-020/021
- Phaser + TypeScript + Vite ;
- plateau orthogonal 20 × 12 ;
- relief déterministe avec volume visuel accentué ;
- une seule commande tactile : relever une cellule ;
- la cellule touchée prélève de la matière à ses voisines ;
- une seule mote jaune visible ;
- aucun haven, source, graine ou eau dans cette première lecture ;
- aucun objectif caché pour la mote ;
- à chaque geste, elle choisit localement une case voisine accessible parmi les plus basses ;
- elle ne possède aucun état terminal `arrived` ;
- une mémoire d'une seule case évite le retour A↔B immédiat quand une autre sortie existe ;
- simulation séparée du rendu ;
- CI et GitHub Pages.

## Pourquoi ce recul est volontaire

Le test humain d'EXP-019 n'a pas révélé le compromis spatial construit par les tests. Le joueur percevait seulement : « je fais monter des cases, les boules bougent, puis elles finissent par ne plus bouger », tandis que sources, graines et autres marqueurs restaient incompréhensibles.

Conclusion : le système demandait trop d'inférences avant même que la causalité de base soit claire. Ajouter du texte ou des flèches aurait maquillé le problème.

## Ce qui est prouvé automatiquement dans la branche jouet
- la redistribution modifie bien le relief sans mutation de l'état source ;
- la mote peut suivre un voisin plus bas sans destination ;
- une sculpture peut détourner la mote par la vallée qu'elle crée ;
- la mote reste réactive et ne passe pas en état d'arrivée ;
- l'ancienne simulation multi-agent et ses compromis restent couverts par leurs tests ;
- EXP-021 protège contre le ping-pong immédiat quand une autre route est disponible.

## Ce qui n'est toujours pas prouvé
- que la règle locale est immédiatement compréhensible au doigt ;
- que le déplacement semble vivant plutôt que mécanique ;
- que sculpter devant la mote donne envie de recommencer ;
- que le relief est assez lisible pour anticiper une direction ;
- que la boucle est amusante sans objectif.

## Connaissances conservées mais sorties du premier plan
EXP-017/018 ont démontré qu'une redistribution locale peut créer de vrais intérêts incompatibles entre plusieurs trajectoires. Cette découverte n'est pas abandonnée. Elle est simplement mise en attente jusqu'à ce qu'un seul objet réagissant au relief soit compris spontanément.

## Prochaine décision

Valider EXP-021 en CI. Puis faire un test humain extrêmement simple de la version jouet, sans expliquer la règle.

Question utile :

> Est-ce que tu as l'impression de pouvoir influencer la direction de la boule en façonnant le terrain autour d'elle ?

Si oui, approfondir le plaisir du mouvement et seulement ensuite tester une deuxième entité. Si non, modifier ou simplifier la règle de mouvement elle-même avant d'ajouter quoi que ce soit.

## Toujours volontairement absent
Feu, combat, ennemi, score, progression, tutoriel permanent, nouvelle commande, ressource complexe, backend, comptes, multijoueur, boutique et grosse infrastructure.
