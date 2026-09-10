# Exploration Radar — familles de plaisir à tester

Ce document empêche Genesis de confondre une primitive prometteuse avec « le jeu ». Il sert de radar entre deux séquences d'approfondissement.

## Principe

Après une primitive validée, rouvrir périodiquement l'espace : regarder ce qui existe réellement, chercher des sources élémentaires de plaisir peu coûteuses à prototyper, puis sélectionner quelques paris très différents.

Ne pas choisir un genre d'abord. Chercher :
- envie immédiate de toucher ;
- retry naturel ;
- surprise compréhensible ;
- maîtrise acquise en quelques essais ;
- profondeur issue de peu de règles ;
- bonne adéquation tactile ;
- situations renouvelées sans centaines de niveaux/assets ;
- prototype web faisable rapidement avec Phaser/TypeScript.

## Premier scan externe — 2026-09

Quelques signaux utiles, sans en faire encore des décisions :

### 1. Timing à un seul geste
Des prototypes récents exploitent un seul geste répété avec beaucoup d'espace de maîtrise : tap unique qui avance un cycle, ou hold/release qui transforme directement timing et puissance. La profondeur vient alors du **quand**, pas du nombre de commandes.

Pari possible : un système où le joueur ne choisit presque jamais « quoi faire », seulement le moment exact où intervenir.

### 2. Engagement par conséquence globale d'une action locale
Certains jeux de jam gagnent beaucoup de profondeur quand une action simple se répercute dans plusieurs espaces ou objets à la fois (mouvements miroirs, mondes répétés, couplages). Le plaisir vient du fait qu'une commande reste simple mais possède plusieurs conséquences prévisibles.

Pari possible : une interaction unique qui agit simultanément sur plusieurs entités/surfaces avec intérêts incompatibles.

### 3. Ressource = action elle-même
Des prototypes récents rendent chaque entrée coûteuse : le geste n'est plus seulement contrôle, il devient aussi dépense. Cela crée immédiatement un compromis sans économie complexe.

Pari possible : chaque toucher possède un coût spatial, temporel ou énergétique directement visible dans le monde.

### 4. Monde manipulé plutôt qu'avatar commandé
Plusieurs prototypes minimalistes laissent l'avatar suivre une logique simple tandis que le joueur agit sur l'environnement, des interrupteurs ou la géométrie. C'est proche de la famille relief de Genesis mais plus large que le relief lui-même.

Pari possible : le joueur prépare le monde et observe une entité autonome traverser les conséquences.

### 5. Procédural léger + règle forte
Certains petits jeux mobiles/web utilisent très peu de contrôles et une génération procédurale pour renouveler les situations. Le contenu vient de la combinaison de paramètres plutôt que de niveaux fabriqués à la main.

Pari possible : une règle robuste sur une topologie générée à chaque partie, testable en sessions de 20–60 secondes.

## Discipline de sélection

Une famille entre en prototype seulement si elle peut être formulée comme :

`source de plaisir supposée → jouet de quelques dizaines/centaines de lignes → observation humaine discriminante → KEEP / PROMOTE-PARTIAL / PARK / DROP`

Un prototype doit pouvoir être jeté sans contaminer le moteur principal.

## Porte actuelle

**Ne sélectionner aucune famille pour EXP-024 avant conclusion humaine d'EXP-023.**

À la fin d'EXP-023, faire un point explicite :
1. ce qui est réellement appris ;
2. primitive(s) conservée(s) ;
3. faiblesse encore ouverte ;
4. profondeur potentielle dans la famille actuelle ;
5. valeur attendue d'une exploration d'une famille différente.

Le choix suivant peut donc être : approfondir, combiner, ou rouvrir complètement l'espace.
