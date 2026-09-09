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
Le test humain ne perçoit ni compromis ni chaîne ressource/croissance ; les agents qui arrivent semblent simplement cesser de fonctionner. `DROP`.

**Apprentissage** : trop d'inférences avant le verbe fondamental. Ne pas masquer avec tutoriel, texte ou flèches.

## EXP-020 — Retour au jouet
Une seule mote, aucun objectif ni ressource visible, sculpture par redistribution, mouvement local. Les sentinelles techniques passent, mais la lisibilité humaine reste le vrai verrou. `ITERATE`.

## EXP-021 — Mémoire minimale contre le ping-pong
**Hypothèse**  
Une mémoire d'une case pourrait supprimer le rebond A↔B sans devenir perceptible comme règle distincte du relief.

**Test humain**  
Le joueur rapporte : il n'a pas l'impression de pouvoir influencer la boule ; même en cliquant au même endroit, elle semble partir dans beaucoup de directions différentes ; il ne sait pas comment la déplacer.

**Observation**  
Le logiciel est déterministe, mais le comportement n'est pas humainement prédictible. La mémoire anti-retour et le déplacement automatique à chaque geste font que la mote paraît prendre des décisions propres. Le terrain n'est pas lu comme la cause suffisante de la direction.

**Décision** `DROP` comme règle de la branche jouable.

**Conservation**  
L'expérience a établi une distinction essentielle : **déterminisme logiciel ≠ prédictibilité humaine**. Une règle invisible n'est acceptable que si elle renforce une causalité déjà lisible ; elle ne doit pas fabriquer artificiellement une impression de vie.

## EXP-022 — J'observe → je prédis → je sculpte → je constate
**Hypothèse**  
Avant de rendre la mote vivante, rendre sa causalité visible. Son prochain mouvement doit pouvoir être prédit en regardant uniquement sa case et le relief orthogonal voisin.

**Prototype minimal**  
La mémoire anti-ping-pong est retirée de la décision expérimentale. Après la sculpture, la mote regarde uniquement ses quatre voisines visibles : si au moins une est strictement plus basse que sa case, elle va vers la plus basse ; sinon elle reste sur place. Aucune destination, aucun pathfinding, aucune inertie cachée, aucune préférence historique.

La règle expérimentale est donc volontairement austère : **la boule descend vers le voisin visible le plus bas, ou ne bouge pas**.

**Sentinelles**
- elle choisit le voisin strictement plus bas le plus bas ;
- elle reste immobile si aucune descente n'existe ;
- deux états visuellement identiques produisent le même mouvement même si leur ancienne mémoire interne diffère ;
- la sculpture reste la redistribution existante.

**Ce que les tests automatiques peuvent prouver**  
Déterminisme, absence de dépendance à la mémoire, relation exacte entre hauteurs et destination.

**Ce qu'ils ne peuvent pas prouver**  
Que le joueur voit assez bien les différences de hauteur pour prédire le résultat.

**Test humain décisif**  
Avant chaque toucher, demander au joueur de montrer/dire où il pense que la boule va aller. Puis seulement toucher et comparer prédiction/résultat. Répéter plusieurs fois sans expliquer la règle. Le signal recherché est une proportion croissante de prédictions correctes, pas simplement l'impression vague d'avoir influencé la boule.

**Statut** `TEST-CI`, puis `TEST-HUMAN` si la build est valide.

## EXP-VIS-005 — Relief lisible
Relief par déplacement vertical, faces sombres et ombres, grille orthogonale conservée. `TEST`.

## Direction actuelle
Le verrou prioritaire n'est ni le caractère de la mote ni la profondeur du système : c'est la **causalité lisible**.

Branche active :
`j'observe le relief → je prédis → je sculpte → je constate`

Aucune nouvelle ressource, aucun tutoriel, aucune nouvelle commande, aucune inertie supplémentaire tant que le joueur ne peut pas régulièrement anticiper le prochain déplacement à partir de ce qu'il voit.
