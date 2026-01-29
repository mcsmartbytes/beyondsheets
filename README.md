# BeyondSheets

Spreadsheet risk analysis and modernization guidance.

## MVP focus
- Upload & parse spreadsheets (+".xlsx/.xls/.csv"+@")
- Purpose detection
- Structural analysis
- Formula risk detection
- Data integrity checks
- Health score + report generation

## Project structure
- `src/app` - Next.js app router + API routes
- `src/lib` - Core analysis engines (parsing, scoring, reporting)

## Setup
1. Copy `.env.example` to `.env.local`
2. (Optional) Add your Google Sheets access token for Google Sheets import
3. Run `npm install` and `npm run dev`

## API endpoints
- POST /api/upload - multipart form-data with file (xlsx/xls/csv)
- POST /api/google-sheets/import - JSON with spreadsheetId and accessToken
- GET /api/health - Health check endpoint

### Google Sheets notes
- Requires a user access token with Drive export permissions.
- Uses Drive export to download an XLSX and then parses it like a normal upload.
- See `.env.example` for instructions on obtaining an access token.
