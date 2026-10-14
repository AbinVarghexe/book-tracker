# SuperrBook — Book Tracker 📚

> A playful, fast, and tactile web application to track books you want to read, are currently reading, and have finished.

Built with **Pure Semantic HTML5, CSS3, and Vanilla JavaScript (ES6+)**, styled using the **Duolingo Style Reference** (Paper White `#ffffff` canvas, Eager Green `#58cc02`, Spark Blue `#1cb0f6`, Amber Gold `#ff9600`, chunky 3D buttons and cards, and Nunito typography).

---

## ✨ Features

- **Duolingo Storybook UI**: Pure white paper canvas with chunky 3D buttons, rounded card containers, and a playful reading mascot.
- **Proper UI Capitalization**: Clean Title Case and uppercase labels (`HOME`, `HOW IT WORKS`, `MY BOOKSHELF`, `OPEN TRACKER`, `ADD TO BOOKSHELF`, `TO READ`, `READING`, `FINISHED`).
- **Custom 3D Dropdown Components**: Bespoke interactive popover menus for both the form status selector and in-card status changers (no default OS dropdowns), with active checkmarks and stacking context management.
- **Add Books**: Form with Title, Author, and Status (`To read`, `Reading`, `Finished`).
- **Strict Real-Time Validation**: Title and Author are required. Submitting blank inputs displays exact inline error messages (`"Please enter a title"`, `"Please enter an author"`) that clear instantly upon typing.
- **Newest First**: Books appear chronologically ordered with the most recent at the top.
- **Case-Insensitive Search**: Live real-time search across book titles and authors simultaneously (e.g. searching `"ben"` or `"BEN"` matches *"Aadujeevitham" by Benyamin*).
- **Status Filter Tabs**: Easily toggle views between `ALL`, `TO READ`, `READING`, and `FINISHED` with live count badges.
- **Instant Status Transitions**: In-card status changer to switch a book between *To read* $\rightarrow$ *Reading* $\rightarrow$ *Finished* with real-time badge updates.
- **100% Private LocalStorage**: Saved automatically in browser `localStorage` with zero accounts, zero passwords, and zero external tracking.
- **Live Counters**: Real-time counter bar showing Total books, To read, Reading, and Finished counts.
- **Delete Book**: Remove any book with instant state and stats synchronization.
- **Mobile Responsive**: Fully responsive layout that adapts smoothly across mobile, tablet, and desktop screens.
- **Signature Green Footer**: Full-bleed Eager Green (`#58cc02`) footer band.

---

## 🚀 Live Demo & Links

- **Live Website**: [https://abinvarghexe.github.io/book-tracker/](https://abinvarghexe.github.io/book-tracker/)
- **Source Code**: [https://github.com/AbinVarghexe/book-tracker](https://github.com/AbinVarghexe/book-tracker)

---

## 🛠️ Local Development & Quick Start

Since this app uses zero build tools, you can run it instantly:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbinVarghexe/book-tracker.git
   cd book-tracker
   ```

2. **Open in any browser:**
   - Double-click `index.html` to open it in Chrome, Edge, Safari, or Firefox.
   - Or start a lightweight local server:
     ```bash
     # Using Python
     python -m http.server 3000

     # Using Node
     npx serve .
     ```

3. Open `http://localhost:3000` in your browser.

---

## 🧪 Testing

Run the automated test suite verifying validation, search, ordering, and status transitions:

```bash
node tests/test-feature1.js
```

---

## 📁 Repository Structure

```text
├── index.html            # Main semantic markup
├── styles.css            # Duolingo 3D styling tokens & responsive layout
├── app.js                # State management, validation, search & custom dropdown logic
├── design.md             # Design tokens & Duolingo style reference
├── PROMPTS.md            # Detailed prompt log and AI bug reflections
├── README.md             # Project documentation
├── .nojekyll             # GitHub Pages bypass for static assets
├── .gitignore            # Git ignore configuration
├── agents/
│   └── AGENTS.md         # Operational agent rules & regulations
└── tests/
    └── test-feature1.js  # Automated unit test suite
```
