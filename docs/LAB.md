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
Le premier scénario censé aider A et gêner B était faux : B gardait exactement sa route. `DROP`.

## EXP-013b — Ouverture / fermeture simultanée
Une même sculpture abaisse la voisine nécessaire à A tout en relevant la case directe de B. `PROMOTE-PARTIAL`.

## EXP-014 — Opportunité qui prépare le futur
Une trajectoire peut traverser une source, transporter l'eau, puis transformer une graine au pas suivant. `PROMOTE-PARTIAL`.

## EXP-015 — Le bénéfice devient coût
La croissance créée par A peut relever une cellule qui était sur la route directe de B. B doit alors changer de chemin. `PROMOTE-PARTIAL`.

## EXP-016 — Réciprocité automatique
La croissance provoquée par A ne force pas naturellement B vers une source voisine : B trouve une autre route. `DROP`. Ne pas forcer une jolie chaîne.

## EXP-017 — Deux gestes, deux intérêts incompatibles
Sur un même état : sculpter la zone critique ouvre la route directe d'A mais empêche B de prendre la source ; ne pas la sculpter favorise B et prive A de sa route directe. `PROMOTE-PARTIAL`.

## EXP-018 — Robustesse géométrique
**Hypothèse**  
Le compromis d'EXP-017 est une propriété locale de la sculpture, pas un accident d'une seule coordonnée.

**Test**  
Le même motif ouverture/fermeture est déplacé à plusieurs endroits du plateau et réfléchi horizontalement.

**Résultat**  
Les variantes déterministes passent : le compromis survit à la translation et au miroir sans modifier les règles de simulation.

**Décision** `PROMOTE-PARTIAL`.

**Limite**  
Cela prouve une petite famille de situations, pas encore que le monde initial les rend perceptibles ou désirables.

## EXP-019 — Porter le compromis dans le monde jouable
**Hypothèse**  
La meilleure étape suivante n'est pas une règle supplémentaire mais une géographie initiale qui expose le dilemme robuste au joueur.

**Prototype**  
Sur le plateau canonique 20×12, une porte légèrement trop haute devant A est placée à côté d'une source sur la route directe de B. Toucher cette source la relève et draine la porte voisine : A gagne son passage direct pendant que B perd sa collecte directe.

**Décision** `TEST-HUMAN`.

**Question humaine précise**  
Sans texte ni flèche, le joueur peut-il voir qu'un même geste a aidé un être et changé l'opportunité de l'autre ?

## EXP-VIS-005 — Relief lisible
Relief par déplacement vertical, faces sombres et ombres, grille orthogonale conservée. `TEST`.

## Direction actuelle

Le signal le plus fort n'est ni l'eau ni la croissance prises séparément. C'est **la redistribution locale de terrain comme échange spatial** : relever ici signifie abaisser ailleurs, donc un geste peut naturellement transférer une possibilité d'une trajectoire vers une autre.

Ne pas ajouter de nouvelle ressource. La prochaine recherche doit approfondir cette propriété :
- vérifier la lisibilité d'EXP-019 sur téléphone ;
- si lisible, construire une séquence courte de 2–3 compromis où le résultat du premier geste change le second ;
- si illisible, améliorer uniquement la lecture du relief/trajectoire ou simplifier les êtres ;
- si le compromis reste artificiel malgré la mise en scène, rétrograder la branche plutôt que l'enrichir.
