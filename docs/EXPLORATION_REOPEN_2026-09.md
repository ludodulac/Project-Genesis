# Réouverture large — septembre 2026

EXP-030 clôt l'approfondissement local de la branche cascade/découverte. Ce document ne cherche pas la mutation suivante : il remet plusieurs sources de plaisir réellement concurrentes en compétition avant tout nouveau prototype.

## Sources externes consultées

Le scan croise jeux mobiles/indés, critiques, retours de joueurs et game jams récents. Exemples principaux : Threes, Suika Game, Poinpy, Downwell, Vampire Survivors, Luck Be a Landlord, Mini Metro, Universal Paperclips, ainsi que les résultats et commentaires du GMTK Game Jam 2026 (notamment BombIt, FFFind15, Countronome et last mile).

Régularités observées :
- un contrôle simple ne suffit pas ; les jeux durables renouvellent la décision par espace limité, risque choisi, build, pression, réseau ou transformation de système ;
- un feedback satisfaisant peut attirer mais s'épuise sans intention ;
- les systèmes qui retirent trop d'agence produisent rapidement frustration ou sentiment d'injustice ;
- la génération aléatoire aide seulement si le joueur peut lire et répondre à ce qu'elle produit ;
- plusieurs jeux très simples obtiennent leur profondeur parce qu'une action locale ou globale modifie plusieurs futurs à la fois ;
- l'augmentation de puissance ou l'automatisation est très satisfaisante lorsqu'elle transforme qualitativement l'activité, mais elle exige vite du contenu et de l'équilibrage.

## Apprentissage Genesis à confronter, sans en faire des contraintes

- relief tactile : causalité prédictible acquise, pas jeu imposé ;
- trajectoire analogique : plaisir réel mais épuisement rapide sans autre source d'intention ;
- danger sans moyen perçu d'influencer : frustration ;
- cascade : spectacle plaisant mais pas de raison spontanée d'agir ;
- curiosité causale : réelle, puis épuisement quand on répète le même système ;
- découverte d'une exception : n'a pas suffi à renouveler l'intérêt.

## Six paris concurrents

### P1 — Pression spatiale globale
**Observation externe.** Threes obtient beaucoup de profondeur d'un geste qui déplace tout le plateau, dans un espace 4×4 où chaque mouvement libère et condamne des positions. Suika montre une autre variante : chaque placement irréversible fabrique le problème de plusieurs coups plus tard. Les critiques signalent aussi la limite : le hasard mal télégraphié devient frustration.

**Inférence Genesis.** Nos expériences ont souvent produit une conséquence intéressante mais peu de futur à préserver. Ici, chaque geste doit résoudre quelque chose maintenant tout en modifiant simultanément plusieurs possibilités futures.

**Pourquoi rejouer.** L'échec peut devenir immédiatement attribuable à une décision spatiale antérieure : « j'ai condamné cette zone, je peux faire mieux ».

**Test qui tue vite.** Plateau 4×4, un seul swipe global, flux entrant visible et déterministe, une règle de contact très simple. Aucun score, niveau, upgrade ni texte stratégique. Si le joueur ne commence pas spontanément à préserver de l'espace / anticiper l'entrée après quelques coups, DROP.

### P2 — Risque volontaire et encaissement
**Observation externe.** Downwell devient excitant lorsque la compétence acquise pousse le joueur à prendre volontairement des risques pour prolonger des combos. Les discussions de design sur le risque montrent aussi le piège inverse : si le coût est saillant mais évitable, les joueurs rationnels n'engagent jamais le système.

**Inférence Genesis.** EXP-025 imposait le danger et le joueur se sentait impuissant. La version réellement différente doit laisser une sortie sûre à tout moment et faire du risque une décision auto-sélectionnée.

**Pourquoi rejouer.** « J'aurais pu encaisser, j'ai voulu une action de plus. » Le regret vient d'un choix, pas d'une menace arbitraire.

**Test qui tue vite.** Une séquence de 15–20 s où le joueur peut sécuriser une chaîne ou continuer pour augmenter une récompense visible. Si presque tout le monde encaisse immédiatement ou si l'échec semble imposé, DROP.

### P3 — Réseau vivant réparable
**Observation externe.** Mini Metro crée une forte intention en faisant apparaître de nouvelles demandes qui rendent l'ancien réseau insuffisant. Mais critiques et joueurs signalent aussi répétition et impuissance lorsque les spawns aléatoires deviennent dominants.

**Inférence Genesis.** C'est une famille lente et systémique que nous n'avons pas encore testée humainement. Elle peut créer adaptation et compromis sans réflexes ni découverte secrète.

**Pourquoi rejouer.** Le joueur veut refaire plus proprement un réseau dont il comprend le point de rupture.

**Test qui tue vite.** 5 nœuds, deux flux, tracé/reroutage direct, demandes télégraphiées. Si aucun reroutage volontaire n'apparaît avant la surcharge ou si l'apparition externe domine les décisions, DROP.

### P4 — Métamorphose de système
**Observation externe.** Universal Paperclips et plusieurs incrémentaux récents sont appréciés lorsque l'activité elle-même change : manuel → automatisé → gestion, avec des systèmes qui se remplacent au lieu de seulement gonfler les nombres. Les retours du GMTK 2026 sur last mile citent précisément la transition de petit puzzle vers gestion automatisée comme source de surprise et de satisfaction.

**Inférence Genesis.** EXP-028–030 ont épuisé la découverte à l'intérieur d'un même système. Une vraie transformation de ce que le joueur fait est plus forte qu'une nouvelle exception.

**Pourquoi rejouer.** Curiosité de trajectoire : « jusqu'où cette chose va-t-elle se transformer ? »

**Test qui tue vite.** Trois phases de 20–30 s maximum, chacune changeant l'action principale. Si le plaisir vient seulement de voir la phase suivante sans envie de maîtriser/recommencer, ce pari ne convient pas au cœur de Genesis.

### P5 — Rythme et mémoire corporelle
**Observation externe.** Les jeux de performance peuvent créer une progression personnelle très nette avec presque aucun contenu. Countronome (GMTK 2026) montre qu'un concept extrêmement petit — garder le beat quand le métronome disparaît — peut être jugé engageant, mais son classement d'enjoyment reste moyen : forte dépendance au goût et au polish.

**Inférence Genesis.** Cette famille est radicalement différente des puzzles causaux déjà testés et très peu coûteuse à réfuter.

**Pourquoi rejouer.** Le joueur ressent directement qu'il peut faire mieux avec son propre timing.

**Test qui tue vite.** 20 s, pattern sonore/visuel qui disparaît progressivement, un tap. Si le retry ne vient pas spontanément après échec ou si la latence/polish domine le ressenti, PARK/DROP.

### P6 — Construction combinatoire minimale
**Observation externe.** Luck Be a Landlord, Vampire Survivors et les roguelites mobiles les plus cités tirent leur rejouabilité de combinaisons différentes plutôt que d'un geste complexe. Le danger est immédiat pour Genesis : contenu, texte, équilibrage et UI peuvent exploser avant que la source de plaisir soit isolée.

**Inférence Genesis.** La cascade seule n'avait pas d'intention, mais choisir entre plusieurs pièces qui modifient un petit moteur pourrait faire de la conséquence automatique une récompense d'une décision plutôt qu'un spectacle gratuit.

**Pourquoi rejouer.** « Cette fois je construis autrement. »

**Test qui tue vite.** 6 cases, 3 types de pièces, 2 choix à chaque tour, 8 tours. Si une stratégie domine immédiatement ou si le joueur doit lire des règles/bonus pour comprendre pourquoi choisir, DROP.

## Comparaison par valeur d'information

| Pari | Éloignement des branches testées | Coût du probe | Raison d'agir intrinsèque | Risque de faux positif | Valeur d'information |
|---|---:|---:|---:|---:|---:|
| P1 pression spatiale globale | 5 | 5 | 5 | 2 | **5** |
| P2 risque volontaire | 4 | 4 | 5 | 3 | **5** |
| P3 réseau vivant | 5 | 3 | 4 | 3 | 4 |
| P4 métamorphose | 5 | 2 | 4 | 5 | 3 |
| P5 rythme/mémoire | 5 | 5 | 4 | 4 | 4 |
| P6 combinatoire | 4 | 4 | 5 | 4 | 4 |

## Sélection

**Premier pari : P1 — pression spatiale globale.**

Ce n'est pas une sélection de genre, ni un clone de Threes/Suika. Le discriminant testé est plus abstrait : **un geste global et simple peut-il créer une intention parce qu'il résout le présent tout en fabriquant simultanément le problème futur ?**

Pourquoi lui avant P2 : P1 exige moins de game feel pour être valide et isole mieux une source de décision. Pourquoi avant P3/P4 : le coût et le temps de test sont nettement plus faibles. Pourquoi avant P5 : P5 peut être rejeté pour préférence rythmique sans nous apprendre autant sur le cœur systémique de Genesis. Pourquoi avant P6 : P6 risque de confondre profondeur et quantité de contenu.

Contre-mesures issues des échecs externes :
- aucune entrée cachée ou aléatoire non télégraphiée ;
- pas de danger que le joueur ne peut pas influencer ;
- pas de score ou progression pour fabriquer artificiellement le retry ;
- pas de tutoriel expliquant la stratégie ;
- auto-reset court seulement après saturation.

Le prototype suivant doit rester un instrument de mesure. S'il ne fait pas apparaître rapidement une intention spatiale et un regret lisible après une mauvaise décision, on le tue sans l'enrichir.
