# LoanSense.AI — Design System & Design Tokens Specification

**Version:** 2.0.0  
**Tone:** Trustworthy Fintech, Calm, Data-First, Precision Analytics  
**Architecture:** Vanilla HTML5, CSS3 Custom Properties, Vanilla ES6 JavaScript (Zero dependencies, offline `file://` compatible)

---

## 1. Design Principles

1. **Fintech Integrity over Flash:** Transitioned away from heavy glassmorphism, 3D card tilt, and button ripple effects to clean, accessible, high-contrast financial data visualization.
2. **Strict Semantic Color Discipline:** Accent colors (Indigo/Violet) are used strictly for brand identity and focus states. Emerald Green is exclusively reserved for approvals/success, Crimson Red exclusively for rejections/errors, and Amber for warnings/moderate risks.
3. **Tabular Precision:** All financial figures, ratios, probabilities, and model performance metrics use `font-variant-numeric: tabular-nums` for rock-solid visual alignment.
4. **Universal Accessibility (WCAG 2.1 AA):** High-contrast ratios (>4.5:1 for body text, >3:1 for graphical elements and large headings) across both Dark (default) and Light themes.
5. **Universal SVG Iconography:** Complete elimination of system-dependent emoji. All icons use a unified, accessible Lucide SVG sprite embedded directly into the DOM for offline execution.

---

## 2. Color Palette & Theme Tokens

All colors are exposed as CSS custom properties with automatic switching between `:root` (Dark Theme default) and `[data-theme="light"]` (Light Theme).

### 2.1 Dark Theme (Default)
| CSS Custom Property | Hex / Value | Description / Usage |
|---|---|---|
| `--bg-base` | `#0b0f19` | Deep slate-black page background |
| `--bg-surface` | `#111827` | Surface cards, tables, panels |
| `--bg-surface-elevated` | `#1f2937` | Modals, drawers, dropdown menus, tooltips |
| `--bg-subtle` | `rgba(255, 255, 255, 0.04)` | Inset tracks, pill backgrounds, zebra stripes |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Standard card and container borders (1px) |
| `--border-strong` | `rgba(255, 255, 255, 0.16)` | Active card borders, divider lines |
| `--border-focus` | `#6366f1` | 2px focus ring for keyboard navigation |
| `--text-primary` | `#f8fafc` | Primary headings, values, and high-emphasis labels |
| `--text-secondary` | `#94a3b8` | Body copy, descriptions, helper hints |
| `--text-muted` | `#64748b` | Sub-labels, inactive states, placeholder text |

### 2.2 Light Theme
| CSS Custom Property | Hex / Value | Description / Usage |
|---|---|---|
| `--bg-base` | `#f8fafc` | Crisp off-white page background |
| `--bg-surface` | `#ffffff` | Pure white surface cards, panels |
| `--bg-surface-elevated` | `#f1f5f9` | Drawers, popovers, active selection states |
| `--bg-subtle` | `rgba(15, 23, 42, 0.04)` | Inset tracks, pill backgrounds, zebra stripes |
| `--border-subtle` | `rgba(15, 23, 42, 0.08)` | Clean subtle borders |
| `--border-strong` | `rgba(15, 23, 42, 0.16)` | Active borders, input boundaries |
| `--border-focus` | `#4f46e5` | 2px accessible focus ring |
| `--text-primary` | `#0f172a` | Deep slate-900 primary text |
| `--text-secondary` | `#475569` | Slate-600 secondary body text |
| `--text-muted` | `#64748b` | Slate-500 helper and metadata text |

### 2.3 Brand & Semantic Tokens (Universal)
| CSS Custom Property | Dark Value | Light Value | Semantic Purpose |
|---|---|---|---|
| `--brand-primary` | `#6366f1` | `#4f46e5` | Primary actions, active highlights |
| `--brand-hover` | `#4f46e5` | `#4338ca` | Button hover and pressed states |
| `--brand-subtle` | `rgba(99, 102, 241, 0.12)` | `rgba(79, 70, 229, 0.08)` | Selected radio cards, badges |
| `--success` | `#10b981` | `#059669` | Loan approved, high accuracy, positive factors |
| `--success-subtle` | `rgba(16, 185, 129, 0.12)` | `rgba(5, 150, 105, 0.10)` | Approval badge and factor background |
| `--danger` | `#ef4444` | `#dc2626` | Loan rejected, high risk, negative factors |
| `--danger-subtle` | `rgba(239, 68, 68, 0.12)` | `rgba(220, 38, 38, 0.10)` | Rejection badge and factor background |
| `--warning` | `#f59e0b` | `#d97706` | Medium severity, threshold warning |
| `--warning-subtle` | `rgba(245, 158, 11, 0.12)` | `rgba(217, 119, 6, 0.10)` | Out-of-bounds warning pill background |
| `--info` | `#3b82f6` | `#2563eb` | Informational callouts, secondary metrics |
| `--info-subtle` | `rgba(59, 130, 246, 0.12)` | `rgba(37, 99, 235, 0.10)` | Disclaimer and tooltip background |

---

## 3. Typography Scale & Hierarchy

- **Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Headings Treatment:** `letter-spacing: -0.025em; text-wrap: balance;`
- **Data & Numeric Treatment:** `font-variant-numeric: tabular-nums;`

| Token / Role | Font Size | Line Height | Weight | Letter Spacing | Element / Usage |
|---|---|---|---|---|---|
| `--font-hero` | `48px` (3rem) | `1.15` | `800` | `-0.03em` | Hero H1 Headline |
| `--font-h2` | `32px` (2rem) | `1.25` | `700` | `-0.025em` | Section Titles (`#dataset`, `#predict`, etc.) |
| `--font-h3` | `22px` (1.375rem) | `1.3` | `600` | `-0.02em` | Card Headlines, Fieldset Group Headers |
| `--font-h4` | `18px` (1.125rem) | `1.4` | `600` | `-0.01em` | Subsection headers, Metric values |
| `--font-body` | `15px` (0.9375rem) | `1.55` | `400` | `0` | Primary reading copy, input fields |
| `--font-sm` | `13px` (0.8125rem) | `1.45` | `500` | `0` | Field labels, table body, helper hints |
| `--font-xs` | `11px` (0.6875rem) | `1.3` | `600` | `+0.04em` | Status chips, tags, uppercase badges |

---

## 4. Spacing System (8px Grid)

All layout paddings, gaps, and margins are aligned to multiples of 4px and 8px:
- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px`
- `--space-5`: `20px`
- `--space-6`: `24px`
- `--space-8`: `32px`
- `--space-10`: `40px`
- `--space-12`: `48px`
- `--space-16`: `64px`

---

## 5. Shape, Radius & Shadow Tokens

- **Border Radii:**
  - `--radius-xs`: `4px` (inline code tags, tiny indicator badges)
  - `--radius-sm`: `8px` (input controls, stepper buttons, segmented chips)
  - `--radius-md`: `12px` (inner cards, alert callouts, model radio cards)
  - `--radius-lg`: `16px` (main section cards, sticky prediction result panel)
  - `--radius-xl`: `24px` (hero preview card, feature containers)
  - `--radius-full`: `9999px` (pills, theme toggle switch, circular avatars)
- **Shadows:**
  - `--shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
  - `--shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`
  - `--shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`
  - `--shadow-focus`: `0 0 0 3px rgba(99, 102, 241, 0.35)`

---

## 6. Lucide SVG Icon Set Mapping

Icons are consolidated into an inline SVG sprite `<svg style="display:none"><symbol id="i-[name]">...</symbol></svg>`. All emoji have been replaced with the standard Lucide icon suite (`stroke-width="1.75"` or `"2.0"`, `stroke="currentColor"`, `fill="none"`):

| Component / Area | Old Representation | New Lucide SVG Sprite Symbol |
|---|---|---|
| Brand Logo | Ad-hoc SVG | `landmark` inside gradient squircle |
| Nav: Overview | — | `layout-dashboard` |
| Nav: Dataset | — | `database` |
| Nav: Limitations | — | `triangle-alert` |
| Nav: Insights | — | `lightbulb` |
| Nav: Models | — | `brain-circuit` |
| Nav: Predict | — | `sparkles` |
| Stat: Total Records | `users` ad-hoc | `users` |
| Stat: Approved | `check` ad-hoc | `circle-check` |
| Stat: Rejected | `x` ad-hoc | `circle-x` |
| Stat: Missing Data | `alert` ad-hoc | `circle-alert` |
| Limitation: Imbalance | `⚖️` | `scale` |
| Limitation: Missing Data | `🕳️` | `eraser` |
| Limitation: Small Sample | `📉` | `trending-down` |
| Limitation: Gender Bias | `🚻` | `users-round` |
| Limitation: Weak Predictors | `🎯` | `target` |
| Limitation: Synthetic Data | `🧪` | `flask-conical` |
| Limitation: No Temporal Data | `📅` | `calendar-off` |
| Limitation: Oversimplified | `📦` | `boxes` |
| Model Tab: Logistic Reg | `📈` | `chart-line` |
| Model Tab: Naive Bayes | `📊` | `chart-column` |
| Model Tab: KNN | `📍` | `scatter-chart` |
| Prediction Form Section 1 | (Unstructured) | `user` (Applicant Details) |
| Prediction Form Section 2 | (Unstructured) | `briefcase` (Employment & Income) |
| Prediction Form Section 3 | (Unstructured) | `wallet` (Credit & Assets) |
| Prediction Form Section 4 | (Unstructured) | `banknote` (Loan Request) |
| Result: Approved | `✅` | `circle-check-big` |
| Result: Rejected | `❌` | `circle-x` |
| Factor: Positive Impact | `✓` | `arrow-up-right` |
| Factor: Negative Impact | `✗` | `arrow-down-right` |
| Theme Toggle Button | — | `sun` / `moon` |
| Mobile Hamburger Menu | — | `menu` / `x` |
| Button: Predict | Ad-hoc arrow | `wand-sparkles` |
| Button: Reset | — | `rotate-ccw` |
| Button: Sample Fill | — | `sparkles` / `file-text` |

---

## 7. Interactive Form Component Specifications

1. **Model Radio Cards:** Replaces the native `<select>` dropdown with a 3-column segmented card control displaying Model Name, Badges ("Best Model", "Linear", "Instance-Based"), and live F1-Score metrics.
2. **Synchronized Sliders + Number Steppers:**
   - **Credit Score:** Synchronized range slider (300 to 900) with dynamic gradient track (`#ef4444` → `#f59e0b` → `#10b981`) and a live badge display.
   - **DTI Ratio:** Smooth slider (0.00 to 1.00) synced with formatted percentage indicator (`xx.x%`).
   - **Steppers:** Age, Dependents, and Existing Loans feature tactile `−` and `+` stepping buttons with input validation boundaries.
3. **Currency Formatter Adornments:** Inputs for Applicant Income, Co-applicant Income, Savings, Collateral, and Loan Amount include an anchored `₹` prefix, `inputmode="numeric"`, tabular numeral alignment, and localized Indian formatting on blur.
4. **Loan Term Segmented Chips:** Quick-select radio chips for 12, 24, 36, 48, 60, 72, and 84 months.
5. **Real-Time Validation & Warnings:**
   - Hard errors trigger `aria-invalid="true"`, red border, and error text linked via `aria-describedby`.
   - Out-of-dataset range warnings trigger soft amber alerts informing the user that predictions outside training bounds have reduced confidence.
6. **Gender Ethical Disclosure:** An informative tooltip pill noting that gender is a sensitive attribute present in the dataset and model weights for transparency.

---

## 8. Prediction Result Panel Architecture

- **Desktop Placement:** Pinned sticky column (~40% width) parallel to the 4 form groups, providing immediate visual feedback without requiring full-page scrolling.
- **Mobile Placement:** Transitions to a stacked column directly below the form, auto-scrolling into view on submit.
- **Dynamic Elements:**
  1. **SVG Probability Gauge:** Animated SVG circular ring (`stroke-dashoffset` transition) showing confidence 0% to 100%.
  2. **Categorical Result Headline:** High-contrast badge with icon and confidence verdict.
  3. **Key Factors List:** Categorized risk factors with directional impact arrows (`arrow-up-right` in emerald, `arrow-down-right` in red).
  4. **Tri-Model Consensus Matrix:** Comparative consensus bars for Logistic Regression, Naive Bayes, and KNN side by side.
  5. **Disclaimer Callout:** Styled info alert directly referencing dataset limitations.
