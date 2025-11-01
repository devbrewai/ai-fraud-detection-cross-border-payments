# Technical Findings

This directory contains detailed technical findings, performance metrics, and design decisions from each phase of the research project. These documents are separated from the [main roadmap](../roadmap.md) to maintain clean status tracking while preserving comprehensive technical documentation.

## Documentation Structure

### Phase 1: Data Exploration & Feature Engineering
**Status:** Complete

[Phase 1 Findings](phase-1-data-exploration.md)

**Key Topics:**
- Dataset statistics (IEEE-CIS, PaySim, OFAC)
- Cross-dataset insights and modeling strategy
- Feature engineering decisions and optimizations
- Missing value handling and edge cases
- Production state management considerations

**Key Metrics:**
- 590K transactions, 432 features, 1:29 class imbalance
- 0 missing values after processing
- 59 MB memory footprint (10.6% reduction from raw data)

---

### Phase 2: Model Training & Evaluation
**Status:** In Progress (Calibration & Explainability Pending)

[Phase 2 Findings](phase-2-model-training.md)

**Key Topics:**
- Baseline model performance and architecture
- Comprehensive evaluation suite (confusion matrices, PR curves)
- Cost-sensitive threshold optimization
- Hyperparameter tuning investigation and diagnostics
- Model selection rationale (baseline vs tuned)
- Feature importance analysis
- Production deployment guidelines

**Key Metrics:**
- Test ROC-AUC: 0.8861 (exceeds 0.85 target by 4.2%)
- Test PR-AUC: 0.4743 (exceeds 0.35 target by 35.5%)
- Cost savings: $225,625 (55.5% reduction at optimal threshold)
- Model size: 1.18 MB (enables low-latency inference)

**Business Impact:**
- Optimal threshold: 0.4205
- Fraud capture: 70.7% (2,875/4,067 cases)
- Review rate: 12.9% (15,250/118,205 transactions)
- Cost per transaction: $1.53 (vs $3.44 baseline)

---

### Phase 3: Sanctions Screening Module
**Status:** Not Started

[Phase 3 Findings](phase-3-sanctions-screening.md) _(placeholder)_

**Planned Topics:**
- OFAC data integration (SDN + Consolidated lists)
- Fuzzy matching implementation (RapidFuzz)
- Confidence score calibration
- Performance benchmarking (latency, throughput)
- Integration with fraud detection pipeline

**Target Metrics:**
- Matching accuracy: ≥95%
- Latency: <50ms p95
- False positive rate: TBD based on confidence threshold

---

## Document Conventions

### Audience
Technical documentation for:
- ML engineers and data scientists
- Financial institution technical evaluators
- Fintech startup engineering teams
- Technical due diligence reviewers

### Structure Standards
Each findings document includes:
1. **Overview:** Phase scope and completion status
2. **Key Findings:** Technical insights and metrics
3. **Limitations:** Known issues and constraints
4. **Next Phase Inputs:** Artifacts and requirements for subsequent phases
5. **References:** Links to notebooks, artifacts, and related docs

### Update Frequency
- Findings documents are updated at phase completion
- In-progress phases receive incremental updates as major milestones complete
- Last updated dates tracked at document level


## Contributing to Findings

When adding findings:
1. Maintain consistent structure across phase documents
2. Include both technical metrics and business implications
3. Document limitations and edge cases explicitly
4. Cross-reference related notebooks and artifacts
5. Update this README with new phase findings as they complete

---

**Last Updated:** 2025-11-01  
**Project:** AI Fraud Detection for Cross-Border Payments & Sanctions Screening Research Case Study  
**Organization:** Devbrew

