# Node API

## Environment Config

API is configured to use PsotggreSQL or SQLite databases.

## Running API

```bash

# Install JavaScript dependencies
npm install

# Copy environment config and generate app key
cp .env.example .env

# Configure DATABASE_URL in .env file to point to your database

# If using SQLite,
DATABASE_URL="file:./dev.db"

# If using SQLite, Change provider in prisma/schema.prisma to sqlite
provider = "sqlite"

# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Run migrations and generate Prisma client
npm run db:all

# Run API
npm run dev

```

## Testing API

```bash

# Update DATABASE_URL in .env file to point to test database or SQLite
DATABASE_URL="file:./dev.db"
# PROVIDER in .env to match the database provider used in prisma/schema.prisma
PROVIDER=

# If using SQLite, Change provider in prisma/schema.prisma to sqlite and delete migration folder
provider = "sqlite"

# Deleting migration and generated folders if any, 
rm -r prisma/migrations
rm -r src/generated

# Run migrations and generate Prisma client
npm run db:all

# Run tests
npm run test

```

## NOTE

When switching from SQLite to PostgreSQL or vice versa, make sure to delete migration folder and generated folders.