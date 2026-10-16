# SIDELINE review and development plan

Reviewed 15 October 2026. Target: a playable football management game with lasting progression.

## Assessment

The visual direction is 8/10: the SIDELINE wordmark, condensed display typography, dark surfaces, lime accent and football atmosphere form a recognizable identity. The implemented prototype is approximately 6/10. Its readiness as a game with lasting progression is approximately 3/10 because the main management systems still use static demonstration data.

Keep the identity and career creation concept. Prioritize dependable interactions, a persistent simulation and an engaging season before expanding the number of screens or competitions.

### Evidence and limits

- Inspected the React source, routing, shared components, state handling and assets.
- Viewed the title screen, main menu, career entry and manager creation in the local browser, including narrow and desktop layouts.
- Production build passed. The latest lint run passed after files changed elsewhere in the workspace during this review; those source edits were not made as part of this review.
- Some browser interactions timed out in the automation connection. A complete career playthrough and save/reload round trip remain to be verified. Source-derived findings below should be covered by focused regression checks during implementation.
- This review does not verify the historical accuracy of the football catalogue or live deployment routing.

## Findings to address first

| Priority | Finding | Evidence | Required result |
| --- | --- | --- | --- |
| High | The final club vision can be omitted when saving a custom career. The button queues a draft update and immediately invokes a handler that reads the previous render's draft. | `src/pages/CareerSetup.jsx:694` and `:715` | Pass the completed draft directly to career creation and validate it once before committing. |
| High | Refreshing a saved HQ or appointment route can redirect to the menu before saved careers load. Route effects check an initially empty careers array without waiting for `hasLoaded`. | `src/context/GameContext.jsx:45`, `src/pages/Headquarters.jsx:618`, `src/pages/Appointment.jsx:45` | Finish hydration before checking whether a career exists. Distinguish loading, invalid ID and unavailable storage. |
| High | Save Formation only changes a local success flag. Switching sections unmounts the component and loses its formation. | `src/pages/Headquarters.jsx:292` and `:359` | Store tactics in the selected career and display saved status only after successful persistence. |
| High | HQ overview shortcuts change `?s=...`, while the visible section is controlled by unrelated component state. | `src/pages/Headquarters.jsx:161` and `:611` | Use the URL as the shared source for navigation, including browser Back and direct links. |
| High | Artwork filenames do not match their contents. `stadium-aerial.png` contains a manager portrait; `avatar-c.png` and `avatar-f.png` contain the green stadium tunnel. `stadium-pitch.png` is identical to `avatar-d.png`. | Visual inspection and SHA-256 comparison of public assets | Inventory and remap every image; ensure every portrait choice is a distinct portrait and each environment contains the expected scene. |
| High | Narrow layouts squeeze primary navigation and setup. The main menu media rule targets `.menu-left-panel`, but that class is absent. Manager creation fixes three columns. | Live narrow menu; `src/pages/MainMenu.jsx:361`, `src/pages/CareerSetup.jsx:108` | Use a full-width mobile menu, stacked career choices and a single-column setup. Adapt the HQ sidebar to a drawer. |
| Medium | Animations, Reduced Motion and Text Size are saved and displayed in Settings but are not applied to the rest of the interface. | References to these settings occur only in Settings and storage; OS reduced-motion CSS exists separately. | Apply motion and text preferences through shared styles, including initial reveals and timed sequences. |
| Medium | Tactics attach players to positions by array index, placing the first player, a goalkeeper, in an attacking slot. | `src/pages/Headquarters.jsx:332` | Assign players by stable player ID to valid lineup slots; enforce one goalkeeper and eleven unique starters. |
| Medium | Scout Report has no handler. Squad, scouting, fixtures and messages use shared static demo arrays. | `src/pages/Headquarters.jsx` | Connect each active control to career-specific state or label the unavailable action clearly until implemented. |
| Medium | Forms have visually separate labels without explicit input associations; switches lack accessible names; clickable cards and modal focus behavior are incomplete. | `src/components/ui/Input.jsx`, `Card.jsx`, `Modal.jsx`, `src/pages/Settings.jsx` | Provide labels, semantic interactive elements, keyboard operation, modal focus trapping and focus restoration. |
| Medium | Assets are oversized and duplicated. Public assets total about 34.1 MB; individual PNGs are roughly 2.0–2.5 MB. | Filesystem size inventory; this is asset inventory, not measured initial page transfer. | Create appropriate WebP/AVIF sizes, retain originals outside public output, remove duplicate public copies and load images according to need. |
| Low | README describes an older three-page FM Scout project. Large pages mix presentation, demo data and behavior. | `README.md`, `src/pages/Headquarters.jsx`, `src/pages/CareerSetup.jsx` | Document SIDELINE accurately and extract reusable screen sections and game logic as each system is implemented. |

## Development sequence

### 1. Make the existing journey trustworthy

Fix custom career confirmation, hydration guards, route validation, HQ navigation and persistent tactics. Preserve the user's draft across refreshes and validate prerequisites before allowing later setup steps. Give failed saves visible feedback rather than silently swallowing storage errors. Correct asset mapping and the most severe narrow-screen layout defects.

Acceptance: both setup modes create a valid career; its selected vision survives; HQ and appointment URLs survive refresh; every HQ shortcut opens the intended section; saved tactics survive navigation and reload. Existing valid saves remain readable.

### 2. Establish the persistent game model

Separate the simulation from React presentation. Use explicit game actions such as selecting a lineup, setting training and advancing the date. Define stable IDs for careers, clubs, players, fixtures and messages.

A campaign should contain:

- Save schema version, campaign ID, simulation seed, creation/update timestamps and game date.
- Manager identity, selected club, philosophy, project and board objectives.
- Competition membership, fixtures, results, standings and season history.
- Club finances, player contracts, squads, fitness, morale and development.
- Lineup, tactics, training, scouting reports, transfers and inbox decisions.

Use a versioned storage adapter so persistence can grow independently of screens. IndexedDB is a reasonable target as campaign history expands; preferences can remain small and separate. Include migrations, a last-good backup, export/import, validation and recovery feedback. Use a seeded simulation so reloading does not reroll an already committed result. Commit a match and its dependent updates together.

Acceptance: closing and reopening restores the same date, squad, lineup, table, messages and finances; careers are isolated; malformed saves produce a recoverable error; an exported campaign can be imported successfully.

### 3. Deliver one complete playable season

Start with one explicitly defined competition and fictional squads. The existing curated catalogue can remain useful for exploration; active competition membership should be an intentional season snapshot rather than an implied live dataset.

Build this loop:

**Read the inbox → choose training and tactics → select the XI → advance to the fixture → play the match → review the result and consequences → save → prepare for the next fixture.**

Generate a valid schedule. Simulate all fixtures for the matchday. Let player attributes, position suitability, fitness, morale, tactics and home advantage affect outcomes. Start with a clear text/event match presentation, score, substitutions and a post-match report. Update the table, player condition and board objectives from the same result. Provide an obvious primary Continue action that states what happens next.

Acceptance: a player can finish a season, see consistent results and standings, close the app midseason and resume, then begin the next season with the previous season recorded. Match events must agree with the final score. Each fixture resolves once.

### 4. Add decisions with lasting consequences

Add training tradeoffs, development and ageing; contracts and wages; scouting with limited information; transfers constrained by budgets; morale and injuries; board expectations and job security. Make career philosophies and club projects affect objectives and progression.

Introduce systems incrementally so players can understand why outcomes changed. Show useful explanations after decisions and matches. Tune several simulated seasons for financial stability, plausible player growth and meaningful tactical choices.

Acceptance: a youth project rewards development; training affects both improvement and fatigue; signings affect squad and budget; board confidence responds to defined objectives; season rollover handles contracts, history and new fixtures consistently.

### 5. Bring every screen to the same visual standard

Preserve charcoal surfaces, off-white text, lime highlights and condensed headings. Give interactive screens more readable body text and clearer separation between panels. Reserve dramatic imagery for entry and appointment moments, and prioritize legible data in the HQ.

Replace emoji navigation with one consistent icon family. Standardize spacing, typography, button states, selection, empty states and save feedback in shared components and styles. Refine the HQ around next fixture, actionable inbox items, squad readiness, board confidence and project progress. Reduce repeated manager/club metadata where it crowds out useful decisions.

Review menu, setup, discovery, squad tables, tactics and dialogs at 390px, 768px, 1024px and 1440px. Keep focus indicators visible, make keyboard navigation complete and honor both in-app and OS motion preferences.

Acceptance: all primary actions remain visible and operable at supported widths; there is no accidental clipping; typography and iconography are consistent; all interactive controls provide meaningful feedback.

### 6. Verify the experience before expanding scope

Add focused tests for save migrations/recovery, fixture generation, table calculations, unique lineup assignments, seeded simulation and season rollover. Add browser checks covering setup, reload, tactics persistence, one match, export/import and season completion. Run build/lint and check the actual deployed host's deep-link fallback.

Measure loading with cold cache and constrained network before choosing performance targets. Optimize imagery first, then split routes if measurements justify it. Gather playtest feedback on whether decisions feel understandable, consequential and worth returning to.

Acceptance: the complete season loop passes its checks; no active control silently does nothing; saves recover reliably; performance is measured on the target device class; playtesters can complete their first match without instruction.

## Recommended first implementation batch

1. Fix career confirmation, hydration and HQ shortcuts.
2. Persist lineup/tactics and introduce a versioned campaign structure.
3. Correct artwork mapping and repair menu/setup layouts.
4. Build a first fixture with date advancement, a match result and saved consequences.

The first major milestone is a dependable return visit: create a career, make a decision, play a match, close the app and return to the exact same evolving football world.
