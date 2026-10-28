// =============================================
// LOANSENSE.AI — CLIENT-SIDE INFERENCE & UI ENGINE
// Production-grade client-side ML underwriting dashboard
// =============================================

let MODEL_DATA = null;

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollProgress();
    initNavbar();
    initMobileDrawer();
    initCounters();
    initScrollAnimations();
    initFeatureTableFilter();
    initLimitationsAccordion();
    initPredictionFormControls();
    loadModelData();
});

// =============================================
// 1. THEME MANAGEMENT MODULE
// =============================================
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;

    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('loansense_theme');
    } catch (e) {
        console.warn('LocalStorage unavailable for theme persistence:', e);
    }

    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');

    applyTheme(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);

        try {
            localStorage.setItem('loansense_theme', nextTheme);
        } catch (e) {
            console.warn('Failed to save theme in localStorage:', e);
        }
    });

    // Listen to OS theme changes if user has no saved preference
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            let userStored = null;
            try {
                userStored = localStorage.getItem('loansense_theme');
            } catch (err) {}
            if (!userStored) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    }
}

// =============================================
// 2. SCROLL PROGRESS BAR
// =============================================
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(100, Math.max(0, scrollPct))}%`;
        progressBar.setAttribute('aria-valuenow', Math.round(scrollPct));
    }, { passive: true });
}

// =============================================
// 3. NAVBAR & SCROLL-SPY
// =============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 8);
        }
    }, { passive: true });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach((link) => {
                        const matches = link.getAttribute('data-section') === id;
                        link.classList.toggle('active', matches);
                        if (link.hasAttribute('aria-selected')) {
                            link.setAttribute('aria-selected', matches ? 'true' : 'false');
                        }
                    });
                }
            });
        },
        { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('data-section') || link.getAttribute('href')?.replace('#', '');
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                closeMobileDrawer();
            }
        });
    });
}

// =============================================
// 4. MOBILE DRAWER WITH FOCUS TRAP
// =============================================
function initMobileDrawer() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('drawerBackdrop');

    if (!menuBtn || !drawer) return;

    menuBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.contains('open');
        if (isOpen) {
            closeMobileDrawer();
        } else {
            openMobileDrawer();
        }
    });

    if (backdrop) {
        backdrop.addEventListener('click', closeMobileDrawer);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeMobileDrawer();
        }
    });
}

function openMobileDrawer() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    if (!drawer) return;

    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';

    // Focus first link in drawer
    const firstLink = drawer.querySelector('a, button');
    if (firstLink) firstLink.focus();
}

function closeMobileDrawer() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    if (!drawer) return;

    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
    }
    document.body.style.overflow = '';
}

// =============================================
// 5. ANIMATED NUMBER COUNTERS
// =============================================
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
    const duration = 1200;
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

// =============================================
// 6. SCROLL REVEAL & BAR ANIMATIONS
// =============================================
function initScrollAnimations() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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
                    }, (index % 4) * 60);
                    animObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08 }
    );

    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(18px)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
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
                    setTimeout(() => { el.style.width = targetWidth; }, 150);
                    barObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.3 }
    );
    barFills.forEach((bar) => barObserver.observe(bar));
}

// =============================================
// 7. FEATURE TABLE SEARCH & CATEGORY FILTER
// =============================================
function initFeatureTableFilter() {
    const searchInput = document.getElementById('featureTableSearch');
    const categoryChips = document.querySelectorAll('.category-chip');
    const tableRows = document.querySelectorAll('#featureTable tbody tr');

    let currentCategory = 'all';
    let currentSearch = '';

    function filterRows() {
        tableRows.forEach((row) => {
            const rowCat = row.getAttribute('data-cat') || '';
            const rowText = row.textContent.toLowerCase();

            const matchesCategory = currentCategory === 'all' || rowCat.toLowerCase() === currentCategory.toLowerCase();
            const matchesSearch = !currentSearch || rowText.includes(currentSearch);

            row.style.display = matchesCategory && matchesSearch ? '' : 'none';
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim().toLowerCase();
            filterRows();
        });
    }

    categoryChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            categoryChips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');
            currentCategory = chip.getAttribute('data-category') || 'all';
            filterRows();
        });
    });
}

// =============================================
// 8. LIMITATIONS ACCORDION & SEVERITY FILTER
// =============================================
function initLimitationsAccordion() {
    const cards = document.querySelectorAll('.limitation-card');
    const filterBtns = document.querySelectorAll('.limitation-filter-btn');

    cards.forEach((card) => {
        const header = card.querySelector('.limitation-header');
        if (header) {
            header.addEventListener('click', () => {
                const isExpanded = card.classList.contains('expanded');
                card.classList.toggle('expanded', !isExpanded);
                header.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
            });
        }
    });

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            const targetSev = btn.getAttribute('data-severity');

            cards.forEach((card) => {
                const cardSev = card.getAttribute('data-card-severity');
                const isVisible = targetSev === 'all' || cardSev === targetSev;
                card.style.display = isVisible ? '' : 'none';
            });
        });
    });
}

// =============================================
// 9. MODEL DATA LOADER & BENCHMARK
// =============================================
function loadModelData() {
    if (window.MODEL_DATA_RAW) {
        MODEL_DATA = window.MODEL_DATA_RAW;
        console.log('LoanSense.AI ML Models Loaded:', MODEL_DATA.feature_names.length, 'features ready.');
        initModelEvaluation();
        updateHeroPreview();
        initPredictionForm();
    } else {
        console.error('MODEL_DATA_RAW not found. Ensure model_data.js loads before script.js.');
        const verdict = document.getElementById('comparisonVerdict');
        if (verdict) {
            verdict.textContent = 'Failed to load model weights. Ensure model_data.js is present.';
        }
    }
}

function updateHeroPreview() {
    if (!MODEL_DATA || !MODEL_DATA.metrics) return;
    const m = MODEL_DATA.metrics;

    const nb = m.naive_bayes;
    const lr = m.logistic_regression;
    const knn = m.knn;

    const heroAcc = document.getElementById('heroAccuracyVal');
    const heroAccBar = document.getElementById('heroAccuracyBar');
    const heroF1 = document.getElementById('heroF1Val');
    const heroF1Bar = document.getElementById('heroF1Bar');
    const heroLR = document.getElementById('heroLRSummary');
    const heroKNN = document.getElementById('heroKNNSummary');

    if (heroAcc) heroAcc.textContent = `${(nb.accuracy * 100).toFixed(1)}%`;
    if (heroAccBar) heroAccBar.style.width = `${(nb.accuracy * 100).toFixed(1)}%`;
    if (heroF1) heroF1.textContent = `${(nb.f1 * 100).toFixed(1)}%`;
    if (heroF1Bar) heroF1Bar.style.width = `${(nb.f1 * 100).toFixed(1)}%`;

    if (heroLR) heroLR.textContent = `${(lr.f1 * 100).toFixed(1)}% F1 · ${(lr.accuracy * 100).toFixed(1)}% Acc`;
    if (heroKNN) heroKNN.textContent = `${(knn.f1 * 100).toFixed(1)}% F1 · ${(knn.accuracy * 100).toFixed(1)}% Acc`;
}

function initModelEvaluation() {
    if (!MODEL_DATA) return;
    const metrics = MODEL_DATA.metrics;

    // F1 score in tabs
    const tabF1LR = document.getElementById('tabF1LR');
    const tabF1NB = document.getElementById('tabF1NB');
    const tabF1KNN = document.getElementById('tabF1KNN');

    if (tabF1LR) tabF1LR.textContent = `${(metrics.logistic_regression.f1 * 100).toFixed(1)}%`;
    if (tabF1NB) tabF1NB.textContent = `${(metrics.naive_bayes.f1 * 100).toFixed(1)}%`;
    if (tabF1KNN) tabF1KNN.textContent = `${(metrics.knn.f1 * 100).toFixed(1)}%`;

    populateComparisonTable(metrics);

    const tabs = document.querySelectorAll('.model-tab');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            displayModelMetrics(tab.getAttribute('data-model'));
        });
    });

    const bestModel = MODEL_DATA.best_model || 'naive_bayes';
    tabs.forEach((t) => {
        const matches = t.getAttribute('data-model') === bestModel;
        t.classList.toggle('active', matches);
        t.setAttribute('aria-selected', matches ? 'true' : 'false');
    });
    displayModelMetrics(bestModel);
}

function displayModelMetrics(modelKey) {
    if (!MODEL_DATA || !MODEL_DATA.metrics[modelKey]) return;

    const m = MODEL_DATA.metrics[modelKey];
    const modelNames = {
        logistic_regression: 'Logistic Regression',
        naive_bayes: 'Gaussian Naive Bayes',
        knn: 'KNN (K=5)'
    };

    animateMetric('metricAccuracy', 'barAccuracy', m.accuracy);
    animateMetric('metricPrecision', 'barPrecision', m.precision);
    animateMetric('metricRecall', 'barRecall', m.recall);
    animateMetric('metricF1', 'barF1', m.f1);

    const cm = m.confusion_matrix;
    const tnEl = document.querySelector('#cmTN .cm-cell-value');
    const fpEl = document.querySelector('#cmFP .cm-cell-value');
    const fnEl = document.querySelector('#cmFN .cm-cell-value');
    const tpEl = document.querySelector('#cmTP .cm-cell-value');
    const cmLabel = document.getElementById('cmModelLabel');
    const cmTotal = document.getElementById('cmTotal');

    if (tnEl) tnEl.textContent = cm[0][0];
    if (fpEl) fpEl.textContent = cm[0][1];
    if (fnEl) fnEl.textContent = cm[1][0];
    if (tpEl) tpEl.textContent = cm[1][1];
    if (cmLabel) cmLabel.textContent = modelNames[modelKey];
    if (cmTotal) cmTotal.textContent = cm[0][0] + cm[0][1] + cm[1][0] + cm[1][1];
}

function animateMetric(valueId, barId, value) {
    const valueEl = document.getElementById(valueId);
    const barEl = document.getElementById(barId);
    if (!valueEl || !barEl) return;

    const targetPct = value * 100;
    const duration = 600;
    const startTime = performance.now();
    const startVal = parseFloat(valueEl.textContent) || 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startVal + (targetPct - startVal) * eased;
        valueEl.textContent = `${current.toFixed(1)}%`;
        barEl.style.width = `${current}%`;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function populateComparisonTable(metrics) {
    const data = {
        accuracy: { lr: metrics.logistic_regression.accuracy, nb: metrics.naive_bayes.accuracy, knn: metrics.knn.accuracy },
        precision: { lr: metrics.logistic_regression.precision, nb: metrics.naive_bayes.precision, knn: metrics.knn.precision },
        recall: { lr: metrics.logistic_regression.recall, nb: metrics.naive_bayes.recall, knn: metrics.knn.recall },
        f1: { lr: metrics.logistic_regression.f1, nb: metrics.naive_bayes.f1, knn: metrics.knn.f1 }
    };

    const fmt = (v) => `${(v * 100).toFixed(2)}%`;

    for (const [metric, vals] of Object.entries(data)) {
        const best = Math.max(vals.lr, vals.nb, vals.knn);
        const ids = {
            lr: `cmp${metric === 'accuracy' ? 'LRAcc' : metric === 'precision' ? 'LRPrec' : metric === 'recall' ? 'LRRec' : 'LRF1'}`,
            nb: `cmp${metric === 'accuracy' ? 'NBAcc' : metric === 'precision' ? 'NBPrec' : metric === 'recall' ? 'NBRec' : 'NBF1'}`,
            knn: `cmp${metric === 'accuracy' ? 'KNNAcc' : metric === 'precision' ? 'KNNPrec' : metric === 'recall' ? 'KNNRec' : 'KNNF1'}`
        };

        for (const [key, id] of Object.entries(ids)) {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = fmt(vals[key]);
                el.classList.toggle('best-value', vals[key] === best);
            }
        }
    }

    const bestModel = MODEL_DATA.best_model;
    const bestF1 = (metrics[bestModel].f1 * 100).toFixed(1);
    const modelNames = {
        logistic_regression: 'Logistic Regression',
        naive_bayes: 'Gaussian Naive Bayes',
        knn: 'KNN (K=5)'
    };
    const verdictEl = document.getElementById('comparisonVerdict');
    if (verdictEl) {
        verdictEl.innerHTML = `Champion Classifier: <strong>${modelNames[bestModel]}</strong> achieved the highest F1-Score of <strong>${bestF1}%</strong> on the balanced holdout test partition.`;
    }
}

// =============================================
// 10. FORM INPUT SYNCHRONIZATION & INTERACTIVITY
// =============================================
function initPredictionFormControls() {
    // Steppers (− / +)
    const stepperBtns = document.querySelectorAll('.stepper-btn');
    stepperBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-step-target');
            const dir = parseInt(btn.getAttribute('data-step-dir'), 10) || 1;
            const input = document.getElementById(targetId);
            if (input) {
                const currentVal = parseInt(input.value, 10) || 0;
                const min = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : -Infinity;
                const max = input.hasAttribute('max') ? parseInt(input.getAttribute('max'), 10) : Infinity;
                const nextVal = Math.min(max, Math.max(min, currentVal + dir));
                input.value = nextVal;
                input.dispatchEvent(new Event('input'));
                input.dispatchEvent(new Event('change'));
            }
        });
    });

    // Segmented Binary Pills (Gender, MaritalStatus, Education)
    const pillOptions = document.querySelectorAll('.pill-option');
    pillOptions.forEach((pill) => {
        pill.addEventListener('click', () => {
            const targetInputId = pill.getAttribute('data-target-input');
            const val = pill.getAttribute('data-value');
            const hiddenSelect = document.getElementById(targetInputId);

            if (hiddenSelect) {
                hiddenSelect.value = val;
                hiddenSelect.dispatchEvent(new Event('change'));
            }

            const parentGroup = pill.parentElement;
            parentGroup.querySelectorAll('.pill-option').forEach((p) => {
                p.classList.remove('active');
                p.setAttribute('aria-checked', 'false');
            });
            pill.classList.add('active');
            pill.setAttribute('aria-checked', 'true');
        });
    });

    // Credit Score Slider & Input Sync
    const creditInput = document.getElementById('creditScore');
    const creditSlider = document.getElementById('creditScoreSlider');
    const creditTier = document.getElementById('creditScoreTier');

    function syncCredit(val) {
        val = Math.min(900, Math.max(300, parseInt(val, 10) || 650));
        if (creditInput) creditInput.value = val;
        if (creditSlider) creditSlider.value = val;

        if (creditTier) {
            let label = 'Prime';
            if (val >= 800) label = 'Exceptional';
            else if (val >= 740) label = 'Very Good';
            else if (val >= 670) label = 'Prime';
            else if (val >= 580) label = 'Fair';
            else label = 'Subprime';
            creditTier.textContent = `${val} · ${label}`;
        }
    }

    if (creditInput && creditSlider) {
        creditInput.addEventListener('input', (e) => syncCredit(e.target.value));
        creditSlider.addEventListener('input', (e) => syncCredit(e.target.value));
        syncCredit(creditInput.value || 700);
    }

    // DTI Ratio Slider & Input Sync
    const dtiInput = document.getElementById('dtiRatio');
    const dtiSlider = document.getElementById('dtiRatioSlider');
    const dtiPctBadge = document.getElementById('dtiRatioPct');

    function syncDTI(val) {
        val = Math.min(1.0, Math.max(0.0, parseFloat(val) || 0.35));
        if (dtiInput) dtiInput.value = val.toFixed(2);
        if (dtiSlider) dtiSlider.value = val.toFixed(2);
        if (dtiPctBadge) dtiPctBadge.textContent = `${(val * 100).toFixed(1)}%`;
    }

    if (dtiInput && dtiSlider) {
        dtiInput.addEventListener('input', (e) => syncDTI(e.target.value));
        dtiSlider.addEventListener('input', (e) => syncDTI(e.target.value));
        syncDTI(dtiInput.value || 0.35);
    }

    // Loan Term Segmented Chips
    const termChips = document.querySelectorAll('.chip-tenure');
    const termSelect = document.getElementById('loanTerm');
    const termDisplay = document.getElementById('loanTermDisplay');

    termChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const termVal = chip.getAttribute('data-term-val');
            termChips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');

            if (termSelect) {
                termSelect.value = termVal;
                termSelect.dispatchEvent(new Event('change'));
            }

            if (termDisplay) {
                const yrs = (parseInt(termVal, 10) / 12).toFixed(1).replace('.0', '');
                termDisplay.textContent = `${termVal} mo (${yrs} yrs)`;
            }
        });
    });

    // Currency Formatting on Blur & Tabular Inputs
    const currencyIds = ['income', 'coIncome', 'savings', 'collateral', 'loanAmount'];
    currencyIds.forEach((id) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('focus', () => {
                const clean = input.value.replace(/,/g, '');
                input.value = clean;
            });

            input.addEventListener('blur', () => {
                const num = parseFloat(input.value.replace(/,/g, ''));
                if (!isNaN(num)) {
                    input.value = Math.round(num).toLocaleString('en-IN');
                    input.setAttribute('data-raw-val', Math.round(num));
                }
                updateCollateralCoverage();
            });

            // Initial format
            const initial = parseFloat(input.value.replace(/,/g, ''));
            if (!isNaN(initial)) {
                input.value = Math.round(initial).toLocaleString('en-IN');
                input.setAttribute('data-raw-val', Math.round(initial));
            }
        }
    });

    function updateCollateralCoverage() {
        const colVal = parseFloat((document.getElementById('collateral')?.value || '').replace(/,/g, '')) || 0;
        const loanVal = parseFloat((document.getElementById('loanAmount')?.value || '').replace(/,/g, '')) || 1;
        const badge = document.getElementById('collateralCoverageBadge');
        if (badge) {
            const ratio = ((colVal / Math.max(1, loanVal)) * 100).toFixed(0);
            badge.textContent = `Covers: ${ratio}%`;
            badge.style.color = ratio >= 100 ? 'var(--success)' : 'var(--text-muted)';
        }
    }
    updateCollateralCoverage();

    // Model Radio Cards Synced with Hidden Select
    const modelCards = document.querySelectorAll('.model-radio-card');
    const modelSelect = document.getElementById('predictModelSelect');
    const indicatorText = document.querySelector('.model-indicator-text');
    const navStatusText = document.getElementById('navStatusText');

    modelCards.forEach((card) => {
        card.addEventListener('click', () => {
            const modelVal = card.getAttribute('data-model');
            modelCards.forEach((c) => {
                c.classList.remove('active');
                c.setAttribute('aria-checked', 'false');
            });
            card.classList.add('active');
            card.setAttribute('aria-checked', 'true');

            if (modelSelect) {
                modelSelect.value = modelVal;
                modelSelect.dispatchEvent(new Event('change'));
            }
        });
    });

    if (modelSelect) {
        modelSelect.addEventListener('change', () => {
            const names = {
                logistic_regression: 'Logistic Regression',
                naive_bayes: 'Gaussian Naive Bayes',
                knn: 'KNN (K=5)'
            };
            const currentName = names[modelSelect.value] || modelSelect.value;
            if (indicatorText) indicatorText.textContent = currentName;
            if (navStatusText) navStatusText.textContent = `Model Active · ${currentName}`;

            // Sync radio cards
            modelCards.forEach((c) => {
                const matches = c.getAttribute('data-model') === modelSelect.value;
                c.classList.toggle('active', matches);
                c.setAttribute('aria-checked', matches ? 'true' : 'false');
            });
        });
    }

    // Sample Quick-Fills
    const btnFillApproved = document.getElementById('btnFillApproved');
    const btnFillRejected = document.getElementById('btnFillRejected');
    const btnReset = document.getElementById('predictResetBtn');

    if (btnFillApproved) {
        btnFillApproved.addEventListener('click', () => {
            fillSampleApplicant({
                age: 42,
                gender: 'Male',
                maritalStatus: 'Married',
                dependents: 1,
                education: 'Graduate',
                employment: 'Salaried',
                employerCategory: 'MNC',
                income: 18000,
                coIncome: 6000,
                creditScore: 765,
                dtiRatio: 0.22,
                existingLoans: 0,
                savings: 35000,
                collateral: 40000,
                loanAmount: 22000,
                loanTerm: 36,
                loanPurpose: 'Home',
                propertyArea: 'Urban'
            });
        });
    }

    if (btnFillRejected) {
        btnFillRejected.addEventListener('click', () => {
            fillSampleApplicant({
                age: 23,
                gender: 'Female',
                maritalStatus: 'Single',
                dependents: 3,
                education: 'Not Graduate',
                employment: 'Unemployed',
                employerCategory: 'Unemployed',
                income: 3500,
                coIncome: 0,
                creditScore: 560,
                dtiRatio: 0.85,
                existingLoans: 4,
                savings: 400,
                collateral: 2000,
                loanAmount: 35000,
                loanTerm: 84,
                loanPurpose: 'Personal',
                propertyArea: 'Rural'
            });
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            fillSampleApplicant({
                age: 35,
                gender: 'Male',
                maritalStatus: 'Married',
                dependents: 1,
                education: 'Graduate',
                employment: 'Salaried',
                employerCategory: 'Private',
                income: 12000,
                coIncome: 3000,
                creditScore: 700,
                dtiRatio: 0.35,
                existingLoans: 1,
                savings: 15000,
                collateral: 25000,
                loanAmount: 20000,
                loanTerm: 48,
                loanPurpose: 'Home',
                propertyArea: 'Urban'
            });
        });
    }
}

function fillSampleApplicant(data) {
    // Numeric and currency inputs
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
            el.value = val;
            el.dispatchEvent(new Event('input'));
            el.dispatchEvent(new Event('blur'));
        }
    };

    setVal('age', data.age);
    setVal('dependents', data.dependents);
    setVal('existingLoans', data.existingLoans);
    setVal('income', data.income);
    setVal('coIncome', data.coIncome);
    setVal('savings', data.savings);
    setVal('collateral', data.collateral);
    setVal('loanAmount', data.loanAmount);

    // Sliders
    const creditInput = document.getElementById('creditScore');
    const creditSlider = document.getElementById('creditScoreSlider');
    if (creditInput && creditSlider) {
        creditInput.value = data.creditScore;
        creditSlider.value = data.creditScore;
        creditInput.dispatchEvent(new Event('input'));
    }

    const dtiInput = document.getElementById('dtiRatio');
    const dtiSlider = document.getElementById('dtiRatioSlider');
    if (dtiInput && dtiSlider) {
        dtiInput.value = data.dtiRatio;
        dtiSlider.value = data.dtiRatio;
        dtiInput.dispatchEvent(new Event('input'));
    }

    // Selects
    const setSelect = (id, val) => {
        const el = document.getElementById(id);
        if (el) {
            el.value = val;
            el.dispatchEvent(new Event('change'));
        }
    };

    setSelect('employment', data.employment);
    setSelect('employerCategory', data.employerCategory);
    setSelect('loanPurpose', data.loanPurpose);
    setSelect('propertyArea', data.propertyArea);
    setSelect('gender', data.gender);
    setSelect('maritalStatus', data.maritalStatus);
    setSelect('education', data.education);

    // Sync Segmented binary pills
    ['gender', 'maritalStatus', 'education'].forEach((name) => {
        const val = data[name];
        const pills = document.querySelectorAll(`.pill-option[data-target-input="${name}"]`);
        pills.forEach((p) => {
            const matches = p.getAttribute('data-value') === val;
            p.classList.toggle('active', matches);
            p.setAttribute('aria-checked', matches ? 'true' : 'false');
        });
    });

    // Sync loan term chips
    const termChips = document.querySelectorAll('.chip-tenure');
    termChips.forEach((chip) => {
        const matches = chip.getAttribute('data-term-val') === String(data.loanTerm);
        chip.classList.toggle('active', matches);
    });
    setSelect('loanTerm', data.loanTerm);
}

// =============================================
// 11. ML MATHEMATICAL INFERENCE PIPELINE
// (Preserved 1:1 mathematical functional parity)
// =============================================

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
 */
function predictNaiveBayes(scaledVector) {
    const priors = MODEL_DATA.models.naive_bayes.class_prior;
    const theta = MODEL_DATA.models.naive_bayes.theta;
    const variance = MODEL_DATA.models.naive_bayes.var;

    const logProbs = [];
    for (let c = 0; c < 2; c++) {
        let logP = Math.log(priors[c]);
        for (let i = 0; i < scaledVector.length; i++) {
            const mu = theta[c][i];
            const v = variance[c][i];
            logP += -0.5 * Math.log(2 * Math.PI * v) - 0.5 * Math.pow(scaledVector[i] - mu, 2) / v;
        }
        logProbs.push(logP);
    }

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

    const distances = X_train.map((trainPoint, idx) => {
        let dist = 0;
        for (let i = 0; i < scaledVector.length; i++) {
            dist += Math.pow(scaledVector[i] - trainPoint[i], 2);
        }
        return { distance: Math.sqrt(dist), label: y_train[idx] };
    });

    distances.sort((a, b) => a.distance - b.distance);
    const kNearest = distances.slice(0, k);
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

// =============================================
// 12. PREDICTION SUBMISSION & RESULT RENDERING
// =============================================
function initPredictionForm() {
    const form = document.getElementById('predictForm');
    const resultContainer = document.getElementById('predictResult');
    const modelSelect = document.getElementById('predictModelSelect');
    const emptyState = document.getElementById('resultEmptyState');
    const contentState = document.getElementById('resultContentState');
    const submitBtn = document.getElementById('predictBtn');
    const btnText = document.getElementById('predictBtnText');
    const btnIcon = document.getElementById('predictBtnIcon');

    if (!form || !resultContainer || !modelSelect) return;

    if (MODEL_DATA && MODEL_DATA.best_model) {
        modelSelect.value = MODEL_DATA.best_model;
        modelSelect.dispatchEvent(new Event('change'));
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!MODEL_DATA) {
            alert('Model data is still loading. Please check console.');
            return;
        }

        // Show loading state (minimum 300ms for tactile feedback)
        if (submitBtn) {
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Calculating Underwriting Vectors...';
            if (btnIcon) btnIcon.innerHTML = '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.4" stroke-dashoffset="10"/>';
        }

        setTimeout(() => {
            // Collect form data (cleaning comma formatting)
            const parseVal = (id, fallback) => {
                const el = document.getElementById(id);
                if (!el) return fallback;
                const clean = el.value.replace(/,/g, '');
                const num = parseFloat(clean);
                return isNaN(num) ? fallback : num;
            };

            const formData = {
                income: parseVal('income', 0),
                coIncome: parseVal('coIncome', 0),
                age: parseVal('age', 35),
                dependents: parseVal('dependents', 0),
                creditScore: parseVal('creditScore', 650),
                existingLoans: parseVal('existingLoans', 0),
                dtiRatio: parseVal('dtiRatio', 0.3),
                savings: parseVal('savings', 0),
                collateral: parseVal('collateral', 0),
                loanAmount: parseVal('loanAmount', 0),
                loanTerm: parseVal('loanTerm', 48),
                education: document.getElementById('education')?.value || 'Graduate',
                employment: document.getElementById('employment')?.value || 'Salaried',
                maritalStatus: document.getElementById('maritalStatus')?.value || 'Married',
                loanPurpose: document.getElementById('loanPurpose')?.value || 'Home',
                propertyArea: document.getElementById('propertyArea')?.value || 'Urban',
                gender: document.getElementById('gender')?.value || 'Male',
                employerCategory: document.getElementById('employerCategory')?.value || 'Private'
            };

            // Build feature vector and scale
            const rawVector = buildFeatureVector(formData);
            const scaledVector = scaleFeatures(rawVector);

            const selectedModel = modelSelect.value;
            const mainResult = predict(selectedModel, scaledVector);

            const allResults = {
                logistic_regression: predict('logistic_regression', scaledVector),
                naive_bayes: predict('naive_bayes', scaledVector),
                knn: predict('knn', scaledVector)
            };

            renderPredictionResults(formData, selectedModel, mainResult, allResults);

            if (submitBtn) {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Predict Loan Approval';
                if (btnIcon) btnIcon.innerHTML = '<use href="#i-wand-sparkles"/>';
            }
        }, 320);
    });
}

function renderPredictionResults(formData, selectedModel, mainResult, allResults) {
    const resultContainer = document.getElementById('predictResult');
    const emptyState = document.getElementById('resultEmptyState');
    const contentState = document.getElementById('resultContentState');

    if (emptyState) emptyState.style.display = 'none';
    if (contentState) contentState.classList.remove('hidden');

    const approved = mainResult.prediction === 1;
    resultContainer.classList.remove('approved', 'rejected');
    resultContainer.classList.add(approved ? 'approved' : 'rejected');

    // Result Headline & Icon (No emoji, pure SVG sprite icons)
    const statusIconWrap = document.getElementById('resultStatusIconWrap');
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const riskBadge = document.getElementById('resultRiskBadge');

    if (statusIconWrap) {
        statusIconWrap.className = `result-status-icon-wrap ${approved ? 'approved' : 'rejected'}`;
    }

    if (resultIcon) {
        resultIcon.innerHTML = approved
            ? '<svg class="icon icon-lg" aria-hidden="true"><use href="#i-circle-check-big"/></svg>'
            : '<svg class="icon icon-lg" aria-hidden="true"><use href="#i-circle-x"/></svg>';
    }

    if (resultTitle) {
        resultTitle.textContent = approved ? 'Loan Approved' : 'Loan Rejected';
        resultTitle.style.color = approved ? 'var(--success)' : 'var(--danger)';
    }

    if (riskBadge) {
        riskBadge.textContent = approved ? 'Low Risk Tier' : 'High Risk Tier';
        riskBadge.className = `card-badge ${approved ? 'success' : 'warning'}`;
    }

    const modelNames = {
        logistic_regression: 'Logistic Regression',
        naive_bayes: 'Gaussian Naive Bayes',
        knn: 'KNN (K=5)'
    };

    // Circular SVG Gauge Animation
    const gaugeCircle = document.getElementById('gaugeProgressCircle');
    const gaugePctVal = document.getElementById('gaugePctVal');
    const resultConfidence = document.getElementById('resultConfidence');

    const probPct = mainResult.probability * 100;
    const maxCircumference = 251.2; // 2 * PI * 40
    const offset = maxCircumference * (1 - mainResult.probability);

    if (gaugeCircle) {
        gaugeCircle.style.stroke = approved ? 'var(--success)' : 'var(--danger)';
        gaugeCircle.style.strokeDashoffset = offset;
    }

    if (gaugePctVal) {
        gaugePctVal.textContent = `${probPct.toFixed(1)}%`;
        gaugePctVal.style.color = approved ? 'var(--success)' : 'var(--danger)';
    }

    if (resultConfidence) {
        resultConfidence.textContent = `${modelNames[selectedModel]} — Probability: ${probPct.toFixed(1)}% (${approved ? 'Likely Approved' : 'Likely Rejected'})`;
    }

    // Key Underwriting Factors with SVG Direction Arrows
    const factors = [];
    if (formData.creditScore >= 700) {
        factors.push({
            text: `Credit Score: ${formData.creditScore} (Prime Tier)`,
            type: 'positive',
            arrow: 'i-arrow-up-right'
        });
    } else if (formData.creditScore >= 650) {
        factors.push({
            text: `Credit Score: ${formData.creditScore} (Moderate Threshold)`,
            type: 'neutral',
            arrow: 'i-arrow-up-right'
        });
    } else {
        factors.push({
            text: `Credit Score: ${formData.creditScore} (Subprime Tier)`,
            type: 'negative',
            arrow: 'i-arrow-down-right'
        });
    }

    if (formData.dtiRatio <= 0.30) {
        factors.push({
            text: `DTI Ratio: ${(formData.dtiRatio * 100).toFixed(0)}% (Low Leverage)`,
            type: 'positive',
            arrow: 'i-arrow-up-right'
        });
    } else if (formData.dtiRatio >= 0.60) {
        factors.push({
            text: `DTI Ratio: ${(formData.dtiRatio * 100).toFixed(0)}% (High Leverage)`,
            type: 'negative',
            arrow: 'i-arrow-down-right'
        });
    }

    const loanAmountSafe = Math.max(1, formData.loanAmount);
    const incomeRatio = (formData.income + formData.coIncome) / loanAmountSafe;
    if (incomeRatio >= 1.0) {
        factors.push({
            text: `Income Coverage: ${incomeRatio.toFixed(1)}x Loan Amount`,
            type: 'positive',
            arrow: 'i-arrow-up-right'
        });
    } else {
        factors.push({
            text: `Income Coverage: ${incomeRatio.toFixed(1)}x Loan Amount`,
            type: 'negative',
            arrow: 'i-arrow-down-right'
        });
    }

    if (formData.collateral >= formData.loanAmount) {
        factors.push({
            text: 'Pledged Collateral Covers 100%+ of Loan',
            type: 'positive',
            arrow: 'i-arrow-up-right'
        });
    }

    const factorsContainer = document.getElementById('resultFactors');
    if (factorsContainer) {
        factorsContainer.innerHTML = factors
            .map((f) => `
                <div class="factor-pill ${f.type}">
                    <span style="display:inline-flex; align-items:center; gap:6px;">
                        <svg class="icon icon-sm" aria-hidden="true"><use href="#${f.arrow}"/></svg>
                        <span>${f.text}</span>
                    </span>
                    <span style="font-weight:700; text-transform:uppercase; font-size:0.65rem;">
                        ${f.type === 'positive' ? '+Favorable' : f.type === 'negative' ? '-Risk' : 'Neutral'}
                    </span>
                </div>
            `)
            .join('');
    }

    // All-Models Consensus Breakdown (No emoji, pure SVG icons & tabular bars)
    const allModelsContainer = document.getElementById('resultAllModels');
    if (allModelsContainer) {
        allModelsContainer.innerHTML = Object.entries(allResults)
            .map(([key, res]) => {
                const isActive = key === selectedModel;
                const isApp = res.prediction === 1;
                const prob = (res.probability * 100).toFixed(1);
                return `
                    <div class="consensus-row ${isActive ? 'active' : ''}">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="status-dot" style="background:${isApp ? 'var(--success)' : 'var(--danger)'};"></span>
                            <span class="consensus-model-name">${modelNames[key]}${isActive ? ' (Active)' : ''}</span>
                        </div>
                        <div class="consensus-prob ${isApp ? 'approved' : 'rejected'}">
                            ${isApp ? 'Approved' : 'Rejected'} · ${prob}%
                        </div>
                    </div>
                `;
            })
            .join('');
    }

    // On mobile (< 1024px), scroll result card into view smoothly
    if (window.innerWidth <= 1024) {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
