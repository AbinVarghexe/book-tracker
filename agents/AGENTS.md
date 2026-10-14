# Agent Workflow & Quality Regulations

This repository adheres to strict pair-programming and incremental engineering guidelines:

### 1. Incremental Feature Workflow
- Never make massive unverified leaps.
- Code each feature, test edge cases locally, and commit before moving forward.

### 2. Design System Tokens (Duolingo Style Reference)
- Adhere to `design.md`:
  - Canvas: Pure Paper White `#ffffff`
  - Primary Green: `#58cc02` (3D bevel `#46a302`)
  - Spark Blue: `#1cb0f6` (3D bevel `#1899d6`)
  - Amber Gold: `#ff9600` (3D bevel `#e08500`)
  - Charcoal Body: `#4b4b4b`
  - Muted Gray: `#777777`
  - Border Gray: `#e5e5e5`
  - Typography: `Nunito` (weights 400, 600, 700, 800, 900)
  - 3D Buttons & Cards: `border-bottom: 4px solid ...` with 2px depress on `:active`
  - Proper Capitalization: Bold uppercase for nav, buttons, and status badges; clean Title Case for headings.

### 3. Core Functional Requirements
- **Validation**: Title & Author required. Inline messages `"Please enter a title"` and `"Please enter an author"`.
- **Chronology**: Newest books appear at the top.
- **Search**: Case-insensitive matching across title and author.
- **Custom Dropdowns**: Interactive 3D popovers for form and in-card status changing with active stacking context elevation (`z-index: 200` on active card).
- **Persistence**: Safe `localStorage` sync.
- **Counters**: Instant synchronization of live statistics bar and filter badges.

### 4. Logging & Accountability
- Document prompt evolution, testing outcomes, and AI bug diagnosis in `PROMPTS.md`.
