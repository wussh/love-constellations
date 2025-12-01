#!/bin/bash

# 🐳 Love Constellations - Docker Setup Script

set -e

echo "🐳 Love Constellations - Docker Setup"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker found"
echo "✅ Docker Compose found"
echo ""

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.docker..."
    cp .env.docker .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🏗️  Building Docker containers..."
echo ""

# Build containers
docker compose build

echo ""
echo "🚀 Starting containers..."
echo ""

# Start containers
docker compose up -d

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 5

echo ""
echo "🔧 Running database migrations..."
docker compose exec app npx prisma generate
docker compose exec app npx prisma db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Services running:"
echo "   • App:          http://localhost:3000"
echo "   • Database:     localhost:5432"
echo "   • Prisma Studio: http://localhost:5555"
echo ""
echo "📝 Useful commands:"
echo "   • View logs:    docker compose logs -f"
echo "   • Stop:         docker compose down"
echo "   • Restart:      docker compose restart"
echo "   • Shell:        docker compose exec app sh"
echo ""
echo "🎉 Happy coding!"
