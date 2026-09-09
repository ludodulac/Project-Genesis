# Lab — Journal d'expériences

Ce document conserve les expériences de game design afin que les essais ratés produisent de la connaissance et ne soient pas répétés sans raison.

## Format
`hypothèse → prototype minimal → test → observation → décision → conservation/abandon → expérience suivante`

## EXP-006 — Diriger le vivant
**Observation humaine**  
Le relief était trop plat et le rôle des petits êtres incompréhensible. Ne pas masquer cela avec du tutoriel.

**Décision** `ITERATE` — les êtres ne sont pas promus.

**À conserver**  
Conséquences lisibles, zéro hasard caché, anticipation comme critère.

## EXP-007 — Faire pousser le monde
**Hypothèse**  
Une propriété transportée devient intéressante si elle laisse une conséquence spatiale permanente.

**Test contrôlé**  
Eau collectée → graine traversée → graine devient bloom → relief augmente. La simulation en phases évite qu'un ordre interne invisible décide du résultat.

**Décision** `ITERATE`.

## EXP-008 — Sculpter plutôt qu'empiler
**Comparaison contrôlée**  
Initial : amplitude ≈ 0.416, minima locaux 8. Accumulation : amplitude ≈ 0.888, minima 8, moyenne en hausse. Redistribution : amplitude ≈ 0.712, minima 13, moyenne conservée.

**Décision** `ITERATE` — la redistribution reste le meilleur candidat actuel pour le verbe de sculpture.

## EXP-010 — Le détour
**Hypothèse**  
Une montagne devient intéressante si elle redirige au lieu de simplement bloquer.

**Test**  
Le pathfinding déterministe cherche un chemin praticable autour d'une crête. Une sentinelle vérifie qu'une même sculpture peut perturber une mote sans modifier la route directe d'une autre.

**Observation**  
Le détour transforme le relief en outil de routage. Mais « faire un chemin plus long » n'est pas encore une conséquence suffisamment riche.

**Décision** `PROMOTE-PARTIAL` — conserver le routage/détour comme infrastructure expérimentale, pas comme gameplay final.

## EXP-011 — Le détour opportuniste
**Hypothèse**  
Un détour devient une décision s'il peut faire traverser une opportunité visible que la route directe évitait.

**Prototype**  
Petites sources visibles sur le plateau. Elles ne sont pas des objectifs. Une mote qui en traverse une transporte de l'eau.

**Test automatisé**  
Une sentinelle reproductible vérifie qu'une mote traversant une source devient porteuse d'eau.

**Décision** `ITERATE`.

**À conserver**  
Les opportunités doivent vivre dans le monde, pas dans des boutons. Le joueur modifie la route ; il ne commande pas la collecte.

## EXP-012 — Fermer la chaîne
**Hypothèse**  
Le premier moment émergent plausible apparaît quand une sculpture produit indirectement une transformation ailleurs : `relief → détour → source → transport → graine → croissance`.

**Prototype minimal**  
Une mote chargée en eau qui traverse une graine transforme celle-ci en bloom, consomme l'eau et soulève légèrement la cellule. Aucun nouvel input.

**Test automatisé**  
La chaîne eau → bloom → modification de hauteur est maintenant une sentinelle explicite.

**Ce que le test ne prouve pas**  
Il prouve la causalité et le déterminisme, pas que la chaîne est amusante ni perceptible sur téléphone.

**Décision** `TEST` — première chaîne à évaluer comme candidat « ah oui ».

## EXP-VIS-005 — Relief lisible
Le relief visuel utilise davantage de déplacement vertical, faces sombres et ombres tout en conservant une grille orthogonale. `TEST`.

## Prochaine recherche — bifurcation avec coût

Ne pas ajouter un deuxième élément maintenant. La prochaine hypothèse est plus stricte : **une route utile doit avoir un coût spatial visible**. Une sculpture pourrait envoyer une mote vers une source puis une graine, tout en rendant simultanément la destination d'une autre mote plus difficile.

Critères de promotion :
- la conséquence peut être anticipée avant le toucher ;
- un geste influence au moins deux intérêts ;
- le bénéfice n'est pas automatiquement dominant ;
- la chaîne reste compréhensible sans texte ;
- le joueur peut découvrir une solution non explicitement enseignée.
