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
- **EXP-029 transfert de la même règle** : `DROP` — répéter une règle comprise ne maintient pas l'intérêt ; l'idée de « clé pour passer » était une hypothèse humaine, pas une solution choisie.
- **EXP-030 découverte d'une relation supplémentaire** : `DROP` — une nouvelle relation dans le même système n'a pas renouvelé suffisamment l'intérêt.
- **EXP-031 pression spatiale globale** : `DROP` — swipes arbitraires, cause de la défaite non comprise, ennui très rapide. Un mystère de règle sans raison d'agir lisible produit de la confusion improductive.
- **EXP-032 risque volontaire / encaissement** : `DROP` comme cœur de Genesis — le joueur reconnaît un vrai jeu d'adresse mais le juge « un peu bof » et perçoit la difficulté finale comme pratiquement inévitable. Le dilemme « sécuriser ou tenter encore une » n'a pas émergé comme moteur dominant.
- **EXP-033 continuité à travers micro-systèmes** : `DROP` — après avoir fait disparaître les premiers éléments, le joueur n'a pas spontanément envie de voir la suite. S'il n'avait pas été informé qu'une suite existait, il se serait arrêté.

## Conséquence d'EXP-033
L'hypothèse « une aventure ou continuité externe peut rendre intéressantes des micro-mécaniques modestes » n'est pas démontrée. Une continuité peut porter des systèmes courts dans des jeux existants, mais elle ne crée pas à elle seule l'élan initial.

La question de recherche a donc été rouverte sans en faire une doctrine : **qu'est-ce qui déclenche spontanément un premier geste puis un deuxième ?**

Le document de travail est `docs/REOPEN_FIRST_SECOND_GESTURE_2026-09.md`.

## Explications concurrentes actuellement comparées
1. réponse expressive / monde qui répond agréablement ;
2. but ou obstacle immédiatement lisible ;
3. augmentation visible du pouvoir d'agir ;
4. construction inachevée / conséquence pendante ;
5. curiosité causale ;
6. enjeu narratif, social ou affectif.

Les familles 1 et 5 ont déjà beaucoup de contre-preuves locales. La famille 6 est coûteuse et peut masquer un cœur faible. La famille 3 est actuellement la plus informative parce qu'elle n'a pas encore été isolée dans Genesis.

## Prochain pari sélectionné — augmentation visible du pouvoir d'agir
Question discriminante : **un premier succès très simple provoque-t-il spontanément un deuxième geste lorsqu'il augmente visiblement le pouvoir d'agir et rapproche une cible auparavant hors de portée ?**

Ce n'est pas une sélection de genre et ce n'est pas un clone de Katamari/Hole.io. Le probe doit isoler seulement :
`petite action réussie → capacité visible augmente → nouvelle cible devient atteignable`.

Kill test : si le joueur clique ou se déplace au hasard, décrit seulement « je mange des trucs », ou s'arrête sans chercher spontanément une cible plus grosse, `DROP` sans ajouter score, timer, histoire, ennemis, upgrades ou niveaux.

## Toujours absent par défaut
Score, progression méta, économie, backend, comptes, multijoueur et contenu destiné à sauver une mécanique faible. Ces éléments pourront revenir uniquement si une hypothèse ultérieure les exige pour être testée, pas comme pansement.
