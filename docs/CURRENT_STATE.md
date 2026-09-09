# Current State

## État réel

Le dépôt contient maintenant le prototype Genesis EXP-006 — **Diriger le vivant**.

### Présent
- vision Genesis et principes d'architecture définis ;
- runtime Phaser 4 + TypeScript + Vite ;
- état du monde sérialisable ;
- simulation séparée du rendu ;
- action canonique unique `RAISE_CELL` ;
- plateau orthogonal de 20 × 12 cellules ;
- grille carrée alignée horizontalement/verticalement ;
- terrain qui occupe presque tout l'écran et dépasse latéralement le viewport ;
- petite marche visible au bord inférieur pour suggérer l'épaisseur et la limite du monde ;
- relief déterministe, sans génération aléatoire ;
- réaction douce des cellules voisines à une élévation ;
- trois petits êtres autonomes ;
- déplacement déterministe d'une case vers le voisin clairement le plus bas après chaque action ;
- une source d'eau explicite ;
- un être qui atteint la source transporte l'eau, avec retour visuel ;
- interaction tactile plein écran ;
- tests de simulation pour la déformation, le déplacement et la collecte d'eau ;
- workflow CI + GitHub Pages.

### Expérience active

**EXP-006 — Diriger le vivant**

Question : **est-ce que déformer le monde suffit à créer des décisions compréhensibles sur les trajectoires de plusieurs êtres ?**

Le test cherche notamment le moment où le joueur commence à anticiper : « si je soulève cette case, cet être va probablement descendre par là ».

### À vérifier sur téléphone
- lisibilité de la grille orthogonale plein écran ;
- sensation de monde plus vaste grâce aux bords hors champ et à la petite marche ;
- plaisir tactile du relief ;
- compréhension spontanée du déplacement des trois êtres ;
- lisibilité de la source d'eau ;
- satisfaction lorsqu'un être récupère l'eau ;
- apparition ou non de décisions intéressantes avec une seule action.

### Absent volontairement
- feu ;
- végétation ;
- combinaison d'éléments ;
- combat ;
- adversaire ;
- condition de victoire ;
- score ;
- backend ;
- comptes ;
- multijoueur ;
- progression ;
- boutique ;
- cartes ;
- assets définitifs.

## Ordre de recherche

Le projet suit actuellement cette chaîne :

`terrain → mouvement → transport → interaction → objectif → adversaire`

Une couche n'est ajoutée que lorsque la précédente produit une sensation ou une décision suffisamment intéressante pour justifier la suivante.

## Critère de réussite actuel

Le prototype n'a pas besoin d'être un jeu complet. Il réussit si, en quelques interactions, le joueur comprend qu'il **ne déplace pas directement les êtres : il sculpte leur monde pour influencer ce qu'ils vont faire**.
