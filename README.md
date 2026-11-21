# FORGE // UI — Component Workbench, WCAG A11y Auditor & AI Prompt Studio

[![CI](https://github.com/Nannidan/forge-ui-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/Nannidan/forge-ui-studio/actions)
**Live Demo:** [https://forge-ui-studio.vercel.app/](https://forge-ui-studio.vercel.app/)

Interactive design-token workbench and code generator engineered with **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## Architecture & Engineering Decisions

- **Real-Time WCAG 2.1 Relative Luminance & Contrast Engine (`src/utils/a11y.ts`):** Computes exact sRGB gamma-expanded luminance and contrast ratios (`:1`) on every color token edit, flagging AA (`4.5:1`) and AAA (`7.0:1`) compliance in real time.
- **Time-Travel Undo / Redo History Hook (`src/hooks/useHistoryState.ts`):** Immutable past/present/future state stack with keyboard shortcuts (`Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`) for non-destructive design iteration.
- **Interactive State Simulator (`src/components/LivePreview.tsx`):** Preview components across `Default`, `Hover`, `Loading`, and `Disabled` states simultaneously.
- **Persistent Component Vault (`src/hooks/useComponentVault.ts`):** Full `localStorage` CRUD drawer (`VaultDrawer.tsx`) for saving, loading, and managing custom component presets.
- **3-Format Deterministic Exporter (`src/utils/codeGenerator.ts`):** Generates copy-ready **React + Tailwind JSX**, **Tailwind v4 `@theme` CSS tokens**, and **structured AI design-system prompts**.

## Local Development

```bash
npm install
npm run dev
npm run lint
npm run build
```
