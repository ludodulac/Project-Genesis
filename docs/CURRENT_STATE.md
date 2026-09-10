# Current State

## État réel
EXP-023 est **conclu humainement**. Genesis a obtenu sa première primitive tactile suffisamment prédictible pour être conservée :

**action sur le terrain → modification du relief → conséquence sur l'acteur**.

Ce résultat n'est **pas** « le jeu Genesis ». Il constitue une primitive disponible et une connaissance sur la causalité tactile.

## EXP-023 — résultat humain
Le cercle creux, le moteur et le geste sont restés figés pendant quatre situations nouvelles.

1. Cas `toward` : le joueur prédit « la bille ira dedans » ; observation conforme.
2. Cas `near-but-stay` : le joueur prédit un départ à gauche, en raisonnant déjà sur la redistribution et le trou visible ; l'acteur reste finalement immobile. Cette erreur révèle que le cas d'égalité exacte n'est pas naturellement anticipé.
3. Cas `away` : alors que la cellule proposée est à droite, le joueur prédit avant action que « la bille va tomber à gauche là où c'est plus bas » ; observation conforme. C'est le résultat discriminant principal : il réfute l'heuristique « l'acteur suit le toucher ».
4. Cas `occupied` : le joueur prédit que la bille restera parce que la case va baisser ; observation conforme. Il signale cependant une affordance physique résiduelle : intuitivement, un appui localisé sur une bille ronde pourrait aussi suggérer un roulement opposé au point de contact.

## Décision
`PROMOTE-PARTIAL` → **KEEP-PRIMITIVE** pour le langage général terrain→conséquence.

Le critère de plusieurs prédictions nouvelles correctes est atteint, y compris un cas où la conséquence va à l'opposé du côté touché et est prédite à partir du relief visible.

Ne pas promouvoir comme vérité générale la sous-règle « égalité des meilleures descentes = rester immobile » : elle a échoué au test de prédiction et demeure une convention moteur peu naturelle.

Ne pas considérer résolue l'affordance du contact direct sur l'acteur rond. Elle n'empêche plus la compréhension générale du terrain, mais reste une tension de représentation à conserver.

## Ce que Genesis conserve
- déterminisme logiciel ≠ prédictibilité humaine ;
- le cercle creux soutient mieux la lecture terrain que le carré ;
- creuser directement est causalement plus lisible que la redistribution indirecte de l'ancien geste ;
- le joueur peut utiliser le relief visible pour prédire une conséquence qui contredit la direction du toucher ;
- une primitive comprise doit être conservée sans devenir automatiquement le jeu.

## Mouvement suivant — rouvrir l'espace
Ne pas enchaîner automatiquement avec EXP-024 dans la famille relief.

Faire maintenant un point d'exploration externe : chercher des sources élémentaires de plaisir adaptées au tactile, au web et à un prototype très peu coûteux. Formuler plusieurs familles de paris réellement différentes, puis choisir le prochain jouet par valeur d'information et potentiel de plaisir, pas par continuité historique.

Boucle : `EXPLORER LARGEMENT → sélectionner une hypothèse → PROTOTYPER TRÈS PETIT → test humain → KEEP/PROMOTE-PARTIAL/PARK/DROP → rouvrir l'espace → éventuellement combiner les primitives fortes`.

## Toujours absent
Backend, comptes, boutique, progression, économie, multijoueur, infrastructure prématurée et accumulation de contenu artisanal.
