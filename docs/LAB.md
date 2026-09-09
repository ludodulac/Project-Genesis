# Lab — Journal d'expériences

Ce document conserve les expériences de game design afin que les essais ratés produisent de la connaissance et ne soient pas répétés sans raison.

## Format
`hypothèse → prototype minimal → test → observation → décision → conservation/abandon → expérience suivante`

## EXP-006 — Diriger le vivant
**Observation humaine**  
Le relief était trop plat et le rôle des petits êtres incompréhensible. Ne pas masquer cela avec du tutoriel.

**Décision** `ITERATE` — les êtres ne sont pas promus.

## EXP-007 — Faire pousser le monde
Eau collectée → graine traversée → bloom → relief augmenté. La simulation en phases évite qu'un ordre interne invisible décide du résultat. `ITERATE`.

## EXP-008 — Sculpter plutôt qu'empiler
Redistribution de matière conservée comme meilleur candidat actuel pour le verbe de sculpture. `ITERATE`.

## EXP-010 — Le détour
Le relief peut rediriger au lieu de simplement bloquer. Le pathfinding reste une infrastructure de laboratoire et non le jeu lui-même. `PROMOTE-PARTIAL`.

## EXP-011 — Le détour opportuniste
Une source traversée charge une mote en eau sans nouvelle commande joueur. L'opportunité vit dans le monde. `ITERATE`.

## EXP-012 — Fermer la chaîne
`relief → détour → source → transport → graine → croissance → nouveau relief`. La causalité est testable, mais le fun et la lisibilité restent à prouver humainement. `TEST`.

## EXP-013 — Faux compromis
**Hypothèse**  
Une même sculpture devait aider A tout en forçant B à se détourner.

**Observation contrôlée**  
Le premier scénario était mal construit : B conservait exactement sa route directe. Le test a échoué alors que les autres scénarios passaient.

**Décision** `DROP` pour ce scénario précis.

**À conserver**  
Un test qui contredit l'histoire souhaitée vaut mieux qu'une mécanique déclarée intéressante trop tôt.

## EXP-013b — Ouverture / fermeture simultanée
**Hypothèse**  
La redistribution locale peut ouvrir la case voisine utile à A en l'abaissant tout en fermant à B la case touchée en la relevant.

**Prototype**  
A dépend d'une voisine initialement juste trop haute. B dépend directement de la case sculptée. Un seul toucher doit rendre la route directe d'A praticable et celle de B impraticable.

**Décision** `TEST` — sentinelle en validation.

## EXP-014 — Opportunité qui prépare le futur
**Observation contrôlée**  
Une trajectoire peut traverser une source, transporter l'eau, puis transformer une graine au pas suivant.

**Décision** `PROMOTE-PARTIAL` — conserver la chaîne comme matière de design, pas comme objectif final.

## EXP-015 — Le bénéfice devient coût
**Observation contrôlée**  
La croissance créée par A peut relever une cellule qui était sur la route directe de B. B doit alors changer de chemin.

**Décision** `PROMOTE-PARTIAL`.

**Pourquoi c'est intéressant**  
Une conséquence positive locale n'est plus globalement positive : elle reconfigure le problème spatial d'une autre entité.

## EXP-016 — Conséquence réciproque
**Hypothèse**  
Le coût créé pour B peut devenir une nouvelle opportunité : la croissance provoquée par A force B vers une source, ce qui le charge à son tour en eau.

**Prototype**  
A fait pousser une graine sur la route de B ; le détour de B passe par une source.

**Décision** `TEST` — scénario déterministe en validation.

## EXP-017 — Deux gestes, deux intérêts incompatibles
**Hypothèse**  
Une vraie décision apparaît si deux gestes valides sur le même état optimisent des intérêts différents et qu'aucun geste ne domine simplement l'autre.

**Prototype**  
- geste A : sculpter une case qui abaisse la route d'A mais relève la source/route de B ;
- geste B : ne pas toucher cette zone, laissant B prendre la source mais A perdre son chemin direct.

**Critère**  
Le scénario n'est intéressant que si le choix `favoriser A` empêche réellement le bénéfice de B, tandis que `favoriser B` empêche réellement le bénéfice direct d'A.

**Décision** `TEST` — c'est actuellement l'hypothèse la plus proche d'une vraie décision de jeu.

## EXP-VIS-005 — Relief lisible
Le relief visuel utilise davantage de déplacement vertical, faces sombres et ombres tout en conservant une grille orthogonale. `TEST`.

## Prochaine recherche

Si EXP-017 tient, ne pas ajouter de système. Construire plusieurs variantes spatiales du même dilemme pour vérifier qu'il ne dépend pas d'un placement artificiel unique. Chercher surtout si la conséquence secondaire peut être exploitée plutôt qu'évitée.

Si EXP-017 ne tient pas, modifier ou simplifier la logique de mouvement plutôt que d'empiler une nouvelle mécanique.
