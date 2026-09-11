# Current State

## État réel
Genesis ne cherche pas encore à terminer un jeu. Il cherche le jeu qui donnera une bonne raison d'être terminé.

Deux catégories restent distinctes :
- **primitives acquises** : interactions qui ont démontré quelque chose d'utile et restent disponibles ;
- **candidats de jeu** : expériences jetables qui doivent produire une vraie raison d'agir avant d'être prolongées.

## Primitive acquise — relief tactile
EXP-023 est clos en `KEEP-PRIMITIVE` pour : **action sur le terrain → modification du relief → conséquence prédictible sur l'acteur**.

Le grand monde en cases et relief n'a pas été supprimé. Il reste disponible comme langage tactile possible, sans obligation de le mettre dans le prochain jeu.

## Résultats humains récents
- **EXP-024 trajectoire analogique** : `PARK` — petit plaisir immédiat, épuisement rapide.
- **EXP-025 tension sous danger** : `DROP` — menace sans agence perçue = frustration.
- **EXP-026 cascade immédiate** : `PARK` — spectacle agréable, pas d'intention spontanée.
- **EXP-027 persistance simple** : `DROP` — changer le futur ne suffit pas si les futurs restent monotones.
- **EXP-028 seuil/cascade** : `PROMOTE-PARTIAL` uniquement pour la curiosité causale déclenchée.
- **EXP-029 transfert de la même règle** : `DROP` — répéter une règle comprise ne maintient pas l'intérêt.
- **EXP-030 découverte d'une relation supplémentaire** : `DROP` — une nouvelle relation dans le même système n'a pas renouvelé suffisamment l'intérêt.
- **EXP-031 pression spatiale globale** : `DROP` — swipes arbitraires, cause de la défaite non comprise, ennui très rapide.
- **EXP-032 risque volontaire / encaissement** : `DROP` — vrai jeu d'adresse reconnu mais jugé « un peu bof » ; le dilemme de risque ne devient pas le moteur.
- **EXP-033 continuité à travers micro-systèmes** : `DROP` — la promesse d'une suite ne crée pas l'élan initial.
- **probe growing-reach / augmentation du pouvoir d'agir** : `DROP` — immédiatement reconnu comme une version inférieure d'un jeu de trou / bulles qui mangent les plus petites. La croissance de capacité est lisible mais ne produit ni identité ni attraction propre.

## Réouverture active
La question reste : **qu'est-ce qui déclenche spontanément un premier geste puis un deuxième ?** Elle n'est pas une doctrine.

Après le DROP de growing-reach, la comparaison a été rouverte dans `docs/REOPEN_AFTER_GROWING_REACH_2026-09.md`.

Les familles comparées restent concurrentes : but/obstacle lisible, feedback sensoriel, curiosité perceptive, métamorphose, construction persistante, auto-défi, narratif/social. Les précédents externes sont utilisés comme justification de tests, jamais comme preuve de plaisir.

## Pari actuellement sélectionné pour un futur probe minimal
**Artifact persistant → ambition auto-générée.**

Question discriminante : **un premier geste provoque-t-il spontanément le deuxième lorsque le premier laisse un artifact lisible, imparfait et modifiable, au point que le joueur se donne lui-même le prochain objectif ?**

Ce n'est pas « un jeu de construction » choisi. Le signal recherché est plus strict : après quelques gestes, le joueur doit commencer à parler de sa propre intention ou de sa propre performance plutôt que demander ce que le prototype attend de lui.

Le précédent externe le plus informatif est Tower of Goo : les joueurs ont spontanément demandé à construire plus haut que la limite du prototype. Les contre-exemples Poly Bridge montrent que cette boucle meurt lorsque la causalité physique paraît arbitraire ou que l'amélioration devient du trial-and-error pixel-perfect.

Conditions avant tout test humain :
- modification persistante et immédiatement intelligible ;
- chaque geste change réellement les possibilités suivantes ;
- plusieurs ambitions plausibles sans les nommer dans l'UI ;
- erreur attribuable et réparable ;
- aucun score, timer, objectif textuel, progression ou tutoriel stratégique pour fabriquer artificiellement le second geste.

Kill test : si le joueur décrit seulement « je pose des trucs » ou demande quoi faire, `DROP`. Signal positif fort seulement s'il formule spontanément « je veux essayer de… » et agit pour poursuivre cette intention.

## Toujours absent par défaut
Score, progression méta, économie, backend, comptes, multijoueur et contenu destiné à sauver une mécanique faible. Ces éléments pourront revenir uniquement si une hypothèse ultérieure les exige pour être testée, pas comme pansement.
