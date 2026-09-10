# Exploration Radar — familles de plaisir à tester

Ce document empêche Genesis de confondre une primitive prometteuse avec « le jeu ». Il sert de radar entre deux séquences d'approfondissement.

## Principe

Après une primitive validée, rouvrir l'espace. Ne pas choisir un genre ni un type de contrôle d'abord. Chercher une **source élémentaire de plaisir**, puis le plus petit jouet capable de la réfuter.

Critères : envie immédiate de toucher ; retry naturel ; surprise compréhensible ; maîtrise perceptible ; profondeur issue de peu de règles ; adéquation tactile ; situations renouvelées sans production massive ; prototype web rapide.

EXP-023 a fourni une primitive conservée — `action sur terrain → relief → conséquence sur acteur` — mais le relief n'est ni une obligation ni un avantage dans ce radar.

## Radar comparatif — 2026-09

### A — Adresse physique / trajectoire
**Plaisir supposé** : former une intention spatiale, lâcher, puis regarder une trajectoire presque mais pas totalement maîtrisée produire rebonds, quasi-ratés et coups magnifiques.

**Verbe** : viser puis relâcher / flicker.

**Retry / maîtrise** : le joueur apprend angle, puissance, rebond et anticipation. Une erreur est immédiatement lisible et appelle « encore une fois, un peu plus haut/fort ».

**Beaucoup avec peu** : une physique 2D, quelques surfaces et une génération simple de géométries suffisent. Desert Golfing génère tous ses trous procéduralement ; Holedown construit son plaisir autour du moment où les balles trouvent une trajectoire de rebonds très productive.

**Jouet de réfutation** : une seule arène portrait, un projectile, 3–5 surfaces, aucun score. Flick → trajectoire → reset immédiat. Tester si dix tirs consécutifs produisent spontanément ajustement, anticipation et envie de retenter.

**Apprentissage si échec** : savoir si Genesis bénéficie réellement d'un contrôle continu/analogique et d'une physique expressive, ou si ce type de plaisir exige trop de contenu/polish pour notre stack.

**Coût** : très bas. **Valeur d'information** : très haute. **Risque** : devenir un simple mini-golf/Angry Birds sans deuxième idée.

### B — Tension tactile / croissance sous danger
**Plaisir supposé** : maintenir le doigt parce que « plus longtemps = mieux », tout en voyant le risque augmenter en temps réel ; relâcher juste avant la catastrophe.

**Verbe** : toucher/maintenir/relâcher un objet directement.

**Retry / maîtrise** : patience, lecture des trajectoires, choix du bon moment et gestion simultanée de plusieurs menaces. Hundreds est un précédent fort : toucher fait grandir des cercles, mais ils ne doivent rien heurter pendant leur croissance.

**Beaucoup avec peu** : cercles, collisions et vitesses produisent des configurations différentes sans assets. Le système peut être généré par quelques paramètres.

**Jouet de réfutation** : 4–6 formes mobiles ; maintenir une forme la fait grossir et augmente une jauge commune ; collision pendant le maintien = rupture/reset. Aucun niveau, aucune progression. Tester si le simple acte de « prendre encore un peu de risque » devient plaisant.

**Apprentissage si échec** : savoir si une tension continue et tactile est plus porteuse que la causalité discrète de Genesis, et si le multitouch ou l'attention divisée valent la complexité.

**Coût** : très bas. **Valeur d'information** : très haute. **Risque** : plaisir trop abstrait si le feedback n'est pas excellent.

### C — Cascade / réaction en chaîne préparée
**Plaisir supposé** : faire une petite décision puis assister à une conséquence beaucoup plus grande que le geste ; satisfaction de l'anticipation qui se confirme, avec surprise dans les détails.

**Verbe** : placer ou déclencher un élément à un endroit choisi.

**Retry / maîtrise** : apprendre à préparer une chaîne plus longue, reconnaître les motifs prometteurs et transformer un résultat médiocre en « je vois comment faire mieux ».

**Beaucoup avec peu** : Drop7 montre qu'une seule règle de placement + voisinage peut produire explosions et chaînes ; Holedown montre le plaisir hypnotique d'un système qui continue à résoudre après la décision du joueur.

**Jouet de réfutation** : petite grille générée avec trois états seulement. Le joueur place un unique déclencheur ; les cellules activées transforment leurs voisines selon une règle visible. Une action par manche, puis résolution automatique de 1–3 secondes.

**Apprentissage si échec** : distinguer le plaisir de **préparer puis regarder** du plaisir de contrôle continu ; mesurer combien d'imprévisibilité reste acceptable quand la conséquence est amplifiée.

**Coût** : bas. **Valeur d'information** : haute. **Risque** : dériver trop vite vers un puzzle de grille classique.

### D — Optimisation spatiale / réseau vivant
**Plaisir supposé** : construire quelque chose de propre qui fonctionne, puis voir une nouvelle demande rendre l'ancien arrangement insuffisant. Le plaisir vient du compromis et de l'adaptation, pas de réflexes.

**Verbe** : relier / placer / rerouter.

**Retry / maîtrise** : on reconnaît progressivement goulots, redondance, distance et capacité. Mini Metro/Motorways obtiennent de la profondeur par le chevauchement de comportements naturels simples ; Islanders transforme le placement en optimisation locale sur îles procédurales.

**Beaucoup avec peu** : points, lignes, flux et quelques règles de capacité suffisent ; la génération de demandes remplace les niveaux artisanaux.

**Jouet de réfutation** : 5 nœuds, deux types de demandes, tracé direct au doigt, flux automatique. Toutes les 8–12 secondes un nouveau nœud apparaît. Aucun upgrade, aucun score complexe. Tester si le joueur commence spontanément à refaire son réseau et à anticiper les futurs problèmes.

**Apprentissage si échec** : savoir si Genesis doit privilégier la décision lente/systémique plutôt que la sensation tactile immédiate, et si une simulation minimale suffit à créer des choix intéressants.

**Coût** : moyen-bas. **Valeur d'information** : haute. **Risque** : satisfaction trop intellectuelle ou montée en puissance trop lente pour le test initial.

### E — Manipulation des règles / découverte logique
**Plaisir supposé** : comprendre une règle, puis découvrir qu'elle peut être recombinée pour produire une conséquence inattendue mais parfaitement logique — moment « ah ! ».

**Verbe** : déplacer/échanger une propriété ou relation visible.

**Retry / maîtrise** : le joueur apprend un petit vocabulaire puis commence à imaginer des interactions avant de les essayer. Baba Is You est le précédent extrême : son créateur partait d'interactions entre règles, puis construisait les puzzles à rebours ; certaines idées étaient supprimées lorsqu'elles ne généraient pas assez de situations.

**Beaucoup avec peu** : 3–4 propriétés orthogonales peuvent théoriquement créer un espace combinatoire important sans assets.

**Jouet de réfutation** : trois objets, deux propriétés visibles et deux emplacements de propriété. Drag d'une propriété d'un objet à l'autre ; le monde réagit immédiatement. Pas de texte syntaxique complexe, pas de niveau complet. Tester si le joueur expérimente volontairement pour découvrir des conséquences.

**Apprentissage si échec** : savoir si le plaisir de découverte logique peut fonctionner sur téléphone sans explication ni production de puzzles, ou s'il demande trop de level design manuel.

**Coût** : moyen. **Valeur d'information** : très haute. **Risque** : coût caché énorme de conception de puzzles et de lisibilité.

### F — Performance / rythme / maîtrise corporelle
**Plaisir supposé** : synchronisation perception→geste→impact ; réussir une séquence auparavant impossible donne une sensation très nette de progression personnelle.

**Verbe** : taper au bon moment, éventuellement maintenir/relâcher selon le contexte.

**Retry / maîtrise** : échec très court, restart immédiat, patterns appris jusqu'à devenir perceptivement plus lents. Super Hexagon illustre cette transformation par la pratique ; Thumper montre qu'un petit jeu de contrôles peut soutenir une forte physicalité quand son, collision et visuel sont cohérents.

**Beaucoup avec peu** : patterns paramétriques et vitesse croissante peuvent renouveler les parties avec très peu d'assets.

**Jouet de réfutation** : un anneau ou couloir, une cible périodique, tap pour franchir/impacter, patterns générés de 10–20 secondes. Pas de musique sous licence ni de contenu musical : rythme visuel + sons synthétiques seulement.

**Apprentissage si échec** : savoir si Genesis a intérêt à poursuivre une famille fondée sur compétence motrice et retry rapide ; mesurer notre sensibilité réelle aux problèmes de latence/polish.

**Coût** : bas pour le jouet, potentiellement élevé pour un vrai jeu. **Valeur d'information** : haute. **Risque** : la qualité finale dépend énormément du timing, du son et du polish.

### G — Transformation / combinaison stratégique
**Plaisir supposé** : transformer un petit ensemble d'éléments familiers en moteur personnel ; satisfaction de reconnaître une synergie et de voir plusieurs règles se multiplier.

**Verbe** : choisir, fusionner, conserver ou sacrifier.

**Retry / maîtrise** : chaque partie propose des combinaisons différentes ; la maîtrise consiste à évaluer ce qui est bon maintenant contre ce qui peut devenir puissant plus tard. Threes montre la rejouabilité d'un système de fusion très pur ; Balatro montre la puissance de systèmes synergiques élégants construits sur un médium familier.

**Beaucoup avec peu** : quelques états numériques/symboliques peuvent créer de nombreuses combinaisons sans animation complexe.

**Jouet de réfutation** : 6 cases, trois types de pièces, une règle de fusion et une seule règle de bonus contextuel. Dix tours maximum. Tester si, dès la troisième partie, le joueur change volontairement de stratégie au lieu d'appliquer une recette.

**Apprentissage si échec** : savoir si Genesis peut obtenir de la profondeur combinatoire sans tomber dans cartes, inventaire, texte ou économie.

**Coût** : bas. **Valeur d'information** : moyenne-haute. **Risque** : glisser très vite vers contenu, équilibrage et UI — précisément ce que Genesis veut éviter aujourd'hui.

### H — Jouet génératif / plaisir de faire apparaître
**Plaisir supposé** : toucher parce que chaque action produit immédiatement une forme belle, cohérente ou surprenante ; pas besoin d'objectif initial.

**Verbe** : ajouter/enlever/peindre.

**Retry / maîtrise** : curiosité (« que se passe-t-il si… ? »), composition, découverte de formes rares. Townscaper démontre qu'un outil extrêmement limité peut déléguer au système procédural la transformation d'un input simple en résultat riche.

**Beaucoup avec peu** : une grammaire procédurale locale remplace niveaux et assets massifs ; mais sa conception peut devenir coûteuse.

**Jouet de réfutation** : grille irrégulière ou points d'ancrage ; tap ajoute une cellule dont l'apparence/forme dépend uniquement de 4–6 configurations de voisinage. Aucun objectif. Tester si le joueur continue à toucher après avoir compris la règle juste pour voir/faire.

**Apprentissage si échec** : savoir si le « toy first » pur possède assez de valeur intrinsèque chez notre testeur, indépendamment d'objectif, score ou danger.

**Coût** : moyen. **Valeur d'information** : moyenne-haute. **Risque** : passer trop de temps sur génération visuelle avant de prouver le plaisir.

## Ce que le scan externe dit transversalement

- Le tactile est particulièrement fort lorsque le geste agit **directement sur l'objet ou la matière du jeu**, avec feedback instantané ; Apple recommande explicitement ce modèle lorsque possible.
- La simplicité de contrôle n'est pas une source de plaisir en soi. One-button est seulement une contrainte ; le plaisir réel peut être timing, trajectoire, tension, cascade, optimisation, découverte ou transformation.
- Les petits jeux solides ne nécessitent pas tous la même temporalité : action réflexe (Duet/Thumper), décision puis spectacle (Holedown), puzzle logique (Baba), construction systémique (Mini Metro), jouet sans objectif (Townscaper), geste analogique (Desert Golfing).
- La génération procédurale est intéressante lorsqu'elle **expose davantage une règle forte**, pas lorsqu'elle compense une règle faible. Desert Golfing et Islanders montrent aussi son intérêt pour qu'une petite équipe puisse continuer à être surprise par son propre jeu.
- Un prototype visuellement pauvre peut fausser le test de sensation. Asher Vollmer souligne que le ressenti du placeholder influence directement les playtests ; Genesis doit donc viser du placeholder très peu coûteux mais propre, pas volontairement laid.

## Matrice de sélection du prochain jouet

Échelle 1–5. `P` = potentiel de plaisir immédiat/profond ; `C` = coût expérimental inversé (5 = très peu coûteux) ; `I` = valeur d'information pour Genesis. Score indicatif = `P × C × I`, utilisé comme discipline, pas comme vérité mathématique.

| Famille | P | C | I | Score | Motif principal |
|---|---:|---:|---:|---:|---|
| A Trajectoire physique | 5 | 5 | 5 | **125** | Très tactile, très différent du relief discret, réfutable en quelques tirs |
| B Tension hold/release | 4 | 5 | 5 | **100** | Test pur de tension tactile directe, code minuscule |
| C Cascade préparée | 5 | 4 | 5 | **100** | Surprise compréhensible + amplification d'une petite décision |
| D Réseau vivant | 5 | 3 | 5 | **75** | Teste une profondeur lente/systémique très différente |
| E Règles manipulables | 5 | 3 | 5 | **75** | Valeur d'information énorme, mais lisibilité/level design risqués |
| F Rythme/performance | 4 | 4 | 4 | **64** | Retry/maîtrise forts, mais dépendance au polish et à la latence |
| G Combinaison stratégique | 5 | 4 | 3 | **60** | Profondeur probable, mais risque précoce de contenu/UI |
| H Jouet génératif | 4 | 3 | 4 | **48** | Teste le plaisir sans objectif, mais génération visuelle plus coûteuse |

## Sélection recommandée

**Premier candidat à tester : A — adresse physique / trajectoire.**

Pas parce qu'il est « meilleur genre », mais parce qu'il maximise aujourd'hui la valeur de l'expérience :

1. il est réellement éloigné de la primitive terrain→acteur et du one-button timing ;
2. il exploite le tactile comme geste analogique continu (direction + amplitude), donc teste une dimension de contrôle encore presque absente de Genesis ;
3. son prototype peut tenir dans une seule scène et une physique très petite ;
4. il possède une boucle naturelle `intention → geste → conséquence → ajustement → retry` observable sans tutoriel ;
5. il peut être abandonné après quelques minutes si le joueur ne montre ni anticipation ni ajustement ;
6. s'il fonctionne, il n'oblige toujours pas à faire du golf : la primitive conservée serait **geste analogique → trajectoire anticipable → ajustement**, réutilisable ailleurs.

**Challengers immédiats** : B et C. Si A échoue pour absence de plaisir ou de maîtrise, ne pas l'enrichir automatiquement : tester B (tension tactile) ou C (cascade) avant de conclure quoi que ce soit sur la direction Genesis.

## Porte avant code

Le radar est maintenant assez large pour autoriser la sélection du prochain jouet. La prochaine expérience doit rester un **probe jetable**, pas une nouvelle fondation. Ne pas combiner avec EXP-023 au premier test. Ne pas ajouter progression, économie, backend, comptes, niveaux artisanaux ou méta-jeu.
