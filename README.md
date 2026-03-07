# KodNest Premium Build System

## Overview
A **premium SaaS design system** for the **KodNest Premium Build System** product. It provides a calm, intentional, coherent, and confident visual language suitable for a serious B2C company.

### Design Philosophy
- Calm, intentional, coherent, confident
- No flashy, loud, playful, or hackathon‑style elements
- No gradients, glass‑morphism, neon colors, or noisy animations

### Color System (max 4 colors)
| Role      | Hex Code |
|-----------|----------|
| Background| `#F7F6F3` (off‑white) |
| Primary Text | `#111111` |
| Accent (Primary) | `#8B0000` (deep red) |
| Success | Muted green (`#6B8E23`) |
| Warning | Muted amber (`#D4A017`) |

### Typography
- **Headings** – Serif font (e.g., *Merriweather*), large, confident, generous line‑height and spacing.
- **Body** – Clean sans‑serif (e.g., *Inter*), 16‑18 px, line‑height 1.6‑1.8, max width 720 px.

### Spacing Scale
Only the following values are allowed (no arbitrary numbers): `8px`, `16px`, `24px`, `40px`, `64px`.

### Global Layout Structure
```
[Top Bar] → [Context Header] → [Primary Workspace + Secondary Panel] → [Proof Footer]
```
- **Top Bar** – left: project name; center: progress indicator; right: status badge.
- **Context Header** – large serif headline with a one‑line sub‑text.
- **Primary Workspace** – 70 % width, clean cards, predictable components.
- **Secondary Panel** – 30 % width, step explanation, copyable prompt box, action buttons.
- **Proof Footer** – persistent checklist: UI Built, Logic Working, Test Passed, Deployed.

### Component Rules
- Primary button: solid deep red, secondary button: outlined.
- Uniform hover effect and border‑radius.
- Inputs: clean borders, clear focus state, no heavy shadows.
- Cards: subtle border, balanced padding, no drop shadows.
- Transitions: 150‑200 ms, ease‑in‑out, no bounce/parallax.

### Usage
1. Include the stylesheet:
```html
<link rel="stylesheet" href="design-system.css" />
```
2. Use the provided class names (see component reference below).
3. Follow the spacing scale and typography guidelines.

### Component Reference (HTML class names)
- `.top-bar`, `.context-header`, `.main-content`, `.primary-workspace`, `.secondary-panel`, `.proof-footer`
- Buttons: `.button-primary`, `.button-secondary`
- Inputs: `.input`
- Cards: `.card`
- State messages: `.state-error`, `.state-success`, `.state-warning`
- Checkboxes: `.proof-checkbox`

### Example Layout
See `index.html` in this repository for a full example that demonstrates all sections and components.

---
*This design system is intentionally minimal yet premium, ready to be extended with additional components as needed.*
