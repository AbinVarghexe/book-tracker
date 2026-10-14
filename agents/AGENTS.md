# AGENTS.md — Agent Guidelines & Regulations

This document defines the core architecture, operational protocols, code standards, and workflow rules for any AI agent or developer building and maintaining the **SuperrBook (Book Tracker)** project.

---

## 1. Project Overview & Scope
- **Product**: SuperrBook Web Application.
- **Mission**: Allow users to effortlessly catalog books they want to read, are reading, or have finished, with live status counts, responsive UI, search, Google Sign-In, and persistent storage.
- **Target Stack**: Clean, zero-dependency Semantic HTML5, CSS3, and modern Vanilla ES6+ JavaScript.
- **Hosting Target**: GitHub Pages (direct root deployment).

---

## 2. Agent Operational Rules & Workflow

### Rule 1: Step-by-Step Incremental Development
1. Build and test each feature against edge cases.
2. Maintain clean, documented commits after each major feature milestone.
3. Keep `PROMPTS.md` updated with prompt history and AI error reflection.

### Rule 2: Strict Adherence to the Superr Design System (`design.md`)
All visual styling must strictly follow `design.md`:
- **Palette**:
  - Canvas: Cream Paper (`#fdfbf9`)
  - Secondary Surface Tint: Dew Drop (`#f7efe9`)
  - Structural Ink & Borders: Charcoal (`#171717`)
  - Headlines: Cocoa Ink (`#2b1a07`)
  - Signatures & Accents: Marker Orange (`#ff6f1e`)
  - Stickers: Sky Sticker (`#3b82f6`), Bubblegum (`#ff66cf`), Sprout (`#22c55e`)
- **Shape Language**:
  - Buttons and tags: `20px` pill radius with `1.5px` solid Charcoal border on Cream Paper fill.
  - Cards: `12px` border radius with subtle card shadow.
  - Inputs: `8px` border radius with `1.5px` Charcoal border.
  - Footer Brand Band: `56px` curved top-left and top-right radius.
- **Typography**:
  - Display / Headlines: `Fraunces` / `Gelica` warm rounded display serif.
  - Body & UI: `Inter` / `Geist` clean grotesque.
  - Annotations: `Patrick Hand` cursive script in Marker Orange.

---

## 3. Mandatory Functional Regulations

### 3.1 Input Validation Rules
- `Title` and `Author` are **mandatory** fields.
- Submitting an empty title MUST display `"Please enter a title"` directly below the title input.
- Submitting an empty author MUST display `"Please enter an author"` directly below the author input.
- Error messages MUST clear automatically as soon as the user starts typing in the field.

### 3.2 List Ordering
- Books MUST be presented **newest first** at the top of the list.

### 3.3 Search Rules
- Search MUST filter simultaneously across `title` OR `author`.
- Search MUST be strictly **case-insensitive** and trim surrounding whitespace.

### 3.4 Data Persistence & Google Sign-In
- Storage keys: `superrbook_books_${userId}` and `superrbook_current_user`.
- Users can sign in with Google or select a sample profile.
- Each user maintains an isolated book collection.
- Any addition, deletion, or status update MUST immediately persist to `localStorage`.

### 3.5 Status Transitions & Counts
- Supported statuses: `To read`, `Reading`, `Finished`.
- Users must be able to change status seamlessly via in-card controls.
- The summary counters (`Total`, `To read`, `Reading`, `Finished`) must update dynamically in real time without requiring a page reload.
