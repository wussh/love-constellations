# 🐳 DOCKER SETUP - COMPLETE

## 🎉 What's Been Added

### Docker Files Created
- ✅ **docker-compose.yml** - Development environment with hot reload
- ✅ **docker-compose.prod.yml** - Production-ready setup
- ✅ **Dockerfile** - Multi-stage build (dev + production)
- ✅ **docker-setup.sh** - Automated setup script
- ✅ **Makefile** - Convenient command shortcuts
- ✅ **.dockerignore** - Optimized build context
- ✅ **DOCKER_GUIDE.md** - Complete documentation
- ✅ **.env.docker** - Docker environment template
- ✅ **.env.production.example** - Production env template

---

## 🚀 Quick Start Options

### Option 1: Automated Script (Easiest)
```bash
./docker-setup.sh
```
**Done!** Opens at http://localhost:3000

### Option 2: Using Makefile
```bash
make docker-setup     # First time
# or
make docker-up        # Subsequent runs
```

### Option 3: Docker Compose Directly
```bash
docker compose up -d
docker compose exec app npx prisma generate
docker compose exec app npx prisma db push
```

---

## 📦 What's Included

### Services Running
1. **PostgreSQL 16** (localhost:5432)
   - Database: `love_constellations`
   - User: `loveconstellations`
   - Password: `starlight2025`
   - Persistent volume for data

2. **Next.js App** (localhost:3000)
   - Hot reload enabled
   - Auto-restarts on code changes
   - All npm packages installed

3. **Prisma Studio** (localhost:5555)
   - Visual database browser
   - Edit data in real-time
   - View relationships

---

## 🎯 Key Features

### Development Environment
✅ **No Node.js installation required** - Everything in containers
✅ **Hot reload enabled** - Changes appear instantly
✅ **Database included** - No separate PostgreSQL setup
✅ **Prisma Studio** - Visual database management
✅ **Persistent data** - Database survives container restarts
✅ **One-command setup** - `./docker-setup.sh`

### Production Ready
✅ **Multi-stage builds** - Optimized image size
✅ **Standalone output** - Next.js optimized for Docker
✅ **Health checks** - Auto-restart if unhealthy
✅ **Non-root user** - Security best practice
✅ **Nginx support** - Reverse proxy ready

---

## 📋 Available Commands

### Quick Commands (Makefile)
```bash
make help              # Show all commands
make docker-up         # Start containers
make docker-down       # Stop containers
make docker-logs       # View logs
make docker-shell      # Access container
make docker-restart    # Restart services
make docker-clean      # Remove everything
```

### Docker Compose Commands
```bash
docker compose up -d              # Start in background
docker compose down               # Stop containers
docker compose logs -f            # Follow logs
docker compose ps                 # List containers
docker compose restart            # Restart all
docker compose exec app sh        # Shell access
```

### Database Commands
```bash
# Inside container
docker compose exec app npx prisma studio
docker compose exec app npx prisma db push
docker compose exec app npx prisma generate

# Direct PostgreSQL access
docker compose exec postgres psql -U loveconstellations
```

---

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Automatically created from .env.docker
DATABASE_URL="postgresql://loveconstellations:starlight2025@postgres:5432/love_constellations"
```

### Change Ports
Edit `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # App on port 3001
  - "5433:5432"  # DB on port 5433
  - "5556:5555"  # Studio on port 5556
```

### Change Database Credentials
Edit `.env.docker`:
```bash
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydb
```

---

## 🎓 Common Workflows

### Daily Development
```bash
# Morning: Start
make docker-up

# Work: Code changes auto-reload

# Check data: Open Prisma Studio
open http://localhost:5555

# View logs if needed
make docker-logs

# Evening: Stop
make docker-down
```

### Database Changes
```bash
# 1. Edit schema
nano prisma/schema.prisma

# 2. Push changes
docker compose exec app npx prisma db push

# 3. Regenerate client
docker compose exec app npx prisma generate

# 4. Restart app
docker compose restart app
```

### Fresh Start
```bash
# Remove everything (including data)
make docker-clean

# Setup again
make docker-setup
```

---

## 🐛 Troubleshooting

### Port Conflicts
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill it
sudo kill -9 <PID>

# Or change ports in docker-compose.yml
```

### Database Won't Start
```bash
# Check status
docker compose ps

# View logs
docker compose logs postgres

# Restart
docker compose restart postgres

# Nuclear option: Remove and recreate
docker compose down -v
docker compose up -d
```

### App Won't Build
```bash
# Clean rebuild
docker compose build --no-cache

# Remove node_modules in container
docker compose run --rm app rm -rf node_modules
docker compose build
```

### Permission Errors (Linux)
```bash
# Fix file ownership
sudo chown -R $USER:$USER .

# Or add your user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📊 Service Status

### Check Everything Running
```bash
docker compose ps
```

Should show:
```
NAME                          STATUS    PORTS
love-constellations-app       Up        0.0.0.0:3000->3000/tcp
love-constellations-db        Up        0.0.0.0:5432->5432/tcp
love-constellations-studio    Up        0.0.0.0:5555->5555/tcp
```

### Check Logs
```bash
# All services
docker compose logs

# Specific service
docker compose logs app
docker compose logs postgres

# Follow live
docker compose logs -f app
```

---

## 🚢 Production Deployment

### Using Production Compose
```bash
# Build production image
docker compose -f docker-compose.prod.yml build

# Start production stack
docker compose -f docker-compose.prod.yml up -d

# Check health
docker compose -f docker-compose.prod.yml ps
```

### Using Dockerfile Directly
```bash
# Build production image
docker build -t love-constellations:latest --target production .

# Run with external database
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="your-prod-db-url" \
  love-constellations:latest
```

---

## 💾 Data Backup

### Backup Database
```bash
# Export to SQL file
docker compose exec postgres pg_dump \
  -U loveconstellations \
  love_constellations > backup.sql

# Or with timestamp
docker compose exec postgres pg_dump \
  -U loveconstellations \
  love_constellations > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
# From SQL file
cat backup.sql | docker compose exec -T postgres psql \
  -U loveconstellations \
  love_constellations
```

### Copy Volume Data
```bash
# Backup volume
docker run --rm \
  -v love-constellations_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/db-backup.tar.gz /data

# Restore volume
docker run --rm \
  -v love-constellations_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/db-backup.tar.gz -C /
```

---

## 📈 Performance Tips

### Speed Up Builds
```bash
# Use BuildKit
export DOCKER_BUILDKIT=1
docker compose build

# Or set in environment permanently
echo 'export DOCKER_BUILDKIT=1' >> ~/.bashrc
```

### Reduce Image Size
Already optimized in Dockerfile:
- ✅ Multi-stage builds
- ✅ Alpine base images
- ✅ Layer caching
- ✅ .dockerignore configured

### Monitor Resources
```bash
# Check resource usage
docker stats

# Limit resources (edit docker-compose.yml)
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
```

---

## 🔗 Useful Links

- **Docker Docs**: https://docs.docker.com
- **Docker Compose**: https://docs.docker.com/compose
- **Next.js Docker**: https://nextjs.org/docs/deployment#docker-image
- **Prisma Docker**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker

---

## ✅ Setup Verification

Run these to verify everything works:

```bash
# 1. Check containers running
docker compose ps

# 2. Check app responds
curl http://localhost:3000

# 3. Check database
docker compose exec postgres psql -U loveconstellations -c "SELECT 1"

# 4. Check Prisma Studio
open http://localhost:5555

# 5. View logs for errors
docker compose logs --tail=50
```

All should return success! ✅

---

## 🎉 Summary

You now have a **complete Docker development environment** with:

✅ PostgreSQL database (auto-configured)
✅ Next.js app with hot reload
✅ Prisma Studio for database management
✅ One-command setup script
✅ Makefile shortcuts
✅ Production-ready Dockerfile
✅ Complete documentation

**Just run `./docker-setup.sh` and start coding!** 🚀

---

**Questions? Check DOCKER_GUIDE.md for detailed docs.**
