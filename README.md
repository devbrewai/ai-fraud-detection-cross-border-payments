# Devbrew Payments Fraud & Sanctions

**Production-grade research case study** from Devbrew.  
Demonstrates real-time fraud detection and OFAC sanctions screening for cross-border payments using public/synthetic datasets.  
Includes training notebooks, inference API, and a demo UI. Open-sourced under Apache 2.0.

---

## Overview

This repository showcases a complete pipeline to:

- Score card-not-present (CNP) transactions for fraud risk.
- Screen names against OFAC sanctions lists with fuzzy matching.
- Return risk score, top contributing features, and sanctions matches in <200ms.

---

## Data Sources

- **Fraud detection**
  - [IEEE-CIS e-commerce fraud dataset](https://www.kaggle.com/c/ieee-fraud-detection)
  - [PaySim synthetic mobile money dataset](https://www.kaggle.com/ntnu-testimon/paysim1)
- **Sanctions screening**
  - [OFAC SDN and Consolidated Lists](https://sanctionslist.ofac.treas.gov/Home)

---

## Tech Stack

- **Backend**: FastAPI, Python, LightGBM/XGBoost, Redis, PostgreSQL
- **Frontend**: Next.js, Tailwind, Vercel
- **Hosting**: Fly.io or Render (API), Vercel (UI)

---

## Repo Structure

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

## Quickstart

### 1. Clone the repo

```bash
git clone https://github.com/devbrewai/devbrew-payments-fraud-sanctions.git
cd devbrew-payments-fraud-sanctions
```

### 2. Setup environment

**Using UV (recommended):**

```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh

# Sync dependencies (creates .venv automatically)
uv sync

# Activate virtual environment
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows
```

**Or using pip:**

```bash
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows

uv pip install -e .         # Install from pyproject.toml
```

### 3. Run API locally

```bash
uvicorn apps.api.main:app --reload
```

### 4. Run frontend

```bash
cd apps/web
npm install
npm run dev
```

---

## Demo

- Web UI (Vercel): _coming soon_
- API endpoint (Render/Fly.io): _coming soon_

---

## Documentation

- [PRD](./docs/PRD.md) — detailed product requirements
- ROI one-pager (coming soon)

---

## License

Apache 2.0 © Devbrew LLC. See [LICENSE](./LICENSE).  
NOTICE file includes dataset attributions.

---

## Contributing

Contributions are welcome!

- Open an issue for bugs or feature requests.
- Submit a PR following our contribution guidelines.

---

## ROI Headline

> Block X% more fraudulent transactions at Y% false positive rate.  
> Screen sanctions in <200 ms end-to-end.
