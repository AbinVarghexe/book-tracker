# Mini Product Submission: SuperrBook (Book Tracker)

This document provides the final submission deliverables for the SuperrBook web application.

---

## 1. Links

- **GitHub Repository:** [https://github.com/AbinVarghexe/book-tracker](https://github.com/AbinVarghexe/book-tracker)
- **Live Website:** [https://abinvarghexe.github.io/book-tracker/](https://abinvarghexe.github.io/book-tracker/)

---

## 2. Five Most Important Prompts

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

### Prompt 5: Superr Design System, Landing Page & Google Sign-In
> *"Create a landing page with well structured format, also create a login for each user with Google sign in, also I have updated the design.md file so change the Design file."*

**Outcome:** Transformed the visual language to the warm schoolyard aesthetic from `design.md` (Cream Paper canvas `#fdfbf9`, Charcoal borders `#171717`, Cocoa Ink headlines `#2b1a07`, Marker Orange `#ff6f1e` accents and 56px curved footer). Added an editorial hero with a tactile notebook replica, illustrated stickers, story features, and Google Sign-In with isolated book collections per user.

---

## 3. One Time the AI Got Something Wrong, and How It Was Fixed

### The Problem
During development of the search functionality and status synchronization, the initial search code used exact string casing:
```javascript
// Initial search check
const titleMatch = book.title.includes(query);
const authorMatch = book.author.includes(query);
```
When searching for `"ben"` (lowercase) or `"BEN"` (uppercase), the book *"Aadujeevitham"* by *"Benyamin"* disappeared from the list because `.includes()` performed a case-sensitive check. Furthermore, when changing a book's status in the dropdown, the card's badge text changed, but the summary counters in the top stats bar did not recalculate until a manual page refresh.

### How It Was Identified
I tested the app like a real user with deliberate edge cases:
1. Typed `"ben"` and `"BEN"` into the search box $\rightarrow$ the book was filtered out because of capital "B".
2. Changed *"Aadujeevitham"* from *"To read"* to *"Finished"* $\rightarrow$ the counter in the stats bar remained stuck at `0 Finished` and `1 To read`.

### How It Was Fixed
I prompted the AI:
> *"When I search for 'ben' or 'BEN', nothing shows even though the book 'Aadujeevitham' by 'Benyamin' is in the list. Also, changing a book's status does not update the count in the top stats bar until I refresh. What is wrong and how do we fix both?"*

The AI corrected both issues in `app.js`:
1. **Case-Insensitive Search:** Normalized both query and book text with `.toLowerCase().trim()`:
   ```javascript
   const query = currentSearchQuery.toLowerCase().trim();
   const titleMatch = book.title.toLowerCase().includes(query);
   const authorMatch = book.author.toLowerCase().includes(query);
   return titleMatch || authorMatch;
   ```
2. **Synchronous Stats Recalculation:** Centralized `updateStats()` inside `renderApp()`, so every status mutation immediately recalculates counts across the stats cards and filter tab badges before saving to `localStorage`.
