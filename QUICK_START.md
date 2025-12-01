# 🚀 QUICK START GUIDE

## Prerequisites
- Node.js 18 or higher
- PostgreSQL database (local or cloud)

## Option 1: Automated Setup (Recommended)

```bash
# 1. Run the setup script
./setup.sh

# 2. Edit .env with your database URL
nano .env  # or your preferred editor

# 3. Start development server
npm run dev
```

## Option 2: Manual Setup

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env and add your DATABASE_URL
# Example: postgresql://user:password@localhost:5432/love_constellations

# 3. Generate Prisma Client
npx prisma generate

# 4. Push database schema
npx prisma db push

# 5. Start development server
npm run dev
```

## Database Options

### 🟢 Supabase (Easiest, Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings > Database
4. Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

### 🟢 Neon (Serverless, Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Format: `postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]`

### 🟡 Local PostgreSQL
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE love_constellations;
\q

# Connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/love_constellations"
```

### 🟡 Railway
1. Go to [railway.app](https://railway.app)
2. Create new project > Add PostgreSQL
3. Copy connection string from Variables tab

## Verify Setup

```bash
# Check database connection
npx prisma db push

# View database in Prisma Studio
npx prisma studio
```

## Development

```bash
# Start dev server
npm run dev

# Open browser
http://localhost:3000
```

## Common Issues

### "Can't reach database server"
- Check DATABASE_URL in .env
- Ensure database is running
- Check firewall/network settings

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "Port 3000 already in use"
```bash
# Change port
PORT=3001 npm run dev
```

### TypeScript errors
```bash
# Regenerate types
npx prisma generate
npm run build
```

## Next Steps

1. **Test the app**
   - Create a star message
   - Try different themes
   - Test twin-star matching (use same initials + birth month)

2. **Explore the code**
   - `app/api/stars/` - API routes
   - `components/` - UI components
   - `lib/` - Utilities and constants

3. **Customize**
   - Modify themes in `lib/constants.ts`
   - Adjust colors in components
   - Update rate limits

4. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Add production DATABASE_URL

## Useful Commands

```bash
# Database management
npx prisma studio          # Visual database browser
npx prisma db push         # Sync schema to database
npx prisma db pull         # Pull schema from database
npx prisma migrate dev     # Create migration

# Development
npm run dev                # Start dev server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Prisma
npx prisma generate        # Generate client
npx prisma format          # Format schema
npx prisma validate        # Validate schema
```

## Support

- Check `README.md` for detailed documentation
- Review `IMPLEMENTATION_PLAN.md` for roadmap
- Open an issue on GitHub for bugs

---

**Happy coding! ⭐**
