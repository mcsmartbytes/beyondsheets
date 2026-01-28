import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    ok: true,
    name: 'beyondsheets',
    version: '0.1.0',
  });
}
