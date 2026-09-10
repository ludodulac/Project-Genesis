# Current State

## État réel
Genesis ne cherche pas encore à terminer un jeu. Il cherche le jeu qui donnera une bonne raison d'être terminé.

Deux catégories sont maintenant distinctes :

- **primitives acquises** : interactions qui ont démontré quelque chose d'utile et restent disponibles ;
- **candidats de jeu** : expériences jetables qui doivent produire une vraie raison d'agir avant d'être prolongées.

## Primitive acquise — relief tactile
EXP-023 est clos en `KEEP-PRIMITIVE` pour :

**action sur le terrain → modification du relief → conséquence prédictible sur l'acteur**.

Le grand monde en cases et relief n'a pas été supprimé. Il reste disponible comme langage tactile possible, sans obligation de le mettre dans le prochain jeu.

## Familles explorées

### EXP-024 — adresse physique / trajectoire
Test humain : « Ça fonctionne. C'est amusant deux fois ».

**Décision : `PARK`.** Le geste analogique fonctionne et procure un petit plaisir immédiat, mais pas de retry intrinsèque durable sans ajouter du contenu.

### EXP-025 — tension tactile sous danger
Test humain : « Je ressens de la frustration de ne pouvoir rien faire ».

**Décision : `DROP`.** Le danger sans moyen perçu d'influencer suffisamment la situation produit une frustration d'agence plutôt qu'une tension intéressante.

### EXP-026 — cascade immédiate
Test humain : le joueur comprend qu'il clique et que les éléments bougent, trouve cela « sympa », puis demande spontanément ce qu'il est censé en faire.

**Décision : `PARK`.** La conséquence amplifiée est visuellement agréable mais ne crée pas encore d'intention. Ne pas la sauver avec score, niveaux ou contenu.

### EXP-027 — conséquence persistante simple
Une action consomme un élément et prépare ses voisins pour les actions suivantes.

L'analyse technique montre que la persistance seule ne suffit pas : l'espace de décision reste essentiellement monotone (`transformer → consommer`). Le système change bien le futur, mais n'offre pas encore assez de futurs qualitativement différents.

**Décision : `DROP` comme candidat de jeu, conservation du code comme contrôle expérimental.**

## EXP-028 — seuil + préparation + cascade
**Statut : `BUILD` — probe humain justifié.**

Règle minimale :
- chaque cellule visible possède 1 ou 2 charges ;
- un tap retire une charge ;
- atteindre zéro fait éclater la cellule ;
- l'éclatement retire une charge aux voisins orthogonaux ;
- les voisins atteignant zéro éclatent ensemble à la vague suivante ;
- tous les changements persistent entre les taps.

Pourquoi cette variante mérite un build : elle introduit pour la première fois dans cette famille la distinction entre **agir maintenant** et **préparer un futur plus puissant**, sans ajouter de second verbe.

### Analyse automatisée
Une exploration exhaustive des petits états 3×3 a montré une diversité immédiate limitée : les cellules déjà prêtes produisent au plus deux magnitudes distinctes de cascade dans cet espace. Le 3×3 est donc trop pauvre pour un test humain discriminant.

Une exploration de nombreux états 4×4 a trouvé des configurations compactes où :
- certains taps produisent une petite cascade immédiatement ;
- d'autres taps ne produisent aucune cascade et préparent seulement le plateau ;
- cette préparation peut rendre possible au coup suivant une cascade nettement plus grande ;
- plusieurs choix visibles ont donc des conséquences différentes avec exactement la même règle.

Le plateau retenu utilise seulement 7 cellules occupées. Dans son état initial, les cellules prêtes donnent des cascades de tailles différentes (1 ou 2), tandis qu'un tap silencieux sur une cellule à deux charges peut préparer une cascade d'au moins 5 cellules au coup suivant.

### Question humaine réelle
Sans explication de la règle, le joueur commence-t-il à comprendre que certaines actions **préparent** les suivantes, puis à toucher avec anticipation plutôt qu'au hasard ?

Le test ne doit pas demander « fais une grosse cascade ». Observer seulement :
1. ce que le joueur pense que les deux apparences signifient ;
2. s'il change volontairement son choix après avoir vu une conséquence persistante ;
3. s'il manifeste une intention de préparer ou déclencher quelque chose.

Si seule l'animation plaît mais que les taps restent arbitraires : `PARK/DROP`. Si une stratégie de préparation apparaît spontanément : `PROMOTE-PARTIAL` pour la relation `préparation visible → conséquence différée`.

## Toujours absent
Score, niveaux, progression, économie, backend, comptes, multijoueur, tutoriel permanent et contenu destiné à sauver une mécanique faible.
