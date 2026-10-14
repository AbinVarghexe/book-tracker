# AGENTS.md — Agent Guidelines & Regulations

This document defines the core architecture, operational protocols, code standards, and workflow rules for any AI agent or developer building and maintaining the **Book Tracker** project.

---

## 1. Project Overview & Scope
- **Product**: Book Tracker Web Application.
- **Mission**: Allow users to effortlessly catalog books they want to read, are reading, or have finished, with live status counts, responsive UI, search, and persistent storage.
- **Target Stack**: Clean, zero-dependency Semantic HTML5, CSS3, and modern Vanilla ES6+ JavaScript.
- **Hosting Target**: GitHub Pages (direct root deployment).

---

## 2. Agent Operational Rules & Workflow

### Rule 1: Step-by-Step Incremental Development
1. Build one isolated feature at a time:
   - **Feature 1**: Add book form with required validation & newest-first book list.
   - **Feature 2**: LocalStorage persistence across page reloads.
   - **Feature 3**: Live search by title or author (case-insensitive).
   - **Feature 4**: Status transitions (*To read*, *Reading*, *Finished*) and deletion.
   - **Feature 5**: Live statistics counters (*"X finished, Y to read"*) and mobile responsiveness.
2. Manually or programmatically verify each feature against negative cases before moving to the next.
3. Commit progress to Git after each stable milestone with clear semantic commit messages.

### Rule 2: Strict Adherence to the Wise Design System (`design.md`)
All visual styling must strictly follow `design.md`:
- **Palette**:
  - Dominant Dark: Forest Ink (`#163300`) for headers, primary typography, dark accents, and active focus.
  - Accent / Functional: Lime Voltage (`#9fe870`) for primary CTA buttons, active status pills, and key metrics.
  - Neutral Canvas: Paper (`#ffffff`) background with soft Fog (`#e8ebe6`) card surfaces.
  - Low-emphasis Wash: Linen Mist (`#e2f6d5`) for subtle highlights and badges.
  - Typography Colors: Obsidian (`#0e0f0c`) for headlines, Charcoal (`#454745`) for body, Pebble (`#868685`) for secondary/hairlines.
- **Shape Language**:
  - Buttons, filter tabs, navigation pills, and status tags MUST be fully rounded (`9999px` pill shape).
  - Cards, panels, and input fields MUST have a gentle `10px` border-radius.
- **Typography**:
  - Inter font family (`wght@400;500;600;700;900`).
  - Heavy display headlines with tight negative letter tracking.
- **No Heavy Drop Shadows or AI Gradients**: Keep the UI flat, clean, and crisp with hairline borders (`1px solid var(--color-fog)` or `--color-pebble`).

---

## 3. Mandatory Functional Regulations

### 3.1 Input Validation Rules
- `Title` and `Author` are **mandatory** fields.
- Submitting an empty title MUST display `"Please enter a title"` directly below the title input.
- Submitting an empty author MUST display `"Please enter an author"` directly below the author input.
- Error messages MUST clear automatically as soon as the user starts typing in the field.

### 3.2 List Ordering
- Books MUST be presented **newest first** at the top of the list (chronological unshift or timestamp descending).

### 3.3 Search Rules
- Search MUST filter simultaneously across `title` OR `author`.
- Search MUST be strictly **case-insensitive** and trim surrounding whitespace (e.g., searching `"ben"`, `"BEN"`, or `"Ben"` must match `"Benyamin"`).
- When a search query produces no results, an informative empty state must be displayed with a quick clear option.

### 3.4 Data Persistence (`localStorage`)
- Storage key: `book_tracker_books_v1`.
- Any addition, deletion, or status update MUST immediately persist to `localStorage`.
- On initial launch with an empty storage, populate default starter books (such as *"Aadujeevitham" by Benyamin*) to demonstrate app behavior immediately.

### 3.5 Status Transitions & Counts
- Supported statuses: `To read`, `Reading`, `Finished`.
- Users must be able to change status seamlessly via in-card controls.
- The summary counters (`Total`, `To read`, `Reading`, `Finished`) must update dynamically in real time without requiring a page reload.

---

## 4. Prompt Logging & AI Transparency (`PROMPTS.md`)
- The agent must maintain `PROMPTS.md`.
- Every major prompt, user instruction, and outcome must be documented.
- Must document at least one realistic AI bug diagnosis, including what went wrong, how the bug was observed, and the exact code resolution.

---

## 5. Git Commit Protocol
- `feat: implement book creation and validation`
- `feat: add localstorage persistence and hydration`
- `feat: add case-insensitive search and status filtering`
- `feat: add dynamic status switching, counters, and delete`
- `style: polish UI according to Wise design system tokens`
- `docs: update PROMPTS.md and README with deployment links`
