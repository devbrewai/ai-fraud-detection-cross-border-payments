# Research Roadmap

**Cross-Border Payments Fraud & Sanctions Screening**

This roadmap outlines the phases, tasks, and success criteria for building this research case study from data preparation through final documentation.

**Status Legend:** 🟢 Complete | 🟡 In Progress | ⚪ Not Started

Last Updated: 2025-10-02

## Phase 1: Data Preparation & Exploration

**Status:** 🟡 In Progress

### Tasks

- [x] Set up project structure and environment
- [x] Download all required datasets (IEEE-CIS, PaySim, OFAC)
- [x] Create data availability validation script
- [x] Build helper functions for data loading and quality analysis
- [x] Perform initial EDA on IEEE-CIS train data
- [x] Analyze PaySim dataset
- [ ] Analyze OFAC sanctions lists (SDN + Consolidated)
- [ ] Define missing value handling strategy (>90% missing columns)
- [ ] Engineer fraud detection features:
  - [ ] Velocity counters (transactions per user 1h/24h)
  - [ ] Device reuse patterns
  - [ ] BIN-IP mismatch detection
  - [ ] Amount z-scores per merchant
- [ ] Merge and prepare final training dataset
- [ ] Save processed features to disk

**Success Criteria:**

- [ ] All datasets loaded and validated
- [ ] Data quality issues documented
- [ ] Feature engineering complete
- [ ] Clean dataset ready for model training

**Key Findings:**

- IEEE-CIS: 590K rows, 394 columns, 3.5% fraud rate (1:29 imbalance)
- 374/394 columns have missing values (some >90%)
- No duplicate rows
- **Development Best Practice**: Built reusable helper functions with validation tests during exploration phase. These tests verify data loading, quality analysis, and visualization functions work correctly before production use. Post-development, verbose tests will be replaced with minimal validation for clean, production-ready notebooks while maintaining safety checks

## Phase 2: Fraud Model Training

**Status:** ⚪ Not Started

### Tasks

- [ ] Split data (train/validation/test)
- [ ] Handle class imbalance (SMOTE/undersampling)
- [ ] Train baseline model (LightGBM/XGBoost)
- [ ] Hyperparameter tuning
- [ ] Evaluate model performance:
  - [ ] ROC-AUC ≥ 0.85 (target)
  - [ ] PR-AUC
  - [ ] Confusion matrix
  - [ ] Feature importance analysis
- [ ] Calibrate probabilities (isotonic regression)
- [ ] Implement SHAP explainability
- [ ] Save model artifacts
- [ ] Document model performance and limitations

**Success Criteria:**

- [ ] ROC-AUC ≥ 0.85 on test set
- [ ] Model explainability implemented
- [ ] Model artifacts saved and versioned

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

- [ ] Fraud model ROC-AUC ≥ 0.85
- [ ] End-to-end latency ≤ 200ms p95
- [ ] Clear documentation of methodology and limitations
- [ ] Reproducible notebooks and code
- [ ] Working demo with all components integrated
- [ ] IEEE-CIS license compliance verified

## Next Steps

**Current Focus:** Phase 1 - Complete EDA on PaySim and OFAC datasets, then move to feature engineering.
