import { NextResponse } from 'next/server';
import { parseSpreadsheet } from '@/lib/spreadsheet/parse';
import { fingerprintBuffer } from '@/lib/spreadsheet/fingerprint';
import { analyzeSpreadsheet } from '@/lib/analysis/analyze';
import fs from 'fs/promises';
import path from 'path';

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
    const analysis = analyzeSpreadsheet(parsed);

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
          mimeType: file.type || null,
          parsed,
          analysis,
          createdAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );

    return NextResponse.json({
      ok: true,
      data: {
        id: fingerprint,
        filename,
        size: buffer.length,
        mimeType: file.type || null,
        parsed,
        analysis,
        reportUrl: `/report/${fingerprint}`,
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
