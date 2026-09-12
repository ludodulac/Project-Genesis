# Product Territory Decision — September 2026

## Why this document exists
Genesis has accumulated enough experiment-level evidence. The next decision is not “which primitive deserves EXP-036/037/038?” but “which game-design territory is promising enough to justify building a real game slice?”

EXP-035 is now closed at `PROMOTE-PARTIAL`: editable structure × autonomous process produced a causal relation that the player discovered without tutorial, and the human ablations removed that relation in the expected qualitative ways. What it did **not** prove is replay, depth, variety or a complete game loop.

The visual signal is recorded separately: the player repeatedly likes the tactile, colorful world. Preserve that language where useful, but never treat it as gameplay evidence.

## Product criteria
A territory is credible only if it combines:
1. demonstrated minute-to-minute pleasure in shipped games;
2. depth from interacting systems rather than huge authored content;
3. strong state/situation generation;
4. fast legibility;
5. enough identity to avoid “poor clone” perception;
6. realistic solo+AI production cost;
7. compatibility with actual Genesis human evidence;
8. a believable path from prototype to a complete game.

Hidden costs are treated as first-class constraints: level design, content production, AI/pathfinding, balance, control precision, art, narrative, progression, multiplayer, repetition and technical simulation risk.

---

# Shortlist

| Territory | Minute-to-minute | Systemic depth | Situation generation | Fast entry | Distinct identity | Feasibility | Genesis fit | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A. Tactile systemic world / terrain stewardship | 5 | 5 | 5 | 4 | 5 | 4 | 5 | **33/35** |
| B. Compact deterministic tactics | 4 | 5 | 5 | 4 | 4 | 4 | 3 | **29/35** |
| C. Minimal network / logistics pressure | 4 | 5 | 5 | 4 | 3 | 4 | 4 | **29/35** |
| D. One-thumb multipurpose action arcade | 5 | 4 | 4 | 5 | 4 | 4 | 2 | **28/35** |
| E. Physics construction / systemic puzzle | 4 | 4 | 4 | 3 | 3 | 3 | 3 | **24/35** |

Scores are decision aids, not measurements.

---

# A — Tactile systemic world / terrain stewardship

## Territory
The player directly reshapes a small living structure or terrain. Autonomous processes or beings continuously react to that state. Several interests share the same world, so a transformation that helps one thing can alter another. The resulting state becomes the context for the next decision.

This is **not** “From Dust on mobile”, not a city builder, and not “EXP-035 plus more stuff”. The territory is the causal architecture: direct world transformation → autonomous response → competing consequences → new state → next decision.

## External evidence
- **From Dust** is the strongest proof that directly manipulating terrain while dynamic natural processes and autonomous people react can itself produce satisfying play. Eric Chahi described the malleable simulation as what drove direct terrain interaction, while cyclical natural events created anticipation. Reviews praised creative adaptation and unexpected consequences.
- **Mini Metro / Mini Motorways** prove a smaller and more abstract version of the same architecture: player-authored structure becomes meaningful because autonomous demand continuously tests it. Dinosaur Polo Club explicitly says the original concept became more compelling when players built the network and AI agents navigated it. Procedural growth creates “zen to chaos” without large authored campaigns.
- **Timberborn** shows why coupled environmental systems can generate durable play: water simulation, moisture, terrain, crops and logistics acquire meaning through their interactions rather than in isolation. Its developers explicitly frame the lesson as designing systems to interact so emergent gameplay can arise.
- **Terra Nil** demonstrates both the attraction and the danger of world transformation: players praise the satisfying transformation and procedural landscapes, while negative reviews report that pretty transformation becomes repetitive when generated maps still demand essentially the same strategy.

## Compatibility with Genesis
Very high.
- EXP-023: terrain modification can produce a predictable actor consequence.
- EXP-035: editable structure × autonomous process survived human ablation and was discovered without tutorial.
- Recurrent visual feedback: the player often likes this world language.
- Negative Genesis evidence also helps constrain it: pure manipulation, spectacle, persistence, timing, growth and weak pressure are insufficient.

## Why it could produce a game rather than another toy
The key is **shared state with conflicting uses**. The terrain is not merely a route editor. The same deformation should affect at least two live interests, so the board continually produces locally different problems. A choice is interesting because it changes future options, not because a score says it was good.

A promising generative pattern is:
`one tactile deformation → several autonomous consequences → visible tradeoff → changed terrain/state → next deformation has new value`.

## Main risks / attempted refutation
This is the natural-looking territory, so it needs the strongest attack.

1. **Simulation cost can explode.** From Dust required a sophisticated water/lava/erosion/vegetation simulator. Timberborn’s water alone required custom hybrid simulation and extensive tuning. Genesis cannot afford to discover the game by building fluid dynamics.
2. **Autonomous agents can destroy trust.** From Dust reviews repeatedly identify pathfinding and fine-control failures as major frustration. If the player cannot explain why an agent chose a path, the core fantasy collapses.
3. **Pretty systemic transformation can still be shallow.** Terra Nil criticism is almost a direct warning for Genesis: a visually satisfying ecological transformation can become “I understood the principle; now what?” when procedural maps do not alter the strategy.
4. **Minimalist presentation hides substantial engineering.** Dinosaur Polo Club documents how a prototype-level Mini Metro track system ballooned dramatically in complexity, and explicitly notes that minimalist games are not necessarily simpler to build.
5. **Unbounded sandbox is not enough.** Genesis already has evidence that pleasant manipulation without a locally generated problem does not become a game.

## Production constraint that makes the territory viable
Do **not** simulate continuous fluids, arbitrary physics or general-purpose pathfinding in the first game. Use a small discrete deterministic world with local rules. Every autonomous step must be explainable from visible neighboring state. The depth must come from system interaction, not physical fidelity.

## Hidden costs
- deterministic simulation and visual explanation: medium;
- balancing multiple interests: medium-high;
- procedural situation generation: medium;
- handcrafted level content: low if the system succeeds;
- AI/pathfinding: low only if movement remains local/rule-based;
- art: medium, helped by the already-liked Genesis visual language;
- progression/narrative: optional, not needed for first product proof;
- multiplayer/backend: none.

## Verdict
**RECOMMEND / TEMPORARY PRODUCT LOCK.**

---

# B — Compact deterministic tactics

## Territory
A small board presents fully legible incoming consequences. The player has a tiny action set, but several simultaneous priorities make each turn a sacrifice, redirection or positional tradeoff.

## External evidence
- **Into the Breach** deliberately reduced randomness and made enemy attacks telegraphed so deaths felt attributable. Subset explicitly states that varied goals and priorities — not simply killing enemies — create interesting choices.
- **Hoplite** demonstrates mobile suitability: predictable enemy responses, few actions and generated layouts combine into tactical problems that remain fresh for a meaningful period.

## Compatibility with Genesis
Moderate.
- EXP-023 predictive causality supports readable consequences.
- EXP-025 says threat without perceived agency is bad.
- EXP-031 says global pressure becomes irritating when defeat causality is unclear.
- This territory could fix those issues, but Genesis has not yet shown that the user enjoys deliberate turn-by-turn tactical calculation.

## Main risks
- Easily becomes a puzzle with one dominant answer rather than an expressive system.
- Content/variety pressure can return through enemy types, squads, maps and objectives. Some Into the Breach negative reviews specifically call the experience repetitive once the tactical vocabulary is mastered.
- Strong genre competition and obvious comparisons.
- More cognitively demanding than the tactile immediacy the player has responded to.

## Hidden costs
Enemy vocabulary, scenario generator, balance, UI telegraphing and tactical testing are all substantial. Art can stay light. No multiplayer needed.

## Verdict
**Strong fallback, not first choice.**

---

# C — Minimal network / logistics pressure

## Territory
The player continuously edits a simple network while autonomous demand moves through it. Limited capacity and changing demand turn each edit into an optimization decision.

## External evidence
- **Mini Metro** began as a jam-sized minimal prototype; the developers explicitly chose constraints that minimized production art and allowed procedural levels. The core became “build the map while AI agents navigate it.”
- **Mini Motorways** retains the same systemic structure with growing cities and roads, and the team describes returning to a prototype that was minimal, enjoyable to interact with, and expandable.
- Both demonstrate procedural session generation, rapid onboarding and long-term replay without narrative or massive authored level sets.

## Compatibility with Genesis
High mechanically: EXP-035 is essentially a microscopic validation of structure × autonomous process. But identity risk is severe: moving directly into routes/traffic/stations would make Genesis look derivative.

## Main risks
- Immediate Mini Metro/Motorways comparison.
- Random demand can feel unfair; player feedback on Mini Metro frequently complains that late failures can feel driven by station placement rather than decisions.
- Hidden implementation complexity in routing, agent logic and clean editing.
- Optimization can become frantic maintenance rather than meaningful planning.

## Hidden costs
Pathfinding/agent scheduling, robust editing tools, procedural balancing and state visualization are medium-high. Content cost can remain low.

## Verdict
**Architecturally valuable reference, but reject as product identity.** Borrow the principle, not the surface.

---

# D — One-thumb multipurpose action arcade

## Territory
A single mobile-native action has two or more tightly coupled uses, creating moment-to-moment mastery and risk. The same input changes position, offense/defense, timing or resource state.

## External evidence
- **Downwell** is a canonical proof: gunboots attack and alter aerial movement, and Ojiro Fumoto built the game around exploiting that one key mechanic.
- **Poinpy** began from pull-and-release touchscreen movement, then layered combo structure and authored challenge around a tactile action.
- **Threes** provides a non-action analogue: one swipe moves tiles, merges them and advances the board state; Asher Vollmer explicitly described the value of overloading a verb.

## Compatibility with Genesis
Low-medium.
- Good fit with mobile scope and desire for immediate comprehension.
- But EXP-024 and EXP-032 suggest that trajectory/timing/skill can be recognized yet feel shallow or “bof” for this player.

## Main risks
- Requires exceptional feel and tuning; a merely competent action game is invisible in a crowded market.
- Skill loop may be satisfying but not align with the user’s demonstrated interests.
- Variety often migrates into enemy/content production if the core action does not generate enough situations alone.

## Hidden costs
Control polish and game feel are high; content/enemy design medium-high; balance medium; art can stay modest.

## Verdict
**Do not choose now.** Strong general design pattern, weak Genesis-specific signal.

---

# E — Physics construction / systemic puzzle

## Territory
The player builds or reshapes a persistent structure, then watches a simulation test it. Iteration turns failures into information.

## External evidence
- **World of Goo** and bridge-building games show the strong pleasure of creating something and then watching physics validate or destroy it.
- **Poly Bridge** demonstrates deep solution spaces and shareable emergent constructions.

## Compatibility with Genesis
Moderate. It uses manipulation + consequence, but the self-authored-artifact probe showed that construction alone does not generate intention for this player.

## Main risks
Poly Bridge player feedback is particularly instructive: nondeterministic physics and pixel-level adjustments can destroy the feeling of incremental learning. Later levels also create heavy handcrafted-content and difficulty-curve burdens. Physics puzzles often require a continuous stream of designed challenges or a strong user-generated-content ecosystem.

## Hidden costs
Physics stability, editor UX, level design, testing, tutorialization and difficulty progression are high. Mobile precision is another concern.

## Verdict
**Reject for current product direction.**

---

# Decision

## Choose Territory A now
Genesis should temporarily stop broad primitive exploration and attempt to build a **small tactile systemic world game**.

The decision is not that “terrain is the game”. The selected product thesis is:

> **The player directly reshapes a compact living world. Autonomous processes read the same world state. Because several interests share that state, every useful transformation also changes future possibilities, and the resulting world becomes the next decision.**

This deserves a temporary product lock because three independent lines now converge:

1. **External proof:** From Dust, Mini Metro/Motorways and Timberborn show that editable shared state + autonomous processes + pressure can generate satisfying, replayable systemic play.
2. **Genesis proof:** direct terrain consequence and structure × autonomous process have both survived human tests; pure spectacle/manipulation/growth/timing have not.
3. **Production fit:** if implemented as a discrete deterministic local simulation, this can generate variety from rules instead of hundreds of levels, enemies, cards or narrative assets.

The lock is temporary but meaningful: do not reopen broad exploration merely because the first implementation needs tuning. Reopen only if the **game slice** fails its product-level criteria.

---

# First vertical slice of GAME — not a new isolated primitive

Working label: **Living Watershed** (internal only; not a title commitment).

## Player fantasy
“I reshape this tiny living world so that what lives and moves through it survives — but every change reroutes more than one thing.”

## Session
3–5 minutes, portrait phone, one continuous board, immediate restart.

## World
- compact orthogonal relief board using the established Genesis visual language;
- visible terrain height;
- 2 autonomous processes sharing the same relief;
- no continuous fluid simulation and no opaque global pathfinding;
- all movement determined by local visible rules.

## Candidate interacting processes
Use one beneficial and one dangerous process that both react to the same terrain. Example implementation for the slice:
- small luminous creatures/motes move downhill toward safe groves;
- periodic water/energy pulses also move downhill and can flood/disable those groves or routes;
- the player’s terrain deformation therefore can create a route for creatures while also opening a route for danger.

The exact fiction can change. The required design property is that **the same terrain edit changes at least two meaningful future consequences**.

## Player action
Keep one direct tactile deformation. Prefer the already-legible relief interaction, but make displacement consequential rather than free sculpting. A strong candidate is local redistribution: pressing a cell lowers it while displaced material raises nearby ground according to one deterministic rule. This naturally gives one action two spatial consequences without adding buttons or inventory.

## Game structure
- Start state already contains a visible opportunity/problem; no tutorial screen.
- Autonomous motion begins quickly.
- The player can read the next few local consequences.
- The same board develops over the whole session; edits persist.
- Several arrivals / survival events alter which areas matter next.
- A session ends with a concrete world-state success or failure, not an arbitrary score threshold.
- Restart changes the initial arrangement/sequence enough to require a different plan while using the same rules.

## What makes this a vertical slice rather than EXP-036
It must include the full loop:
`read situation → reshape world → autonomous consequences → new conflicting situation → adapt → success/failure → immediate replay`.

It is allowed to contain a win/loss condition, pacing and a small amount of generated variation because those are part of proving the **game**, not compensatory systems added to rescue a weak mechanic.

It must **not** include:
- meta-progression;
- shop/economy;
- card/loadout system;
- narrative campaign;
- multiple worlds/biomes;
- handcrafted level pack;
- multiplayer;
- generic enemy roster;
- continuous fluid physics;
- elaborate AI/pathfinding.

## Product-level success criteria
The slice deserves continued production only if human play shows most of the following without being told:
1. player understands how a terrain edit changes autonomous behavior;
2. player encounters choices where two plausible edits serve different interests;
3. player changes plan because the previous world state created a new problem/opportunity;
4. at least some failures are attributable and provoke an immediate different plan;
5. a second run produces materially different decisions rather than replaying the same solution;
6. the user describes what they were trying to achieve, not merely what buttons they discovered;
7. the user voluntarily wants another run or begins theorizing about alternate approaches.

## Kill / pivot criteria
Reopen territory selection if, after the vertical slice is coherent and readable:
- the optimal play collapses into the same local rule every run;
- adding a second autonomous interest only adds noise rather than tradeoffs;
- the player still experiences it as a pretty toy/puzzle with one answer;
- variety requires handcrafted levels/content rather than system-generated situations;
- simulation clarity requires so much UI/tutorialization that direct manipulation loses its immediacy.

If it fails for presentation or tuning while the decision structure is alive, iterate the game. If it fails because the shared-state system does not generate different decisions, **then** reopen the territory decision rather than starting an endless micro-probe chain.

---

# Sources consulted
External evidence and counter-evidence included developer interviews/postmortems and player criticism around:
- From Dust — Eric Chahi / Game Developer core design interview; GDC simulation talk; GameSpot review and player reports on AI/control issues.
- Mini Metro / Mini Motorways — Dinosaur Polo Club development posts, IGF interview/postmortem, code-complexity notes, player criticism of randomness/repetition.
- Timberborn — Game Developer deep dive on coupled water/terrain/irrigation systems.
- Into the Breach — Subset Games Road to the IGF interview plus player criticism of repetition/RNG perception.
- Hoplite — Pocket Gamer review of predictable mobile tactics.
- Downwell — Ojiro Fumoto GDC talk on building around one key mechanic.
- Threes — Game Developer analysis/interviews on minimalist design and overloaded swipe.
- Poly Bridge — developer/player discussions on nondeterministic physics and difficulty/level-design frustration.
- Terra Nil — player reviews/discussions showing both satisfying world transformation and the danger of procedural maps that do not change strategy.

Decision date: 2026-09-12.
