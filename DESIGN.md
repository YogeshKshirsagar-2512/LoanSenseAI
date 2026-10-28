# LoanSense.AI — Design System & Design Tokens Specification

**Version:** 2.1.0  
**Tone:** Trustworthy Fintech, Calm, Data-First, Precision Analytics  
**Architecture:** Vanilla HTML5, CSS3 Custom Properties, Vanilla ES6 JavaScript (Dedicated Pure Light Theme with Silent Structure)

---

## 1. Design Principles

1. **Fintech Integrity over Flash:** Clean, accessible, high-contrast financial data visualization without noisy gradients or heavy glassmorphism.
2. **Dedicated Pure Light Architecture:** Engineered as a native, permanent light-mode fintech dashboard with high-contrast slate surfaces, eliminating night/dark version toggles.
3. **Silent Structure Background:** An architectural background composed of a 32px precision micro-grid, faint 96px dot coordinates, and container-aligned structural guide lines for a calm, engineered feel.
4. **Strict Semantic Color Discipline:** Accent colors (Indigo/Violet) are used strictly for brand identity and focus states. Emerald Green is exclusively reserved for approvals/success, Crimson Red exclusively for rejections/errors, and Amber for warnings/moderate risks.
5. **Tabular Precision:** All financial figures, ratios, probabilities, and model performance metrics use `font-variant-numeric: tabular-nums` for rock-solid visual alignment.
6. **Universal Accessibility (WCAG 2.1 AAA/AA):** Ultra-high contrast ratios (>16:1 for primary text on white, >8.9:1 for secondary text, >5.8:1 for metadata) ensuring crystal-clear readability across all displays.
7. **Universal SVG Iconography:** 100% elimination of system-dependent emoji. All icons use a unified, accessible Lucide SVG sprite embedded directly into the DOM for offline execution.

---

## 2. Color Palette & Theme Tokens

### 2.1 Base Surface Tokens
| CSS Custom Property | Value | Description / Usage |
|---|---|---|
| `--bg-base` | `#f8fafc` | Clean slate-50 canvas |
| `--bg-surface` | `#ffffff` | Pure white crisp card surface |
| `--bg-surface-hover` | `#f8fafc` | Subtle card hover tint |
| `--bg-surface-elevated` | `#f1f5f9` | Slate-100 for control backdrops & wells |
| `--bg-subtle` | `#f1f5f9` | Slate-100 for secondary backgrounds |
| `--bg-glass` | `rgba(255, 255, 255, 0.94)` | High-opacity crisp navbar glass with backdrop-filter |

### 2.2 Border & Focus Tokens
| CSS Custom Property | Value | Description / Usage |
|---|---|---|
| `--border-subtle` | `#e2e8f0` | Slate-200 visible card and table borders (1px) |
| `--border-strong` | `#cbd5e1` | Slate-300 strong divider and input borders |
| `--border-focus` | `#4f46e5` | Indigo-600 focus ring for keyboard navigation |
| `--shadow-focus` | `0 0 0 3px rgba(79, 70, 229, 0.18)` | Accessible focus elevation ring |

### 2.3 High-Contrast Readability Typography (WCAG AAA)
| CSS Custom Property | Value | Description / Usage |
|---|---|---|
| `--text-primary` | `#0f172a` | Slate-900 (16.5:1 on white, ultra-readable) |
| `--text-secondary` | `#334155` | Slate-700 (8.9:1 on white, crisp metadata) |
| `--text-muted` | `#526075` | Slate-600 (5.8:1 on white, clear helper text) |

### 2.4 Brand & Semantic Tokens
| CSS Custom Property | Value | Semantic Purpose |
|---|---|---|
| `--brand-primary` | `#4f46e5` | Primary actions, active highlights |
| `--brand-hover` | `#4338ca` | Button hover and pressed states |
| `--brand-subtle` | `#eef2ff` | Indigo-50 for badge and card backdrops |
| `--brand-border` | `#c7d2fe` | Indigo-200 for subtle brand container borders |
| `--success` | `#059669` | Emerald-600 for approved metrics and gauges |
| `--success-dark` | `#047857` | Emerald-700 for high-contrast readable text |
| `--success-subtle` | `#ecfdf5` | Emerald-50 for approval card fills |
| `--success-border` | `#a7f3d0` | Emerald-200 for approval borders |
| `--danger` | `#dc2626` | Red-600 for rejected metrics and gauges |
| `--danger-dark` | `#b91c1c` | Red-700 for high-contrast readable text |
| `--danger-subtle` | `#fef2f2` | Red-50 for rejection card fills |
| `--danger-border` | `#fecaca` | Red-200 for rejection borders |
| `--warning` | `#d97706` | Amber-600 for caveats and missing data rates |
| `--warning-dark` | `#b45309` | Amber-700 for high-contrast readable text |
| `--warning-subtle` | `#fffbeb` | Amber-50 for caveat badge fills |
| `--warning-border` | `#fde68a` | Amber-200 for caveat borders |
| `--info` | `#2563eb` | Blue-600 for informational callouts and TP cells |
| `--info-dark` | `#1d4ed8` | Blue-700 for high-contrast readable text |
| `--info-subtle` | `#eff6ff` | Blue-50 for info badge fills |
| `--info-border` | `#bfdbfe` | Blue-200 for info borders |

---

## 3. Background Architecture — Silent Structure

The background replaces floating ambient orbs with an engineered structural backdrop:
1. **`.structure-grid`:** A 32px × 32px precision coordinate hairline grid (`rgba(15, 23, 42, 0.045)`) masked with an elliptical vignette fade.
2. **`.structure-dots`:** A 96px × 96px dot matrix in faint indigo (`rgba(79, 70, 229, 0.08)`).
3. **`.structure-glow`:** A whisper-soft radial glow at the top center.
4. **`.structure-axis-lines`:** Container-aligned dashed boundary guidelines matching the 1320px content layout.
