// =============================================
// LOAN APPROVAL SYSTEM — ML PREDICTION ENGINE
// Actual trained models running in the browser
// =============================================

let MODEL_DATA = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCounters();
    initScrollAnimations();
    loadModelData();
});

// === Load model data from globally embedded JS ===
function loadModelData() {
    if (window.MODEL_DATA_RAW) {
        MODEL_DATA = window.MODEL_DATA_RAW;
        console.log('Model data loaded:', MODEL_DATA.feature_names.length, 'features');
        initModelEvaluation();
        initPredictionForm();
    } else {
        console.error('MODEL_DATA_RAW not found. Make sure model_data.js is loaded before script.js.');
        document.getElementById('comparisonVerdict').textContent =
            '❌ Failed to load model data. Make sure model_data.js exists.';
    }
}

// === Navbar scroll behavior ===
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('data-section') === id);
                    });
                }
            });
        },
        { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(link.getAttribute('data-section'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// === Animated counters ===
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    animateCounter(el, parseInt(el.getAttribute('data-count'), 10));
                    counterObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.5 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));
}

function animateCounter(el, target) {
    const duration = 1500;
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// === Scroll-triggered animations ===
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.limitation-card, .insight-card, .chart-card, .feature-table-card, .metric-card, .cm-card, .comparison-card'
    );

    const animObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 80);
                    animObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animObserver.observe(el);
    });

    const barFills = document.querySelectorAll('.bar-fill, .h-bar-fill');
    const barObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetWidth = el.style.width;
                    el.style.width = '0%';
                    setTimeout(() => { el.style.width = targetWidth; }, 200);
                    barObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.3 }
    );
    barFills.forEach((bar) => barObserver.observe(bar));
}

// ============================================
// MODEL EVALUATION SECTION
// ============================================

function initModelEvaluation() {
    if (!MODEL_DATA) return;

    const metrics = MODEL_DATA.metrics;

    // Populate tab F1 scores
    document.getElementById('tabF1LR').textContent = (metrics.logistic_regression.f1 * 100).toFixed(1) + '%';
    document.getElementById('tabF1NB').textContent = (metrics.naive_bayes.f1 * 100).toFixed(1) + '%';
    document.getElementById('tabF1KNN').textContent = (metrics.knn.f1 * 100).toFixed(1) + '%';

    // Populate comparison table
    populateComparisonTable(metrics);

    // Set up tab switching
    const tabs = document.querySelectorAll('.model-tab');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            displayModelMetrics(tab.getAttribute('data-model'));
        });
    });

    // Show default best model
    const bestModel = MODEL_DATA.best_model || 'naive_bayes';
    tabs.forEach((t) => {
        if (t.getAttribute('data-model') === bestModel) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });
    displayModelMetrics(bestModel);
}

function displayModelMetrics(modelKey) {
    if (!MODEL_DATA) return;

    const m = MODEL_DATA.metrics[modelKey];
    const modelNames = {
        logistic_regression: 'Logistic Regression',
        naive_bayes: 'Naive Bayes',
        knn: 'KNN (K=5)'
    };

    // Update metric cards with animation
    animateMetric('metricAccuracy', 'barAccuracy', m.accuracy);
    animateMetric('metricPrecision', 'barPrecision', m.precision);
    animateMetric('metricRecall', 'barRecall', m.recall);
    animateMetric('metricF1', 'barF1', m.f1);

    // Update confusion matrix
    const cm = m.confusion_matrix;
    document.querySelector('#cmTN .cm-cell-value').textContent = cm[0][0];
    document.querySelector('#cmFP .cm-cell-value').textContent = cm[0][1];
    document.querySelector('#cmFN .cm-cell-value').textContent = cm[1][0];
    document.querySelector('#cmTP .cm-cell-value').textContent = cm[1][1];
    document.getElementById('cmModelLabel').textContent = modelNames[modelKey];
    document.getElementById('cmTotal').textContent = cm[0][0] + cm[0][1] + cm[1][0] + cm[1][1];
}

function animateMetric(valueId, barId, value) {
    const valueEl = document.getElementById(valueId);
    const barEl = document.getElementById(barId);

    const targetPct = (value * 100);
    const duration = 800;
    const startTime = performance.now();
    const startVal = parseFloat(valueEl.textContent) || 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startVal + (targetPct - startVal) * eased;
        valueEl.textContent = current.toFixed(1) + '%';
        barEl.style.width = current + '%';
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function populateComparisonTable(metrics) {
    const data = {
        accuracy: {
            lr: metrics.logistic_regression.accuracy,
            nb: metrics.naive_bayes.accuracy,
            knn: metrics.knn.accuracy
        },
        precision: {
            lr: metrics.logistic_regression.precision,
            nb: metrics.naive_bayes.precision,
            knn: metrics.knn.precision
        },
        recall: {
            lr: metrics.logistic_regression.recall,
            nb: metrics.naive_bayes.recall,
            knn: metrics.knn.recall
        },
        f1: {
            lr: metrics.logistic_regression.f1,
            nb: metrics.naive_bayes.f1,
            knn: metrics.knn.f1
        }
    };

    const fmt = (v) => (v * 100).toFixed(2) + '%';

    // Fill values and highlight best
    for (const [metric, vals] of Object.entries(data)) {
        const best = Math.max(vals.lr, vals.nb, vals.knn);
        const ids = {
            lr: `cmp${metric === 'accuracy' ? 'LRAcc' : metric === 'precision' ? 'LRPrec' : metric === 'recall' ? 'LRRec' : 'LRF1'}`,
            nb: `cmp${metric === 'accuracy' ? 'NBAcc' : metric === 'precision' ? 'NBPrec' : metric === 'recall' ? 'NBRec' : 'NBF1'}`,
            knn: `cmp${metric === 'accuracy' ? 'KNNAcc' : metric === 'precision' ? 'KNNPrec' : metric === 'recall' ? 'KNNRec' : 'KNNF1'}`
        };

        for (const [key, id] of Object.entries(ids)) {
            const el = document.getElementById(id);
            el.textContent = fmt(vals[key]);
            if (vals[key] === best) el.classList.add('best-value');
        }
    }

    // Verdict
    const bestModel = MODEL_DATA.best_model;
    const bestF1 = (metrics[bestModel].f1 * 100).toFixed(1);
    const modelNames = {
        logistic_regression: 'Logistic Regression',
        naive_bayes: 'Naive Bayes',
        knn: 'KNN'
    };
    document.getElementById('comparisonVerdict').innerHTML =
        `🏆 <strong>${modelNames[bestModel]}</strong> is the best model with F1-Score: <strong>${bestF1}%</strong>`;
}

// ============================================
// ML PREDICTION ENGINE (runs in browser)
// ============================================

/**
 * Build the 27-feature vector from form inputs,
 * matching the exact order from the training pipeline with Enhanced Features.
 */
function buildFeatureVector(formData) {
    const vector = [];

    // Numeric features (excluding original Credit_Score and DTI_Ratio)
    vector.push(formData.income);                  // Applicant_Income
    vector.push(formData.coIncome);                // Coapplicant_Income
    vector.push(formData.age);                     // Age
    vector.push(formData.dependents);              // Dependents
    vector.push(formData.existingLoans);           // Existing_Loans
    vector.push(formData.savings);                 // Savings
    vector.push(formData.collateral);              // Collateral_Value
    vector.push(formData.loanAmount);              // Loan_Amount
    vector.push(formData.loanTerm);                // Loan_Term

    // Education_Level: Graduate=0, Not Graduate=1
    vector.push(formData.education === 'Not Graduate' ? 1 : 0);

    // Employment_Status OneHot (drop first = Contract)
    vector.push(formData.employment === 'Salaried' ? 1 : 0);
    vector.push(formData.employment === 'Self-employed' ? 1 : 0);
    vector.push(formData.employment === 'Unemployed' ? 1 : 0);

    // Marital_Status OneHot (drop first = Married)
    vector.push(formData.maritalStatus === 'Single' ? 1 : 0);

    // Loan_Purpose OneHot (drop first = Business)
    vector.push(formData.loanPurpose === 'Car' ? 1 : 0);
    vector.push(formData.loanPurpose === 'Education' ? 1 : 0);
    vector.push(formData.loanPurpose === 'Home' ? 1 : 0);
    vector.push(formData.loanPurpose === 'Personal' ? 1 : 0);

    // Property_Area OneHot (drop first = Rural)
    vector.push(formData.propertyArea === 'Semiurban' ? 1 : 0);
    vector.push(formData.propertyArea === 'Urban' ? 1 : 0);

    // Gender OneHot (drop first = Female)
    vector.push(formData.gender === 'Male' ? 1 : 0);

    // Employer_Category OneHot (drop first = Business)
    vector.push(formData.employerCategory === 'Government' ? 1 : 0);
    vector.push(formData.employerCategory === 'MNC' ? 1 : 0);
    vector.push(formData.employerCategory === 'Private' ? 1 : 0);
    vector.push(formData.employerCategory === 'Unemployed' ? 1 : 0);

    // Enhanced Features
    vector.push(Math.pow(formData.creditScore, 2)); // Enhanced_credit_score
    vector.push(Math.pow(formData.dtiRatio, 2));    // Enhanced_DTI_Ratio

    return vector;
}

/**
 * StandardScaler transform: (x - mean) / scale
 */
function scaleFeatures(rawVector) {
    const mean = MODEL_DATA.scaler.mean;
    const scale = MODEL_DATA.scaler.scale;
    return rawVector.map((val, i) => (val - mean[i]) / scale[i]);
}

/**
 * Logistic Regression: sigmoid(dot(coef, x) + intercept)
 */
function predictLogisticRegression(scaledVector) {
    const coef = MODEL_DATA.models.logistic_regression.coefficients;
    const intercept = MODEL_DATA.models.logistic_regression.intercept;

    let z = intercept;
    for (let i = 0; i < coef.length; i++) {
        z += coef[i] * scaledVector[i];
    }

    const probability = 1 / (1 + Math.exp(-z));
    return {
        prediction: probability >= 0.5 ? 1 : 0,
        probability: probability,
        label: probability >= 0.5 ? 'Approved' : 'Rejected'
    };
}

/**
 * Gaussian Naive Bayes: P(class|X) ∝ P(class) * Π P(xi|class)
 * where P(xi|class) = Gaussian(xi; mu, sigma^2)
 */
function predictNaiveBayes(scaledVector) {
    const priors = MODEL_DATA.models.naive_bayes.class_prior;
    const theta = MODEL_DATA.models.naive_bayes.theta;   // means per class
    const variance = MODEL_DATA.models.naive_bayes.var;   // variance per class

    // Calculate log-probability for each class
    const logProbs = [];
    for (let c = 0; c < 2; c++) {
        let logP = Math.log(priors[c]);
        for (let i = 0; i < scaledVector.length; i++) {
            const mu = theta[c][i];
            const v = variance[c][i];
            // log of Gaussian PDF
            logP += -0.5 * Math.log(2 * Math.PI * v) - 0.5 * Math.pow(scaledVector[i] - mu, 2) / v;
        }
        logProbs.push(logP);
    }

    // Convert to probabilities via log-sum-exp
    const maxLog = Math.max(...logProbs);
    const expSum = logProbs.reduce((sum, lp) => sum + Math.exp(lp - maxLog), 0);
    const probs = logProbs.map((lp) => Math.exp(lp - maxLog) / expSum);

    return {
        prediction: probs[1] >= 0.5 ? 1 : 0,
        probability: probs[1],
        label: probs[1] >= 0.5 ? 'Approved' : 'Rejected'
    };
}

/**
 * K-Nearest Neighbors: Find K closest training points, majority vote
 */
function predictKNN(scaledVector) {
    const k = MODEL_DATA.models.knn.k;
    const X_train = MODEL_DATA.models.knn.X_train;
    const y_train = MODEL_DATA.models.knn.y_train;

    // Calculate Euclidean distances
    const distances = X_train.map((trainPoint, idx) => {
        let dist = 0;
        for (let i = 0; i < scaledVector.length; i++) {
            dist += Math.pow(scaledVector[i] - trainPoint[i], 2);
        }
        return { distance: Math.sqrt(dist), label: y_train[idx] };
    });

    // Sort by distance and take K nearest
    distances.sort((a, b) => a.distance - b.distance);
    const kNearest = distances.slice(0, k);

    // Majority vote
    const approvedCount = kNearest.filter((n) => n.label === 1).length;
    const probability = approvedCount / k;

    return {
        prediction: probability >= 0.5 ? 1 : 0,
        probability: probability,
        label: probability >= 0.5 ? 'Approved' : 'Rejected'
    };
}

/**
 * Predict using a specific model
 */
function predict(modelKey, scaledVector) {
    switch (modelKey) {
        case 'logistic_regression':
            return predictLogisticRegression(scaledVector);
        case 'naive_bayes':
            return predictNaiveBayes(scaledVector);
        case 'knn':
            return predictKNN(scaledVector);
        default:
            return predictLogisticRegression(scaledVector);
    }
}

// ============================================
// PREDICTION FORM
// ============================================

function initPredictionForm() {
    const form = document.getElementById('predictForm');
    const result = document.getElementById('predictResult');
    const modelSelect = document.getElementById('predictModelSelect');
    const indicatorText = document.querySelector('.model-indicator-text');

    // Update indicator when model changes
    modelSelect.addEventListener('change', () => {
        const names = {
            logistic_regression: 'Logistic Regression',
            naive_bayes: 'Naive Bayes',
            knn: 'KNN (K=5)'
        };
        indicatorText.textContent = names[modelSelect.value];
    });

    // Default to the best model dynamically
    if (MODEL_DATA && MODEL_DATA.best_model) {
        modelSelect.value = MODEL_DATA.best_model;
        modelSelect.dispatchEvent(new Event('change'));
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!MODEL_DATA) {
            alert('Model data not loaded yet. Please wait or check console for errors.');
            return;
        }

        // Collect form data
        const formData = {
            income: parseFloat(document.getElementById('income').value) || 0,
            coIncome: parseFloat(document.getElementById('coIncome').value) || 0,
            age: parseFloat(document.getElementById('age').value) || 35,
            dependents: parseFloat(document.getElementById('dependents').value) || 0,
            creditScore: parseFloat(document.getElementById('creditScore').value) || 650,
            existingLoans: parseFloat(document.getElementById('existingLoans').value) || 0,
            dtiRatio: parseFloat(document.getElementById('dtiRatio').value) || 0.3,
            savings: parseFloat(document.getElementById('savings').value) || 0,
            collateral: parseFloat(document.getElementById('collateral').value) || 0,
            loanAmount: parseFloat(document.getElementById('loanAmount').value) || 0,
            loanTerm: parseFloat(document.getElementById('loanTerm').value) || 48,
            education: document.getElementById('education').value,
            employment: document.getElementById('employment').value,
            maritalStatus: document.getElementById('maritalStatus').value,
            loanPurpose: document.getElementById('loanPurpose').value,
            propertyArea: document.getElementById('propertyArea').value,
            gender: document.getElementById('gender').value,
            employerCategory: document.getElementById('employerCategory').value
        };

        // Build feature vector and scale
        const rawVector = buildFeatureVector(formData);
        const scaledVector = scaleFeatures(rawVector);

        // Predict with selected model
        const selectedModel = modelSelect.value;
        const mainResult = predict(selectedModel, scaledVector);

        // Predict with ALL models for comparison
        const allResults = {
            logistic_regression: predict('logistic_regression', scaledVector),
            naive_bayes: predict('naive_bayes', scaledVector),
            knn: predict('knn', scaledVector)
        };

        // Render main result
        const approved = mainResult.prediction === 1;
        result.classList.remove('hidden', 'approved', 'rejected');
        result.classList.add(approved ? 'approved' : 'rejected');

        document.getElementById('resultIcon').textContent = approved ? '✅' : '❌';
        document.getElementById('resultTitle').textContent = approved
            ? 'Loan Approved'
            : 'Loan Rejected';
        document.getElementById('resultTitle').style.color = approved
            ? 'var(--accent-emerald)'
            : 'var(--accent-red)';

        const modelNames = {
            logistic_regression: 'Logistic Regression',
            naive_bayes: 'Naive Bayes',
            knn: 'KNN (K=5)'
        };

        document.getElementById('resultConfidence').textContent =
            `${modelNames[selectedModel]} — Approval Probability: ${(mainResult.probability * 100).toFixed(1)}%`;

        // Key factors from the input
        const factors = [];
        if (formData.creditScore >= 700) {
            factors.push({ text: `Credit Score: ${formData.creditScore} (Strong)`, type: 'positive' });
        } else if (formData.creditScore >= 650) {
            factors.push({ text: `Credit Score: ${formData.creditScore} (Moderate)`, type: 'neutral' });
        } else {
            factors.push({ text: `Credit Score: ${formData.creditScore} (Low)`, type: 'negative' });
        }

        if (formData.dtiRatio <= 0.3) {
            factors.push({ text: `DTI: ${formData.dtiRatio} (Low risk)`, type: 'positive' });
        } else if (formData.dtiRatio >= 0.6) {
            factors.push({ text: `DTI: ${formData.dtiRatio} (High risk)`, type: 'negative' });
        }

        const incomeRatio = (formData.income + formData.coIncome) / formData.loanAmount;
        if (incomeRatio >= 1) {
            factors.push({ text: `Income/Loan: ${incomeRatio.toFixed(1)}x`, type: 'positive' });
        } else {
            factors.push({ text: `Income/Loan: ${incomeRatio.toFixed(1)}x`, type: 'negative' });
        }

        if (formData.collateral >= formData.loanAmount) {
            factors.push({ text: 'Collateral covers loan', type: 'positive' });
        }

        document.getElementById('resultFactors').innerHTML = factors
            .map((f) => `<span class="factor-tag ${f.type}">${f.text}</span>`)
            .join('');

        // All models comparison
        document.getElementById('resultAllModels').innerHTML = Object.entries(allResults)
            .map(([key, res]) => {
                const isActive = key === selectedModel;
                const isApproved = res.prediction === 1;
                return `
                    <div class="result-model-mini ${isActive ? 'active-model' : ''}">
                        <div class="result-model-mini-name">${modelNames[key]}${isActive ? ' ★' : ''}</div>
                        <div class="result-model-mini-result ${isApproved ? 'approved' : 'rejected'}">
                            ${isApproved ? '✅ Approved' : '❌ Rejected'}
                        </div>
                        <div class="result-model-mini-prob">
                            Prob: ${(res.probability * 100).toFixed(1)}%
                        </div>
                    </div>
                `;
            })
            .join('');

        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Add to existing script.js

// === 3D Tilt Effect for Cards ===
function initTiltEffect() {
    const cards = document.querySelectorAll('.stat-card, .chart-card, .limitation-card, .insight-card, .metric-card, .cm-card, .comparison-card, .model-tab');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation 5deg
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease-out';
            
            // Add a subtle glare effect
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            card.style.background = `
                radial-gradient(
                    circle at ${glareX}% ${glareY}%, 
                    rgba(255,255,255,0.08) 0%, 
                    rgba(255,255,255,0) 60%
                ),
                var(--bg-card)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease-out, background 0.5s ease-out';
            card.style.background = 'var(--bg-card)';
        });
    });
}

// === Button Ripple Effect ===
function initRippleEffect() {
    const buttons = document.querySelectorAll('button, .nav-link, .predict-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// === Floating Labels for Form ===
function initFloatingLabels() {
    const inputs = document.querySelectorAll('.form-group input, .form-group select');
    
    inputs.forEach(input => {
        // Create wrapper if not exists
        if (!input.parentElement.classList.contains('input-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'input-wrapper';
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            
            const label = input.parentElement.parentElement.querySelector('label');
            if (label) {
                wrapper.appendChild(label);
            }
        }
        
        // Handle focus states
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Initial state
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Run these on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initTiltEffect();
        initRippleEffect();
    }, 500); // Small delay to let initial animations finish
});
