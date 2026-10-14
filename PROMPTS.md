# Prompt Log: Book Tracker Development

This document logs the key prompts used during the development of the Book Tracker web application, what happened at each step, and how issues/bugs were identified and corrected.

---

### Prompt 1: Project Architecture & Planning
**Prompt:**  
> "I want to build a Book Tracker web app. Features: add a book with title, author and status (To read, Reading, Finished), show the list newest first, search by title or author, change status, and keep the data after a refresh. Optional extras: delete books, counts (e.g. '3 finished, 2 to read'), and a mobile-friendly layout. Before writing code, create an implementation plan and design reference."

**What happened:**  
The AI created a detailed technical specification and an implementation plan covering the data model, component architecture, responsive layout, and testing plan.

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
The AI wired `localStorage` persistence. It populated initial sample books for first-time visitors (including *"Aadujeevitham" by Benyamin*) and ensured immediate updates when books are added.

---

### Prompt 4: AI Bug Diagnosis & Fix — Search Case-Sensitivity & Live Stats Desync
**Prompt (Fixing the bug):**  
> "When I search for 'ben' or 'BEN', nothing shows even though the book 'Aadujeevitham' by 'Benyamin' is in the list. Also, changing a book's status does not update the count in the top stats bar until I refresh. What is wrong and how do we fix both?"

**What happened & How it was fixed:**  
1. **Search case-insensitivity fix:** The initial code used `.includes(query)` which was strictly case-sensitive. The filter was updated with `.toLowerCase().trim()` across both `book.title` and `book.author` so queries like `"BEN"`, `"ben"`, and `"Ben"` match `"Benyamin"`.
2. **Immediate Counter Sync:** Status changes now trigger `updateStats()` inside `renderApp()` synchronously, immediately updating the stat badges before persisting to `localStorage`.

---

### Prompt 5: Feature 3 & 4 — Search, Status Transitions, Counts, and UI Polish
**Prompt:**  
> "Add a live search box and status filter tabs (All, To read, Reading, Finished). Show live counts at the top (e.g. 'X finished, Y reading, Z to read'). Implement book deletion with confirmation. Make the app fully mobile-friendly."

**What happened:**  
Added the live search bar with instant query matching, status filter tabs, animated stats counter badges, card deletion with confirmation support, and responsive adjustments for mobile screens.

---

### Prompt 6: Landing Page, Google Sign-In & Superr Style Reference
**Prompt:**  
> "Create a landing page with well structured format, also create a login for each user with Google sign in, also I have updated the design.md file so change the Design file."

**What happened:**  
1. **Superr Design System:** Adopted the **Superr Style Reference** (`design.md`): Cream Paper `#fdfbf9` canvas, Charcoal `#171717` borders and text, Cocoa Ink `#2b1a07` headlines, Marker Orange `#ff6f1e` annotations and 56px curved footer brand band, Dew Drop `#f7efe9` cards, and 20px pill buttons.
2. **Structured Landing Page:** Built a 2-column editorial hero with handwritten script captions, marker highlights, tactile notebook object with laminated school name-label sticker, floating stickers, and a 3-step value story section.
3. **Google Authentication & Multi-User Isolation:** Integrated Google Identity Services + user profile management. Users can sign in with Google or sample accounts (Alex Reed, Priya Nair). Each user's books are isolated in their own localStorage namespace (`superrbook_books_${userId}`).

---

### Prompt 7: Visual Bug Diagnosis & Redesign of "How It Works" Cards
**Prompt:**  
> "this portion is not properly designed" (with screenshot of feature cards with collapsed padding).

**What happened & How it was fixed:**  
1. **Root Cause Analysis:** In `styles.css`, `.feature-card` had `padding: var(--spacing-28);`, but `--spacing-28` was not defined in `:root` (only `--spacing-24` and `--spacing-32` existed). This caused browsers to invalidate the CSS property and render the cards with `0px` padding.
2. **Design Enhancement:** Defined `--spacing-28: 28px;`, applied explicit robust padding (`34px 28px 30px`), and added step pill badges and circular sticker characters.

---

### Prompt 8: Comprehensive Redesign of Dashboard & Book Cards
**Prompt:**  
> "also this dashboard section is also not proeprly designed" (with screenshot of stretched dashboard, unpadded add form, and plain book list).

**What happened & How it was fixed:**  
1. **Add Book Form Card:** Upgraded to a tactile library slip card with `padding: 32px 28px;`, `★ NEW LOG` badge, warm Dew Drop form inputs with orange focus rings, and an interactive pill action button.
2. **Reading Record Cards:** Redesigned book cards into tactile reading slips with vertical bookmark accent stripes (amber for To read, blue for Reading, sprout green for Finished), bold `Fraunces` titles, script author prefixes in Marker Orange, library date-stamp tags (`📅 Added on ...`), and styled circular delete buttons.
3. **Stats Bar & Cache Busting:** Added icon headers to the 4 stats cards (`📚`, `⏳`, `📖`, `🏆`) and added cache buster `?v=2.3` to `styles.css` in `index.html` to guarantee instant browser refreshes on GitHub Pages.

---

### Prompt 9: Refero Design Polish, UI-Extension Packaging & Complete Removal of Google Sign-In
**Prompt:**  
> "/refero-design use this skill and properlu edit the ui /ui-extension use this skills also remove Google sign in"

**What happened & How it was resolved:**  
1. **Complete Removal of Google Sign-In:**  
   - Removed Google Identity Services (`<script src="https://accounts.google.com/gsi/client">`), Google login button, user chip, profile dropdown menu, and `#authModal` from `index.html`.
   - Stripped auth session management, demo accounts, and Google SDK initialization from `app.js`.
   - Storage simplified to pure, private client-side `localStorage` (`superrbook_books_v1`) without requiring accounts, passwords, or tracking.
2. **Refero Design Polish:**  
   - **Feature & Story Cards:** Resolved all padding collapse issues by establishing explicit, robust padding (`36px 30px 32px`), warm cream card backgrounds, high-contrast step badges (`STEP 01-03`), and joyful pastel sticker accents.
   - **Tactile Book Cards:** Fixed empty horizontal voids by introducing a tactile book jacket thumbnail (`.book-spine-thumb`) with bold initial typography and color-coded status backgrounds (`#fef3c7` To read, `#bfdbfe` Reading, `#bbf7d0` Finished). Added editorial Patrick Hand script author tags (`by Author`), calendar date chips, and smooth-hover delete buttons.
   - **Add Book Form Slip:** Redesigned into a library checkout slip card with perforated dashed borders, warm input backgrounds (`#faf7f2`), clear inline error messages, and a vibrant Marker Orange submit pill.
   - **Stats Bar:** Re-architected with subtle status-tinted vertical gradients, clear micro-caps labels, and prominent `44px` Fraunces display counters.
3. **Antigravity UI-Extension Integration:**  
   - Packaged the application as an official Antigravity UI extension plugin under `plugins/book-tracker/`.
   - Created `plugin.json` manifest, branded SVG logo (`assets/logo.svg`), and declarative sidecar manifest (`sidecars/panel/sidecar.json`).
   - Implemented `sidecars/panel/main.mjs` serving the UI with `/preload.js` bridge for Antigravity's side pane.
   - Installed to `%USERPROFILE%\.gemini\config\plugins\book-tracker\` for instant discovery in Antigravity.

---

### Prompt 10: Duolingo Style Reference & Proper UI Capitalization
**Prompt:**  
> "Use captiall letters in the UI properlu and redisitgn the UI: Duolingo — Style Reference: Playful classroom mascot on white paper"

**What happened & How it was resolved:**  
1. **Proper UI Capitalization:**  
   - Replaced all all-lowercase branding and typography with proper Title Case and intentional uppercase formatting.
   - Set navigation links (`HOME`, `HOW IT WORKS`, `MY BOOKSHELF`) and action buttons (`OPEN TRACKER`, `START TRACKING FOR FREE`, `ADD TO BOOKSHELF`) to clean, bold uppercase with letter-spacing `0.053em` following Duolingo specifications.
   - Ensured all card headers, form labels (`Book Title *`, `Author *`, `Reading Status`), meta tags (`Newest First`), and status pills (`TO READ`, `READING`, `FINISHED`) use proper capital letters.
2. **Duolingo Style System Implementation:**  
   - **Canvas & Colors:** Pure white paper canvas (`#ffffff`), signature Eager Green (`#58cc02`), Storybook Green (`#d7ffb8`), Spark Blue (`#1cb0f6`), Amber Gold (`#ff9600`), Charcoal (`#4b4b4b`), and Pencil Gray (`#777777`).
   - **Chunky 3D Buttons & Cards:** Implemented Duolingo's signature 3D pressed bevels (`border: 2px solid; border-bottom: 4px solid <darker-tone>; border-radius: 14px-16px;`) that depress 2px on click.
   - **Playful Reading Mascot:** Created a vector classroom reading mascot with a floating speech bubble (`"Ready to read today? 📖"`).
---

### Prompt 11: Custom Duolingo 3D Dropdown Components
**Prompt:**  
> "We designed the dropdown. The dropdown is in the default version."

**What happened & How it was resolved:**  
1. **Diagnosis:**  
   - Both the Add Book form status dropdown and the in-card status changer relied on native HTML `<select>` elements, which caused browsers and operating systems to open un-styled, default grey OS select menus.
2. **Custom Duolingo 3D Dropdown Components:**  
   - **Form Status Dropdown:** Replaced the default select with a custom 3D interactive popover component (`.custom-select-trigger` + `.custom-select-dropdown`). Features 3 colored options (`⏳ TO READ`, `📖 READING`, `🏆 FINISHED`) with active checkmarks and smooth 180° rotating chevron animations.
   - **In-Card Status Dropdown:** Replaced the invisible overlay select with a custom 3D popover menu (`.card-status-popover`) anchored directly below each status pill. Clicking the badge opens a Duolingo popover with option highlights and active checkmarks.
   - **Accessibility & Dismissal:** Implemented click-outside detection and `Escape` key handlers to close all open dropdowns automatically.

---

### Prompt 12: Dropdown Stacking Context Bug Fix
**Prompt:**  
> "There's a bug in the dropdown. It is not appearing above the selector. Please fix that. Provided the image to" (with screenshot showing the opened dropdown menu appearing underneath the blue status button of the adjacent card below).

**What happened & How it was resolved:**  
1. **Diagnosis & Reflection:**  
   - In CSS, sibling DOM nodes that appear later in the tree (the second `.book-card`) naturally stack on top of earlier nodes when both have positioning or `transform` styles.
   - Even though the `.card-status-popover` had `z-index: 60`, its stacking context was bound to the first `.book-card`. Consequently, the adjacent card below and its blue `READING` button rendered on top of the open dropdown menu, obscuring the "FINISHED" option.
2. **Fix Implemented:**  
   - Updated `app.js` to dynamically add the `.dropdown-active` class to the parent `.book-card` whenever its popover is opened, and remove it on close.
   - Set `.book-card.dropdown-active` to `z-index: 200 !important; transform: none !important;` in `styles.css`.
   - Elevated `.card-status-popover` to `z-index: 9999 !important;` with an elevated 3D shadow (`box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18)`).
   - This ensures the opened popover floats cleanly and unconditionally on top of all adjacent cards, selectors, and buttons.




