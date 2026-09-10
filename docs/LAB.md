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

**Ne pas promouvoir** :
- l'égalité exacte→immobilité comme règle intuitive ;
- la cellule occupée comme interaction physiquement satisfaisante ;
- le relief comme « jeu Genesis ».

**Conservation** : une primitive tactile humainement prédictible est maintenant disponible pour de futures combinaisons.

## EXP-VIS-005 — Relief lisible
Relief orthogonal par déplacement vertical, faces et ombres. `TEST`.

## Direction de recherche après EXP-023
EXP-023 clôt une question, pas la recherche du jeu. Le radar comparatif a rouvert l'espace et sélectionné la famille A non pour son score heuristique, mais parce qu'elle est éloignée du relief, très peu coûteuse à tester et adresse une inconnue fondamentale : l'adresse tactile analogique produit-elle spontanément anticipation, correction et retry ?

## EXP-024 — Adresse physique / trajectoire
**Hypothèse** : un geste analogique direct peut suffire à créer une boucle de maîtrise sans contenu supplémentaire.

Boucle recherchée : `J'OBSERVE → JE PRÉDIS → JE GESTE → JE VOIS L'ÉCART → J'AJUSTE`.

### Prototype minimal
- une arène portrait ;
- une bille à lancer ;
- trois surfaces fixes ;
- un anneau cible unique, sans score ;
- tirer la bille en arrière puis relâcher ;
- angle + force encodés dans le même geste ;
- gravité + rebonds simples ;
- reset automatique rapide ;
- aucun niveau, par, progression, génération procédurale, relief ou deuxième mécanique.

La ligne élastique pendant la traction sert uniquement à rendre le geste compréhensible. Elle n'affiche pas la trajectoire future.

### Sentinelles automatiques
- tirer vers un côté lance dans la direction opposée ;
- une traction plus longue donne proportionnellement plus de vitesse ;
- la traction est plafonnée sans changer sa direction ;
- une collision verticale produit un rebond miroir lisible.

Ces tests garantissent la cohérence du contrôle, jamais le plaisir.

### Protocole humain
Observer une courte série libre d'essais. Ne pas transformer « dix tirs » en seuil mécanique.

Deux preuves séparées sont nécessaires :
1. **maîtrise naissante** — le geste suivant incorpore explicitement ou visiblement l'écart précédent (`moins fort`, `plus à gauche`, usage intentionnel d'un rebond, etc.) ;
2. **retry intrinsèque** — le joueur veut recommencer parce qu'il pense pouvoir faire mieux, et non simplement parce qu'on lui demande de poursuivre.

Si le geste lui-même est illisible ou désagréable, corriger seulement le minimum permettant de tester l'adresse. Si le geste est lisible mais que la boucle ou le retry n'apparaissent pas, `DROP/PARK` sans contenu de sauvetage.

### Test humain — calibration invalide
Premier essai : le joueur identifie immédiatement que la bille ne peut pas atteindre le cerceau, que le vol continue puis reset, et que la puissance disponible est insuffisante. Ce n'est pas une preuve contre l'adresse analogique : le probe ne permet pas encore de tester honnêtement l'hypothèse.

Une correction minimale a augmenté amplitude/puissance et accéléré le reset. Au second essai, le joueur rapporte encore : « ce n'est pas possible, ça ne peut pas aller assez haut ». La calibration reste donc invalide. **Ne pas demander davantage de tirs dans cette configuration et ne pas interpréter l'absence de retry comme un échec de la famille.**

Signal conceptuel spontané malgré l'échec du probe : le joueur imagine « une énigme de par quel chemin on doit passer », puis se demande immédiatement si ce type de jeu n'est pas déjà vu et revu.

Recherche externe de contrôle : cette intuition correspond effectivement à une famille déjà très occupée. Des jeux actuels comme RicoShot et Sink Shot se présentent explicitement comme des puzzles de trajectoire où l'on vise, rebondit sur les murs et cherche le chemin vers une cible ; des précédents anciens comme Angry Birds, Peggle, Fragger et Trick Shot occupent également largement le territoire lancement/angle/rebond.

**Apprentissage provisoire** : distinguer deux questions :
- la primitive `geste analogique → trajectoire → correction` reste non testée proprement à cause d'un probe mal calibré ;
- la proposition de jeu évidente `trouver le chemin de rebonds vers un cerceau` est déjà fortement conventionnelle et ne mérite pas d'être protégée comme direction Genesis.

**Statut** : `ITERATE-CALIBRATION`, mais avec faible valeur à poursuivre sous forme de puzzle de ricochets. Si une dernière calibration minimale ne permet pas de tester l'adresse nue sans glisser vers le puzzle de chemin, PARK la famille et passer au challenger B/C plutôt que d'ajouter contenu ou mécanique.
