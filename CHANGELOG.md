# BeyondSheets - Changelog

## [Unreleased] - 2026-01-28

### Added
- **Google Sheets Import Analysis**: Google Sheets import now includes full analysis and report generation, matching the upload endpoint functionality
- **Report URLs**: Google Sheets imports now return a `reportUrl` for viewing the analysis report
- **Environment Configuration**: Added `.env.example` with detailed instructions for obtaining Google OAuth tokens
- **File Size Validation**: Added 10MB file size limit (configurable via `MAX_FILE_SIZE` env var) for both uploads and Google Sheets imports
- **MIME Type Validation**: Enhanced file type validation to check both file extensions and MIME types
- **Comprehensive Logging**: Added detailed logging throughout API routes for better debugging and monitoring
- **Enhanced Error Messages**: Specific error messages for different failure scenarios (invalid tokens, file too large, corrupted files, etc.)

### Changed
- **Health Score Algorithm**: Completely redesigned with sophisticated multi-factor analysis:
  - **Structural Health** (20% weight): Evaluates sheet count, hidden sheets, and data volume
  - **Formula Health** (25% weight): Assesses formula complexity and risk ratio
  - **Data Integrity** (25% weight): Checks for consistent headers, duplicate columns, and row consistency
  - **Scalability** (15% weight): Evaluates ability to handle growth and additional users
  - **Bus Factor** (15% weight): Measures documentation quality and knowledge transfer risk
  - Overall score is now a weighted average of these five dimensions
- **README**: Fixed typos ("ile" → "file", "ccessToken" → "accessToken") and added setup instructions
- **UI Improvements**: Google Sheets results now displayed in collapsible details (matching upload section)

### Fixed
- Google Sheets import not performing analysis or saving reports
- Google Sheets import not returning report URLs to frontend
- Missing documentation for environment setup
- Overly simplistic health scoring algorithm with arbitrary magic numbers

### Technical Details
- Maximum file size: 10MB (configurable)
- Supported formats: .xlsx, .xls, .csv
- Health scores now range 0-100 with real calculations based on spreadsheet characteristics
- All API routes include structured error logging with context

## Future Improvements
See the main project assessment for medium and low priority enhancements including:
- Database integration (Prisma + PostgreSQL)
- Authentication system
- Enhanced formula risk detection
- UI component library and visual dashboards
- Testing suite
- Batch processing capabilities
