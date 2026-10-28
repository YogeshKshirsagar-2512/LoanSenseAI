# Changelog — UI/UX Overhaul

## [v2.1.0] — Pure Light Theme & Silent Structure Architecture

**Date:** October 2026  
**Type:** Dedicated Light Mode Optimization & Visual Polish  
**Scope:** `styles.css`, `index.html`, `script.js`, `DESIGN.md`

### 1. Dedicated Pure Light Architecture
- **Night Version Retired:** Completely removed the dark mode toggle button (`#themeToggle`) and all legacy dark theme CSS overrides (`data-theme="light"` / `[data-theme="dark"]`).
- **Native Light Tokens:** Configured `:root` directly with permanent, high-contrast fintech light tokens. Cleaned up theme persistence in `script.js` so the application runs 100% natively in light mode with no flash of dark mode or dependency on storage state.

### 2. Silent Structure Background
- **Replaced Ambient Orbs:** Eliminated blurry floating background orbs and GPU blur filters.
- **Architectural Engineering Grid:** Added `.bg-silent-structure` with:
  - `.structure-grid`: 32px × 32px precision hairline grid (`rgba(15, 23, 42, 0.045)`) with an elliptical vignette fade.
  - `.structure-dots`: 96px × 96px coordinate dot matrix markers in faint indigo (`rgba(79, 70, 229, 0.08)`).
  - `.structure-glow`: Whisper-soft radial atmospheric illumination centered under the hero section.
  - `.structure-axis-lines`: Layout-aligned dashed boundary guide lines framing the 1320px content area.

### 3. Rigorous Color Visibility & Contrast Audit (WCAG AAA)
- **Primary Typography:** Tuned `--text-primary` to `#0f172a` (Slate-900), providing >16.5:1 contrast against pure white cards and `#f8fafc` canvas.
- **Secondary Typography:** Enhanced `--text-secondary` to `#334155` (Slate-700, 8.9:1 contrast) and `--text-muted` to `#526075` (Slate-600, 5.8:1 contrast).
- **Crisp Component Borders:** Replaced low-opacity borders with solid `#e2e8f0` (Slate-200) card borders and `#cbd5e1` (Slate-300) input/divider borders to prevent washed-out edges on white surfaces.
- **Form Controls:** Added subtle inner depth (`box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04)`), white input surfaces, dark `#0f172a` input values, and high-contrast currency prefix adornments (`₹`).
- **High-Contrast Confusion Matrix:** Tuned TN (`#ecfdf5` / `#047857`), FP (`#fef2f2` / `#b91c1c`), FN (`#fffbeb` / `#b45309`), and TP (`#eff6ff` / `#1d4ed8`) for crystal-clear readability.
- **Sticky Result Panel:** Circular SVG probability gauge track set to `#e2e8f0` with high-contrast emerald/red progress strokes, bold 900-weight probability numerals, and distinct decision factor pills.

---

## [v2.0.0] — Complete UI/UX Redesign & Optimization

**Date:** October 2026  
**Type:** Complete UI/UX Redesign & Optimization  
**Scope:** `index.html`, `styles.css`, `script.js`, `DESIGN.md`, `README.md`

### 1. Executive Summary
LoanSense.AI has been redesigned from a heavy glassmorphic prototype with ad-hoc emojis and unstructured forms into a trustworthy, precision fintech analytics dashboard. The application remains 100% offline-capable via `file://` (no frameworks, no npm, no backend), while delivering a modern banking analytics experience with complete WCAG 2.1 AA accessibility.

### 2. Key Improvements & Rationale
- **Iconography Overhaul (Zero Emoji):** Integrated an inline Lucide SVG sprite embedded directly into `index.html` (55 unique symbols).
- **Redesigned Navigation & Header:** Sticky header with scroll-spy, 2px progress bar, model active chip, and mobile drawer.
- **Two-Column Hero:** Dynamic champion preview card (Naive Bayes, F1 80.2%) alongside direct CTAs and trust indicators.
- **Structured 4-Domain Form:** 18 inputs grouped into Applicant, Employment, Credit, and Loan Request with sliders, steppers, and currency formatting.
- **Sticky Prediction Result Panel:** Circular SVG probability gauge, directional factor arrows, and tri-model consensus matrix.
- **De-cluttered Visuals:** Removed 3D tilt effects and unconstrained button ripples.
