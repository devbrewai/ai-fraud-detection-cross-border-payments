# Cross-Border Payments Fraud

**Open-source research case study** from Devbrew demonstrating fraud detection and OFAC sanctions screening for cross-border payments.

This reference pipeline combines public datasets (IEEE-CIS, PaySim, OFAC) with modern ML and API tooling to:

- Detect fraud in **card-not-present (CNP) transactions**
- Screen sender/receiver names against **OFAC Sanctions Lists** with fuzzy matching
- Generate fraud risk scores with explainability, **targeting sub-200ms latency**

**What's included:**

- Training notebooks for fraud modeling and sanctions matching
- FastAPI inference service
- Next.js demo UI with real-time scoring
- Documentation and reference architecture (ROI framing planned)

> **Note**: For **research/educational use only**, not production-ready.
>
> Models trained on IEEE-CIS data are restricted to **non-commercial use**.
> Production deployments require retraining on proprietary or licensed datasets.

**License:** Apache 2.0

## Data Sources

- **Fraud detection**
  - [IEEE-CIS e-commerce fraud dataset](https://www.kaggle.com/c/ieee-fraud-detection) - research only (non-commercial license)
  - [PaySim synthetic mobile money dataset](https://www.kaggle.com/ntnu-testimon/paysim1) - open data
- **Sanctions screening**
  - [OFAC SDN and Consolidated Lists](https://sanctionslist.ofac.treas.gov/Home) -— public domain

## Tech Stack

- **Backend**: FastAPI, Python, LightGBM/XGBoost, Redis, PostgreSQL
- **Frontend**: Next.js, Tailwind, Vercel
- **Hosting**: Fly.io or Render (API), Vercel (UI) or any cloud service provider (e.g. AWS, GCP, Azure, DigitalOcean, Heroku, etc.)

## Repo Structure

```
cross-border-payments-fraud/
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

## Quickstart

### 1. Clone the repo

```bash
git clone https://github.com/devbrewai/cross-border-payments-fraud.git
cd cross-border-payments-fraud
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

## Demo

- Video walkthrough: _planned_
- Optional live demo endpoint (rate-limited): _planned_

## Documentation

- [Research Requirements](./docs/research-requirements.md) — detailed case study specifications
- [Roadmap](./docs/roadmap.md) — project phases and success criteria
- Case Study Summary: _planned_ (pending results validation)

## Disclaimer

This repository is provided for **educational and research purposes only**.

- The **IEEE-CIS Fraud Dataset** is licensed for **non-commercial use only** and may not be redistributed or used to train commercial models.
- Any **trained model artifacts** derived from IEEE-CIS data are intended solely for demonstration and benchmarking.
- For production systems, you must retrain the pipeline on your own **proprietary or licensed datasets**.
- The **PaySim** and **OFAC Sanctions Lists** datasets are open/public and may be used more broadly, subject to their respective terms.

Devbrew makes no representations or warranties regarding the suitability of this code for production use. Use at your own risk and ensure compliance with all applicable laws, regulations, and dataset licenses.

## License

Apache 2.0 © Devbrew LLC. See [LICENSE](./LICENSE).  
[NOTICE](./NOTICE) file includes dataset attributions.

## Contributing

Contributions are welcome!

- Open an issue for bugs or feature requests.
- Submit a PR following our contribution guidelines [here](./CONTRIBUTING.md).
