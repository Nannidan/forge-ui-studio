# FORGE // UI

An interactive **React 19 + TypeScript + Tailwind CSS v4** component workbench, accessibility auditor, and AI Prompt Spec generator.

---

## Key Features

- **Live Design Token Controls:** Real-time switching for Accent Palette, Surface Mode (*Solid*, *Glassmorphism*, *Outline*), Border Radius, Padding Scale, and Elevation/Glow across 4 component archetypes (*Card*, *Button*, *Alert*, *Stat Tile*).
- **Interactive State Simulator:** Toggle `Default`, `Loading` (skeleton/spinner with `aria-busy`), and `Disabled` (`aria-disabled`) states live—automatically reflected in the exported JSX.
- **Live WCAG 2.1 Accessibility Auditor:** Computes real-time luminance contrast ratios (`AAA` / `AA` / `Fail`) and verifies semantic ARIA/focus-ring compliance.
- **Saved Component Vault (`localStorage` CRUD):** Name, persist, reload, and delete custom component presets in a slide-out drawer.
- **Undo / Redo History Stack:** Full state-history stack with `Ctrl/Cmd + Z` and `Ctrl/Cmd + Shift + Z` keyboard shortcuts.
- **3-Format Export Engine:** One-click copy or file download (`.tsx`, `.css`, `.txt`) for **React + Tailwind JSX**, **Tailwind v4 `@theme inline` CSS Tokens**, and **AI Prompt Specs**.
- **Adaptive IDE Layout:** Pinned preview with a 3-tab dock (`Tokens` | `Content` | `Code`) on mobile; full-viewport `100dvh` split-pane workspace on desktop and ultrawide screens.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 (`@theme inline`) |
| Animation | Framer Motion (`MotionConfig reducedMotion="user"`) |
| Icons | Lucide React |
| Deployment | Vercel (CI/CD via GitHub) |

---

## Local Development

```bash
git clone [https://github.com/Nannidan/forge-ui-studio.git](https://github.com/Nannidan/forge-ui-studio.git)
cd forge-ui-studio
npm install
npm run dev
```
