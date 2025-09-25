# Product Requirements Document (PRD)

**Case Study A — Cross-Border Payments Fraud & Sanctions Screening**

---

## 1. Overview

This project is a **production-grade research case study** demonstrating how to detect fraud and perform sanctions screening for cross-border payments in real time.

The deliverable is an **open-source pipeline and demo** that:

- Scores card-not-present (CNP) transactions for fraud risk.
- Screens names against OFAC sanctions lists using fuzzy matching.
- Returns a fraud risk score, top contributing features, and any sanctions matches.
- Runs end-to-end in **under 200 ms**.

Repo: `devbrewai/devbrew-payments-fraud-sanctions`  
License: **Apache 2.0**

---

## 2. Target Audience

- **FinTech Startups** (payments, wallets, cross-border, stablecoins).
- **Financial Institutions** needing to reduce fraud losses and maintain sanctions compliance.
- **External Engineers & Researchers** looking for reference implementations.

---

## 3. Problem Statement

Cross-border money movement and stablecoin rails increase exposure to:

- **Fraud** (CNP, synthetic identity, velocity abuse).
- **Sanctions violations** (screening requirements for compliance).

Firms need a **low-latency pipeline** that reduces false positives while blocking more fraudulent or sanctioned transactions.

---

## 4. Objectives & Success Criteria

**Objectives**

- Train and serve a fraud detection model with real-world transaction features.
- Implement fuzzy sanctions list matching with clear audit output.
- Build a demo UI to visualize the pipeline.

**Success Criteria**

- Fraud model ROC-AUC ≥ 0.85 on test set.
- End-to-end latency ≤ 200 ms p95.
- Demo clearly communicates ROI impact to business stakeholders.

---

## 5. Data Sources

- **Fraud detection**:

  - IEEE-CIS e-commerce fraud dataset (Kaggle).
  - PaySim synthetic mobile money transactions.

- **Sanctions screening**:
  - OFAC SDN and Consolidated Lists (CSV downloads).

---

## 6. Deliverables

1. **Fraud Detection Model**

   - Gradient boosting (LightGBM/XGBoost).
   - Features: velocity counters, device reuse, BIN–IP mismatch, z-scored amounts.
   - Calibrated probabilities + cost-based threshold.

2. **Sanctions Screening Module**

   - Token-based fuzzy matching (e.g. RapidFuzz).
   - Country/date filters.
   - Confidence score + best candidate match.

3. **API Service** (FastAPI)

   - Endpoint `/score` → returns JSON with risk_score, top_features, sanctions_match.
   - Redis cache for velocity counters.
   - Logging + audit storage in Postgres.

4. **Demo Web App** (Next.js, Vercel)

   - Input form for transactions.
   - Gauge for fraud risk.
   - SHAP/feature importance panel.
   - Sanctions match card.

5. **Proof Kit**
   - Training notebook (EDA, feature engineering, model training).
   - Model artifact + inference wrapper.
   - Screen capture of demo.
   - One-pager with metrics + ROI framing.

---

## 7. Technical Requirements

### Recommended Stack Options

- **Stack A (Enterprise-Ready)**

  - AWS S3, SageMaker, Lambda/ECS, API Gateway, DynamoDB, CloudWatch.

- **Stack B (OSS Speed, default)**
  - FastAPI, Python, LightGBM/XGBoost.
  - Redis (feature cache).
  - PostgreSQL (audit + sanctions lists).
  - Next.js + Vercel (frontend).
  - Fly.io/Render (API hosting).

### Non-Functional Requirements

- p95 latency ≤ 150–200 ms.
- Model explainability (basic SHAP importances).
- Audit trail of requests/responses.
- Security: env vars for secrets, token auth for API.

---

## 8. Project Structure

```
devbrew-payments-fraud-sanctions/
  ├── apps/
  │   ├── api/           # FastAPI scoring service
  │   └── web/           # Next.js demo UI
  ├── packages/
  │   ├── models/        # trained artifacts, ONNX exports
  │   └── shared/        # schemas, utils
  ├── data_catalog/      # dataset download scripts + notes
  ├── docs/              # PRD, one-pagers, ROI, architecture
  └── notebooks/         # EDA + model training
```

---

## 9. Timeline (5 Days)

- **Day 1–2** → Data ingestion + feature engineering.
- **Day 3–4** → Fraud modeling + sanctions screening module.
- **Day 5** → API, demo UI, proof kit packaging.

---

## 10. ROI Headline

> “Block X% more fraudulent transactions at Y% false positive rate.  
> Screen sanctions in <200 ms end-to-end.”

---

## 11. Licensing & Attribution

- License: **Apache 2.0**.
- NOTICE file to cite:
  - Devbrew as originator.
  - IEEE-CIS, PaySim, OFAC as data sources.

---
