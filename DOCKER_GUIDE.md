# 🐳 Docker Setup Guide

## Quick Start (Easiest Way)

```bash
# One command setup
./docker-setup.sh
```

This will:
1. ✅ Check Docker installation
2. ✅ Create environment file
3. ✅ Build containers
4. ✅ Start PostgreSQL + App
5. ✅ Run database migrations
6. ✅ Start Prisma Studio

**Then open:** http://localhost:3000

---

## Manual Docker Setup

### 1. Build Containers
```bash
docker compose build
```

### 2. Start Services
```bash
docker compose up -d
```

### 3. Run Database Migrations
```bash
docker compose exec app npx prisma generate
docker compose exec app npx prisma db push
```

### 4. Verify
- App: http://localhost:3000
- Prisma Studio: http://localhost:5555
- PostgreSQL: localhost:5432

---

## Using Makefile (Recommended)

```bash
# View all commands
make help

# Docker setup
make docker-setup

# Start containers
make docker-up

# View logs
make docker-logs

# Stop containers
make docker-down

# Access app shell
make docker-shell
```

---

## Services Included

### 1. PostgreSQL Database
- **Image**: `postgres:16-alpine`
- **Port**: `5432`
- **Database**: `love_constellations`
- **User**: `loveconstellations`
- **Password**: `starlight2025`
- **Volume**: Persistent data storage

### 2. Next.js App (Development)
- **Port**: `3000`
- **Hot Reload**: Enabled
- **Volume Mounted**: Live code changes

### 3. Prisma Studio
- **Port**: `5555`
- **Purpose**: Visual database browser
- **Access**: http://localhost:5555

---

## Common Commands

### Start/Stop
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart services
docker compose restart

# Stop and remove volumes
docker compose down -v
```

### Logs
```bash
# View all logs
docker compose logs -f

# View specific service
docker compose logs -f app
docker compose logs -f postgres

# Last 50 lines
docker compose logs --tail=50 app
```

### Database Management
```bash
# Access PostgreSQL
docker compose exec postgres psql -U loveconstellations -d love_constellations

# Run Prisma migrations
docker compose exec app npx prisma db push

# Open Prisma Studio
# Already running at http://localhost:5555

# Reset database
docker compose exec app npx prisma migrate reset
```

### App Shell Access
```bash
# Enter app container
docker compose exec app sh

# Run commands inside container
docker compose exec app npm run build
docker compose exec app npx prisma generate
```

---

## Environment Variables

### Default (.env.docker)
```bash
POSTGRES_USER=loveconstellations
POSTGRES_PASSWORD=starlight2025
POSTGRES_DB=love_constellations
DATABASE_URL="postgresql://loveconstellations:starlight2025@postgres:5432/love_constellations"
```

### Custom Configuration
Create `.env` file:
```bash
# Copy template
cp .env.docker .env

# Edit as needed
nano .env
```

---

## Port Configuration

Default ports:
- **App**: 3000
- **Database**: 5432
- **Prisma Studio**: 5555

### Change Ports
Edit `docker-compose.yml`:
```yaml
services:
  postgres:
    ports:
      - "5433:5432"  # Change to 5433
  
  app:
    ports:
      - "3001:3000"  # Change to 3001
```

---

## Production Deployment

### Build Production Image
```bash
# Build production stage
docker compose -f docker-compose.prod.yml build

# Or using Dockerfile directly
docker build --target production -t love-constellations:prod .
```

### Run Production Container
```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="your-production-db-url" \
  love-constellations:prod
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database Connection Failed
```bash
# Check if postgres is healthy
docker compose ps

# View postgres logs
docker compose logs postgres

# Restart postgres
docker compose restart postgres
```

### Permission Issues
```bash
# Fix ownership (Linux/Mac)
sudo chown -R $USER:$USER .

# Or run with sudo
sudo docker compose up -d
```

### Container Won't Start
```bash
# Remove old containers
docker compose down -v

# Rebuild
docker compose build --no-cache

# Start fresh
docker compose up -d
```

### Module Not Found
```bash
# Reinstall in container
docker compose exec app npm install

# Or rebuild
docker compose build --no-cache
```

---

## Development Workflow

### Recommended Flow
```bash
# 1. Start containers
make docker-up

# 2. View logs in terminal
make docker-logs

# 3. Make code changes (auto-reload enabled)

# 4. Check Prisma Studio for data
# Open http://localhost:5555

# 5. Restart if needed
make docker-restart
```

### Database Changes
```bash
# 1. Edit prisma/schema.prisma

# 2. Push changes
docker compose exec app npx prisma db push

# 3. Regenerate client
docker compose exec app npx prisma generate

# 4. Restart app
docker compose restart app
```

---

## Data Persistence

### Volumes
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect love-constellations_postgres_data

# Backup database
docker compose exec postgres pg_dump -U loveconstellations love_constellations > backup.sql

# Restore database
cat backup.sql | docker compose exec -T postgres psql -U loveconstellations love_constellations
```

---

## Clean Up

### Remove Everything
```bash
# Stop and remove containers + volumes
docker compose down -v

# Remove images
docker rmi love-constellations-app love-constellations-studio

# Clean Docker system
docker system prune -a -f
```

### Keep Database, Remove App
```bash
# Stop containers only
docker compose down

# Remove app containers, keep postgres volume
docker compose rm -f app prisma-studio
```

---

## Docker Compose Profiles

### Run Only Database
```bash
docker compose up -d postgres
```

### Run Without Prisma Studio
```bash
docker compose up -d postgres app
```

---

## Performance Tips

### 1. Use BuildKit
```bash
export DOCKER_BUILDKIT=1
docker compose build
```

### 2. Multi-stage Caching
Already configured in Dockerfile

### 3. Volume Optimization
```yaml
# In docker-compose.yml (already configured)
volumes:
  - .:/app
  - /app/node_modules  # Prevents host override
  - /app/.next         # Speeds up builds
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Docker Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker compose build
      
      - name: Run tests
        run: docker compose run app npm test
```

---

## FAQ

**Q: Do I need to install Node.js locally?**
A: No, everything runs in Docker containers.

**Q: Can I use this with existing local setup?**
A: Yes, just use different ports or stop local services.

**Q: How do I see database contents?**
A: Use Prisma Studio at http://localhost:5555

**Q: Can I use this in production?**
A: Yes, use the production stage in Dockerfile.

**Q: How do I update dependencies?**
A: Modify package.json, then `docker compose build --no-cache`

---

## Next Steps

1. ✅ Run `./docker-setup.sh`
2. ✅ Open http://localhost:3000
3. ✅ Create your first star
4. ✅ Check database in Prisma Studio
5. ✅ Make code changes (auto-reloads)

---

**Built with 🐳 Docker for easy development**
