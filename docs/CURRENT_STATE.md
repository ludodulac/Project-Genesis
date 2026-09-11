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

Les prochains paris peuvent donc porter sur des **micro-systèmes couplés de 2–3 propriétés maximum**, seulement lorsque l'interaction est l'hypothèse testée :
`A rend B intéressant` et `B modifie la valeur de A`.

Ce changement n'autorise pas l'empilement arbitraire. Un bundle de sauvetage (`mécanique faible + score + progression + ennemis + narration`) reste interdit.

## Critères avant tout prochain probe
Un couplage ne mérite un test humain que s'il satisfait conceptuellement :
1. retirer A change qualitativement B, et retirer B change qualitativement A ;
2. au moins une action/état possède plusieurs conséquences cohérentes ;
3. l'interaction crée anticipation, conflit ou futurs distincts plutôt que davantage d'effet ;
4. la causalité locale reste lisible ;
5. aucun score/progression/fiction n'est nécessaire pour rendre le premier cycle intéressant ;
6. une ablation est définie avant construction ;
7. le signal humain attendu est spécifique (décision, anticipation, hypothèse, intention), pas seulement temps passé ou taps.

## Familles actuellement remises en concurrence au niveau interaction
1. **causalité prédictible × priorités conflictuelles** — très haute valeur d'information ;
2. **curiosité causale × objectif local lisible** — très haute valeur d'information ;
3. **manipulation agréable × contrainte qui rend la forme conséquente** — haute valeur mais risque de retomber dans un puzzle physique familier ;
4. **action polyvalente × deux fonctions mutuellement dépendantes** — très haute valeur, encore trop abstraite pour un probe ;
5. **métamorphose** — `PARK` comme profondeur ultérieure ;
6. **narratif/social/meta-progression** — `PARK` pendant la découverte du cœur.

## Statut de EXP-035
**Aucun EXP-035 sélectionné.**

La prochaine étape n'est pas de construire une nouvelle primitive, mais de comparer plusieurs couplages concrets et distants, avec précédents, contre-exemples, appuis Genesis, coût solo, ablations et kill tests. Le premier qui montre une interaction plausiblement multiplicative pourra alors mériter le coût d'un nouveau test humain.

## Toujours absent par défaut
Score, progression méta, économie, backend, comptes, multijoueur et contenu destiné à sauver une mécanique faible. Ils pourront revenir uniquement si une hypothèse ultérieure les exige réellement, pas comme pansement.
