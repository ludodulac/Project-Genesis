# Current State

## État réel
EXP-023 est clos en `KEEP-PRIMITIVE` pour :

**action sur le terrain → modification du relief → conséquence sur l'acteur**.

Cette primitive reste disponible mais ne définit pas le jeu Genesis.

## EXP-024 — probe actif : adresse physique / trajectoire
Question : **un contrôle tactile analogique très simple peut-il produire spontanément anticipation, correction personnelle et désir de retry ?**

Boucle recherchée :

`J'OBSERVE → JE PRÉDIS → JE GESTE → JE VOIS L'ÉCART → J'AJUSTE`

### Jouet minimal
Accessible par `?probe=trajectory`.

- espace portrait unique ;
- une bille ;
- trois surfaces fixes ;
- un anneau cible sans score ;
- geste élastique direct : attraper la bille, tirer en arrière, relâcher ;
- angle et force viennent du même geste analogique ;
- gravité et rebonds simples ;
- reset automatique rapide après réussite, sortie ou durée maximale ;
- aucune autre mécanique, aucun niveau, aucune progression, aucun relief Genesis.

Une courte ligne élastique rend seulement le mapping du geste lisible pendant la traction. Elle ne montre pas la trajectoire future ni les rebonds.

### Preuves humaines distinctes requises
1. **Maîtrise naissante** : les gestes suivants incorporent l'écart observé — par exemple moins fort, plus à gauche/droite, ou usage intentionnel d'un rebond.
2. **Retry intrinsèque** : le joueur souhaite refaire parce qu'il pense pouvoir améliorer son résultat, et pas seulement parce que le protocole lui demande un essai supplémentaire.

Le nombre d'essais n'est pas un seuil de réussite. Une dizaine constitue seulement une fenêtre d'observation possible.

### Discipline de décision
Si le geste est incompréhensible ou désagréable, corriger uniquement ce qui empêche de mesurer l'adresse analogique.

Si le geste est lisible mais que `anticipation → écart → ajustement` ou le désir de retry n'apparaît pas, ne pas sauver la famille avec objectif supplémentaire, contenu, progression ou polish : `DROP` ou `PARK`.

Si le probe réussit, conserver seulement la primitive démontrée. Ne pas conclure que Genesis devient un jeu de trajectoire.

## Toujours absent
Niveaux, par, score, progression, génération procédurale, relief Genesis, seconde mécanique, backend, comptes, économie, multijoueur et contenu destiné à sauver le probe.
