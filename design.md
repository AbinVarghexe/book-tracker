# Duolingo — Style Reference
> Playful classroom mascot on white paper

**Theme:** light

Duolingo's interface treats the page like a children's storybook: white paper canvas, chubby rounded display type, and a single saturated green that reads as 'correct answer' the moment it appears. Body copy stays calm in mid-gray so the green and its accent blue can do all the emotional work — green for progress and headings, blue for interactive links and secondary actions. Components are pill-shaped or chunky-rounded with thick 2px borders in black or color, giving every button the feel of a sticker pressed onto the page rather than a flat UI control.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Eager Green | `#58cc02` | `--color-eager-green` | Green text accent for links, tags, and emphasized short phrases. Primary CTA fill and display headlines |
| Eager Green Dark | `#46a302` | `--color-eager-green-dark` | 3D bevel / bottom shadow for Eager Green buttons |
| Storybook Green | `#d7ffb8` | `--color-storybook-green` | Soft highlight wash on light surfaces, subtle background tints |
| Spark Blue | `#1cb0f6` | `--color-spark-blue` | Blue text accent for links, tags, and emphasized short phrases |
| Spark Blue Dark | `#1899d6` | `--color-spark-blue-dark` | 3D bevel / bottom shadow for Spark Blue buttons |
| Fresh Leaf | `#a5ed6e` | `--color-fresh-leaf` | Green supporting accent |
| Night Ink | `#000437` | `--color-night-ink` | Violet text accent for links, tags, and emphasized short phrases |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on green/dark fills |
| Charcoal | `#4b4b4b` | `--color-charcoal` | Hero headings and primary body copy |
| Pencil Gray | `#777777` | `--color-pencil-gray` | Muted body paragraphs, secondary descriptive text |
| Border Gray | `#e5e5e5` | `--color-border-gray` | Card borders, secondary button borders |
| Faded Gray | `#afafaf` | `--color-faded-gray` | Disabled or low-emphasis nav labels and button borders |
| Amber Read | `#ff9600` | `--color-amber-read` | Status To Read accent |
| Amber Read Dark | `#d97f00` | `--color-amber-read-dark` | 3D bevel for amber buttons |

## Tokens — Typography

### Display — Nunito Black / ExtraBold (Substitute for Feather)
- **Family:** `'Nunito', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Weights:** 700, 800, 900
- **Tracking:** -0.0200em
- **Role:** Display headlines, section titles, hero headlines

### Body / UI — Nunito / Nunito Sans
- **Family:** `'Nunito', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Weights:** 500, 600, 700, 800
- **Nav Labels:** 15px uppercase, tracking `0.0530em`, weight 700
- **Buttons:** 15px uppercase, tracking `0.0530em`, weight 800

## Tokens — Spacing & Radii

- **Border Radius:** `12px` - `16px` (chunky 3D rounded components)
- **3D Bottom Bevels:** `box-shadow: 0 4px 0 <darker-shade>;`
- **Active Click State:** `transform: translateY(2px); box-shadow: 0 2px 0 <darker-shade>;`
