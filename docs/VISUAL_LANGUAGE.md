# Visual Language

Ce document fixe la méthode de recherche visuelle du projet. Il ne fige pas encore un style final.

## Principe

Une modification visuelle doit répondre à **une question identifiable**. On évite les changements globaux du type « rendre plus joli » tant qu'on ne sait pas quel problème on essaie de résoudre.

## Axes séparés

1. **Projection / caméra** — vue de dessus, inclinaison, échelle, profondeur.
2. **Forme du terrain** — cellules nettes, surface continue, rondeur, transitions.
3. **Relief** — amplitude, lisibilité des pentes, ombres, faces visibles.
4. **Matière / couleur** — palette, texture, gradients, contraste.
5. **Mouvement** — vitesse, inertie, élasticité, propagation.
6. **Feedback tactile visuel** — sélection, impulsion, onde, réaction au doigt.
7. **Lisibilité du mobile** — taille des zones touchables, contraste, espace utile.

On ne change idéalement qu'un axe majeur à la fois pendant une expérience.

## Boucle d'expérience

Pour chaque expérience visuelle :

- **Question** — qu'essaie-t-on de comprendre ?
- **Variable** — quel paramètre ou axe change ?
- **Constantes** — ce qui reste volontairement identique.
- **Test** — ce qu'il faut observer sur téléphone.
- **Décision** — KEEP / ITERATE / REVERT.
- **Apprentissage** — ce qu'on conserve même si la variante est rejetée.

## État actuel

### EXP-VIS-001 — projection initiale
Plateau isométrique équilibré, suffisamment volumétrique pour montrer le relief.

### EXP-VIS-002 — projection plus rasante
Rejetée après retour utilisateur : interprétation inverse de l'intention. Trop orientée « plateau devant soi ».

### EXP-VIS-003 — projection plus zénithale
En cours. Objectif : se rapprocher d'une vue de dessus tout en gardant assez de relief pour comprendre immédiatement qu'une cellule monte ou descend.

## Règle de convergence

Nous ne chercherons pas le « style final » avant d'avoir validé séparément :

1. une projection confortable ;
2. une déformation agréable ;
3. une lecture claire du relief ;
4. un objet qui réagit de manière satisfaisante.

Seulement ensuite, nous travaillerons texture, identité graphique et polish.
