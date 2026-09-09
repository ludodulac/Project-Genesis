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
`ITERATE` — le déplacement déterministe et le transport restent en laboratoire, non promus.

**À conserver**  
Une action simple, conséquences lisibles, zéro hasard caché, nouvelles couches introduites une par une.

---

## EXP-007 — Faire pousser le monde

**Hypothèse**  
Transporter une propriété devient réellement intéressant lorsque cette propriété laisse une conséquence permanente qui modifie ensuite le terrain et les trajectoires.

**Prototype**  
- conserver le geste `RAISE_CELL`, les trois êtres et la source d'eau d'EXP-006 ;
- ajouter seulement trois cases-graine fixes et visibles ;
- un être chargé d'eau qui atteint une graine consomme son eau ;
- la graine devient une pousse ;
- la pousse élève légèrement sa cellule ;
- aucune autre ressource, aucun feu, aucun score, aucun objectif ajouté.

**Boucle testée**  
`terrain → déplacement → eau → croissance → nouveau terrain`

**Scénarios contrôlés**  
- eau collectée : vérifié ;
- eau consommée par une graine : vérifié ;
- pousse modifiant réellement la hauteur : vérifié ;
- premier essai de réaction en chaîne : une pousse créée par `mote-a` pouvait rerouter `mote-b` dans la même étape.

**Observation**  
Le premier reroutage semblait prometteur mais dépendait de l'ordre des agents dans le tableau. C'est une fausse émergence : le joueur ne peut ni voir ni déduire cette priorité interne. Ce comportement est rejeté.

La simulation a donc été séparée en phases : tous les déplacements sont décidés depuis le même état du terrain, puis appliqués, puis les interactions de cases sont résolues dans un ordre explicite et stable. Une transformation créée à cette étape influence les décisions suivantes, pas celles déjà prises.

**Décision**  
`ITERATE` — conserver la croissance comme candidat parce qu'elle laisse une trace spatiale, mais rejeter toute causalité dépendant d'un ordre caché. Pas encore de promotion dans `GAMEPLAY.md` avant test humain.

**À conserver**  
- une propriété collectée doit avoir un effet spatial compréhensible ;
- les chaînes doivent être anticipables ;
- un détail d'implémentation invisible ne doit jamais devenir une règle de gameplay ;
- les effets permanents du joueur sur le monde sont une piste forte.

---

## EXP-008 — Sculpter plutôt qu'empiler

**Hypothèse**  
Le verbe actuel est encore trop unidirectionnel : toucher ajoute de la hauteur, donc le joueur finit surtout par empiler des bosses. Un geste plus fort pourrait redistribuer le relief : **faire monter ici doit créer un coût ou un creux ailleurs**. Cela produirait naturellement montagnes, vallées, compromis et détournements sans ajouter de bouton.

**Pourquoi maintenant**  
EXP-006/007 montrent que les trajectoires deviennent intéressantes quand la géographie change. Avant d'ajouter feu, danger ou objectif, il faut vérifier que le verbe fondamental de sculpture produit lui-même assez de décisions.

**Prototype minimal envisagé**  
Comparer deux variantes avec les mêmes êtres, eau et graines :

- A — `RAISE_CELL` actuel : cible + voisins montent ;
- B — déplacement de matière : cible monte, anneau proche descend légèrement, somme approximativement conservée.

Aucune nouvelle ressource, aucun nouvel élément, aucun objectif.

**Mesures contrôlées**  
Comparer sur des séquences identiques :
- amplitude et diversité du relief ;
- nombre de changements de trajectoire ;
- fréquence des êtres bloqués dans des minima ;
- capacité à créer volontairement un couloir, une barrière ou un bassin ;
- stabilité du déterminisme.

**Question de test**  
Est-ce que redistribuer le terrain crée plus de compromis et de possibilités avec le même geste, sans rendre la lecture confuse ?

**Décision**  
`NEXT` — prochaine hypothèse active après validation technique de la simulation phasée.
