# Lab — Journal d'expériences

Ce document conserve les expériences de game design afin que les essais ratés produisent de la connaissance et ne soient pas répétés sans raison.

## Format

### EXP-XXX — Nom
**Hypothèse**  
Ce que nous pensons rendre amusant, lisible ou satisfaisant.

**Prototype**  
La plus petite modification permettant de tester l'hypothèse.

**Observation**  
Ce qui s'est réellement passé en jouant.

**Décision**  
`PROMOTE` / `ITERATE` / `PARK` / `DROP`.

**À conserver**  
La partie intéressante même si l'expérience globale échoue.

---

## EXP-001 — Soulever le monde

**Hypothèse**  
Déformer directement un petit relief sous le doigt peut être plaisant avant même l'existence d'un objectif de jeu.

**Prototype**  
Un plateau compact. Toucher une cellule augmente sa hauteur. Les cellules voisines accompagnent légèrement la déformation. Un objet simple réagit à la pente.

**Observation**  
Les premiers retours ont surtout servi à préciser la représentation du monde : davantage de cases, beaucoup plus d'espace occupé, et une vue moins isométrique.

**Décision**  
`ITERATE`.

**À conserver**  
Le terrain lui-même reste l'objet principal de l'expérience.

---

## EXP-006 — Diriger le vivant

**Hypothèse**  
Le geste de déformer le relief devient une vraie décision de jeu si plusieurs petits êtres se déplacent selon des lois simples et prévisibles, et si certaines cases leur transmettent une propriété visible.

**Références de design**  
- *From Dust* : le terrain et les phénomènes naturels produisent les situations par interaction plutôt que par scripts isolés.
- *Into the Breach* : conséquences déterministes et lisibles pour permettre anticipation et apprentissage.
- *Dorfromantik* : rendre satisfaisante l'interaction répétée au cœur du jeu.
- *Baba Is You* : une nouvelle règle n'est intéressante que si ses interactions produisent suffisamment de situations à explorer.

**Prototype**  
- monde orthogonal de carrés, plein écran ;
- 20 × 12 cellules, avec le territoire qui dépasse latéralement le viewport ;
- petite marche visible au bord inférieur du monde ;
- action unique conservée : `RAISE_CELL` ;
- trois petits êtres autonomes ;
- après chaque action, chacun descend d'une seule case vers le voisin clairement le plus bas ;
- aucune décision aléatoire ;
- une seule case-source d'eau ;
- lorsqu'un être atteint cette source, il transporte visiblement l'eau.

**Question de test**  
Est-ce que le joueur commence spontanément à raisonner en termes de relief et de trajectoire — « si je soulève ici, lequel va partir où ? » — et est-ce que rejoindre la source d'eau crée un petit moment de satisfaction/compréhension ?

**Observation**  
À tester sur téléphone.

**Décision**  
`ITERATE` — expérience en cours.

**À conserver**  
Même si la source d'eau n'est pas amusante, conserver la règle de recherche : une action simple, conséquences lisibles, zéro hasard caché, nouvelles couches introduites une par une.

---

## EXP-007 — Faire pousser le monde

**Hypothèse**  
Transporter une propriété devient réellement intéressant lorsque cette propriété laisse une conséquence permanente qui modifie ensuite le terrain et les trajectoires.

**Prototype**  
- conserver intégralement le geste `RAISE_CELL`, les trois êtres et la source d'eau d'EXP-006 ;
- ajouter seulement trois cases-graine fixes et visibles ;
- un être chargé d'eau qui atteint une graine consomme son eau ;
- la graine devient une pousse ;
- la pousse élève légèrement sa cellule, donc peut modifier une pente future ;
- aucune autre ressource, aucun feu, aucun score, aucun objectif ajouté.

**Boucle testée**  
`terrain → déplacement → eau → croissance → nouveau terrain`

**Question de test**  
Est-ce que le joueur commence à planifier sur plusieurs conséquences : guider un être vers l'eau, puis vers une graine, tout en anticipant que la pousse changera ensuite la géographie ?

**Critère de promotion**  
La croissance mérite de rester seulement si elle provoque au moins une décision nouvelle liée au relief. Si elle n'est qu'une animation satisfaisante sans modifier le raisonnement, la règle doit être simplifiée ou supprimée.

**Ce que l'expérience ne teste toujours pas**  
- feu ;
- interactions élémentaires multiples ;
- combat ;
- adversaire ;
- score ;
- condition de victoire ;
- progression.

**Observation**  
À tester sur téléphone.

**Décision**  
`ITERATE` — expérience en cours.

**À conserver**  
Une propriété collectée doit avoir une conséquence compréhensible sur le monde ; éviter les bonus abstraits ou les inventaires sans effet spatial.
