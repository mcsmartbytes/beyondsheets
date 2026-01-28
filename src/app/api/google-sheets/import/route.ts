import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchGoogleSheetAsXlsx } from '@/lib/google-sheets/client';
import { parseSpreadsheet } from '@/lib/spreadsheet/parse';
import { fingerprintBuffer } from '@/lib/spreadsheet/fingerprint';

export const runtime = 'nodejs';

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
      return NextResponse.json(
        { ok: false, error: 'Access token is required.' },
        { status: 400 },
      );
    }

    const buffer = await fetchGoogleSheetAsXlsx({
      spreadsheetId: parsed.data.spreadsheetId,
      accessToken,
    });
    const fingerprint = fingerprintBuffer(buffer);
    const parsedSheets = await parseSpreadsheet(buffer, parsed.data.spreadsheetId + '.xlsx');

    return NextResponse.json({
      ok: true,
      data: {
        fingerprint,
        filename: parsed.data.spreadsheetId + '.xlsx',
        size: buffer.length,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        parsed: parsedSheets,
      },
    });
  } catch (error) {
    console.error('Google Sheets import failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to import Google Sheet.' },
      { status: 500 },
    );
  }
}
