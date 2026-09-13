# PETIT MONDE — LAB 001 — Relations + Conditions + Traces

## Statut

**À TESTER HUMAINEMENT.** Ce laboratoire n'est ni PETIT MONDE commercial, ni une nouvelle vérité de Genesis.

Branche : `petit-monde-lab-relations-traces`

Accès : `?game=petit-monde-lab`

Mode accéléré de vérification développeur : `?game=petit-monde-lab&fast=1`.

## Question unique

> Avec seulement des relations persistantes, des conditions locales et des traces, pouvons-nous faire ressentir qu'un petit ensemble d'êtres et de lieux possède une histoire propre ?

## Ce que le laboratoire simule

- 3 humains : Mina, Jo, Léa ;
- une petite population d'oiseaux ;
- végétation locale simplifiée ;
- 4 lieux visibles : hameau, rive, prairie, bosquet ;
- 3 activités humaines : repos, activité utile, présence sociale ;
- déplacement ;
- aucune économie, crafting, progression, technologie, quête ou cosmologie.

## Trois primitives seulement

### Relation

Une valeur persistante influence la tendance d'un humain à revenir vers un lieu, une activité, une personne ou les oiseaux. Les répétitions cohérentes renforcent légèrement la relation. Une intervention du joueur ne réinitialise jamais directement la relation : le passé continue donc d'exercer une force.

### Condition

Chaque lieu expose uniquement quelques propriétés utiles aux décisions visibles : accessibilité, calme, couverture végétale et végétation.

### Trace

La fréquentation laisse du piétinement (`footfall`). Cette trace décroît progressivement, mais tant qu'elle reste forte elle réduit le calme et ralentit/réduit la végétation. La végétation influence à son tour couverture et présence des oiseaux.

## Boucle expérimentale

`RELATION → COMPORTEMENT → TRACE → CONDITION MODIFIÉE → NOUVEAUX COMPORTEMENTS / NOUVELLES RELATIONS`

Les oiseaux utilisent les mêmes conditions profondes mais un langage visible différent : présence, absence et déplacement. La végétation exprime surtout la mémoire lente du passage.

## Comportement humain

Pas de besoin façon Sims, pas de planification longue, pas d'arbre d'IA massif.

À chaque décision, un humain compare quelques lieux accessibles avec :
- relation persistante au lieu ;
- présence de personnes auxquelles il est relié ;
- présence des oiseaux lorsqu'elle compte pour lui ;
- accessibilité et calme ;
- inertie vers le lieu actuel ;
- petite variabilité déterministe par graine.

Le choix est pondéré, pas strictement maximal. Un choix qui s'écarte nettement de l'attracteur le plus fort peut produire une courte hésitation visible.

## Configuration initiale intentionnelle

- Mina possède déjà une relation modérée à la rive.
- Jo possède déjà une relation à Mina et à l'activité sociale.
- Léa est sensible à la présence des oiseaux.
- La rive est initialement calme, couverte et fréquentée par les oiseaux, mais relativement moins accessible.

Ces asymétries ne scénarisent pas une chaîne précise ; elles donnent seulement au laboratoire quelque chose de reconnaissable à perturber.

## Trois actions maximum

### AMÉNAGER

Augmente l'accessibilité du lieu choisi mais réduit légèrement calme et couverture. Il n'existe aucun bonus écologique ou social direct.

### PRÉSERVER

Réduit l'accessibilité humaine et augmente le calme, permettant aux traces de passage de décroître et à la végétation de récupérer.

### LIBÉRER DU TEMPS

Réduit temporairement l'attraction de l'activité utile et augmente légèrement les possibilités de repos/socialisation. Aucun habitant ne reçoit d'ordre.

## Chaîne recherchée, non scriptée

`aménagement de la rive`
→ fréquentation humaine plus probable
→ relations/routines renforcées
→ traces de passage plus fortes
→ calme/végétation/couverture modifiés
→ présence des oiseaux moins probable
→ Léa peut perdre une raison de fréquenter la rive et choisir ailleurs
→ un autre lieu commence à accumuler sa propre histoire.

Le test échoue si cette chaîne n'est obtenue que parce qu'un script la force.

## Présentation et lisibilité

Le laboratoire montre :
- positions et déplacements des humains ;
- noms des humains ;
- oiseaux présents dans un lieu ;
- densité végétale simplifiée ;
- trace de passage visible lorsque la fréquentation monte ;
- hésitation humaine par un petit temps/indice visuel ;
- faits historiques seulement quand on sélectionne un être ou un lieu.

Il ne montre jamais de jauge d'affection, score d'habitat, score nature ou causalité calculée.

Exemples acceptables :
- « Mina est souvent venue ici récemment. »
- « Quelques passages récents restent visibles. »

## Protocole humain

### Phase 1 — observation

5 minutes sans intervention. Les boutons restent présents mais refusent l'action. Objectif : vérifier qu'une routine ou une régularité devient perceptible avant toute perturbation.

### Phase 2 — intervention

Jusqu'à 15 minutes. Le joueur peut utiliser les trois familles d'action, mais il n'est pas obligé de toutes les essayer.

### Phase 3 — après intervention

Après la fenêtre d'intervention, les nouvelles actions sont de nouveau bloquées. Le joueur observe seulement les conséquences persistantes.

## Questions après la session

1. « Raconte-moi ce qui s'est passé. »
2. Qui as-tu remarqué ?
3. Est-ce que quelqu'un faisait régulièrement quelque chose ?
4. Est-ce qu'un lieu semblait important ?
5. Quel endroit a changé ?
6. As-tu remarqué quelque chose concernant les oiseaux ou la végétation ?
7. Quelle conséquence penses-tu avoir provoquée ?
8. Qu'est-ce qui t'a surpris ?
9. Si tu avais cinq minutes supplémentaires sans nouvelle capacité, qu'aimerais-tu regarder ?

## CONTINUE

Plusieurs joueurs reconnaissent sans aide une routine, une relation être↔lieu, une conséquence non humaine et au moins une chaîne causale liée à leur intervention. Signal très fort : ils souhaitent observer davantage avant d'obtenir une nouvelle action.

## PIVOT

La simulation contient des relations mais les joueurs ne les perçoivent pas. Travailler répétition, contraste, animation, son, rythme et cadrage avant toute nouvelle mécanique.

## STOP

Après amélioration de la lisibilité, les joueurs ne reconnaissent toujours pas de routine, ne s'attachent à aucun être/lieu, traitent oiseaux/végétation comme décor, ou vivent l'observation après intervention comme du temps mort. Ne pas ajouter de contenu pour sauver le laboratoire.

## Ce que les tests automatisés prouvent seulement

- déterminisme d'une même graine + mêmes actions ;
- perturbation d'un lieu sans effacer la relation passée ;
- fréquentation → conditions locales ;
- préservation → décroissance de pression/récupération possible.

Ils ne prouvent ni lisibilité, ni attachement, ni intérêt. Ces propriétés restent exclusivement humaines à ce stade.
