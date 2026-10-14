# Mini Product Submission: SuperrBook (Book Tracker)

This document provides the final submission deliverables for the SuperrBook web application.

---

## 1. Links

- **GitHub Repository:** [https://github.com/AbinVarghexe/book-tracker](https://github.com/AbinVarghexe/book-tracker)
- **Live Website:** [https://abinvarghexe.github.io/book-tracker/](https://abinvarghexe.github.io/book-tracker/)

---

## 2. Key Prompts & Iterations

### Prompt 1: Project Scaffolding & Architecture
> *"I want to build a Book Tracker web page using plain HTML, CSS and JavaScript. Features: add a book with title, author and status (To read, Reading, Finished), show the list newest first, search by title or author, change status, and keep the data after a refresh. Before writing any code, list the files you will create and explain how the data will be saved."*

**Outcome:** Established the project blueprint, file separation (`index.html`, `styles.css`, `app.js`), local data persistence, and responsive layout.

---

### Prompt 2: Core Form Validation & Newest-First List Ordering
> *"Create the book entry form with Title, Author and a Status dropdown (To read, Reading, Finished). When I click Add, show the book at the top of a list. Title and Author are strictly required. If one is empty, show a message under that box: 'Please enter a title' and 'Please enter an author'. Clear the error message as soon as the user starts typing."*

**Outcome:** Built form submission logic with defensive input checking, field-specific inline error containers, real-time input clearing, and newest-first chronological rendering.

---

### Prompt 3: Data Persistence with LocalStorage
> *"Save the book list in localStorage so all books and their updated statuses persist after a page refresh. Load the saved list when the page opens, and provide sample seed data for first-time visitors."*

**Outcome:** Integrated safe storage wrappers with fallback seed data (including *"Aadujeevitham" by Benyamin*) visible immediately on first visit and persisting across tab closes and page reloads.

---

### Prompt 4: Case-Insensitive Search & Status Filtering
> *"Add a search box above the list. As I type, show only books whose title or author contains the search text, ignoring capital letters (for example, typing 'ben' or 'BEN' should match 'Benyamin'). Also add status filter tabs (All, To read, Reading, Finished)."*

**Outcome:** Implemented combined filter logic with `.toLowerCase().trim()`, instant clear search button (`x`), active pill state management, and clear empty-state messaging when no matches are found.

---

### Prompt 5: Duolingo Design System, Proper Capitalization & Custom 3D Dropdowns
> *"Use captiall letters in the UI properlu and redisitgn the UI: Duolingo Style Reference"* and *"There's a bug in the dropdown. It is not appearing above the selector. Please fix that."*

**Outcome:** Redesigned the entire UI with Duolingo's playful classroom aesthetic (Paper White `#ffffff`, Eager Green `#58cc02`, Spark Blue `#1cb0f6`, chunky 3D buttons/cards, vector mascot, full-bleed green footer). Built custom interactive 3D dropdown components for both the form and in-card status changes, and fixed the stacking context issue by elevating `.book-card.dropdown-active` to `z-index: 200` and popovers to `z-index: 9999`.

---

## 3. Notable AI Bug Diagnosed & Fixed

### Case-Insensitive Search Bug
During development of the search functionality and status synchronization, the initial search code used exact string casing:
```javascript
const titleMatch = book.title.includes(query);
const authorMatch = book.author.includes(query);
```
When searching for `"ben"` (lowercase) or `"BEN"` (uppercase), the book *"Aadujeevitham"* by *"Benyamin"* disappeared from the list because `.includes()` performed a case-sensitive check.

**Fix:** Updated the search logic to normalize both queries and book fields using `.toLowerCase().trim()`:
```javascript
const q = currentSearchQuery.toLowerCase().trim();
const titleMatch = (book.title || '').toLowerCase().includes(q);
const authorMatch = (book.author || '').toLowerCase().includes(q);
```
Now, any case combination matches accurately.
