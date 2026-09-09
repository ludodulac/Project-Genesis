# Current State

## État réel

Genesis est un prototype mobile Phaser + TypeScript où le joueur n'a qu'un verbe : **sculpter le terrain par redistribution locale**.

Le laboratoire a dépassé EXP-008 : EXP-010 à EXP-018 ont testé si ce verbe peut créer des trajectoires, opportunités et compromis sans ajouter de commandes.

## Version jouable actuelle
- plateau orthogonal 20 × 12 ;
- relief déterministe avec volume visuel ;
- toucher une cellule la relève en drainant ses voisines ;
- hauteur moyenne approximativement conservée ;
- trois êtres autonomes avec destinations visibles ;
- déplacement déterministe et simultané ;
- relief trop abrupt = passage impossible, détour possible ;
- sources visibles donnant de l'eau au passage ;
- graines transformées en bloom par un porteur d'eau ;
- bloom qui relève sa cellule ;
- simulation indépendante du rendu ;
- invariance à l'ordre interne des agents testée ;
- CI, build Vite et GitHub Pages.

## Ce que le laboratoire a réellement appris

### Conservé
**EXP-008 — redistribution** : meilleur candidat actuel pour le verbe, car relever une cellule abaisse ses voisines et crée naturellement des échanges spatiaux.

**EXP-010 — détour** : le relief peut modifier une trajectoire sans commander directement l'être.

**EXP-014/015 — conséquences futures** : une route peut collecter de l'eau, produire une croissance, puis cette croissance peut modifier la route d'un autre être.

**EXP-017/018 — compromis** : deux gestes sur un même état peuvent favoriser des intérêts incompatibles, et le motif survit à plusieurs translations et à un miroir horizontal.

### Abandonné
**EXP-013** : premier faux compromis ; B n'était en réalité pas gêné.

**EXP-016** : une croissance ne redirige pas automatiquement un autre être vers une opportunité intéressante. Ne pas forcer cette réciprocité.

## Hypothèse active — EXP-019

Le compromis robuste est maintenant porté dans la géographie initiale du plateau plutôt que laissé uniquement dans les tests.

Situation recherchée :

`A a une porte légèrement trop haute`

à côté de

`B a une source sur sa route directe`

Toucher la source :
- relève la source ;
- abaisse la porte voisine par redistribution ;
- peut ouvrir le passage direct de A ;
- peut fermer la collecte directe de B.

Aucune nouvelle règle et aucune nouvelle commande n'ont été ajoutées pour créer ce dilemme.

## Statut de confiance

**Prouvé automatiquement** : déterminisme, conservation approximative de matière, chaîne eau→croissance, croissance→coût de route, compromis local, robustesse du compromis sur plusieurs géométries.

**Non prouvé** : plaisir, compréhension spontanée, capacité à anticiper avant le toucher, désir de rejouer.

## Prochain test humain

Une seule question est désormais prioritaire sur téléphone :

> Sans explication, vois-tu qu'en touchant certaines cases tu peux aider un petit être tout en changeant ce qui arrive à un autre ?

Si oui, approfondir une séquence de 2–3 décisions liées. Si non, ne pas ajouter de mécanique : améliorer la lisibilité ou simplifier les êtres.

## Toujours volontairement absent
Feu, combat, ennemi, score, progression, nouvelle commande, deuxième ressource complexe, backend, comptes, multijoueur, boutique, cartes et grosse infrastructure.
