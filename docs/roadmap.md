# Research Roadmap

**Cross-Border Payments Fraud & Sanctions Screening**

This roadmap outlines the phases, tasks, and success criteria for building this research case study from data preparation through final documentation.

**Status Legend:** 🟢 Complete | 🟡 In Progress | ⚪ Not Started

Last Updated: 2025-10-30

## Phase 1: Data Preparation & Exploration

**Status:** 🟢 Complete

### Tasks

- [x] Set up project structure and environment
- [x] Download all required datasets (IEEE-CIS, PaySim, OFAC)
- [x] Create data availability validation script
- [x] Build helper functions for data loading and quality analysis
- [x] Perform initial EDA on IEEE-CIS train data
- [x] Analyze PaySim dataset
- [x] Analyze OFAC sanctions lists (SDN + Consolidated)
- [x] Define missing value handling strategy (>90% missing columns)
- [x] Engineer fraud detection features:
  - [x] Velocity counters (transactions per user 1h/24h)
  - [x] Device reuse patterns
  - [x] BIN-IP mismatch detection
  - [x] Amount z-scores per merchant
- [x] Merge and prepare final training dataset
- [x] Save processed features to disk

**Success Criteria:**

- [x] All datasets loaded and validated
- [x] Data quality issues documented
- [x] Feature engineering complete
- [x] Clean dataset ready for model training

**Key Findings:**

- IEEE-CIS: 590K rows, 394 columns, 3.5% fraud rate (1:29 imbalance)
- 374/394 columns have missing values (some >90%)
- No duplicate rows
- **Development Best Practice**: Built reusable helper functions with validation tests during exploration phase. These tests verify data loading, quality analysis, and visualization functions work correctly before production use. Post-development, verbose tests will be replaced with minimal validation for clean, production-ready notebooks while maintaining safety checks

**Cross-Dataset Insights:**

- **Class Imbalance**: Both IEEE-CIS (1:37) and PaySim (1:500) are highly imbalanced; stratified sampling and proper CV are mandatory
- **Feature Coverage**: IEEE-CIS has 434 features enabling richer modeling; PaySim has 11 features but includes explicit transaction types useful for rule-based features
- **Compliance Integration**: OFAC sanctions data (39,350 entities) preprocessed and ready for fuzzy matching pipeline integration
- **Modeling Strategy**: Side-by-side metrics reveal algorithm choice and tuning must account for different imbalance ratios and feature availability
- **Deployment Planning**: Conditional logic implemented to handle missing/unloaded datasets gracefully during analysis

**Feature Engineering Insights:**

- **Missing Value Strategy**: Dropped 12 columns (3% of features) with >90% missing values; imputed remaining using median (numeric) and mode (categorical) strategies, achieving 0 missing values in final dataset
- **Single-Transaction Edge Case**: 3,444 cards (0.58%) appeared only once in dataset, causing NaN in standard deviation calculations; resolved by filling with 0 (semantically correct: no variation for single transactions)
- **Feature Density**: Engineered 10 high-value features (time-based, velocity, device reuse, amount statistics) increasing feature count from 422 to 432 while reducing memory footprint from 66MB to 59MB through optimized data types
- **Velocity Computation**: Card-level velocity features (1h/24h windows) are computationally expensive on 590K transactions; consider pre-computation or sampling strategies for larger datasets or real-time inference
- **Data Quality Validation**: Post-processing validation critical, automated checks caught missing values in engineered features before model training, preventing downstream failures
- **Production Considerations**: Device and card aggregation features require maintaining state in production; velocity features need Redis/cache layer; amount statistics benefit from periodic recomputation as new transactions arrive

## Phase 2: Fraud Model Training

**Status:** 🟡 In Progress

### Tasks

- [x] Split data (train/validation/test)
- [x] Handle class imbalance (class weights)
- [x] Train baseline model (LightGBM/XGBoost)
- [ ] Hyperparameter tuning (Step 7)
- [x] Evaluate model performance:
  - [x] ROC-AUC ≥ 0.85 (target)
  - [x] PR-AUC ≥ 0.35 (target)
  - [x] Confusion matrix analysis (3 thresholds)
  - [x] Precision-Recall-Threshold curves
  - [x] Cost-sensitive threshold optimization
  - [x] Feature importance analysis
  - [x] Comprehensive evaluation JSON
- [ ] Calibrate probabilities (isotonic regression) (Step 8)
- [ ] Implement SHAP explainability (Step 9)
- [x] Save model artifacts (baseline + evaluation)
- [x] Document model performance and limitations

**Success Criteria:**

- [x] ROC-AUC ≥ 0.85 on test set
- [x] PR-AUC ≥ 0.35 on test set
- [ ] Model explainability implemented
- [x] Model artifacts saved and versioned
- [x] Evaluation metrics documented

**Key Findings:**

- **Baseline Model Performance**: LightGBM baseline achieves test ROC-AUC of 0.8861 (exceeds 0.85 target), training in 8.35 seconds with early stopping at 295 iterations
- **Temporal Drift Impact**: PR-AUC shows significant degradation from train (0.7673) to test (0.4743), attributed to documented temporal drift in fraud patterns (0.52pp fraud rate shift) and conservative baseline hyperparameters
- **Class Imbalance Handling**: is_unbalance parameter with 28.56x positive class weighting effectively addresses 1:29 fraud-legitimate imbalance, though PR-AUC performance indicates room for improvement through hyperparameter tuning
- **Model Generalization**: Train-validation gap of 5.59% indicates acceptable overfitting levels for baseline; test PR-AUC (0.4743) remains 13.9x better than random classifier (0.0344), validating pipeline correctness
- **Feature Importance Concentration**: Top 20 features (4.7% of feature set) explain 73.4% of model importance; 315 features (73.4%) needed for 90% importance coverage, indicating significant feature redundancy and opportunity for dimensionality reduction
- **V-Feature Dominance**: Anonymous V-features (V257, V258, V294, V283, V317) dominate top-10 importance, suggesting IEEE-CIS engineered features capture critical fraud signals; transaction amount (TransactionAmt) ranks as top interpretable feature
- **Production Readiness**: Baseline establishes reference point for hyperparameter tuning; PR-AUC improvement is primary optimization target while maintaining ROC-AUC performance and monitoring for overfitting
- **Categorical Feature Handling**: Successfully converted and trained on 29 high-cardinality categorical features (email domains, device info, card identifiers) - critical fraud signals that triggered expected LightGBM warnings for bins exceeding max_bin threshold
- **Model Artifacts**: Comprehensive metadata structure with 13 sections (compliance, explainability, limitations, monitoring) demonstrates production-grade MLOps practices; model size 1.18 MB enables low-latency inference
- **Comprehensive Evaluation (Step 6)**: Implemented production-grade evaluation with threshold-independent metrics (ROC-AUC: 0.8861, PR-AUC: 0.4743), confusion matrix analysis at 3 operationally relevant thresholds, and precision-recall curves across full probability spectrum
- **Cost-Sensitive Optimization**: Business-aligned threshold optimization (FP cost: $5, FN cost: $100) identifies threshold 0.4205 achieving **$225,625 cost savings** (55.5% reduction) while maintaining 70.7% fraud capture at 12.9% review rate
- **Multi-Threshold Analysis**: Evaluated 3 operating points - fraud-rate-aligned (98.2% recall, 4.1% precision), default 0.5 (55.7% recall, 17.6% precision), and optimal F1 0.8440 (35.8% recall, 64.8% precision) - demonstrating precision-recall trade-offs for stakeholder decision-making
- **Production Deployment Readiness**: Comprehensive evaluation JSON includes monitoring guidelines (±5% flagged rate tolerance), alerting thresholds (min ROC-AUC: 0.82, min recall: 0.637), and quarterly re-evaluation triggers for temporal drift detection
- **Evaluation Artifacts**: Generated 3 high-resolution visualizations (confusion matrices, cost optimization curves, precision-recall curves) and structured JSON metadata enabling MLOps integration, regulatory audits, and baseline-vs-tuned model comparison
- **Business Value Quantification**: At cost-optimal threshold, model processes 12.9% of transactions (15,250 reviews) to catch 70.7% of fraud (2,875 cases), with expected cost per transaction reduced from $3.44 (no model) to $1.53 (with model)

## Phase 3: Sanctions Screening Module

**Status:** ⚪ Not Started

### Tasks

- [ ] Load and preprocess OFAC SDN list
- [ ] Load and preprocess OFAC Consolidated list
- [ ] Implement fuzzy matching (RapidFuzz)
- [ ] Add country/date filters
- [ ] Generate confidence scores
- [ ] Test matching accuracy
- [ ] Benchmark matching latency
- [ ] Document matching logic and edge cases

**Success Criteria:**

- [ ] Fuzzy matching working with confidence scores
- [ ] Country/date filters implemented
- [ ] Matching latency <50ms

## Phase 4: API Service & Infrastructure

**Status:** ⚪ Not Started

### Tasks

- [ ] Build FastAPI service structure
- [ ] Implement `/score` endpoint
- [ ] Integrate fraud model inference
- [ ] Integrate sanctions screening
- [ ] Set up Redis for velocity feature caching
- [ ] Set up PostgreSQL for audit logging
- [ ] Implement API authentication
- [ ] Add request/response logging
- [ ] Benchmark end-to-end latency
- [ ] Write API tests

**Success Criteria:**

- [ ] API returns risk_score, top_features, sanctions_match
- [ ] End-to-end latency ≤ 200ms p95
- [ ] Audit logs stored in PostgreSQL
- [ ] Redis caching working for velocity features

## Phase 5: Demo UI

**Status:** ⚪ Not Started

### Tasks

- [ ] Set up Next.js project
- [ ] Build transaction input form
- [ ] Display fraud risk gauge
- [ ] Display SHAP feature importance
- [ ] Display sanctions match results
- [ ] Style with Tailwind CSS
- [ ] Connect to API backend
- [ ] Test end-to-end flow
- [ ] Deploy demo (Vercel)

**Success Criteria:**

- [ ] Working demo UI with real-time scoring
- [ ] All visualizations functional
- [ ] Deployed and accessible

## Phase 6: Documentation & Case Study Summary

**Status:** ⚪ Not Started

### Tasks

- [ ] Document methodology in notebooks
- [ ] Write case study summary with findings
- [ ] Document limitations and future work
- [ ] Create architecture diagrams
- [ ] Write deployment guide
- [ ] Update README with final results
- [ ] Verify all dataset attributions and licenses

**Success Criteria:**

- [ ] Complete documentation of approach
- [ ] Case study summary published
- [ ] Reproducible setup instructions
- [ ] All compliance requirements met

## Overall Success Criteria

- [x] Fraud model ROC-AUC ≥ 0.85 (achieved 0.8861)
- [x] Fraud model PR-AUC ≥ 0.35 (achieved 0.4743)
- [x] Comprehensive model evaluation with business metrics
- [ ] End-to-end latency ≤ 200ms p95
- [x] Clear documentation of methodology and limitations
- [x] Reproducible notebooks and code
- [ ] Working demo with all components integrated
- [x] IEEE-CIS license compliance verified

## Next Steps

**Current Focus:** Phase 2 - Complete hyperparameter tuning (Step 7) to improve PR-AUC from baseline 0.4743 to ≥ 0.50, then proceed to probability calibration (Step 8) and model explainability (Step 9).

**Recent Completion:** Step 6 (Model Evaluation) - Comprehensive evaluation with cost-sensitive optimization achieving $225,625 savings (55.5% reduction). All validation checks passed. Model ready for hyperparameter tuning.

**Upcoming:**
1. Phase 2: Model Trainings
    - Hyperparameter Tuning (Optuna Bayesian optimization, 50-100 trials, target PR-AUC ≥ 0.50)
    - Probability Calibration (Isotonic regression for reliable threshold selection)
    - Model Explainability (SHAP values for regulatory compliance)
2. Phase 3: Sanctions Screening Module
3. Phase 4: API Service & Infrastructure
