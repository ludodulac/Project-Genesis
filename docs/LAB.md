# Lab — Journal d'expériences

Ce document conserve les expériences de game design afin que les essais ratés produisent de la connaissance et ne soient pas répétés sans raison.

## Format
`hypothèse → prototype minimal → test → observation → décision → conservation/abandon → expérience suivante`

## EXP-006 à EXP-018 — connaissances conservées
EXP-006/007 ont montré que relief plat et êtres incompréhensibles ne doivent pas être masqués par un tutoriel. EXP-008 conserve la redistribution de matière comme piste de sculpture. EXP-010 à 018 ont démontré techniquement détours, chaînes et compromis multi-agent, avec EXP-016 abandonné lorsqu'une jolie chaîne ne se produisait pas naturellement. Ces résultats restent du laboratoire, pas la version jouable.

## EXP-019 — Porter le compromis dans le monde jouable
Le test humain ne perçoit ni compromis ni chaîne ressource/croissance ; les agents qui arrivent semblent simplement cesser de fonctionner. `DROP`.

**Apprentissage** : trop d'inférences avant le verbe fondamental. Ne pas masquer avec tutoriel, texte ou flèches.

## EXP-020 — Retour au jouet
Une seule mote, aucun objectif ni ressource visible, sculpture et mouvement local. Les sentinelles techniques passent, mais la lisibilité humaine reste le verrou. `ITERATE`.

## EXP-021 — Mémoire minimale contre le ping-pong
**Test humain** : le joueur n'a pas l'impression de pouvoir influencer la boule ; même en cliquant au même endroit, elle semble partir dans beaucoup de directions et il ne sait pas comment la déplacer.

**Décision** `DROP`.

**Conservation** : **déterminisme logiciel ≠ prédictibilité humaine**. Une règle invisible n'est acceptable que si elle renforce une causalité déjà lisible.

## EXP-022a — Descendre vers le voisin visible le plus bas
**Hypothèse** : retirer toute mémoire et faire descendre la mote vers son voisin strictement le plus bas.

**Observation CI importante** : une sentinelle supposait qu'en relevant une case voisine de la mote, la redistribution créerait une destination évidente ailleurs. Elle a échoué : relever la voisine drainait en réalité la case sous la mote, qui devenait elle-même un bassin et la mote restait immobile.

Ce n'est pas un bug moteur. C'est une faiblesse de la relation geste→relief→mouvement : même avec une règle de mouvement simple, la sculpture « je relève ici et je creuse autour » demande encore de prévoir une conséquence indirecte. Le test avait encodé une intuition humaine fausse.

**Décision** `ITERATE`, ne pas corriger le test pour préserver artificiellement cette interaction.

## EXP-022b — Presser pour creuser, puis rouler
**Hypothèse** : pour isoler la causalité la plus lisible possible, inverser temporairement le geste dans la branche jouet. Le doigt enfonce directement la case touchée ; la matière est redistribuée vers ses voisines. La boule ne possède aucune mémoire et descend uniquement si une direction visible est strictement la plus basse.

**Prototype minimal** :
- toucher = enfoncer la case touchée ;
- une case adjacente touchée devient directement une vallée ;
- la boule peut donc rouler vers cette case ;
- aucune destination, inertie ou historique ;
- en cas d'égalité exacte entre les deux meilleures descentes, la boule ne choisit pas arbitrairement : elle reste en place.

**Sentinelles** :
- presser chacune des quatre cases adjacentes sur terrain plat attire la boule vers cette case ;
- aucune direction cachée en cas d'égalité ;
- une ancienne mémoire interne ne change pas le résultat ;
- l'ancien moteur EXP-008/010-018 reste séparé et inchangé.

**Test humain — causalité générale** : le joueur formule spontanément, sans explication, « je creuse quelque part et la bille tend à aller vers le creux ». Il arrive un peu à la déplacer ainsi. C'est le premier langage terrain→bille formulé spontanément. La causalité creux→bille est donc `PROMOTE-PARTIAL` et doit être préservée tant qu'un test ultérieur ne la contredit pas.

### Frontière isolée — toucher la case occupée
Le protocole a été recommencé après une ambiguïté de formulation entre « case sous la bille » et « case où se trouve la bille » ; les réponses contaminées ne sont pas retenues.

**Prédiction humaine valide, avant toucher** : en touchant exactement la case verte occupée par la bille, le joueur pense qu'elle va « aller quelque part autour », sans savoir où.

**Observation** : après un toucher unique de cette case, la bille reste au même endroit.

**Explication spontanée du joueur** : il a l'impression d'avoir appuyé sur la case comme s'il n'avait pas vraiment touché la bille. Puisque la bille est ronde, il s'attend intuitivement à ce qu'un appui directement sur elle la fasse bouger hors de la case ; le résultat actuel lui donne plutôt l'impression d'une bille collée à sa case.

**Apprentissage** : cette frontière révèle une attente physique distincte, sans invalider la causalité générale creux→bille. La représentation ronde de la bille suggère qu'un contact direct devrait avoir une conséquence sur elle. Le comportement actuel « je creuse sa case et elle reste dedans » est cohérent avec un bassin, mais incohérent avec l'affordance perçue d'une bille ronde manipulable.

### Recherche de frontière — résultats utiles
La direction d'un déplacement latéral après un simple tap centré n'est pas contenue dans l'entrée. Sans asymétrie visible, toute sortie nord/sud/est/ouest demanderait donc hasard, ordre fixe, mémoire ou autre tie-break caché : ces variantes sont rejetées car elles reproduiraient précisément la faiblesse d'EXP-021.

Calcul sur le monde jouable initial : la bille démarre vers `(10,6)` à une hauteur d'environ `0.4572`. Son voisin le plus bas est seulement `0.00515` plus bas, soit environ `0.11 px` avec `HEIGHT_PX=22`. Une règle « tap sur la bille → va vers le voisin naturellement le plus bas » serait donc déterministe mais pratiquement invisible au départ.

Simulation de 500 états obtenus après 1 à 12 pressions locales : avec la règle actuelle de creux, la bille se retrouve presque toujours dans un minimum local. Après un tap sur sa propre case, la pression l'enfonce encore et **0 %** des états simulés offrent ensuite une descente vers un voisin. Une variante « relâcher la bille et laisser la gravité choisir » ne résout donc pas la frontière : sans modifier le terrain, seulement ~3 % de ces états possèdent même un voisin strictement plus bas, et quasiment aucun avec un écart visuellement fort.

La variante « utiliser le point exact du doigt sur le côté de la petite bille comme direction de poussée » est également fragile : le diamètre visuel actuel est d'environ `19 px`, sensiblement inférieur aux tailles de cible tactile confortables usuelles. Encoder gauche/droite/haut/bas dans quelques pixels à l'intérieur de la bille demanderait une précision que le doigt ne fournit pas de manière fiable. `DROP` comme candidat principal.

Une variante reste structurellement testable sans direction cachée : **un contact direct fournit l'énergie, mais le terrain fournit la direction**. Le candidat le moins arbitraire serait alors de sortir vers l'unique bord voisin le plus bas, même si ce bord est plus haut que le fond du creux actuel. Sur 1000 états simulés issus de déplacements par creusement adjacent, l'écart entre le bord le plus bas et le deuxième plus bas est ≥ `1 px` dans ~82 % des états et ≥ `2 px` dans ~66 %. Cela rend la direction parfois visible, contrairement au relief initial. Mais cette règle ferait ponctuellement « monter » la bille hors d'un bassin : elle doit donc être considérée comme une **impulsion externe** et non comme de la gravité. Elle reste un candidat, pas une règle promue.

**Décision de recherche** :
- `DROP` hasard / direction fixe / mémoire / ancien sens de déplacement ;
- `DROP` direction basée sur un sous-ciblage fin à l'intérieur de la petite bille ;
- `DROP` simple « release + gravité », car la bille est presque toujours déjà dans le creux ;
- `KEEP-CANDIDATE` impulsion directe dont la direction est entièrement choisie par le relief visible ;
- ne rien déployer tant qu'une variante n'a pas une causalité formulable sans règle cachée.

**Statut frontière** : `ITERATE-RESEARCH`.

## EXP-022d — Retirer la promesse de bille roulante
**Hypothèse** : le problème de la case occupée vient peut-être surtout du signifiant visuel rond. Remplacer temporairement la bille par un petit acteur carré, sans changer aucune règle de terrain ni de simulation, pourrait retirer l'attente « si je tape directement dessus, il devrait rouler quelque part » tout en préservant `je creuse là → l'objet va vers le creux`.

**Prototype** : changement de présentation uniquement. La simulation, le geste et les sentinelles d'EXP-022b restent identiques.

**Test humain spontané** : sans toucher, le joueur dit « Je ne sais pas le déplacer et j'attends peut-être de voir des boutons pour le déplacer ».

**Observation** : la suppression du signifiant de bille n'améliore pas le langage terrain→objet. Elle détruit au contraire l'affordance physique qui avait permis au joueur de formuler spontanément `je creuse → la bille tend à aller vers le creux`, et fait apparaître une attente de contrôles UI externes.

**Décision** `DROP` immédiat. Le changement visuel est reverté ; la bille ronde est restaurée. Ne pas compenser avec boutons, joystick ou tutoriel.

**Apprentissage** : l'aspect bille est à la fois une source d'une ambiguïté locale et un support majeur de la causalité globale. Il faut résoudre la frontière du contact direct **sans sacrifier la métaphore physique qui rend le terrain intelligible**.

## EXP-VIS-005 — Relief lisible
Relief orthogonal par déplacement vertical, faces et ombres. `TEST`.

## Direction actuelle
`j'observe → je prédis → je presse/creuse → je constate`

Pas de nouvelle ressource, deuxième entité, destination, pathfinding, inertie, mémoire, tutoriel, score, combat ou progression tant que cette causalité élémentaire n'est pas prédictible humainement.
