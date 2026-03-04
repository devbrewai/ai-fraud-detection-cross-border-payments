# Sentinel API

FastAPI service for real-time fraud scoring and sanctions screening.

## Features

- **Fraud scoring:** LightGBM model inference on 400+ features
- **Sanctions screening:** Fuzzy matching against OFAC SDN/Consolidated lists (~40k names)
- **Real-time velocity features:** Redis-backed transaction counters
- **Audit logging:** Async PostgreSQL logging for compliance
- **Low latency:** <50ms p95 scoring; on-demand SHAP explainability via `?explain=true`

## Quick start

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- Access to `packages/models/` artifacts (generated from notebooks)

### 1. Start infrastructure

From `apps/api`:

```bash
cd apps/api
docker-compose up -d redis db
```

Or from the **project root**:

```bash
make docker-up
```

### 2. Configure environment

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` with your local settings.

### 3. Run the API

From the **project root**:

```bash
make run-api
```

Or manually:

```bash
PYTHONPATH=apps/api uvicorn src.main:app --reload
```

### 4. Verify

```bash
curl http://localhost:8000/health
```

Example response: `status`, `project`, `version`, `model_loaded`, `screener_loaded`. Use `model_loaded` and `screener_loaded` to confirm the API is ready to score.

## Docker

### Build and run

Build and run the full stack (API + Redis + Postgres):

```bash
cd apps/api
docker-compose up --build
```

### Configuration note

The `docker-compose.yml` file is configured to **ignore your local `.env` file** for critical infrastructure connections (`DATABASE_URL`, `REDIS_URL`) to prevent conflicts between `localhost` (host machine) and internal container hostnames (`db`, `redis`).

- **Local dev:** Uses `.env` (connecting to `localhost`).
- **Docker:** Uses hardcoded internal defaults in `docker-compose.yml`.

**Troubleshooting:**
If you see `ConnectionRefusedError` inside Docker, ensure you haven't modified `docker-compose.yml` to force usage of local environment variables that point to `localhost`.

## API documentation

Once the API is running, interactive documentation is available at:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs) - Interactive API explorer
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc) - Alternative documentation view
- **OpenAPI JSON:** [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json) - Raw schema

## API endpoints

| Method | Path                | Description                   |
| ------ | ------------------- | ----------------------------- |
| `GET`  | `/health`           | Health check                  |
| `POST` | `/api/v1/score`     | Score a transaction           |
| `POST` | `/api/v1/batch`     | Score a batch of transactions |
| `GET`  | `/api/v1/analytics` | Get comprehensive analytics   |

**Score:** Append `?explain=true` to include SHAP top-feature contributions (adds ~1s latency).

**Batch:** Request body is a JSON object with a `transactions` array (max 100 items). Each item: `transaction_id`, `sender_name`, `TransactionAmt`, `card_id`, optional `sender_country`, optional `ProductCD`. Response includes `results`, `total_processed`, and `total_latency_ms`.

**Analytics:** Returns summary metrics, daily volume, risk distribution, latency trends, and model/sanctions metrics.

### Example request

```bash
curl -X POST http://localhost:8000/api/v1/score \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "txn_123",
    "TransactionAmt": 150.00,
    "card_id": "card_abc",
    "sender_name": "John Doe",
    "sender_country": "US",
    "ProductCD": "W"
  }'
```

### Example response

```json
{
  "transaction_id": "txn_123",
  "risk_score": 0.021,
  "risk_level": "low",
  "decision": "approve",
  "sanctions_match": false,
  "latency_ms": 25.3
}
```

When `?explain=true`, the response also includes `top_features` (SHAP contributions). The response always includes `velocity` (transactions_1h, transactions_24h). On a sanctions hit, `sanctions_details` is populated.

## Project structure

```
apps/api/
├── src/
│   ├── main.py              # FastAPI entry point
│   ├── config.py            # Pydantic settings
│   ├── routers/
│   │   └── v1.py            # /score, /batch, /analytics endpoints
│   ├── schemas/
│   │   ├── feature_factory.py  # Dynamic schema generation
│   │   └── requests.py      # Request/Response models
│   ├── services/
│   │   ├── fraud_model.py   # LightGBM inference
│   │   ├── sanctions.py     # OFAC screening
│   │   ├── features.py      # Redis velocity counters
│   │   └── audit.py         # PostgreSQL audit logging
│   └── utils/
│       └── countries.py     # ISO country code helpers
├── tests/
│   └── test_score.py
├── Dockerfile
└── docker-compose.yml
```

## Testing

### Run unit tests

From the **project root**:

```bash
make test
```

Or:

```bash
PYTHONPATH=apps/api pytest apps/api/tests -v
```

Some tests call the running API; start the server for full coverage.

### Verified rejection test

To verify the full fraud/sanctions rejection logic, you can run this known positive match case:

```bash
curl -X POST http://localhost:8000/api/v1/score \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "txn_verify_reject",
    "TransactionAmt": 200.00,
    "sender_name": "Jhon Paul Castro Paez",
    "sender_country": "Colombia",
    "card_id": "card_rejected",
    "ProductCD": "W"
  }'
```

**Expected response:**

```json
{
  "decision": "reject",
  "risk_level": "critical",
  "sanctions_match": true
}
```

## Performance

| Metric                        | Target | Achieved  |
| ----------------------------- | ------ | --------- |
| Scoring latency (no SHAP)     | <200ms | ~30-50ms  |
| Scoring + SHAP explainability | —      | ~1-1.5s   |
| Model inference               | <50ms  | <10ms     |
| Sanctions screening (p95)     | <50ms  | ~47ms     |

SHAP explainability is opt-in via `?explain=true` query parameter. The demo UI requests explanations by default.

## Environment variables

| Variable                | Description                                                                 | Default                    |
| ----------------------- | --------------------------------------------------------------------------- | -------------------------- |
| `REDIS_URL`             | Redis connection string (optional — velocity features disabled if unset)     | `redis://localhost:6379/0` |
| `DATABASE_URL`          | PostgreSQL connection string (optional — audit/analytics disabled if unset) | —                          |
| `MODEL_PATH`            | Path to LightGBM model file                                                 | Required                   |
| `SCREENER_PATH`         | Path to sanctions screener pickle                                          | Required                   |
| `EXPLAINER_PATH`        | Path to SHAP explainer pickle                                              | Required                   |
| `FEATURE_REGISTRY_PATH` | Path to feature registry JSON                                              | Required                   |
| `API_V1_STR`            | API version prefix                                                         | `/api/v1`                  |
| `PROJECT_NAME`          | Project name for OpenAPI docs                                              | `Sentinel API`             |
