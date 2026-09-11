# Réouverture — premier geste, deuxième geste — septembre 2026

## Point de départ humain

EXP-033 testait une hypothèse issue de la bifurcation « aventure de micro-systèmes » : un élément persistant pouvait-il donner envie de traverser plusieurs interactions courtes qui, isolément, ne porteraient pas un jeu entier ?

Observation humaine : le joueur clique sur les éléments rouges, constate qu'ils disparaissent, puis dit qu'il n'a pas spontanément envie de continuer. S'il n'avait pas été informé qu'une suite existait, il se serait arrêté là.

Décision : **DROP EXP-033**. Une continuité externe ne transforme pas automatiquement des interactions faibles en envie de poursuivre. Le défaut est antérieur à la profondeur, au système de progression ou à la variété : la première situation ne produit pas assez d'élan pour susciter le geste suivant.

Cette observation ouvre une question, pas une doctrine : **qu'est-ce qui provoque spontanément un premier geste puis un deuxième ?**

## Recherche externe

La recherche croise histoire du jeu, jouets numériques, jeux mobiles/indés, game jams 2026, critiques de joueurs et travaux sur la motivation.

### 1. Action expressive / monde qui répond bien
Townscaper est un cas pur : un clic produit immédiatement une forme jolie et cohérente, puis les placements suivants recomposent les voisins. L'absence de but n'empêche pas l'expérimentation pour certains joueurs. Mais les critiques convergent aussi sur la limite : pour d'autres, la nouveauté se fane vite faute d'objectif ou de profondeur.

Signal : **chaque geste peut être sa propre récompense et fabriquer un nouvel espace d'expression**.
Contre-signal Genesis : relief tactile, trajectoire et cascade ont déjà montré que sensation/feedback seuls peuvent être agréables mais s'épuiser très vite.

### 2. But ou obstacle immédiatement lisible
Super Mario Bros. 1-1 place très tôt un obstacle qui rend la direction et le besoin d'agir perceptibles sans exposition. Journey donne une destination globale extrêmement simple : aller vers la montagne. Monument Valley expose une destination et des pièces manipulables dont la fonction se découvre par interaction.

Signal : **le joueur agit parce qu'une tension visible existe déjà avant le geste**.
Contre-signal : un objectif lisible peut produire de l'obéissance sans plaisir ; il ne prouve pas que le verbe mérite d'être répété.

### 3. Augmentation visible du pouvoir d'agir
Katamari Damacy relie directement action et capacité : ramasser de petites choses agrandit le katamari, ce qui rend progressivement accessibles des objets auparavant impossibles à prendre. Les critiques décrivent souvent un objet trop gros comme un objectif personnel immédiat : grossir suffisamment puis revenir le prendre. Le postmortem de Keita Takahashi montre toutefois que cette croissance n'était pas automatiquement suffisante : l'équipe a finalement gardé des limites de temps, et le créateur juge que le sentiment de changement d'échelle aurait pu être encore mieux exprimé.

Donut County et Hole.io reprennent une structure similaire : absorber du petit → grandir → absorber plus grand. Le plaisir de croissance est souvent cité, mais Donut County est aussi critiqué pour répétitivité et manque de profondeur.

Signal : **le premier succès ne donne pas seulement une récompense ; il change ce qui devient possible au deuxième geste**.
Contre-signal : la croissance peut devenir une routine monotone et nécessiter du contenu, de la pression ou des objectifs pour durer.

### 4. Construction inachevée / conséquence pendante
World of Goo fait naître l'action suivante d'une structure encore incomplète : chaque placement modifie ce qui tient, ce qui menace de tomber et ce qui peut atteindre la sortie. La manipulation est directe et tactile, mais les joueurs critiquent les moments où l'interface ou la physique leur font perdre l'attribution causale.

Signal : **le premier geste fabrique un problème ou une forme visiblement inachevée qui appelle le second**.
Contre-signal Genesis : EXP-027 et EXP-031 ont montré que persistance ou futur modifié ne suffisent pas quand la raison d'agir n'est pas immédiatement lisible.

### 5. Curiosité causale
EXP-028 a déjà produit ce signal humainement : agir, observer, former une hypothèse, retester. Monument Valley exploite également ce plaisir de transformation compréhensible et surprenante.

Signal : **le deuxième geste teste une hypothèse née du premier**.
Contre-signal Genesis : EXP-029 et EXP-030 ont montré que cette curiosité s'épuise vite si l'apprentissage ne transforme pas suffisamment la situation.

### 6. Enjeu social, narratif ou affectif
Des jeux de jam 2026 montrent qu'une situation forte, un personnage ou un ton peuvent donner immédiatement une raison de cliquer et porter des mécaniques simples. Les commentaires sur certains jeux à mini-épreuves louent explicitement l'atmosphère ou la relation à un adversaire fictif comme source d'engagement.

Signal : **on agit parce que quelque chose ou quelqu'un compte déjà avant la maîtrise du système**.
Contre-signal : fort coût de contenu, risque de masquer une mécanique faible, faible valeur d'information pour identifier le cœur systémique de Genesis.

## Travaux pertinents

Les modèles issus de la théorie de l'autodétermination appliqués aux jeux relient l'engagement à la satisfaction de besoins de compétence, autonomie et relation. Ils n'impliquent pas qu'un seul de ces facteurs suffise au tout premier geste, mais ils fournissent un filtre utile : un système qui donne peu de contrôle ou peu d'effet lisible a moins de chances d'entretenir une motivation autonome.

Les travaux récents sur la curiosité indiquent aussi qu'elle n'est pas un moteur uniforme : différentes formes de curiosité prédisent des préférences différentes. Genesis ne doit donc plus traiter « curiosité » comme une substance générale que l'on peut simplement augmenter.

## Comparaison après EXP-033

| Explication | Déjà partiellement testée dans Genesis | Peut expliquer le 1er geste | Peut expliquer le 2e geste | Coût d'un kill test | Valeur d'information |
|---|---:|---:|---:|---:|---:|
| réponse expressive / toy | oui, fortement | 5 | 2–3 | 5 | 2 |
| but/obstacle visible | peu | 5 | 4 | 5 | 4 |
| **pouvoir d'agir qui augmente** | **non** | 4 | **5** | **5** | **5** |
| construction inachevée | partiellement | 4 | 5 | 3 | 4 |
| curiosité causale | oui, fortement | 4 | 4 puis chute | 5 | 2 |
| enjeu narratif/social | non | 5 | 4 | 2 | 3 |

## Décision de recherche

Le prochain pari n'est ni « attraction intrinsèque » comme doctrine, ni « faire Katamari ». Le discriminant le plus informatif actuellement est :

> **un premier succès très simple provoque-t-il spontanément un deuxième geste lorsqu'il augmente visiblement le pouvoir d'agir et rapproche un objet qui était auparavant hors de portée ?**

Pourquoi ce pari :
- il teste un mécanisme motivationnel encore absent du laboratoire Genesis ;
- le but local peut être perceptible sans règle secrète ;
- le deuxième geste découle directement du changement produit par le premier ;
- il ne nécessite ni score, histoire, niveau, monnaie, adversaire ni tutoriel ;
- les précédents externes sont assez forts pour justifier le test mais assez contradictoires pour qu'un résultat négatif soit très informatif.

## Kill test minimal

Un petit monde tactile. Un acteur absorbant ne peut prendre que ce qui est plus petit que lui. Quelques petites choses sont immédiatement accessibles ; au moins une chose visiblement trop grande est présente dès le début. Chaque absorption agrandit immédiatement l'acteur. Aucun score, timer, texte stratégique, danger ou progression externe.

Le pari survit seulement si le joueur, après une ou deux absorptions, **cherche spontanément une nouvelle cible parce qu'il perçoit que son pouvoir a changé**, idéalement en revenant vers une cible auparavant impossible.

Si le joueur décrit seulement « je mange des trucs », clique au hasard, ou cesse rapidement sans vouloir atteindre quelque chose de plus gros : `DROP` sans enrichissement.
