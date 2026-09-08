# Project Principles

## Mission
Créer un petit monde tactile qui soit déjà plaisant à manipuler avant d'être chargé de systèmes de jeu.

## Invariants

1. **Le monde est une donnée.** Le plateau et ses entités doivent pouvoir être décrits, sérialisés et reproduits.
2. **La simulation est séparée du rendu.** Phaser ne porte pas la vérité métier du jeu.
3. **Le joueur émet des intentions.** Une interaction produit une action (`RaiseCell`, etc.) ; seule la simulation modifie l'état canonique.
4. **Même état + même action = même résultat**, autant que possible. Préserver le déterminisme pour tests, replays, bots et éventuel réseau futur.
5. **Une animation n'est jamais une règle.** Le rendu observe les changements d'état et les événements de simulation.
6. **Les expériences sont jetables ; les fondations ne le sont pas.** Une idée reste dans le laboratoire jusqu'à ce qu'elle mérite d'entrer dans le moteur.
7. **Ajouter avant de réécrire.** Une expérience locale ne justifie pas un refactor transversal.
8. **Pas de complexité hypothétique.** Pas de backend, comptes, boutique, multijoueur, progression ou infrastructure lourde avant qu'un besoin réel ne les déclenche.
9. **Le game feel commence au prototype 1.** Toucher, mouvement, timing et feedback ne sont pas une couche cosmétique réservée à la fin.
10. **Implemented ≠ verified ≠ fun.** Une mécanique codée n'est ni prouvée correcte ni prouvée agréable.
11. **Un échec expérimental produit de la connaissance.** Documenter ce qui a été essayé et ce qui a été appris.
12. **Préparer une évolution signifie préserver ses frontières, pas construire cette évolution maintenant.**

## Frontière fondamentale

`ACTION → SIMULATION → NOUVEL ÉTAT + ÉVÉNEMENTS → PRÉSENTATION`

Aucune interface, animation ou effet sonore ne doit contourner cette chaîne pour modifier directement la vérité du monde.
