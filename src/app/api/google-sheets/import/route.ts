import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchGoogleSheetAsXlsx } from '@/lib/google-sheets/client';
import { parseSpreadsheet } from '@/lib/spreadsheet/parse';
import { fingerprintBuffer } from '@/lib/spreadsheet/fingerprint';
import { analyzeSpreadsheet } from '@/lib/analysis/analyze';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

// Maximum file size for Google Sheets imports: 10MB
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10);

const importSchema = z.object({
  spreadsheetId: z.string().min(1),
  accessToken: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = importSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'spreadsheetId is required.' },
      { status: 400 },
    );
  }

  try {
    const accessToken =
      parsed.data.accessToken || process.env.GOOGLE_SHEETS_ACCESS_TOKEN;

    if (!accessToken) {
      console.warn('[Google Sheets] No access token provided');
      return NextResponse.json(
        { ok: false, error: 'Access token is required. See .env.example for instructions.' },
        { status: 400 },
      );
    }

    console.log(`[Google Sheets] Fetching spreadsheet: ${parsed.data.spreadsheetId}`);
    
    const buffer = await fetchGoogleSheetAsXlsx({
      spreadsheetId: parsed.data.spreadsheetId,
      accessToken,
    });

    console.log(`[Google Sheets] Downloaded ${buffer.length} bytes`);

    // Validate buffer size
    if (buffer.length === 0) {
      console.error('[Google Sheets] Downloaded spreadsheet is empty');
      return NextResponse.json(
        { ok: false, error: 'Downloaded spreadsheet is empty.' },
        { status: 400 },
      );
    }

    if (buffer.length > MAX_FILE_SIZE) {
      console.error(`[Google Sheets] File too large: ${buffer.length} bytes`);
      return NextResponse.json(
        {
          ok: false,
          error: `Google Sheet too large. Maximum size is ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB.`,
        },
        { status: 413 },
      );
    }

    const fingerprint = fingerprintBuffer(buffer);
    const filename = `${parsed.data.spreadsheetId}.xlsx`;
    
    console.log(`[Google Sheets] Generated fingerprint: ${fingerprint}`);
    
    const parsedSheets = await parseSpreadsheet(buffer, filename);
    console.log(`[Google Sheets] Parsed ${parsedSheets.sheetNames.length} sheets`);
    
    const analysis = analyzeSpreadsheet(parsedSheets);
    console.log(`[Google Sheets] Analysis complete. Health score: ${analysis.healthScore.overall}/100`);

    // Save file and report to storage (same as upload route)
    const storageDir = path.join(process.cwd(), 'data', 'uploads');
    await fs.mkdir(storageDir, { recursive: true });

    const fileBase = `${fingerprint}-${filename.replace(/[^a-z0-9._-]/gi, '_')}`;
    const storedFilePath = path.join(storageDir, fileBase);
    const reportPath = path.join(storageDir, `${fingerprint}.report.json`);

    await fs.writeFile(storedFilePath, buffer);
    await fs.writeFile(
      reportPath,
      JSON.stringify(
        {
          id: fingerprint,
          filename,
          size: buffer.length,
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          parsed: parsedSheets,
          analysis,
          createdAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );

    console.log(`[Google Sheets] Report saved: ${reportPath}`);

    return NextResponse.json({
      ok: true,
      data: {
        id: fingerprint,
        filename,
        size: buffer.length,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        parsed: parsedSheets,
        analysis,
        reportUrl: `/report/${fingerprint}`,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('[Google Sheets] Import failed:', {
      spreadsheetId: parsed.data.spreadsheetId,
      error: errorMessage,
      stack: errorStack,
    });
    
    // Provide specific error messages based on the error
    if (errorMessage.includes('status 401') || errorMessage.includes('status 403')) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Invalid or expired access token. Please provide a valid Google OAuth token.',
        },
        { status: 401 },
      );
    }
    
    if (errorMessage.includes('status 404')) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Spreadsheet not found. Check the spreadsheet ID and ensure it\'s accessible.',
        },
        { status: 404 },
      );
    }
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Failed to import Google Sheet. Please check the spreadsheet ID and access token.',
      },
      { status: 500 },
    );
  }
}
