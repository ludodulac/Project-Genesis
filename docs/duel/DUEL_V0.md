# DUEL — laboratoire V0

## Statut
Branche expérimentale. DUEL est séparé de PETIT MONDE / Living Watershed et ne remplace aucun candidat existant de Genesis.

## Hypothèse falsifiable
> Deux joueurs disposant d’un vocabulaire mécanique minuscule commencent-ils à lire, conditionner et tromper l’autre humain grâce à la position, l’énergie et un cycle événementiel public ?

Le laboratoire ne teste ni contenu, ni progression, ni roster, ni monétisation, ni qualité commerciale.

## Architecture testée
**Plancher d’agence + cycle événementiel public.**

- deux combattants strictement identiques ;
- arène horizontale discrète de 7 positions ;
- bords dangereux ;
- 3 fondamentaux permanents ;
- 6 techniques avancées connues ;
- 3 techniques avancées actives simultanément ;
- 1 technique NEXT publique ;
- cycle déterministe : une technique jouée sort, NEXT entre, la technique utilisée rejoint la fin de la file ;
- aucun shuffle ;
- aucun cooldown chronométrique ;
- énergie 0–5 ;
- choix simultanés cachés jusqu’à la résolution ;
- résolution courte.

## Fondamentaux
### PRESS
Effet immédiat : avance d’une case et exerce une pression faible au contact.
Coût : aucun.
Géographie : gagne du terrain ; modeste contre une défense préparée.
Futur : ne touche pas au cycle.
Information : montre une volonté d’avancer sans engager une technique premium.
Bait : peut provoquer INTERCEPT ou REVERSAL sans sacrifier de technique avancée.

### BRACE
Effet immédiat : tient la position et réduit une poussée reçue.
Coût : aucun.
Géographie : utile quand céder une case est dangereux ; vulnérable à BREAK.
Futur : ne touche pas au cycle.
Information : révèle une préférence pour la conservation plutôt que l’initiative.
Bait : invite l’adversaire à risquer BREAK.

### RETREAT
Effet immédiat : recule d’une case.
Coût : du territoire.
Géographie : excellent loin du bord, de plus en plus mauvais près du bord.
Futur : conserve toutes les techniques mais dégrade la position future.
Information : montre qu’une option premium a été préservée au prix de l’espace.
Bait : l’adversaire peut avancer pour rendre les futurs retraits plus coûteux.

## Techniques avancées
### RUSH — prise de terrain
Effet immédiat : avance jusqu’à deux cases et pousse fortement au contact.
Coût : 2 énergie + sortie du cycle actif.
Géographie : forte à moyenne distance ; mauvaise contre INTERCEPT/REVERSAL.
Futur : retire une menace d’engagement rapide pendant plusieurs usages avancés.
Information : l’adversaire sait que RUSH est absente et que le prochain slot a changé.
Bait : provoquer RUSH ouvre une fenêtre où l’adversaire ne peut plus reprendre autant de terrain d’un coup.

### INTERCEPT — interception
Effet immédiat : si l’adversaire entre avec PRESS ou RUSH à portée, son engagement est annulé et il est repoussé.
Coût : 2 énergie + sortie du cycle.
Géographie : forte contre une entrée lisible ; inutile si l’autre n’avance pas ou utilise BREAK.
Futur : son absence rend les prises de terrain adverses plus crédibles.
Information : l’adversaire sait qu’une réponse anti-entrée majeure vient d’être dépensée.
Bait : feindre ou retarder l’entrée peut faire sortir INTERCEPT sans bénéfice.

### REVERSAL — renversement premium
Effet immédiat : punit fortement une frappe engagée à courte portée.
Coût : 3 énergie + sortie du cycle.
Géographie : très forte quand l’adversaire attaque près ; perd contre BREAK ou l’inaction.
Futur : crée volontairement la plus grosse fenêtre de vulnérabilité du prototype.
Information : son absence est publique et doit immédiatement modifier la lecture du prochain échange.
Bait : c’est la technique principale que l’adversaire veut forcer avant d’attaquer franchement.

### BREAK — ouverture
Effet immédiat : avance d’une case et devient très forte contre BRACE, INTERCEPT ou REVERSAL non déclenchés.
Coût : 2 énergie + sortie du cycle.
Géographie : forte contre l’attente défensive à courte/moyenne distance ; plus faible contre une attaque active.
Futur : son absence rend une défense conservatrice plus confortable.
Information : révèle que le joueur était prêt à appeler une réaction défensive.
Bait : un adversaire actif peut pousser BREAK à être dépensée dans un mauvais échange.

### FADE — décrochage premium
Effet immédiat : recule rapidement de deux cases.
Coût : 1 énergie + beaucoup de territoire + sortie du cycle.
Géographie : forte au centre ; catastrophique ou impossible à rentabiliser près du bord.
Futur : préserve le corps mais peut créer une future situation territoriale très mauvaise.
Information : l’adversaire sait qu’une grosse option d’évasion n’est plus disponible.
Bait : la pression territoriale peut forcer FADE avant une attaque plus sérieuse.

### DRIVE — poussée de bord
Effet immédiat : poussée très forte, uniquement au contact.
Coût : 3 énergie + sortie du cycle.
Géographie : faible loin ; menace décisive quand l’adversaire est déjà près du bord.
Futur : une fois dépensée, l’adversaire peut accepter momentanément davantage de proximité.
Information : révèle qu’une condition de victoire immédiate vient d’être consommée.
Bait : RETREAT ou REVERSAL peuvent faire gaspiller DRIVE.

## Pourquoi le cycle n’est pas « à vide »
Aucune technique avancée ne fait uniquement progresser la file. Toutes changent au moins un des éléments suivants : position, pression, vulnérabilité, coût d’énergie ou information publique. Les fondamentaux ne font jamais tourner la file.

## Énergie
L’énergie est volontairement grossière : maximum 5, les techniques coûtent 1–3, puis 1 point revient après chaque échange. Elle doit seulement créer le dilemme « disponible mais coûteux maintenant » ; si les joueurs parlent plus de mana que de l’adversaire, elle sera simplifiée ou retirée.

## Interface / contrôle
Route : `?game=duel-v0`.

Le laboratoire est paysage. Deux joueurs peuvent partager un écran tactile ou jouer au clavier :
- P1 : Q/W/E = fondamentaux, A/S/D = trois techniques avancées actives ;
- P2 : I/O/P = fondamentaux, J/K/L = trois techniques avancées actives.

Le choix d’un joueur devient simplement `LOCKED` jusqu’au choix adverse. Les deux actions sont révélées ensemble.

## Protocole humain
Observer les matchs 1, 5, 10 et 20 entre les mêmes deux joueurs.

### CONTINUE
- conservation volontaire d’une technique ;
- bait d’une technique adverse ;
- exploitation consciente de son absence ;
- mauvaise position acceptée pour préserver une option ;
- habitudes identifiées puis volontairement brisées ;
- revanche immédiate avec une intention différente.

Signal très fort : « Je savais qu’il savait que je n’avais plus X. »

### PIVOT
Les joueurs parlent surtout de rotation optimale, ordre de cycle, icônes ou solution mathématique d’un état.

### STOP
- cycle à vide ;
- identité de l’adversaire peu importante ;
- disparition d’une technique sans vraie vulnérabilité ;
- HUD regardé davantage que le combattant ;
- décisions essentiellement calculatoires ;
- pas de rematch motivé par « cette fois je vais… ».

## Ce que les tests automatisés peuvent prouver
Déterminisme, ordre de cycle, coût d’énergie, permanence des fondamentaux et conséquence territoriale.

Ils ne peuvent pas prouver le mindgame. Le verdict principal reste humain.
