#!/bin/bash

# Love Constellations Setup Script

echo "⭐ Setting up Love Constellations..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your DATABASE_URL"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "📦 Prisma Client generated!"
echo ""

# Check if user wants to push schema
read -p "Do you want to push the database schema now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗄️  Pushing database schema..."
    npx prisma db push
    echo "✅ Database schema pushed!"
else
    echo "⏭️  Skipped database push. Run 'npx prisma db push' when ready."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your PostgreSQL DATABASE_URL"
echo "2. Run 'npx prisma db push' (if you skipped it)"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000"
echo ""
echo "✨ Happy coding!"
