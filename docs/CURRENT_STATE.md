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
- **EXP-028 seuil/cascade** : `PROMOTE-PARTIAL` pour curiosité causale spontanée ; maîtrise tactique non prouvée.
- **EXP-029 transfert de la même règle** : `DROP` — répéter une règle comprise ne maintient pas l'intérêt.
- **EXP-030 découverte d'une relation supplémentaire** : `DROP` — une nouvelle relation dans le même système n'a pas renouvelé suffisamment l'intérêt.
- **EXP-031 pression spatiale globale** : `DROP` — swipes arbitraires, cause de la défaite non comprise, ennui très rapide.
- **EXP-032 risque volontaire / encaissement** : `DROP` — vrai jeu d'adresse reconnu mais jugé « un peu bof » ; le dilemme de risque ne devient pas le moteur.
- **EXP-033 continuité à travers micro-systèmes** : `DROP` — la promesse d'une suite ne crée pas l'élan initial.
- **growing-reach / augmentation du pouvoir d'agir** : `DROP` — immédiatement reconnu comme une version inférieure d'une famille déjà connue ; lisibilité et croissance ne créent pas une identité.
- **EXP-034 artifact auto-modifiable** : `DROP` pour l'hypothèse `artifact seul → ambition auto-générée`. Retour humain : « rigolo à manipuler mais ce n'est pas encore un jeu ». Le plaisir de manipulation est confirmé, mais aucune intention propre n'émerge spontanément.

## Distinction désormais explicite
Ne pas confondre :
- plaisir de manipulation ;
- compréhension prédictive ;
- curiosité causale ;
- intention / décision ;
- désir de rejouer.

Un probe peut démontrer l'une de ces propriétés sans être lui-même un jeu complet.

## Synthèse méthodologique — septembre 2026
Le document `docs/SYNTHESIS_INTERACTION_LEVEL_2026-09.md` réanalyse transversalement la trajectoire et la recherche externe.

Décision : **ITERATE THE METHOD**.

La discipline expérimentale reste valide (`hypothèse → probe → sentinelles → humain → décision`), mais l'unité de pari change. Genesis a probablement imposé trop souvent l'exigence qu'une propriété nue produise seule plaisir, intention, profondeur et replay.

Les nouveaux paris peuvent donc porter sur des **micro-systèmes couplés de 2–3 propriétés maximum**, seulement lorsque l'interaction est l'hypothèse testée :
`A rend B intéressant` et `B modifie la valeur de A`.

Ce changement n'autorise pas l'empilement arbitraire. Un bundle de sauvetage (`mécanique faible + score + progression + ennemis + narration`) reste interdit.

## Compétition de couplages avant EXP-035
Document : `docs/COUPLING_COMPETITION_EXP035_2026-09.md`.

Familles comparées :
1. menace prédictible × priorités conflictuelles ;
2. une action × deux conséquences mécaniquement utiles ;
3. choix tactique × deadline rythmique ;
4. exploration/information × conséquence de ressource partagée ;
5. structure modifiable × processus autonome.

La famille 5 gagne le coût du prochain probe, non parce qu'elle réutilise un acquis Genesis, mais parce que ses ablations sont propres, son coût est faible et son signal humain est fortement discriminant.

## EXP-035 — guided flow — ABLATIONS HUMAINES EN COURS
Hypothèse interne : une structure modifiable et un processus autonome peuvent produire une boucle qualitativement nouvelle si le joueur commence à éditer en anticipation ou en correction de ce que le processus fera ensuite.

Implementation minimale :
- un petit champ déformable ;
- une mote creuse ;
- une destination visible ;
- la mote avance automatiquement selon la géométrie locale ;
- toucher le champ modifie cette géométrie de façon persistante ;
- aucun texte tutoriel, score, timer de performance, récompense, progression, adversaire ou séquence de contenu.

Ablations définies et implémentées avant test :
- `edit-only` : structure modifiable, processus autonome désactivé ;
- `flow-only` : processus autonome actif, structure non modifiable ;
- `coupled` : les deux propriétés actives.

Sentinelles techniques :
- chaque ablation retire bien une propriété sans casser l'autre ;
- dans la condition couplée, une édition peut changer qualitativement le prochain mouvement autonome ;
- une correction locale suffit à transformer un arrêt en arrivée.

### Observation humaine — condition couplée
Retour spontané : « Oui c'est joli j'ai remarqué que en abaissant les petites touches je pouvais déplacer jusqu'à la cible. »

Lecture provisoire, avant ablations :
- la relation causale structure → mouvement autonome est comprise ;
- l'action est reliée à une destination locale, et non décrite comme manipulation aléatoire ;
- le kill test initial du couplage n'est donc pas déclenché ;
- cela ne prouve pas encore que le couplage ouvre un espace de jeu.

Le signal global « tout est joli / j'aime souvent cet univers, mais je cherche le game » reste séparé : l'univers visuel est une propriété candidate à préserver, jamais une preuve de gameplay.

### Protocole restant
Ne pas modifier EXP-035. Faire tester les ablations déjà définies. Le verdict du couplage dépend de la différence qualitative entre `edit-only`, `flow-only` et `coupled`, pas de la simple réussite à atteindre la cible.

Si le couplage survit, appliquer ensuite un second filtre de niveau supérieur : ouvre-t-il un espace de jeu capable de produire décisions, situations différentes, apprentissage, surprises et raisons de revenir sans score/progression/contenu/mécaniques compensatoires ?

Route humaine principale : `?probe=guided-flow`.

## Toujours absent par défaut
Score, progression méta, économie, backend, comptes, multijoueur et contenu destiné à sauver une mécanique faible. Ils pourront revenir uniquement si une hypothèse ultérieure les exige réellement, pas comme pansement.
