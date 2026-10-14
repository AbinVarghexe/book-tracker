# AGENTS.md — Agent Guidelines & Regulations

> See detailed specifications in [agents/AGENTS.md](file:///d:/DEV/Test-1/agents/AGENTS.md).

This project follows strict agent guidelines:
1. **Incremental Feature Workflow**: Build, test with deliberate edge cases, commit.
2. **Duolingo Design System**: Strictly follow `design.md` tokens (Paper White `#ffffff`, Eager Green `#58cc02`, Spark Blue `#1cb0f6`, Amber Gold `#ff9600`, 3D chunky buttons & cards, Nunito typography, full-bleed green footer).
3. **Proper UI Capitalization**: Use Title Case and bold uppercase for navigation, buttons, and status badges.
4. **Core Validation**: Title & Author required with specific inline errors (`"Please enter a title"`, `"Please enter an author"`).
5. **Ordering**: Newest books first.
6. **Search**: Case-insensitive title and author matching.
7. **Custom 3D Dropdowns**: Bespoke popover menus for form and in-card status changing with active stacking context management.
8. **Persistence**: 100% private `localStorage` client-side sync.
9. **Counters**: Live stats bar for Total, To read, Reading, Finished.
10. **Logging**: Maintain prompt log and AI error reflection in `PROMPTS.md`.
