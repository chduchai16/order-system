.PHONY: help build test lint clean docker-build local-ci deploy-staging deploy-prod

# Variables
JAVA_VERSION=17
MAVEN_OPTS=-Xmx1024m
DOCKER_REGISTRY=ghcr.io
IMAGE_NAME=order-system
SERVICES=apigateway authservice userservice productservice orderservice paymentservice notificationservice discoveryserver

help:
	@echo "Order System - Development Tasks"
	@echo ""
	@echo "Build & Test:"
	@echo "  make build           - Build all services (Maven)"
	@echo "  make test            - Run all tests"
	@echo "  make test-unit       - Run unit tests only"
	@echo "  make test-integration - Run integration tests"
	@echo "  make build-frontend  - Build frontend (Next.js)"
	@echo "  make lint            - Run linters"
	@echo ""
	@echo "Development:"
	@echo "  make dev             - Start development servers (local docker-compose)"
	@echo "  make dev-stop        - Stop development servers"
	@echo "  make dev-logs        - Show docker-compose logs"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build    - Build Docker images for all services"
	@echo "  make docker-push     - Push Docker images to registry"
	@echo "  make docker-clean    - Remove all local images"
	@echo ""
	@echo "CI/CD:"
	@echo "  make local-ci        - Run local CI pipeline (like GitHub Actions)"
	@echo "  make deploy-staging  - Deploy to staging"
	@echo "  make deploy-prod     - Deploy to production"
	@echo ""
	@echo "Utility:"
	@echo "  make clean           - Clean Maven and build artifacts"
	@echo "  make format          - Format code"
	@echo "  make version         - Show versions"

# Build targets
build:
	@echo "Building all services..."
	mvn -B clean package -DskipTests

build-frontend:
	@echo "Building frontend..."
	cd frontend && npm install && npm run build

test:
	@echo "Running all tests..."
	mvn -B test

test-unit:
	@echo "Running unit tests..."
	mvn -B test

test-integration:
	@echo "Running integration tests..."
	mvn -B verify

# Linting and formatting
lint:
	@echo "Running linters..."
	cd frontend && npm run lint
	mvn -B spotless:check || true

format:
	@echo "Formatting code..."
	mvn -B spotless:apply
	cd frontend && npm run lint -- --fix || true

# Development
dev:
	@echo "Starting development environment..."
	docker-compose up -d

dev-stop:
	@echo "Stopping development environment..."
	docker-compose down

dev-logs:
	@echo "Showing docker-compose logs..."
	docker-compose logs -f

# Docker targets
docker-build:
	@echo "Building Docker images..."
	@for service in $(SERVICES); do \
		echo "Building $$service..."; \
		docker build -t $(DOCKER_REGISTRY)/$(IMAGE_NAME)/$$service:latest -f $$service/Dockerfile .; \
	done
	@echo "Building frontend..."
	docker build -t $(DOCKER_REGISTRY)/$(IMAGE_NAME)/frontend:latest -f frontend/Dockerfile frontend

docker-push:
	@echo "Pushing Docker images..."
	@for service in $(SERVICES); do \
		echo "Pushing $$service..."; \
		docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME)/$$service:latest; \
	done
	docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME)/frontend:latest

docker-clean:
	@echo "Removing Docker images..."
	@docker rmi $(DOCKER_REGISTRY)/$(IMAGE_NAME)/* || true

# Local CI
local-ci:
	@echo "Running local CI pipeline..."
	@if [ -f "./scripts/run-local-ci.sh" ]; then \
		bash ./scripts/run-local-ci.sh; \
	else \
		echo "CI script not found"; \
		exit 1; \
	fi

# Deployment
deploy-staging:
	@echo "Deploying to staging..."
	@echo "This is a placeholder. Update with your staging deployment command."
	@echo "Example: kubectl apply -f k8s/staging/"

deploy-prod:
	@echo "Deploying to production..."
	@echo "This is a placeholder. Update with your production deployment command."
	@echo "Example: kubectl apply -f k8s/production/"

# Utility targets
clean:
	@echo "Cleaning build artifacts..."
	mvn clean
	rm -rf frontend/node_modules frontend/.next
	rm -rf frontend/out

version:
	@echo "=== Versions ==="
	@java -version
	@mvn -v | head -n 1
	@node -v
	@npm -v
	@docker -v

# Help for specific task
help-%:
	@echo "Help for: $*"
	@grep "^$*:" -A 2 Makefile || echo "Task not found"

# Default target
.DEFAULT_GOAL := help
