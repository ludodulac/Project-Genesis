# Architecture

## Architecture cible minimale

```text
src/
├── world/          # état canonique du petit monde
├── simulation/     # lois et transitions déterministes
├── input/          # intentions du joueur
├── game/           # objectifs/règles de partie — presque vide au début
├── presentation/   # rendu, animations, son, caméra, effets
└── experiments/    # prototypes jetables
```

La structure physique exacte peut évoluer ; les frontières conceptuelles sont plus importantes que le nombre de dossiers.

## Flux canonique

```text
Interaction tactile
      ↓
Action / intention
      ↓
Simulation pure
      ↓
WorldState suivant + événements
      ↓
Présentation
```

### World
Contient cellules, hauteurs, propriétés et entités. Aucun DOM, Phaser, son ou réseau.

### Simulation
Applique les lois du monde : voisinage, élévation, pente, déplacement, réactions. Les fonctions importantes doivent être testables sans navigateur.

### Input
Traduit un geste en intention. Exemple initial : `RaiseCell(cellId)`.

### Game
Contiendra plus tard objectifs, victoire, ressources, adversaire. Ne pas remplir avant que le jouet soit plaisant.

### Presentation
Phaser peut gérer rendu, tween, particules, audio, caméra et tactile. Cette couche reflète l'état ; elle n'est pas l'autorité.

### Experiments
Une expérience peut contourner temporairement certaines abstractions pour apprendre vite, mais elle ne devient pas automatiquement architecture de production. Toute promotion vers le moteur doit identifier la règle générale découverte et l'intégrer proprement.

## État sérialisable

Le plateau doit pouvoir être représenté par des données simples : identifiants, topologie, hauteurs, propriétés et entités. Un état intéressant doit pouvoir devenir fixture de test.

## Déterminisme

Éviter les dépendances implicites à l'horloge, au framerate et au hasard global. Si du hasard devient utile, utiliser une graine explicite lorsque possible.

## Politique d'évolution

Nous préparons les frontières nécessaires à de futurs bots, replays ou réseau en faisant passer toute action par la simulation. Nous ne construisons aucun de ces systèmes tant que le jeu n'en a pas besoin.
