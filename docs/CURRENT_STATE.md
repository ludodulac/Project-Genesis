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
- **EXP-035 structure modifiable × processus autonome** : `PROMOTE-PARTIAL` pour le couplage causal ; l'instanciation à une mote / une cible n'est pas encore un game.

## Distinction désormais explicite
Ne pas confondre :
- plaisir de manipulation ;
- compréhension prédictive ;
- curiosité causale ;
- intention / décision ;
- espace de jeu génératif ;
- désir de rejouer.

Un probe peut démontrer l'une de ces propriétés sans être lui-même un jeu complet.

## Synthèse méthodologique — septembre 2026
Le document `docs/SYNTHESIS_INTERACTION_LEVEL_2026-09.md` réanalyse transversalement la trajectoire et la recherche externe.

Décision : **ITERATE THE METHOD**.

La discipline expérimentale reste valide (`hypothèse → probe → sentinelles → humain → décision`), mais l'unité de pari change. Genesis a probablement imposé trop souvent l'exigence qu'une propriété nue produise seule plaisir, intention, profondeur et replay.

Les nouveaux paris peuvent donc porter sur des **micro-systèmes couplés de 2–3 propriétés maximum**, seulement lorsque l'interaction est l'hypothèse testée :
`A rend B intéressant` et `B modifie la valeur de A`.

Ce changement n'autorise pas l'empilement arbitraire. Un bundle de sauvetage (`mécanique faible + score + progression + ennemis + narration`) reste interdit.

## EXP-035 — guided flow — PROMOTE-PARTIAL
Hypothèse testée : une structure modifiable et un processus autonome peuvent produire une boucle qualitativement nouvelle si le joueur édite en anticipation ou en correction de ce que le processus fera ensuite.

Ablations définies avant construction :
- `edit-only` : structure modifiable, processus autonome désactivé ;
- `flow-only` : processus autonome actif, structure non modifiable ;
- `coupled` : les deux propriétés actives.

### Résultats humains
Condition couplée : « en abaissant les petites touches je pouvais déplacer jusqu'à la cible ». Le joueur relie spontanément une édition précise à la trajectoire et à une destination locale.

`edit-only` : « Je peux pas le déplacer ». Le retrait du processus autonome fait disparaître précisément la capacité que le joueur avait identifiée dans le couplage.

`flow-only` : « J'arrive pas à cliquer sur tous les boutons ». Le retrait de l'édition est perçu comme perte d'agence sur la structure. Ce retour ne démontre pas à lui seul une préférence, mais confirme que l'édition faisait partie de la relation fonctionnelle perçue.

Deux essais intermédiaires ont été invalidés : les liens avaient encodé le séparateur `&`, donc les ablations n'étaient pas réellement activées. Ils ne sont pas utilisés dans le verdict.

### Verdict d'ablation
**Le couplage survit.** Les deux propriétés ne sont pas seulement juxtaposées : dans la condition complète, l'édition prend sa valeur parce qu'elle change le processus autonome ; dans chaque ablation, cette relation disparaît qualitativement. Classification : `PROMOTE-PARTIAL`.

Acquis : **une structure éditable peut devenir conséquente lorsqu'un processus autonome, localement lisible, dépend de cette structure et que le joueur peut découvrir cette causalité sans tutoriel.**

Non acquis : replay, profondeur, émergence, décisions conflictuelles, variété de situations, apprentissage durable.

### Filtre supérieur — potentiel de game
L'instanciation actuelle ne passe pas encore ce filtre. Avec une mote, une cible et une correction dominante, elle produit surtout un problème causal lisible : une fois la relation comprise, la meilleure action tend à rester évidente. Il n'existe pas encore de raison interne pour que deux situations demandent des choix réellement différents.

EXP-035 n'est donc pas prolongé par du score, de la progression ou du contenu. Son couplage devient un matériau acquis. La recherche suivante doit tester si une troisième propriété minimale peut transformer cette causalité en **espace de décisions**, ou si une autre famille fait mieux.

## Signal visuel séparé
Retour récurrent : l'utilisateur trouve souvent cet univers joli et dit aimer cet univers-là. Conserver ce signal comme propriété candidate de Genesis pendant la recherche du cœur du jeu. Ne jamais l'utiliser comme preuve qu'un probe est un game.

## Recherche suivante
Comparer avant tout nouveau build des familles capables de produire des décisions contextuelles plutôt qu'une action correcte unique. Inclure au minimum :
- structure éditable × processus autonome × intérêts conflictuels ;
- une action × deux conséquences mécaniquement utiles ;
- information incomplète mais inférable × action irréversible/réversible à coût local ;
- processus autonome × transformation réciproque du monde.

Sélection uniquement si les ablations, le coût solo et le comportement humain discriminant sont propres. Prochain numéro disponible : EXP-036.

## Toujours absent par défaut
Score, progression méta, économie, backend, comptes, multijoueur et contenu destiné à sauver une mécanique faible. Ils pourront revenir uniquement si une hypothèse ultérieure les exige réellement, pas comme pansement.
