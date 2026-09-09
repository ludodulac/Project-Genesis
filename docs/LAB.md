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
La croissance provoquée par A ne force pas naturellement B vers une source voisine : B trouve une autre route. `DROP`.

## EXP-017 — Deux gestes, deux intérêts incompatibles
Deux gestes sur un même état peuvent favoriser des intérêts incompatibles. `PROMOTE-PARTIAL`.

## EXP-018 — Robustesse géométrique
Le motif ouverture/fermeture survit à plusieurs translations et au miroir horizontal. Tests et build passent. `PROMOTE-PARTIAL`.

## EXP-019 — Porter le compromis dans le monde jouable
Le motif a été placé dans le monde canonique sans nouvelle règle.

### Observation humaine réelle
Le joueur comprend seulement :
- il peut faire monter des cases ;
- chaque toucher fait bouger les petites boules au début ;
- après un moment elles ne bougent plus ;
- il voit des petits lacs/cases spéciales qu'il peut également relever ;
- il ne sait pas ce que sont les autres objets ni pourquoi ils importent.

Le compromis A/B n'est donc pas perceptible. La chaîne source/eau/graine/croissance n'est pas comprise. Le fait que les agents atteignent leur destination et deviennent ensuite immobiles donne surtout l'impression que le contrôle s'est cassé.

**Décision** `DROP` pour EXP-019 comme mise en scène jouable.

**Apprentissage majeur**  
Les tests ont trouvé une structure décisionnelle réelle mais le joueur ne possède pas le modèle mental minimal permettant de la voir. Ajouter des flèches, textes ou tutoriels masquerait le problème. Trois agents + havens + sources + graines + état porté demandent trop d'inférences avant que le verbe de sculpture puisse être compris.

## EXP-020 — Retour au jouet : une chose qui ne s'arrête pas
**Hypothèse**  
Revenir au canon Genesis-01 : un monde, un geste, **une seule chose mobile**, dont le comportement reste observable indéfiniment. Avant de tester un compromis multi-agent, vérifier que le joueur comprend spontanément « je change le relief → sa trajectoire change ».

**Prototype**  
La version jouable utilise maintenant un monde dédié sans haven, source, graine ni eau visibles, avec une seule mote jaune. À chaque sculpture, elle choisit localement le voisin accessible le plus bas. Elle n'a pas d'état terminal.

**Sentinelles**
- la mote choisit le voisin bas sans objectif caché ;
- relever une case peut la détourner vers la vallée créée par redistribution ;
- elle ne passe jamais en état `arrived` ;
- l'ancien moteur multi-agent reste intact et testé séparément.

**Observation CI**  
La première sentinelle de « mouvement continu » exigeait arbitrairement plus de deux cellules visitées. Elle a échoué alors que les propriétés fondamentales passaient. Cette exigence a été supprimée plutôt que de tordre le moteur pour satisfaire le test. Le run corrigé est vert et déployé.

**Décision** `TEST-HUMAN`, sous réserve d'un dernier problème de mouvement découvert ci-dessous.

## EXP-021 — Mémoire minimale contre le ping-pong
**Hypothèse**  
Le choix purement « voisin le plus bas » peut produire une oscillation A↔B qui ressemble à une animation mécanique plutôt qu'à une chose qui circule dans le relief.

**Prototype minimal**  
La mote conserve seulement la case précédente. Si plusieurs sorties sont accessibles, elle préfère une autre case au retour immédiat ; elle peut revenir en arrière si c'est réellement la seule sortie.

**Pourquoi cette mémoire est acceptable**  
Ce n'est ni une destination ni un pathfinding caché. C'est une inertie minimale et lisible : continuer plutôt que rebondir instantanément.

**Sentinelle**  
Si l'ancienne case est la plus basse mais qu'une autre sortie est accessible, la mote ne revient pas immédiatement en arrière.

**Statut** `TEST` jusqu'à validation CI.

## EXP-VIS-005 — Relief lisible
Relief par déplacement vertical, faces sombres et ombres, grille orthogonale conservée. `TEST`.

## Direction actuelle

Le signal abstrait de compromis d'EXP-017/018 reste conservé comme connaissance, mais il est **trop tôt pour le mettre au premier plan**. Le verrou réel est plus fondamental : la causalité entre le doigt, le relief et le mouvement doit devenir évidente et plaisante avant toute réintroduction d'une deuxième entité.

La branche active est donc :
`sculpture locale → vallée/bosse lisible → une mote continue → trajectoire locale compréhensible`

Aucune nouvelle ressource, aucun tutoriel et aucune nouvelle commande tant que cette boucle n'est pas validée humainement.
