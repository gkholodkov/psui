# Improve the accommodation-scam learning prototype

## Context

The current prototype walks a learner through Welcome → Board → AdDetail → InspectOverlay → Form → Evidence → Outcome → Checklist. It already covers two scam scenarios (A: brand impersonation, B: pre-check) and one safe scenario (C: plain WG). The flow works, but the learning is shallow:

- The inspection step is a generic "tap things worth checking" list that floats *above* the ad rather than letting the learner interact with the real form fields and message bubbles.
- Learners only *identify* cues; they never *classify* them, so the distinction between "data overcollection", "platform switching", and "scarcity pressure" never lands.
- Tapped hotspots are local state in `InspectOverlay.tsx` and are discarded on close, so the Evidence and Outcome screens cannot tell the learner what they missed, misclassified, or chose to ignore.
- The scenario set is missing the most pedagogically important case: a flow that *looks* suspicious (holding-fee step, ID upload) but is actually safe because the route is verified and timing is correct. Without it, the learner generalises "any pre-check = scam".
- Decision screens still use quiz wording ("What would you do first?"), and outcomes do not handle the critical failure mode of "noticed risk, continued anyway" or the false-positive "rejected a safe listing".

Goal: deepen the learning loop without rebuilding architecture. Reuse the existing routes, screens, and `Ad` data shape; extend them.

## Approach

### 1. Shared inspection state via React Context

Add `src/app/state/InspectionContext.tsx`: a provider mounted in `Layout.tsx` that exposes per-ad inspection state:

```ts
interface AdInspectionState {
  tapped: Set<string>;          // hotspot ids the learner opened
  classifications: Record<string, string>;  // hotspotId -> chosen tactic
  correct: Record<string, boolean>;         // hotspotId -> classification correct?
  continuedDespiteRisk: boolean;            // set when learner submits form after seeing risk cues
}
```

Hook: `useAdInspection(adId)` returning `{ state, tap, classify, markContinued, reset }`.

Why Context, not URL params: the cue list per ad is up to ~8 items with classification answers; encoding them in the URL is messy and the prototype is a single SPA session anyway. The Explore report confirmed no global store exists yet, so this is additive.

### 2. Anchor hotspots to real UI elements

Rewrite `InspectOverlay.tsx` so it no longer renders a vertical list above a blurred page. Instead:

- The overlay becomes a semi-transparent scrim over the page beneath (AdDetail or FormScreen), with a top instruction banner and a bottom progress bar.
- The page beneath renders its real elements (form fields, link preview, scarcity badge, WhatsApp button, profile metadata). Each "inspectable" element is wrapped in a new `<Inspectable hotspotId="h2">` component that, when inspect mode is on, gets a pulsing ring and pointer cursor, and on tap opens a `Popover` (existing `ui/popover.tsx`) anchored to that element.

The popover shows:
1. The hotspot label and explanation (`hotspot.feedback`).
2. A classification prompt: "What kind of evidence is this?" with three `ToggleGroup` options pulled from a fixed tactic vocabulary (see §3). One option is the correct `hotspot.tactic`; the other two are plausible distractors picked deterministically per hotspot.
3. Correct/incorrect feedback text written into the data model.

This satisfies the brief's "tap real elements, not an abstract list" requirement and reuses the design system (`ui/popover.tsx`, `ui/toggle-group.tsx`, `ui/badge.tsx`).

Critical files:
- New: `src/app/components/Inspectable.tsx` — wrapper with pulsing ring + popover trigger.
- Rewrite: `src/app/components/InspectOverlay.tsx` — now a scrim + banner + progress, no list.
- Edit: `src/app/components/AdDetail.tsx`, `src/app/components/FormScreen.tsx` — wrap real elements (price chip, scarcity badge, IBAN/passport/deposit form fields, link preview, contact field) in `<Inspectable hotspotId="...">`. Hotspot IDs must match the ones already declared in `data.ts`.

### 3. Cue classification vocabulary

Extend `Ad.Hotspot` in `src/app/data.ts`:

```ts
interface Hotspot {
  id: string;
  label: string;
  feedback: string;
  tactic: TacticTag;            // existing field, now typed
  correctFeedback: string;      // shown when classified correctly
  incorrectFeedback: string;    // shown when classified wrong
  distractors: TacticTag[];     // 2 wrong options for the classification prompt
}

type TacticTag =
  | "Data overcollection"
  | "Advance payment"
  | "Platform switching"
  | "Brand impersonation"
  | "Scarcity pressure"
  | "Safe payment timing"
  | "Verified route"
  | "Not enough evidence";
```

Populate the new fields for every hotspot in A, B, C, and the new D (§4). Reuse `tactic` strings as the source of truth for the vocabulary.

### 4. Scenario set

Per user instruction, remove the placeholder template D. Replace it with a real fourth scenario that covers the missing pedagogical case:

- **A — Brand impersonation + platform switching** (keep, refine hotspots/classifications)
- **B — High-risk pre-check** (keep, refine hotspots/classifications)
- **C — Safe but unpolished** (keep; this is the "do not judge by polish" case)
- **D — Legitimate but suspicious-looking** (new): a university-partner agency that *does* ask for a holding fee and ID upload, but the route is on a verified domain, the viewing is scheduled before payment is charged, refund terms are explicit, and the contact is identifiable. Several hotspots intentionally classify as "Safe payment timing" / "Verified route" / "Not enough evidence" so the learner practises distinguishing surface red flags from real risk.

Edit only: `src/app/data.ts`. Update `Board.tsx` header from "4 offers" → "4 offers" (already done) and remove any leftover placeholder copy from D.

### 5. Neutral decision language

Strip quiz phrasing from `AdDetail.tsx` (line 69 "What would you do first?"), `EvidenceScreen.tsx` (line 60 "What is the …safer action?"), and any similar copy in `FormScreen.tsx` / `OutcomeScreen.tsx`. Replace with the labels listed in the brief: "Next step", "Choose next action", or show buttons only with: *Open link*, *Inspect first*, *Pause & inspect*, *Continue*, *Report / do not continue*, *Request viewing*, *Check another offer*.

### 6. Richer Evidence and Outcome feedback

Rewrite `EvidenceScreen.tsx` to consume the Context state:

- Section "What you inspected" — list hotspots in `state.tapped` with their tactic badges.
- Section "What you missed" — hotspots in `ad.hotspots` not in `state.tapped`, shown muted with their tactic.
- Section "What you misclassified" — hotspots where `state.correct[id] === false`, with the right answer.
- Verdict + recommended next action remain (`ad.evidenceVerdict`).

Extend `OutcomeScreen.tsx` outcome types:
- `unsafe-after-inspect` (already present) → reinforce: "You found the risk cues, but still continued through the unsafe route. The goal is not only to notice red flags. The goal is to change the next action." Triggered when `state.tapped.size > 0 && state.continuedDespiteRisk` for scam ads. Set `continuedDespiteRisk` in `FormScreen.tsx` when the learner clicks the submit/continue button on a scam ad.
- New `false-positive` outcome for safe ads (C, D) when the learner picks "Report / do not continue": "Suspicion means verify, not panic. This listing had safer transaction patterns." Then list the safe evidence (verified route, no early sensitive data, payment after viewing, no urgency).

Edit `routes.tsx` if a new outcomeType slug needs to be allowed (the route already accepts any string via `:outcomeType`).

### 7. Reusable, actionable checklist

Rewrite `ChecklistScreen.tsx`:

- Each of the five items (Destination, Channel, Data, Payment, Pressure) becomes a `Collapsible` (`ui/collapsible.tsx`) row. Expanded body contains a one-sentence explanation and one concrete example pulled from the ad the learner just completed (read last-visited `adId` from the Context).
- Add a "Copy checklist" button that copies a plain-text version to the clipboard via `navigator.clipboard.writeText`.
- Keep the existing "campus reporting contact" placeholder block; do not wire real contacts.

### 8. Safety and privacy

All form inputs stay `disabled` and have no submit handler. No `<a href>` ever points outside the prototype; all "links" are React Router `Link`s or buttons. The new `D` scenario's "verified" URL and IBAN/passport fields are pure strings in `data.ts`, never collected.

## Critical files to modify

- `src/app/data.ts` — extend `Hotspot` type; rewrite D as the ambiguous-legitimate case; add `correctFeedback` / `incorrectFeedback` / `distractors` to every hotspot in A, B, C, D.
- `src/app/state/InspectionContext.tsx` — **new**, provider + `useAdInspection` hook.
- `src/app/components/Layout.tsx` — mount `<InspectionProvider>`.
- `src/app/components/Inspectable.tsx` — **new**, popover-anchored wrapper.
- `src/app/components/InspectOverlay.tsx` — rewrite as scrim + banner + progress.
- `src/app/components/AdDetail.tsx` — wrap inspectable elements; neutral copy.
- `src/app/components/FormScreen.tsx` — wrap inspectable form fields; set `continuedDespiteRisk` on submit; neutral copy.
- `src/app/components/EvidenceScreen.tsx` — read Context; render inspected / missed / misclassified sections; neutral copy.
- `src/app/components/OutcomeScreen.tsx` — handle `false-positive`; reinforce `unsafe-after-inspect` copy.
- `src/app/components/ChecklistScreen.tsx` — Collapsible items + per-ad example + copy button.
- `src/app/components/Board.tsx` — minor copy clean-up if D's content changes.

Reuse existing primitives: `ui/popover.tsx`, `ui/toggle-group.tsx`, `ui/badge.tsx`, `ui/collapsible.tsx`, `ui/button.tsx`, `components/figma/ImageWithFallback.tsx`.

Do not touch protected files: `src/app/components/MangoBubble.tsx`, `package.json`, `src/imports/Topic_5_Online_Scams.pdf`, `src/imports/Screenshot_2026-06-05_at_13.41.39.png`.

## Verification

1. The Vite dev server is already running — load the preview surface (700×2000 viewport).
2. Run scenario B (pre-check scam) end-to-end:
   - On AdDetail click *Inspect first*; confirm the page beneath stays visible and form fields/badges get pulsing rings.
   - Tap the IBAN field; popover opens with classification prompt; pick "Normal viewing requirement" → see incorrect feedback; reopen and pick "Data overcollection" → see correct feedback.
   - Close overlay; continue to Form; click *Continue* without going back; land on Outcome with the `unsafe-after-inspect` reinforcement message.
3. Run scenario D (ambiguous-legitimate):
   - Inspect; classify the holding-fee field as "Advance payment" (wrong) → see incorrect feedback explaining timing/route context.
   - Submit *Report / do not continue* on Evidence → land on `false-positive` outcome with the "suspicion means verify" message and safe-evidence list.
4. Run scenario C (safe-unpolished) and confirm Evidence lists what was inspected and what was missed; Checklist screen shows a C-specific example under each of the five items and the "Copy checklist" button writes to clipboard.
5. Visually scan every screen for remaining "What would you do" / quiz phrasing — none should remain.
