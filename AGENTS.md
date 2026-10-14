# AGENTS.md — Agent Guidelines & Regulations

> See detailed specifications in [agents/AGENTS.md](file:///d:/DEV/Test-1/agents/AGENTS.md).

This project follows strict agent guidelines:
1. **Incremental Feature Workflow**: Build, test with deliberate edge cases, commit.
2. **Wise Design System**: Strictly follow `design.md` tokens (Forest Ink `#163300`, Lime Voltage `#9fe870`, Fog `#e8ebe6`, Pill buttons `9999px`, 10px card radius, Inter font).
3. **Core Validation**: Title & Author required with specific inline errors (`"Please enter a title"`, `"Please enter an author"`).
4. **Ordering**: Newest books first.
5. **Search**: Case-insensitive title and author matching.
6. **Persistence**: `localStorage` data sync.
7. **Counters**: Live stats bar for Total, To read, Reading, Finished.
8. **Logging**: Maintain prompt log and AI error reflection in `PROMPTS.md`.
