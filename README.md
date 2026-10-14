# Book Tracker 📚

> A clean, focused, and responsive web application to track books you want to read, are currently reading, and have finished.

Built with **Semantic HTML5, CSS3, and Vanilla JavaScript (ES6+)**, following the **Wise Design System** (Forest Ink `#163300`, Lime Voltage `#9fe870`, Fog surfaces `#e8ebe6`, and 9999px pill buttons).

---

## ✨ Features

- **Add Books**: Form with Title, Author, and Status (`To read`, `Reading`, `Finished`).
- **Strict Real-time Validation**: Title and Author are required. Submitting blank fields immediately shows inline alerts (`"Please enter a title"`, `"Please enter an author"`), which clear automatically on keystroke.
- **Newest First**: Books appear chronologically ordered with the most recent at the top.
- **Case-Insensitive Search**: Live search across book titles and authors simultaneously (e.g. searching `"ben"` or `"BEN"` finds *"Aadujeevitham" by Benyamin*).
- **Status Filter Tabs**: Easily toggle views between `All`, `To read`, `Reading`, and `Finished`.
- **Instant Status Transitions**: In-card status selector to switch a book from *To read* $\rightarrow$ *Reading* $\rightarrow$ *Finished* with real-time badge updates.
- **Data Persistence**: Automatically saved to browser `localStorage` (`book_tracker_books_v1`) so your collection survives page refreshes and browser restarts.
- **Live Statistics**: Real-time counter bar showing Total books, To read, Reading, and Finished counts.
- **Delete Book**: Easily remove books with instant state synchronization.
- **Mobile Responsive**: Fully responsive grid that adapts smoothly from desktop to mobile screens with touch-friendly targets.

---

## 🚀 Live Demo

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
   - Simply double click `index.html` to open it in Chrome, Edge, Safari, or Firefox.
   - Or start a lightweight local server:
     ```bash
     # Using Python
     python -m http.server 3000

     # Using Node
     npx serve .
     ```

3. Open `http://localhost:3000` in your browser.

---

## 🧪 Testing Checklist

Try these tests yourself:
1. **Empty Field Validation**: Click **Add Book** with empty fields $\rightarrow$ Observe `"Please enter a title"` and `"Please enter an author"` under the inputs.
2. **Adding a Book**: Add *"Aadujeevitham"* by *Benyamin* $\rightarrow$ Verify it appears at the very top of the list with a `"To read"` pill.
3. **Search Matching**: Type `"ben"` or `"BEN"` into the search box $\rightarrow$ Only Benyamin's book stays visible.
4. **Status Changing**: Change status from *"To read"* to *"Finished"* $\rightarrow$ Badge updates to Lime Voltage and Finished count increments.
5. **Data Persistence**: Refresh the browser $\rightarrow$ All added books and statuses remain intact.
6. **Mobile View**: Resize the window or inspect under mobile emulation (375px) $\rightarrow$ Clean single-column layout.

---

## 📁 Project Structure

```
d:\DEV\Test-1\
├── index.html          # Semantic HTML5 layout and accessibility markup
├── styles.css          # Wise Design System styling (Forest Ink, Lime Voltage, Fog)
├── app.js              # State management, LocalStorage, validation, search, counters
├── design.md           # Wise Design System reference tokens
├── AGENTS.md           # Agent rules and operational specifications
├── PROMPTS.md          # Complete prompt log and AI bug resolution history
├── SUBMISSION.md       # Final submission artifact
└── README.md           # Documentation and usage guide
```

---

## 📄 License
MIT License. Free to use and modify.
