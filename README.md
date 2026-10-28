# LoanSense.AI — Intelligent Underwriting & Risk Prediction System

![LoanSense AI](https://img.shields.io/badge/Status-Active-success.svg) ![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Scikit--Learn-orange.svg) ![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla%20HTML%2FCSS%2FJS-blue.svg) ![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-emerald.svg)

LoanSense.AI is an interactive, browser-based Machine Learning underwriting dashboard that predicts loan approval outcomes in real time. It trains three different ML classifiers (Logistic Regression, Gaussian Naive Bayes, and K-Nearest Neighbors) on an empirical dataset of 1,000 loan applications and exports the trained weights to run client-side via raw mathematical operations in vanilla JavaScript with 0ms server latency.

---

## ✨ Features & Architecture

- **Real ML Inference in Browser:** All models are trained in Python using scikit-learn and exported as standardized weights (`model_data.js`). The browser executes mathematical inference locally (Sigmoid for Logistic Regression, Gaussian PDF for Naive Bayes, Euclidean distance for KNN) with zero data leaving the user's device.
- **Fintech-Grade UI/UX:** Built with a clean, high-contrast fintech aesthetic featuring:
  - **Dedicated Pure Light Architecture:** Clean, high-contrast fintech aesthetic with a silent architectural structure background, engineered specifically for readability and precision data analysis.
  - **Zero Emoji / Unified SVG Sprite:** Completely standardized using Lucide SVG icons embedded into an offline-ready sprite.
  - **Two-Column Hero & Live Benchmark:** Dynamic benchmark preview card showing the champion model's accuracy (88.0%) and F1-score (80.2%) alongside direct CTAs.
  - **4-Domain Grouped Prediction Form:** 18 loan parameters organized into Applicant Profile, Employment & Income, Credit & Assets, and Loan Request with synchronized sliders, steppers, segmented tenure chips, and currency inputs with ₹ adornments.
  - **Sticky Circular Gauge Result Panel:** Real-time feedback with an animated SVG probability gauge, decision impact factors with directional arrows, and a tri-model consensus matrix.
  - **Collapsible Limitations Accordion:** 8 data caveats categorized by severity (High, Medium, Low) with interactive filtering.
  - **Dynamic Feature Schema Filtering:** Instant real-time text search and category chips across all 20 dataset features.
- **Strict Offline Compatibility:** Works by double-clicking `index.html` from `file://` with no build steps, node servers, or external asset dependencies.
- **Fully Responsive & Accessible:** Optimized for 390px mobile viewports through 1440px desktop screens with semantic landmarks, keyboard focus rings, and WCAG AA contrast.

---

## 📈 Model Benchmark Performance

| Evaluation Metric | Logistic Regression | Gaussian Naive Bayes (Champion) | KNN (K=5) |
|---|:---:|:---:|:---:|
| **Accuracy** | 87.0% | **88.0%** | 75.0% |
| **Precision** | 83.1% | **86.9%** | 66.7% |
| **Recall** | 75.5% | 74.5% | 46.9% |
| **F1-Score** | 79.1% | **80.2%** | 55.1% |

*Note: Gaussian Naive Bayes was selected as the default champion prediction model due to achieving the highest overall F1-score (80.2%) after quadratic feature enhancement (`Credit_Score²` and `DTI_Ratio²`).*

---

## 🚀 Quick Start

Simply open `index.html` in any modern web browser:
```bash
# Double-click index.html or open via terminal
start index.html  # Windows
open index.html   # macOS
```

Because all ML inference runs in vanilla JavaScript, no local server, Python runtime, or internet connection is required to interact with the dashboard.

---

## 🛠 Retraining the Machine Learning Models

1. Launch `LoanApprovalSystem.ipynb` in Jupyter Notebook or VS Code.
2. Execute all pipeline cells to handle missing values, engineer enhanced features, and train the classifiers.
3. Export the resulting weights, scaling parameters, and priors into `model_data.js`.
4. Refresh `index.html` to instantly load the updated model parameters.

---

## 📄 Design & Changelog Documentation

- Detailed design tokens, typography, and color specifications: [`DESIGN.md`](./DESIGN.md)
- Complete UI/UX changes and implementation notes: [`CHANGELOG-UI.md`](./CHANGELOG-UI.md)
