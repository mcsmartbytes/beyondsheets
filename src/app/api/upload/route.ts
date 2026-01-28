import { NextResponse } from 'next/server';
import { parseSpreadsheet } from '@/lib/spreadsheet/parse';
import { fingerprintBuffer } from '@/lib/spreadsheet/fingerprint';

export const runtime = 'nodejs';

const allowedExtensions = ['.xlsx', '.xls', '.csv'];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'File is required.' }, { status: 400 });
  }

  const filename = file.name || 'upload';
  const lower = filename.toLowerCase();
  const isAllowed = allowedExtensions.some((ext) => lower.endsWith(ext));

  if (!isAllowed) {
    return NextResponse.json(
      { ok: false, error: 'Only .xlsx, .xls, and .csv files are supported.' },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    return NextResponse.json({ ok: false, error: 'File is empty.' }, { status: 400 });
  }

  try {
    const fingerprint = fingerprintBuffer(buffer);
    const parsed = await parseSpreadsheet(buffer, filename);

    return NextResponse.json({
      ok: true,
      data: {
        fingerprint,
        filename,
        size: buffer.length,
        mimeType: file.type || null,
        parsed,
      },
    });
  } catch (error) {
    console.error('Upload parse failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to parse spreadsheet.' },
      { status: 500 },
    );
  }
}
