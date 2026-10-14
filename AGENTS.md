# AGENTS.md — Agent Guidelines & Regulations

> See detailed specifications in [agents/AGENTS.md](file:///d:/DEV/Test-1/agents/AGENTS.md).

This project follows strict agent guidelines:
1. **Incremental Feature Workflow**: Build, test with deliberate edge cases, commit.
2. **Superr Design System**: Strictly follow `design.md` tokens (Cream Paper `#fdfbf9`, Charcoal `#171717`, Cocoa Ink `#2b1a07`, Marker Orange `#ff6f1e`, Dew Drop `#f7efe9`, 20px pill buttons, 12px card radius, Fraunces/Inter font, 56px curved footer).
3. **Landing Page & Google Auth**: Structured landing page hero with tactile notebook & stickers, plus Google Sign-In with isolated book storage per user.
4. **Core Validation**: Title & Author required with specific inline errors (`"Please enter a title"`, `"Please enter an author"`).
5. **Ordering**: Newest books first.
6. **Search**: Case-insensitive title and author matching.
7. **Persistence**: `localStorage` data sync per user.
8. **Counters**: Live stats bar for Total, To read, Reading, Finished.
9. **Logging**: Maintain prompt log and AI error reflection in `PROMPTS.md`.
