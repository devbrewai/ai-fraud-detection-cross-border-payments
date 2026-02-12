.PHONY: help dev run-api run-web test test-web lint docker-up docker-down db-generate db-migrate db-push db-studio clean

# Default target
help:
	@echo "Sentinel - AI Fraud Detection & Sanctions Screening"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Services:"
	@echo "  dev          Start API + Web concurrently (requires docker-up)"
	@echo "  run-api      Start the FastAPI server (requires Redis & Postgres)"
	@echo "  run-web      Start the Next.js frontend"
	@echo "  docker-up    Start Redis & Postgres containers"
	@echo "  docker-down  Stop Docker containers"
	@echo ""
	@echo "Testing & Linting:"
	@echo "  test         Run API tests"
	@echo "  test-web     Run Next.js component tests"
	@echo "  lint         Run code linting"
	@echo ""
	@echo "Auth Database (Drizzle + Neon):"
	@echo "  db-generate  Generate migration files from schema changes"
	@echo "  db-migrate   Apply pending migrations to Neon auth DB"
	@echo "  db-push      Push schema directly to Neon (dev shortcut)"
	@echo "  db-studio    Open Drizzle Studio GUI"
	@echo ""
	@echo "Utilities:"
	@echo "  clean        Remove Python cache files"

# Run API + Web concurrently
dev:
	@trap 'kill 0' EXIT; \
	PYTHONPATH=apps/api uvicorn src.main:app --reload & \
	cd apps/web && bun run dev & \
	wait

# Run the FastAPI server
run-api:
	PYTHONPATH=apps/api uvicorn src.main:app --reload

# Run the Next.js frontend
run-web:
	cd apps/web && bun run dev

# Run tests
test:
	PYTHONPATH=apps/api pytest apps/api/tests -v

# Run linting
lint:
	ruff check .

# Start infrastructure containers
docker-up:
	docker-compose -f apps/api/docker-compose.yml up -d redis db

# Stop infrastructure containers
docker-down:
	docker-compose -f apps/api/docker-compose.yml down

# Run Next.js component tests
test-web:
	cd apps/web && bun run test:run

# Generate Drizzle migration files from schema changes
db-generate:
	cd apps/web && bun run db:generate

# Apply pending migrations to Neon auth DB
db-migrate:
	cd apps/web && bun run db:migrate

# Push schema directly to Neon (no migration files, useful for dev)
db-push:
	cd apps/web && bun run db:push

# Open Drizzle Studio GUI to browse auth tables
db-studio:
	cd apps/web && bun run db:studio

# Clean Python cache
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
