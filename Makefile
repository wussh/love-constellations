# Makefile for Love Constellations

.PHONY: help install dev build start stop restart logs clean docker-build docker-up docker-down docker-restart docker-logs docker-clean prisma-generate prisma-push prisma-studio

# Default target
help:
	@echo "🌟 Love Constellations - Available Commands"
	@echo "==========================================="
	@echo ""
	@echo "📦 Local Development:"
	@echo "  make install          - Install dependencies"
	@echo "  make dev              - Start development server"
	@echo "  make build            - Build for production"
	@echo "  make start            - Start production server"
	@echo ""
	@echo "🐳 Docker Commands:"
	@echo "  make docker-setup     - Initial Docker setup"
	@echo "  make docker-build     - Build Docker containers"
	@echo "  make docker-up        - Start Docker containers"
	@echo "  make docker-down      - Stop Docker containers"
	@echo "  make docker-restart   - Restart Docker containers"
	@echo "  make docker-logs      - View Docker logs"
	@echo "  make docker-shell     - Access app container shell"
	@echo "  make docker-clean     - Remove containers and volumes"
	@echo ""
	@echo "🗄️  Database Commands:"
	@echo "  make prisma-generate  - Generate Prisma client"
	@echo "  make prisma-push      - Push schema to database"
	@echo "  make prisma-studio    - Open Prisma Studio"
	@echo "  make db-reset         - Reset database"
	@echo ""

# Local development
install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

# Docker commands
docker-setup:
	./docker-setup.sh

docker-build:
	docker compose build

docker-up:
	docker compose up -d
	@echo "✅ Containers started"
	@echo "📊 App: http://localhost:3000"
	@echo "📊 Prisma Studio: http://localhost:5555"

docker-down:
	docker compose down

docker-restart:
	docker compose restart

docker-logs:
	docker compose logs -f

docker-shell:
	docker compose exec app sh

docker-clean:
	docker compose down -v
	docker system prune -f

# Prisma commands
prisma-generate:
	npx prisma generate

prisma-push:
	npx prisma db push

prisma-studio:
	npx prisma studio

db-reset:
	npx prisma migrate reset --force

# Docker + Prisma
docker-prisma-generate:
	docker compose exec app npx prisma generate

docker-prisma-push:
	docker compose exec app npx prisma db push

docker-prisma-studio:
	docker compose exec app npx prisma studio

# Cleanup
clean:
	rm -rf node_modules .next out dist
	@echo "✅ Cleaned local files"
