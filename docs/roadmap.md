# Research Roadmap

**Cross-Border Payments Fraud & Sanctions Screening**

This roadmap outlines the phases, tasks, and success criteria for building this research case study from data preparation through final documentation.

**Status Legend:** 🟢 Complete | 🟡 In Progress | ⚪ Not Started

**Documentation Structure:** This roadmap tracks project status only. For detailed technical findings, performance metrics, and design decisions, see the [findings/](findings/) directory.

Last Updated: 2025-11-03 (Phase 2 Complete)

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

**Deliverables:**

- [x] Processed training dataset (432 features, 590K rows)
- [x] Feature engineering pipeline
- [x] Data quality validation suite
- [x] Comprehensive findings documentation

**Detailed Findings:** See [Phase 1 Findings](findings/phase-1-data-exploration.md) for technical insights, feature engineering decisions, and production considerations.

## Phase 2: Fraud Model Training

**Status:** 🟢 Complete

### Tasks

- [x] Split data (train/validation/test)
- [x] Handle class imbalance (class weights)
- [x] Train baseline model (LightGBM/XGBoost)
- [x] Hyperparameter tuning (Step 7) - Decision: Use baseline model
- [x] Evaluate model performance:
  - [x] ROC-AUC ≥ 0.85 (target)
  - [x] PR-AUC ≥ 0.35 (target)
  - [x] Confusion matrix analysis (3 thresholds)
  - [x] Precision-Recall-Threshold curves
  - [x] Cost-sensitive threshold optimization
  - [x] Feature importance analysis
  - [x] Comprehensive evaluation JSON
- [x] Calibrate probabilities (isotonic regression)
- [x] Implement SHAP explainability
- [x] Save model artifacts (baseline + evaluation + calibration + explainability)
- [x] Document model performance and limitations

**Success Criteria:**

- [x] ROC-AUC ≥ 0.85 on test set (achieved 0.8861)
- [x] PR-AUC ≥ 0.35 on test set (achieved 0.4743)
- [x] Probability calibration (ECE < 0.10 target, achieved 0.0050)
- [x] Model artifacts saved and versioned
- [x] Evaluation metrics documented

**Deliverables:**

- [x] Baseline model (LightGBM, 1.18 MB)
- [x] Comprehensive evaluation suite (confusion matrices, PR curves, cost analysis)
- [x] Business cost optimization ($225K savings at optimal threshold)
- [x] Hyperparameter tuning analysis (baseline selected via systematic diagnostics)
- [x] Model metadata with 13-section structure (MLOps-ready)
- [x] Probability calibration (isotonic regression, ECE=0.0050, 96.8% improvement)
- [x] SHAP explainability (TreeExplainer, 10K sample, <10ms inference overhead)

**Detailed Findings:** See [Phase 2 Findings](findings/phase-2-model-training.md) for performance metrics, cost analysis, hyperparameter tuning investigation, probability calibration results, SHAP explainability analysis, and model selection rationale.

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
- [x] Probability calibration ECE < 0.10 (achieved 0.0050)
- [x] Comprehensive model evaluation with business metrics
- [ ] End-to-end latency ≤ 200ms p95
- [x] Clear documentation of methodology and limitations
- [x] Reproducible notebooks and code
- [ ] Working demo with all components integrated
- [x] IEEE-CIS license compliance verified

## Next Steps

**Current Focus:** Phase 3 (Sanctions Screening Module) preparation.

**Recent Completion:** 
- Hyperparameter tuning investigation (baseline model selected via systematic diagnostics)
- Probability calibration (isotonic regression, ECE=0.0050, 96.8% improvement)
- SHAP explainability (TreeExplainer, top features validated, production-ready artifacts)
- Phase 2 complete with all artifacts generated

**Immediate Actions:**

1. **Phase 2 Final Steps** (COMPLETE ✓)
   - [x] Commit calibration work
   - [x] SHAP explainability implemented
   - [x] Final model documentation complete

2. **Phase 3: Sanctions Screening** (~4-6 hours)
   - [ ] OFAC fuzzy matching implementation
   - [ ] Confidence scoring system
   - [ ] Latency benchmarking

3. **Phase 4: API Service** (~8-12 hours)
   - [ ] FastAPI service structure
   - [ ] Model inference integration
   - [ ] Redis/PostgreSQL setup

4. **Phase 5: Demo UI** (~6-8 hours)
   - [ ] Next.js application
   - [ ] Real-time scoring interface
   - [ ] Deployment (Vercel)

5. **Phase 6: Final Documentation** (~3-4 hours)
   - [ ] Case study summary
   - [ ] Architecture diagrams
   - [ ] Deployment guide

**For detailed progress and technical insights:** See [Phase 1 Findings](findings/phase-1-data-exploration.md) and [Phase 2 Findings](findings/phase-2-model-training.md).
