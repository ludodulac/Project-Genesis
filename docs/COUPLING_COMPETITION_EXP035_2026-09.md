# Coupling competition before EXP-035 — September 2026

## Method
Genesis no longer asks a naked primitive to carry pleasure, intention, depth, and replay by itself. Candidates here are minimal interactions between properties. A coupling survives only if removing one property qualitatively changes the experience rather than merely making it less polished.

Each candidate is compared on: external evidence, Genesis inference, counter-evidence, clean ablations, solo cost, and discriminant human behavior.

## Candidate A — Predictable threat × conflicting priorities
External basis: Into the Breach made telegraphed attacks central and used civilian buildings / varied objectives to create decisions beyond simply killing enemies. The design team explicitly describes interesting choices arising from varied goals and priorities.

Genesis inference: EXP-023 proved that a local physical consequence can be predicted; EXP-025 showed that threat without perceived agency becomes frustration.

Counter-evidence: this coupling needs several values to matter simultaneously. A tiny probe risks becoming either obvious rescue-the-target obedience or another unreadable pressure system like EXP-031.

Ablations:
- predictable threat without conflicting values -> mostly straightforward prevention;
- conflicting values without reliable prediction -> guessing/frustration;
- coupled -> sacrifice / prioritization should appear.

Cost: medium-high for a clean probe because at least two genuinely competing values must be legible.

Human discriminant: player verbalizes a trade-off before acting (e.g. chooses to let one thing go to preserve another).

Status: strong, but not first.

## Candidate B — One action × two mechanically useful consequences
External basis: Downwell's gunboots simultaneously attack and alter aerial movement; the designer identified the mechanic as promising precisely because the same input served multiple gameplay purposes. SUPERHOT similarly couples movement to time progression, changing the meaning of ordinary movement.

Genesis inference: mobile constraints make multi-purpose input attractive; however EXP-024 and EXP-032 warn that skill/timing can be briefly fun without creating a durable decision system.

Counter-evidence: if the two effects merely happen together rather than constraining one another, this becomes a gimmick. Copying recoil, time-stop, or another known surface would also test familiarity rather than the coupling principle.

Ablations:
- consequence A only;
- consequence B only;
- coupled action.

Cost: low-medium, but inventing a non-derivative instantiation with obvious causality is the hard part.

Human discriminant: player times or aims one action specifically because they are considering both consequences at once.

Status: very strong runner-up.

## Candidate C — Tactical choice × rhythm deadline
External basis: Crypt of the NecroDancer converts turn-based tactical choice into beat-limited choice; its creator reports that predictable enemy patterns were required because the beat reduced thinking time. Reviews confirm that the rhythm makes otherwise methodical positioning feel qualitatively different.

Genesis inference: would test an interaction not derived from the relief/cascade lineage.

Counter-evidence: rhythm itself is a strong taste/skill filter. The creator removed strict timing accuracy because it created frustration, and reviews still report the coupling can overwhelm players. EXP-032 already produced a weak result around timing skill.

Ablations:
- tactical grid with unlimited time;
- beat without spatial decisions;
- coupled.

Cost: medium.

Human discriminant: player anticipates enemy patterns while maintaining rhythm, rather than merely following the beat.

Status: PARK for later; too confounded for the next human test.

## Candidate D — Exploration/information × shared resource consequence
External basis: Desktop Dungeons turns unrevealed space into a resource: exploring restores the player but also regenerates wounded monsters. The same act reveals information, heals, and changes combat math.

Genesis inference: genuinely new relative to most local probes; it creates contextual value from an otherwise ordinary movement action.

Counter-evidence: the coupling becomes interesting only after health, enemy level, combat and regeneration are understood. A minimal probe risks testing arithmetic comprehension rather than play.

Ablations:
- exploration reveals only;
- regeneration/resource effect without hidden space;
- coupled.

Cost: medium-high due to required state legibility.

Human discriminant: player deliberately preserves or spends unexplored space because of a future fight.

Status: high-value future family, poor immediate probe.

## Candidate E — Editable structure × autonomous process
External basis: Mini Metro makes player-authored topology meaningful because autonomous passenger demand continuously tests it; route editing without demand would be drawing, while demand without editable topology would be observation. Related systemic games use the same broad pattern: a persistent structure acquires meaning when an autonomous process runs through it.

Genesis inference: this directly addresses the EXP-034 distinction without trying to rescue that exact toy. Manipulation can remain pleasant, but now the world supplies consequences that can make one shape better for a locally visible situation. It also does not require that the player invent an objective from nothing.

Counter-evidence: Mini Metro reviews note that uncontrolled/random demand can make failure feel unfair; construction/physics games become trial-and-error when causality is opaque. Therefore the process in the probe must be deterministic, local, and visually attributable.

Ablations (defined before construction):
1. EDIT-ONLY — structure remains manipulable, autonomous process disabled. Expected: toy/manipulation, no anticipatory correction.
2. FLOW-ONLY — autonomous process runs through a fixed structure, editing disabled. Expected: spectator/observation, no agency.
3. COUPLED — same structure is editable and the autonomous process responds to it. Required qualitative novelty: player edits in anticipation of where the process will go, or corrects a specific cause after observing it.

Cost: low if expressed with one deformable field, one autonomous mote, one visible destination, no score/economy/content.

Human discriminant: not click count or completion. Strong evidence is anticipatory or corrective intent tied to causality: the player changes a specific part because they expect the autonomous mote to behave differently next. Negative evidence is random manipulation, waiting, or treating the moving thing as spectacle.

Status: SELECT for EXP-035.

## Why E wins
It does not win because it reuses Genesis relief. It wins because:
- external precedent demonstrates the multiplication clearly;
- its two ablations are unusually clean;
- the full interaction can be tested with one gesture and one autonomous process;
- the negative result remains informative;
- it fits mobile and solo constraints without content, UI, progression, rewards or tutorial;
- it tests a methodological claim: whether two individually insufficient properties can create a qualitatively new loop when they causally constrain each other.

Implementation may reuse the already human-readable relief language as a cheap presentation substrate, but relief is not the hypothesis. The hypothesis is `editable structure × autonomous consequence`.

## EXP-035 build contract
Full probe:
- one small deformable field;
- one hollow mote;
- one visible destination;
- the mote advances autonomously according to visible local geometry;
- touching the field changes geometry persistently and immediately;
- no text tutorial, score, timer, reward, progression, opponent or content sequence.

Technical variants:
- `coupled` (default);
- `edit-only`;
- `flow-only`.

Kill criterion after human test:
DROP the coupling if the player merely manipulates, waits, or repeatedly taps without showing a prediction/correction relation between field and autonomous mote. A success requires behavior or spontaneous language showing that the process has made the editable structure consequential.