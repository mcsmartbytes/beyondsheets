# BeyondSheets

Spreadsheet risk analysis and modernization guidance.

## MVP focus
- Upload & parse spreadsheets (.xlsx/.xls/.csv)
- Purpose detection
- Structural analysis
- Formula risk detection
- Data integrity checks
- Health score + report generation

## Project structure
- `src/app` - Next.js app router + API routes
- `src/lib` - Core analysis engines (parsing, scoring, reporting)
- `prisma/` - Database schema and migrations

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_SHEETS_ACCESS_TOKEN` (optional) - For Google Sheets import

### 3. Database Setup

#### Option A: Local PostgreSQL (Docker)
```bash
# Run PostgreSQL in Docker
docker run --name beyondsheets-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=beyondsheets -p 5432:5432 -d postgres:16

# Set DATABASE_URL in .env.local:
# DATABASE_URL=`"`postgresql://postgres:password@localhost:5432/beyondsheets`"`
```

#### Option B: Cloud Database
Use a managed PostgreSQL service:
- **Vercel Postgres** (recommended for Vercel deployment)
- **Supabase** (free tier available)
- **Neon** (serverless PostgreSQL)
- **Railway** (easy setup)

### 4. Run Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

### 5. Start Development Server
```bash
npm run dev
```

## Database Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (caution: deletes all data)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Deployment (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Add PostgreSQL database in Vercel dashboard
4. Set environment variables:
   - `DATABASE_URL` (auto-set by Vercel Postgres)
   - `GOOGLE_SHEETS_ACCESS_TOKEN` (if using Google Sheets import)
5. Deploy!

Vercel will automatically run `npx prisma generate` during build.

## API endpoints
- POST /api/upload - multipart form-data with file (xlsx/xls/csv)
- POST /api/google-sheets/import - JSON with spreadsheetId and accessToken
- GET /api/health - Health check endpoint

### Google Sheets notes
- Requires a user access token with Drive export permissions.
- Uses Drive export to download an XLSX and then parses it like a normal upload.
- See `.env.example` for instructions on obtaining an access token.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Parser**: SheetJS (xlsx)
- **Validation**: Zod
- **Hosting**: Vercel (recommended)
