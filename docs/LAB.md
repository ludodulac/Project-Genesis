# Lab — Journal d'expériences

Ce document conserve les expériences de game design afin que les essais ratés produisent de la connaissance et ne soient pas répétés sans raison.

## Format
`hypothèse → prototype minimal → test → observation → décision → conservation/abandon → expérience suivante`

## EXP-006 — Diriger le vivant
Le relief était trop plat et le rôle des petits êtres incompréhensible. Ne pas masquer cela avec du tutoriel. `ITERATE`.

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
Le premier scénario censé aider A et gêner B était faux : B gardait exactement sa route. `DROP` pour ce scénario précis.

**À conserver**  
Un test qui contredit l'histoire souhaitée vaut mieux qu'une mécanique déclarée intéressante trop tôt.

## EXP-013b — Ouverture / fermeture simultanée
Une même sculpture abaisse la voisine nécessaire à A tout en relevant la case directe de B. Le scénario déterministe confirme que la route directe d'A s'ouvre pendant que celle de B se ferme. `PROMOTE-PARTIAL`.

## EXP-014 — Opportunité qui prépare le futur
Une trajectoire peut traverser une source, transporter l'eau, puis transformer une graine au pas suivant. `PROMOTE-PARTIAL` — conserver la chaîne comme matière de design, pas comme objectif final.

## EXP-015 — Le bénéfice devient coût
La croissance créée par A peut relever une cellule qui était sur la route directe de B. B doit alors changer de chemin. `PROMOTE-PARTIAL`.

**Pourquoi c'est intéressant**  
Une conséquence positive locale n'est plus globalement positive : elle reconfigure le problème spatial d'une autre entité.

## EXP-016 — Réciprocité automatique
**Hypothèse**  
La croissance provoquée par A devait forcer B vers une source voisine, créant automatiquement une nouvelle opportunité.

**Observation contrôlée**  
Faux. B trouve une autre route qui évite la source. La réciprocité imaginée n'émerge pas de ces règles dans ce scénario.

**Décision** `DROP`.

**À conserver**  
Ne pas forcer un détour vers une opportunité juste pour obtenir une jolie chaîne. Une opportunité n'a de valeur que si la géographie la rend naturellement compétitive.

## EXP-017 — Deux gestes, deux intérêts incompatibles
**Hypothèse**  
Une vraie décision apparaît si deux gestes valides sur le même état optimisent des intérêts différents et qu'aucun geste ne domine simplement l'autre.

**Résultat contrôlé**  
Le scénario tient :
- sculpter la zone critique ouvre la route directe d'A mais empêche B de traverser la source ;
- laisser cette zone intacte permet à B de prendre la source tandis qu'A perd sa route directe.

**Décision** `PROMOTE-PARTIAL`.

**Pourquoi c'est le signal le plus fort à ce stade**  
Le système produit enfin un choix entre deux bénéfices incompatibles avec le même verbe et sans nouvelle commande. C'est une preuve de structure décisionnelle, pas encore une preuve de fun.

## EXP-VIS-005 — Relief lisible
Le relief visuel utilise davantage de déplacement vertical, faces sombres et ombres tout en conservant une grille orthogonale. `TEST`.

## Prochaine recherche — robustesse du dilemme

Ne rien ajouter. Construire plusieurs variantes spatiales d'EXP-017 afin de vérifier que le compromis n'existe pas seulement dans un placement artificiel unique.

Questions :
- le dilemme survit-il quand la source est déplacée ?
- survit-il avec une autre orientation du relief ?
- peut-il se prolonger sur deux ou trois décisions sans devenir calcul trivial ?
- une conséquence secondaire peut-elle devenir exploitable plutôt qu'être seulement évitée ?

Si le dilemme disparaît dès qu'on change légèrement la géographie, `EXP-017` redescend à `ITERATE`.
