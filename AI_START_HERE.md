# AI START HERE

Ce fichier est le routeur de reprise du projet. Il n'est pas une nouvelle source de vérité.

## Avant de modifier

1. Vérifier le vrai dépôt, la branche `main`, les commits récents, PR/issues éventuelles et l'état réellement déployé.
2. Lire `PROJECT_PRINCIPLES.md`.
3. Lire `docs/CURRENT_STATE.md`.
4. Lire uniquement la documentation pertinente à la zone touchée.
5. Inspecter le code réel avant de proposer une architecture ou une correction.
6. Distinguer moteur retenu, expérience de laboratoire, idée garée et ancien essai.
7. Identifier la source de vérité affectée.
8. Chercher la plus petite modification cohérente et réversible.
9. Valider au niveau proportionnel au risque.

## Hiérarchie de vérité

1. Comportement réel : code + tests + état déployé.
2. Invariants : `PROJECT_PRINCIPLES.md`.
3. Architecture : `docs/ARCHITECTURE.md`.
4. État opérationnel : `docs/CURRENT_STATE.md`.
5. Mécaniques retenues : `docs/GAMEPLAY.md`.
6. Expériences et apprentissages : `docs/LAB.md`.
7. Idées non engagées : `docs/PARKED_IDEAS.md`.

## Mode laboratoire autonome

Genesis doit progresser comme un laboratoire autonome de game design. L'IA ne s'arrête pas après chaque petite expérience pour demander quoi faire ensuite.

Boucle canonique :

`hypothèse → prototype minimal → test → observation → décision → conservation/abandon → expérience suivante`

L'IA peut inventer, implémenter, tester, comparer, simplifier, abandonner et combiner des expériences tant que les changements restent réversibles et que les fondations solides ne sont pas sacrifiées.

À chaque boucle, la question principale est : **cette règle crée-t-elle une sensation, une décision, une anticipation, une surprise ou une interaction réellement intéressante ?**

Une mécanique techniquement correcte mais sans intérêt de jeu doit pouvoir être supprimée. Une petite interaction très forte doit être approfondie avant d'ajouter de nouvelles couches.

EXP-XXX n'est jamais le jeu. Une expérience peut être promue, partiellement conservée, parkée ou abandonnée. Ne jamais transformer une expérience moyenne en architecture permanente.

### Chercher l'émergence

Favoriser les règles simples dont les interactions produisent davantage de situations intéressantes que ce qui a été explicitement scripté. Chercher notamment :

- réactions en chaîne ;
- conséquences anticipables mais non triviales ;
- compromis ;
- détournements intelligents du terrain ;
- interactions entre plusieurs règles simples ;
- comportements émergents ;
- moments visuellement forts ;
- découvertes que le joueur comprend sans tutoriel explicite ;
- situations donnant envie de recommencer immédiatement.

Le but est de trouver un **verbe de jeu extrêmement fort**, puis quelques systèmes qui le multiplient. Pas cinquante mécaniques moyennes.

### Autonomie autorisée

L'IA peut enchaîner plusieurs expériences sans solliciter l'utilisateur tant qu'elle :

- ne détruit pas une fondation solide ;
- ne transforme pas une hypothèse en vérité sans test ;
- n'ajoute pas prématurément backend, comptes, multijoueur, boutique ou grosse infrastructure ;
- garde les expériences réversibles ;
- documente ce qui est essayé, appris, abandonné, promu et encore incertain.

Si une question nécessite réellement un ressenti humain sur téléphone, préparer une version claire et demander seulement une ou deux observations précises.

### Tests : vérité ≠ fun

Les tests automatisés servent à vérifier : déterminisme, transitions d'état, règles, invariants et absence de régression.

Ils ne servent pas à prouver qu'une mécanique est amusante.

Pour le game design, utiliser aussi : scénarios contrôlés, simulations reproductibles, comparaison de variantes, instrumentation légère et observation du comportement. Ne demander un test humain que lorsqu'il apporte une information impossible à obtenir autrement.

### Trace obligatoire

À tout moment, le dépôt doit permettre de retrouver clairement :

- **CE QUI A ÉTÉ TESTÉ** — expériences réalisées ;
- **CE QUI A ÉTÉ APPRIS** — forces et faiblesses observées ;
- **CE QUI A ÉTÉ ABANDONNÉ** — et pourquoi ;
- **CE QUI A ÉTÉ PROMU** — mécaniques entrées dans `GAMEPLAY.md` ;
- **ÉTAT ACTUEL** — comportement réellement disponible ;
- **PROCHAINE HYPOTHÈSE** — ce que la prochaine boucle cherche à apprendre.

## Règle de recherche

Avant d'inventer une solution technique non triviale, rechercher les références pertinentes (documentation officielle, exemples Phaser, techniques éprouvées, projets open source compatibles), puis adapter la solution à nos frontières plutôt que copier une architecture entière.

Une référence externe est une source d'inspiration, jamais automatiquement une dépendance ni une règle du projet.

Pour le game design, utiliser les jeux existants comme preuves qu'une famille de décisions ou d'interactions peut fonctionner, sans recopier leur surface. Chercher la logique transférable : information, rythme, compromis, lisibilité, émergence, feedback et coût d'une décision.

## Avant de terminer une session

- vérifier ce qui fonctionne réellement ;
- distinguer fait, hypothèse et ressenti ;
- inscrire les mécaniques conservées dans `GAMEPLAY.md` ;
- inscrire les expériences dans `LAB.md` ;
- mettre `CURRENT_STATE.md` à jour si l'état opérationnel a changé ;
- transformer une régression reproductible importante en test/sentinelle lorsque raisonnable ;
- signaler explicitement ce qui n'a pas été vérifié ;
- laisser une prochaine hypothèse claire, pas seulement une prochaine tâche technique.

Test final : une nouvelle conversation sans contexte doit pouvoir lire ce fichier, vérifier le dépôt réel et reprendre la recherche sans reconstruire l'histoire orale du projet.
