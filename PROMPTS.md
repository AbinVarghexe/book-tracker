# Prompt Log: Book Tracker Development

This document logs the key prompts used during the development of the Book Tracker web application, what happened at each step, and how issues/bugs were identified and corrected.

---

### Prompt 1: Project Architecture & Planning
**Prompt:**  
> "I want to build a Book Tracker web app. Features: add a book with title, author and status (To read, Reading, Finished), show the list newest first, search by title or author, change status, and keep the data after a refresh. Optional extras: delete books, counts (e.g. '3 finished, 2 to read'), and a mobile-friendly layout. Follow the Wise design style (deep forest green #163300, lime voltage #9fe870, pill buttons, 10px rounded cards/inputs, Inter font). Before writing code, create an implementation plan and design reference."

**What happened:**  
The AI created a detailed technical specification and an implementation plan covering the data model, component architecture, responsive layout, and testing plan. It also established `design.md` with the Wise Design System tokens (Forest Ink, Lime Voltage, Fog surfaces, Pill radiuses).

---

### Prompt 2: Feature 1 — Add Book Form & Newest-First List with Validation
**Prompt:**  
> "Build the core book tracking functionality: A form with Title, Author, and Status dropdown (To read, Reading, Finished). When submitted, add the book to the top of the list (newest first). Title and Author are strictly required. If either is left empty, display a clear inline message directly under that box ('Please enter a title' and 'Please enter an author')."

**What happened:**  
The form was created with reactive state and inline error containers. Validations were wired to display error messages directly below the corresponding inputs and clear immediately upon typing. New books were inserted at index 0 with timestamp IDs.

---

### Prompt 3: Feature 2 — LocalStorage Persistence & Status Synchronization
**Prompt:**  
> "Save the book list in localStorage so all books and their statuses persist after a page refresh. Load the saved list when the app opens."

**What happened:**  
The AI initially wired `localStorage` using a simple `useEffect` fetch. However, on subsequent tests, updating a book's status and immediately reloading showed that the status reverted or caused a Next.js SSR hydration mismatch warning ("Text content did not match server-rendered HTML").

---

### Prompt 4: AI Bug Diagnosis & Fix — Hydration Mismatch & Status Mutation Bug
**Prompt (Fixing the bug):**  
> "When I change a book's status from 'Reading' to 'Finished' and refresh the page, the book appears but the status badge and counts sometimes flicker or trigger a hydration error in the console. Also, searching for 'BEN' in all caps didn't match 'Benyamin'. Here is the code snippet. What went wrong and how do we fix both?"

**What happened & How it was fixed:**  
1. **Hydration fix:** The AI resolved the hydration mismatch by introducing a mounted flag and lazy client-side initializer so server render and initial client render align before reading `localStorage`.
2. **Search case-insensitivity fix:** The filter logic was updated with `.toLowerCase().trim()` across both `book.title` and `book.author` to ensure queries like `"BEN"`, `"ben"`, and `"Ben"` reliably match `"Benyamin"` or `"Aadujeevitham"`.
3. **Immediate Persistence:** Status mutations now trigger an explicit state copy and immediate synchronous flush to `localStorage`.

---

### Prompt 5: Feature 3 & 4 — Search, Status Transitions, Counts, and Wise UI Polish
**Prompt:**  
> "Add a live search box and status filter tabs (All, To read, Reading, Finished). Show live counts at the top (e.g. 'X finished, Y reading, Z to read'). Implement book deletion with confirmation/undo. Style the entire app using the Wise design reference: #163300 Forest Ink backgrounds and accents, #9fe870 Lime Voltage pills, 9999px rounded action buttons, 10px rounded cards and inputs, and ensure full mobile responsiveness."

**What happened:**  
Added the live search bar with instant query matching, status filter tabs, animated stats counter badges, card deletion with undo support, and polished the styling strictly to match Wise design guidelines.
