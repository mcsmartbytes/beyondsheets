import { NextResponse } from 'next/server';
import { parseSpreadsheet } from '@/lib/spreadsheet/parse';
import { fingerprintBuffer } from '@/lib/spreadsheet/fingerprint';
import { analyzeSpreadsheet } from '@/lib/analysis/analyze';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const allowedExtensions = ['.xlsx', '.xls', '.csv'];
const allowedMimeTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'text/csv', // .csv
  'application/csv',
];

// Maximum file size: 10MB (can be overridden via env var)
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10);

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

  // Validate MIME type if provided
  if (file.type && !allowedMimeTypes.includes(file.type)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Invalid file type: ${file.type}. Expected spreadsheet format.`,
      },
      { status: 400 },
    );
  }

  // Check file size before loading into buffer
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        ok: false,
        error: `File too large. Maximum size is ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB.`,
      },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    return NextResponse.json({ ok: false, error: 'File is empty.' }, { status: 400 });
  }

  try {
    console.log(`[Upload] Processing file: ${filename}, size: ${buffer.length} bytes`);
    
    const fingerprint = fingerprintBuffer(buffer);
    console.log(`[Upload] Generated fingerprint: ${fingerprint}`);
    
    const parsed = await parseSpreadsheet(buffer, filename);
    console.log(`[Upload] Parsed ${parsed.sheetNames.length} sheets`);
    
    const analysis = analyzeSpreadsheet(parsed);
    console.log(`[Upload] Analysis complete. Health score: ${analysis.healthScore.overall}/100`);

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

    console.log(`[Upload] Report saved: ${reportPath}`);

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('[Upload] Parse failed:', {
      filename,
      error: errorMessage,
      stack: errorStack,
    });
    
    // Provide more specific error messages
    if (errorMessage.includes('Unsupported file')) {
      return NextResponse.json(
        { ok: false, error: 'File format not supported or corrupted.' },
        { status: 400 },
      );
    }
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Failed to parse spreadsheet. Please ensure the file is a valid Excel or CSV file.',
      },
      { status: 500 },
    );
  }
}
