# Lab — Journal d'expériences

Ce document conserve les expériences de game design afin que les essais ratés produisent de la connaissance et ne soient pas répétés sans raison.

## Format

### EXP-XXX — Nom
**Hypothèse**  
Ce que nous pensons rendre amusant, lisible ou satisfaisant.

**Prototype**  
La plus petite modification permettant de tester l'hypothèse.

**Observation**  
Ce qui s'est réellement passé en jouant ou dans un scénario contrôlé.

**Décision**  
`PROMOTE` / `ITERATE` / `PARK` / `DROP`.

**À conserver**  
La partie intéressante même si l'expérience globale échoue.

---

## EXP-001 — Soulever le monde

**Hypothèse**  
Déformer directement un petit relief sous le doigt peut être plaisant avant même l'existence d'un objectif de jeu.

**Observation**  
Les retours ont précisé la représentation : beaucoup de cases, monde plein écran, mais la dernière vue est devenue trop plate pour lire facilement le relief.

**Décision**  
`ITERATE`.

**À conserver**  
Le terrain lui-même reste l'objet principal de l'expérience. Une vue majoritairement du dessus doit néanmoins conserver une lecture 3D immédiate.

---

## EXP-006 — Diriger le vivant

**Hypothèse**  
Déformer le relief devient une décision si plusieurs petits êtres suivent des lois prévisibles et si le joueur commence spontanément à anticiper leurs trajectoires.

**Prototype**  
Monde orthogonal plein écran, action terrain unique, trois êtres autonomes, déplacement déterministe vers une pente plus basse, source d'eau transportable.

**Observation humaine**  
Le testeur ne comprend pas spontanément quoi faire avec les petits êtres ni ce que leur présence lui demande. C'est une donnée négative importante : la proposition actuelle ne communique pas encore son intention par le comportement seul.

Ce problème ne doit pas être masqué par un tutoriel ou des flèches. Soit le comportement des êtres devient naturellement signifiant, soit ils seront simplifiés, remplacés ou supprimés.

**Décision**  
`ITERATE` — ne pas promouvoir les êtres actuels.

**À conserver**  
Conséquences lisibles, zéro hasard caché, anticipation comme critère de qualité.

---

## EXP-007 — Faire pousser le monde

**Hypothèse**  
Transporter une propriété devient intéressant lorsqu'elle laisse une conséquence permanente qui modifie le terrain.

**Boucle testée**  
`terrain → déplacement → eau → croissance → nouveau terrain`

**Observation contrôlée**  
Eau collectée, eau consommée par une graine et croissance modifiant la hauteur sont vérifiées. Une première réaction en chaîne a été rejetée parce qu'elle dépendait de l'ordre interne des agents. La simulation a été séparée en phases afin que tous les mouvements lisent le même état.

**Décision**  
`ITERATE` — croissance candidate, non promue.

**À conserver**  
Une propriété collectée doit produire un effet spatial compréhensible ; aucune causalité ne doit dépendre d'une priorité invisible.

---

## EXP-008 — Sculpter plutôt qu'empiler

**Hypothèse**  
Un geste qui redistribue la matière peut créer plus de compromis qu'un geste qui ajoute seulement de la hauteur.

**Comparaison contrôlée**  
Sur une séquence identique :
- initial : amplitude ≈ `0.416`, minima locaux `8` ;
- accumulation : amplitude ≈ `0.888`, minima `8`, moyenne en hausse ;
- redistribution : amplitude ≈ `0.712`, minima `13`, moyenne conservée.

**Observation**  
La redistribution ne crée pas les pics les plus extrêmes, mais davantage de bassins distincts et une géographie positive/négative. Elle est maintenant la variante jouable active pour comparaison tactile.

**Décision**  
`ITERATE` — candidat fort pour le verbe de sculpture, pas encore promu.

**À conserver**  
Un résultat qui contredit l'hypothèse modifie la documentation ; les minima locaux sont utiles pour caractériser les terrains de circulation.

---

## EXP-VIS-005 — Relief lisible sans perdre la vue du dessus

**Signal humain**  
Le plateau actuel paraît trop plat : le testeur ne lit plus suffisamment la 3D.

**Hypothèse**  
On peut garder les cases orthogonales et une caméra majoritairement zénithale tout en rendant les montagnes et vallées immédiatement compréhensibles grâce à davantage de déplacement vertical, des faces sombres et des ombres cohérentes.

**Prototype**  
Modification de présentation uniquement : amplitude visuelle du relief accrue, face verticale plus profonde, petite face latérale et ombre portée. Aucun changement de simulation.

**Question**  
Une seule touche permet-elle maintenant de voir clairement ce qui monte et ce qui descend sans retrouver l'ancien aspect isométrique ?

**Décision**  
`TEST`.

---

## Prochaine recherche — conflit spatial lisible

Le prochain problème de game design n'est pas d'ajouter un élément. C'est de découvrir une conséquence suffisamment évidente pour que les êtres — ou leur remplacement — aient une raison d'exister sans explication textuelle.

Hypothèse prioritaire : **une même sculpture doit pouvoir aider une trajectoire et en compromettre une autre**. Cela introduirait un compromis avec le seul verbe du terrain.

Critères :
- intention perceptible sans tutoriel ;
- anticipation possible avant le geste ;
- conséquence visuelle immédiate ;
- au moins deux intérêts spatiaux en tension ;
- aucune règle cachée.

Si les êtres actuels n'expriment pas clairement ce conflit, ils ne seront pas protégés.
