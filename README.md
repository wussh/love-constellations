# ⭐ Love Constellations

A global, anonymous, aesthetic platform where people drop unsent love messages that appear as stars inside shared constellations.

## 🌟 Features

### Phase 1 (MVP) - Current Implementation
- ✅ **Anonymous Message Posting** - Submit love messages without login
- ✅ **Theme Categories** - Crush, First Love, Unsent Apologies, Long Distance, etc.
- ✅ **Twin-Star Matching** - Secret code system links messages with same initials + birth month
- ✅ **Interactive Star Field** - 2D canvas visualization with color-coded themes
- ✅ **React System** - Like/react to messages to increase star brightness
- ✅ **Real-time Updates** - Stars appear as they're created (polling every 10s)
- ✅ **Rate Limiting** - IP-based protection against spam
- ✅ **Theme Filtering** - View all or filter by specific theme

### Phase 2 (Planned)
- 🔜 **3D Star Map** - WebGL/Three.js immersive experience
- 🔜 **Real-time WebSocket** - Instant star appearance with meteor animation
- 🔜 **AI Moderation** - Content filtering for safety
- 🔜 **Galaxy Rooms** - Separate 3D spaces for each theme
- 🔜 **Secret Replies** - Anonymous messaging between twin stars
- 🔜 **Mood Music** - Optional ambient soundtrack

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **State**: TanStack Query (React Query) + Zustand
- **Database**: PostgreSQL + Prisma ORM
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or cloud)

### Option 1: Docker Setup (Recommended - Easiest!)

**One command to get everything running:**

```bash
./docker-setup.sh
```

This automatically:
- ✅ Sets up PostgreSQL database
- ✅ Installs all dependencies
- ✅ Runs migrations
- ✅ Starts the app with hot reload
- ✅ Opens Prisma Studio for database management

**Access:**
- App: http://localhost:3000
- Prisma Studio: http://localhost:5555

**Docker Commands:**
```bash
make docker-up        # Start containers
make docker-down      # Stop containers
make docker-logs      # View logs
make docker-shell     # Access container shell
```

See [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) for complete Docker documentation.

---

### Option 2: Local Installation

1. **Clone and install dependencies**
   ```bash
   cd love-constellations
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/love_constellations"
   ```

3. **Generate Prisma client and run migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📊 Database Schema

### Stars Table
- `id` - Unique identifier
- `message` - The love message
- `theme` - Category (CRUSH, FIRST_LOVE, etc.)
- `code_hash` - Hashed secret code for twin matching
- `pos_x`, `pos_y` - Position on canvas
- `brightness` - Calculated from reactions
- `created_at` - Timestamp
- `ip_hash` - For rate limiting

### Reactions Table
- `id` - Unique identifier
- `star_id` - Reference to star
- `ip_hash` - For duplicate prevention
- `created_at` - Timestamp

### Twin Links Table
- `id` - Unique identifier
- `star_a_id`, `star_b_id` - Connected stars
- `created_at` - Timestamp

## 🎨 Theme Categories

| Theme | Icon | Description |
|-------|------|-------------|
| Crush | 💕 | That person you can't stop thinking about |
| First Love | 🌸 | The one who started it all |
| Unsent Apology | 🕊️ | Words you wish you could say |
| Long Distance | 🌍 | Miles apart, hearts together |
| Secret Admirer | 🎭 | Anonymous feelings from afar |
| Moving On | 🦋 | Letting go, growing forward |
| What If | ✨ | The roads not taken |
| Gratitude | 💖 | Thank you for existing |

## 🔐 Security Features

- **Anonymous by Default** - No user accounts or tracking
- **IP-based Rate Limiting** - 3 stars/hour, 20 reactions/hour
- **Hashed Secret Codes** - SHA256 for twin-star matching
- **Hashed IP Addresses** - Privacy-preserving abuse prevention
- **Content Length Limits** - 10-500 characters

## 📁 Project Structure

```
love-constellations/
├── app/
│   ├── api/
│   │   └── stars/
│   │       ├── route.ts          # GET/POST stars
│   │       └── [id]/react/
│   │           └── route.ts      # POST reactions
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── constellation-page.tsx    # Main page component
│   ├── star-canvas.tsx           # 2D canvas renderer
│   ├── star-form.tsx             # Message submission form
│   ├── star-modal.tsx            # Message detail view
│   └── providers.tsx             # React Query provider
├── lib/
│   ├── prisma.ts                 # Prisma client
│   ├── utils.server.ts           # Server utilities
│   └── constants.ts              # App constants
├── prisma/
│   └── schema.prisma             # Database schema
└── package.json
```

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy!

### Database Options
- **Supabase** - Free PostgreSQL + realtime features
- **Neon** - Serverless PostgreSQL
- **PlanetScale** - Scalable MySQL (requires schema adjustment)
- **Railway** - Easy PostgreSQL hosting

## 🎯 Roadmap

### MVP Complete ✅
- [x] Core message posting
- [x] Theme system
- [x] Twin-star matching
- [x] 2D visualization
- [x] Rate limiting
- [x] React system

### Phase 1.5
- [ ] WebSocket real-time updates
- [ ] Meteor spawn animations
- [ ] Star clustering by keywords
- [ ] Secret reply system
- [ ] Mood music toggle

### Phase 2
- [ ] 3D WebGL star map
- [ ] Theme-based galaxy rooms
- [ ] Advanced twin-star animations
- [ ] AI content moderation
- [ ] User analytics dashboard

## 🤝 Contributing

This is currently an MVP. Contributions welcome! Areas of focus:
- 3D visualization with Three.js
- Real-time with WebSockets/Supabase
- AI moderation integration
- Mobile optimization
- Performance improvements

## 📄 License

MIT License - feel free to use this for your own projects!

## 💌 About

Love Constellations is a space for unexpressed feelings - a beautiful, anonymous way to share what your heart couldn't say. Every message becomes a star, and sometimes, stars find each other.

---

**Built with 💜 using Next.js, TypeScript, and lots of starlight**
