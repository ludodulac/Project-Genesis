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
**Observation CI importante** : relever une case voisine drainait en réalité la case sous la mote, qui devenait elle-même un bassin. La sentinelle avait encodé une intuition humaine fausse.

**Décision** `ITERATE`. La relation geste→relief→mouvement était trop indirecte.

## EXP-022b — Presser pour creuser, puis rouler
Toucher enfonce directement la case ; la matière est redistribuée aux voisines. L'acteur sans mémoire descend uniquement si une direction visible est strictement la plus basse ; en égalité exacte, il reste.

**Test humain** : première formulation spontanée utile : « je creuse quelque part et la bille tend à aller vers le creux ». `PROMOTE-PARTIAL`.

### Frontière — cellule occupée
Un tap centré ne contient aucune direction latérale. Hasard, direction fixe, mémoire et sous-ciblage fin sont rejetés. Le joueur attend néanmoins intuitivement qu'une bille ronde touchée directement puisse être déplacée : tension d'affordance conservée.

## EXP-022d — Acteur carré
Le joueur ne sait plus le déplacer et attend des boutons. `DROP`. La circularité soutient donc une lecture physique utile.

## EXP-022e — Cercle creux
Le centre transparent laisse le terrain perceptible sous l'acteur. Le joueur décrit spontanément `action sur terrain → relief → objet qui coule/se déplace`. `PROMOTE-PARTIAL`, puis signifiant figé pour EXP-023.

## EXP-023 — Réfuter la compréhension terrain→conséquence
**Question** : le joueur comprend-il réellement la géométrie locale, ou seulement « je touche près donc ça bouge / ça suit mon doigt » ?

Quatre situations nouvelles, même moteur, même cercle creux, même geste. Prédiction recueillie avant chaque action.

### 1 — `toward`
**Prédiction** : « la bille ira dedans ».

**Observation** : la bille va dans la case enfoncée.

**Résultat** : correct.

### 2 — `near-but-stay`
La pression adjacente crée deux meilleures descentes exactement égales ; le moteur refuse d'inventer une direction.

**Prédiction** : le joueur pense que la bille sera poussée dans le trou à gauche. Son explication raisonne déjà sur le relief et la redistribution : baisser à droite ferait monter la case de la bille et l'expulser vers le bas visible.

**Observation** : aucun mouvement.

**Résultat** : incorrect. Apprentissage important : la convention « égalité exacte → immobilité » n'est pas naturellement prédictible. Ne pas la confondre avec le langage général acquis.

### 3 — `away`
La cellule proposée est à droite, mais le relief local offre une sortie clairement plus basse à gauche.

**Prédiction** : « la bille va tomber à gauche là où c'est plus bas par rapport à là où elle est maintenant ».

**Observation** : déplacement à gauche.

**Résultat** : correct et **discriminant**. Le joueur prédit une conséquence opposée au côté touché à partir de la géométrie visible. L'heuristique « l'objet suit l'endroit touché » est réfutée.

### 4 — `occupied`
**Prédiction apprise** : la bille restera parce que la case va baisser.

**Intuition résiduelle explicitée spontanément** : selon l'endroit précis où l'on clique/appuie sur une bille, elle pourrait intuitivement rouler ou se déplacer vers le côté opposé.

**Observation** : elle reste.

**Résultat** : prédiction du moteur correcte, mais tension d'affordance physique toujours réelle.

### Décision EXP-023
**`KEEP-PRIMITIVE`** : le langage général `action sur terrain → relief → conséquence sur acteur` passe le seuil humain. Plusieurs conséquences nouvelles ont été correctement prédites, dont le contre-exemple fort `away`.

**Ne pas promouvoir** : l'égalité exacte→immobilité comme règle intuitive ; la cellule occupée comme interaction physiquement satisfaisante ; le relief comme « jeu Genesis ».

**Conservation** : une primitive tactile humainement prédictible est maintenant disponible pour de futures combinaisons.

## EXP-VIS-005 — Relief lisible
Relief orthogonal par déplacement vertical, faces et ombres. `TEST`.

## EXP-024 — Adresse physique / trajectoire
**Hypothèse** : un geste analogique direct peut suffire à créer une boucle de maîtrise sans contenu supplémentaire.

Après deux calibrations invalides, le probe final a retiré les obstacles qui transformaient accidentellement le test en puzzle de chemin. Le geste et la cible sont alors devenus physiquement valides.

**Test humain final** : « Ça fonctionne. C'est amusant deux fois ».

Le plaisir immédiat existe mais s'épuise presque aussitôt ; pas de retry intrinsèque durable observé. Ajouter obstacles, niveaux ou objectifs aurait sauvé un jeu enrichi plutôt que l'hypothèse nue.

**Décision** : `PARK` famille A. Conserver le geste analogique comme primitive possible, ainsi que le signal séparé que l'habillage ricochet/path-puzzle paraît déjà connu.

## EXP-025 — Tension tactile / croissance sous danger
**Hypothèse** : maintenir directement un objet qui grossit tandis que des menaces mobiles s'approchent peut créer le dilemme intrinsèque `encore un peu → relâcher avant la catastrophe`.

### Prototype minimal
Un objet central grossit uniquement pendant l'appui. Quatre menaces circulaires se déplacent et rebondissent sur l'arène. Si une menace touche l'objet pendant l'appui, reset rapide. Aucun score, niveau, objectif secondaire, pouvoir, texte ou progression.

### Observation humaine
Retour immédiat : « Je ressens de la frustration de ne pouvoir rien faire ».

Ce n'est pas la tension recherchée. Le joueur ne décrit ni envie de tenir plus longtemps, ni décision de relâcher au bon moment, ni maîtrise du risque. Le système produit une menace visible mais l'action disponible est vécue comme absence d'agence.

### Décision
**`DROP` EXP-025 / famille B dans cette forme.** Ne pas ajouter esquive, pouvoirs, jauges, cibles ou boutons pour la sauver : cela changerait l'hypothèse testée.

**Conservation** : `danger sans moyen perçu d'influencer la situation = frustration d'agence, pas tension intéressante`. Pour Genesis, une contrainte ne devient intéressante que si le geste du joueur modifie réellement un futur qu'il peut anticiper.

## EXP-026 — Cascade immédiate
**Hypothèse** : une seule décision visible peut produire une conséquence amplifiée suffisamment intéressante pour susciter anticipation et envie de recommencer.

### Observation humaine
Le joueur comprend l'interaction au niveau le plus simple : il clique sur les éléments et cela les fait bouger. Il décrit le résultat comme « sympa », puis demande spontanément : « qu'est-ce que tu veux faire avec ça ? ».

### Décision
**`PARK`.** Le spectacle de propagation possède un petit agrément visuel, mais aucune intention n'émerge spontanément. Ne pas ajouter score, niveaux ou progression pour fabriquer artificiellement une raison d'agir.

**Conservation** : l'amplification visuelle peut être une récompense secondaire, pas encore un verbe de jeu.

## EXP-027 — Persistance seule
**Hypothèse** : si les conséquences d'un tap restent sur le plateau et modifient le coup suivant, l'intention apparaîtra peut-être sans objectif externe.

### Prototype et test technique
Un tap consomme la cellule touchée et transforme les voisines chargées en cellules prêtes. Les changements persistent.

### Observation
Le système possède bien de la mémoire, mais sa dynamique est monotone : transformer puis consommer. Il modifie le futur sans créer assez de futurs qualitativement distincts. La persistance n'est donc pas, à elle seule, le composant manquant d'EXP-026.

### Décision
**`DROP` comme candidat de jeu.** Conserver le noyau comme contrôle expérimental montrant que `persistance ≠ décision intéressante`.

## EXP-028 — Seuil, préparation et propagation
**Hypothèse** : un même tap peut devenir intéressant si le joueur doit choisir entre conséquence immédiate et préparation d'une conséquence future plus grande.

### Règle minimale
Chaque cellule a 1 ou 2 charges visibles. Un tap retire une charge. Une cellule atteignant zéro éclate, retire une charge à chaque voisine orthogonale, et les voisines qui atteignent zéro éclatent simultanément à la vague suivante. Tous les changements persistent.

### Sentinelles
- un tap sur une cellule à 2 charges prépare sans déclencher de cascade ;
- une cellule à 1 charge éclate ;
- propagation orthogonale seulement ;
- les impacts simultanés sont additionnés avant de décider la vague suivante ;
- le plateau de test contient des choix donnant des conséquences immédiates différentes ;
- une préparation silencieuse peut rendre possible au tour suivant une cascade nettement plus grande.

### Recherche d'états
L'exploration exhaustive des petits états 3×3 montre une diversité immédiate trop pauvre pour être un bon test : les cellules déjà prêtes ne donnent au plus que deux magnitudes de cascade distinctes dans cet espace.

L'exploration d'états 4×4 fait apparaître des plateaux compacts où le même vocabulaire de deux états produit : petite récompense immédiate, préparation silencieuse et grosse conséquence différée. Le plateau retenu n'utilise que 7 cellules occupées ; ses actions prêtes produisent des cascades de tailles 1 ou 2, tandis qu'une préparation peut ouvrir au coup suivant une chaîne d'au moins 5 cellules.

### Observation humaine
Retour spontané : « C'est assez marrant », puis lecture inattendue mais forte : cela ressemble à « un jeu d'énigme » où l'on se demande comment ça fonctionne et où « le jeu ce serait découvre le mécanisme de comment ça marche ».

Le joueur ne formule pas encore la stratégie précise `préparer → déclencher`, donc l'hypothèse tactique initiale n'est pas démontrée. En revanche il formule spontanément une **boucle de découverte de règle** : agir → observer → émettre une hypothèse sur le mécanisme → retester.

### Décision
**`PROMOTE-PARTIAL`**, mais pour une raison différente de celle prévue. Conserver deux signaux séparés :
1. le système à seuil produit suffisamment de structure pour provoquer une curiosité causale ;
2. la préparation tactique consciente reste non prouvée.

Ne pas transformer immédiatement Genesis en puzzle abstrait. Le signal nouveau est plus général : **comprendre le monde peut être une récompense de jeu en soi**.

La recherche externe confirme qu'il existe une famille viable centrée explicitement sur l'inférence des règles, mais Genesis doit vérifier si son propre plaisir vient de l'aha puis s'éteint, ou si la règle apprise devient ensuite un outil de maîtrise.

## EXP-029 — Transfert après découverte
**Question discriminante** : une fois le mécanisme partiellement compris, le joueur utilise-t-il cette compréhension sur une nouvelle situation, ou l'intérêt venait-il seulement du mystère initial ?

### Observation humaine
Retour immédiat : « tu m'as donné le même principe et ça ne m'amuse plus », avec une réserve spontanée très précise : « sauf s'il y avait quelque chose à découvrir, une sorte de clé à comprendre pour passer un niveau ».

Le transfert pur de la même règle vers de nouvelles topologies ne suffit donc pas. Une fois la curiosité initiale consommée, la répétition du mécanisme s'éteint. En revanche le joueur nomme lui-même la condition susceptible de maintenir l'intérêt : **chaque situation doit cacher une compréhension à acquérir, et cette compréhension doit permettre un franchissement visible**.

### Décision
**`DROP` pour l'hypothèse `rule discovery → mastery par répétition de topologies`.** Ne pas sauver EXP-029 en ajoutant seulement plus de plateaux, score ou difficulté numérique.

**`PROMOTE-PARTIAL` pour une nouvelle piste distincte : `discovery → key insight → passage`.** La récompense recherchée n'est peut-être pas l'optimisation d'une règle déjà connue mais une suite d'aha honnêtes : problème visible, informations suffisantes, découverte d'une propriété ou relation, puis ouverture/franchissement qui prouve la compréhension.

**Critère de suite** : ne pas fabriquer un niveau avant d'avoir identifié une « vérité intéressante » réellement découvrable. Une clé arbitrairement cachée ou une règle secrète sans indices serait du devinage, pas un aha. La prochaine expérience doit tester une seule clé conceptuelle, avec toutes ses pièces visibles avant le déclic et sans explication textuelle.

## EXP-030 — Découverte qui change l'action
**Hypothèse** : le plus petit renouvellement d'intérêt possible consiste à observer une propriété nouvelle, puis à pouvoir agir différemment grâce à cette observation dans une seconde situation. Cette hypothèse est testée sans score, progression, tutoriel ni ajout d'un véritable « niveau ».

### Prototype minimal
Même famille visuelle et même propagation qu'EXP-028/029, avec un seul type d'élément supplémentaire au comportement distinct. La première situation permet d'observer cette différence ; la seconde permet théoriquement d'exploiter la relation. Aucun texte n'explique la règle.

### Observation humaine
Retour : « quand on touche les Bleus ça fait disparaître tout enfin pas tout le temps mais parfois » puis surtout « ça n'a pas super évolué depuis tout à l'heure ».

Le joueur perçoit donc encore des différences de conséquence, mais la présence d'une propriété supplémentaire et la possibilité de l'exploiter ensuite **ne renouvellent pas sensiblement l'intérêt**. Le prototype reste vécu comme une variation proche du même système de boutons/cascades.

### Décision
**`DROP` pour l'hypothèse minimale `découvrir une propriété → agir autrement suffit à renouveler l'intérêt`.** Ne pas la sauver avec tutoriel, récompense, score ou davantage de plateaux.

**Conservation** : le problème n'est pas seulement l'absence de nouvelle information. Une découverte n'a de valeur de jeu que si elle transforme suffisamment la nature de la situation, la représentation mentale ou le pouvoir d'agir. Ici, la règle nouvelle reste enchâssée dans une interaction déjà épuisée.

**Conséquence pour la suite** : ne pas considérer « une clé à comprendre » comme solution générale. Revenir à une exploration plus large de formes où l'insight, s'il existe, change qualitativement ce que le joueur croit possible plutôt que d'ajouter une exception à une cascade connue.
