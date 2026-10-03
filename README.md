# 🏦 LoanSense.AI — Loan Approval Prediction System

![LoanSense AI](https://img.shields.io/badge/Status-Active-success.svg) ![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Scikit--Learn-orange.svg) ![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow.svg)

LoanSense.AI is an interactive, browser-based Machine Learning dashboard that predicts loan approval outcomes. It trains three different ML classifiers (Logistic Regression, Naive Bayes, and K-Nearest Neighbors) on a dataset of 1,000 applications and exports the models to run entirely client-side using raw mathematical implementations in JavaScript.

## ✨ Features

- **🧠 Real ML Models in Browser:** Models are trained using Python (scikit-learn) and exported. The browser executes inference locally (Sigmoid for LR, Gaussian PDF for NB, Euclidean distance for KNN).
- **📊 Interactive Model Evaluation:** Compare the performance of the three models with animated metric cards, interactive confusion matrices, and dynamic F1-score comparisons.
- **🔮 Real-Time Predictions:** Enter applicant details into the 18-field form to instantly see the approval probability across all three models.
- **🎨 Premium UI/UX:** Built with a modern dark-theme glassmorphism aesthetic, featuring 3D hover tilt effects, button ripples, and ambient background animations.
- **📱 Fully Responsive:** Adapts flawlessly to mobile, tablet, and desktop views.

## 🚀 Technical Architecture

1. **Python / Scikit-Learn Pipeline (`LoanApprovalSystem.ipynb`):**
   - Handles missing values and label encoding.
   - One-hot encodes categorical variables.
   - Engineers enhanced features (`Credit_Score²` and `DTI_Ratio²`).
   - Trains Logistic Regression, Gaussian Naive Bayes, and KNN models.
   - Exports the model coefficients, standard scaler means/scales, and class priors to `model_data.js`.

2. **Frontend (`index.html`, `styles.css`, `script.js`):**
   - No backend required!
   - JavaScript reconstructs the 27-feature standardized vector.
   - Evaluates the vector against the exported ML weights entirely in the DOM.

## 📈 Model Performance

| Metric | Logistic Regression | Naive Bayes 🏆 | KNN (K=5) |
|--------|:---:|:---:|:---:|
| **Accuracy** | 87.0% | **88.0%** | 75.0% |
| **Precision** | 83.1% | **86.9%** | 66.7% |
| **Recall** | 75.5% | 74.5% | 46.9% |
| **F1-Score** | 79.1% | **80.2%** | 55.1% |

*Note: Naive Bayes was selected as the default prediction model due to the highest overall F1-score after feature enhancement.*

## 💻 Getting Started

Simply open `index.html` in any modern web browser to interact with the dashboard. Because all ML inference is handled via JavaScript, no local server or Python environment is required to use the UI!

To retrain the models:
1. Run the `LoanApprovalSystem.ipynb` notebook.
2. Export the resulting weights into `model_data.js`.
3. Refresh the page.

