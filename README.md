# BeyondSheets

Spreadsheet risk analysis and modernization guidance.

## MVP focus
- Upload & parse spreadsheets (`.xlsx/.xls/.csv`)
- Purpose detection
- Structural analysis
- Formula risk detection
- Data integrity checks
- Health score + report generation

## Project structure
- `src/app` - Next.js app router + API routes
- `src/lib` - Core analysis engines (parsing, scoring, reporting)

## API endpoints
- POST /api/upload - multipart form-data with ile (xlsx/xls/csv)
- POST /api/google-sheets/import - JSON with spreadsheetId and ccessToken

### Google Sheets notes
- Requires a user access token with Drive export permissions.
- Uses Drive export to download an XLSX and then parses it like a normal upload.
