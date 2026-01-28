import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';

type ReportData = {
  id: string;
  filename: string;
  size: number;
  mimeType: string | null;
  createdAt: string;
  analysis?: {
    purpose: {
      primary: string;
      secondary: string | null;
      signals: Array<{ label: string; score: number; matches: string[] }>;
    };
    healthScore: {
      overall: number;
      structural: number;
      formulas: number;
      integrity: number;
      scalability: number;
      busFactor: number;
    };
    notes: string[];
  };
  parsed: {
    sheetNames: string[];
    sheets: Array<{
      name: string;
      hidden: boolean;
      rowCount: number;
      colCount: number;
      sampleRows: unknown[][];
    }>;
  };
};

async function loadReport(id: string): Promise<ReportData | null> {
  const reportPath = path.join(process.cwd(), 'data', 'uploads', `${id}.report.json`);
  try {
    const raw = await fs.readFile(reportPath, 'utf8');
    return JSON.parse(raw) as ReportData;
  } catch {
    return null;
  }
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await loadReport(id);

  if (!report) {
    return (
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
        <h1>Report not found</h1>
        <p>We could not find a report for that ID.</p>
        <Link href="/">Back to upload</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
      <Link href="/">← Back</Link>
      <h1 style={{ marginTop: 16 }}>Report</h1>
      <p style={{ color: '#9ca3af' }}>
        {report.filename} · {(report.size / 1024).toFixed(1)} KB ·{' '}
        {new Date(report.createdAt).toLocaleString()}
      </p>

      <section style={{ marginTop: 24, padding: 16, borderRadius: 12, background: '#111827' }}>
        <h2 style={{ marginTop: 0 }}>Summary</h2>
        <p>Total sheets: {report.parsed.sheetNames.length}</p>
        <p>Hidden sheets: {report.parsed.sheets.filter((sheet) => sheet.hidden).length}</p>
      </section>

      {report.analysis && (
        <section style={{ marginTop: 24, padding: 16, borderRadius: 12, background: '#111827' }}>
          <h2 style={{ marginTop: 0 }}>Analysis</h2>
          <p>
            Purpose: <strong>{report.analysis.purpose.primary}</strong>
            {report.analysis.purpose.secondary ? ` · ${report.analysis.purpose.secondary}` : ''}
          </p>
          <p style={{ color: '#9ca3af' }}>
            Health score: {report.analysis.healthScore.overall}/100
          </p>
          {report.analysis.notes.length > 0 && (
            <ul style={{ color: '#cbd5f5', paddingLeft: 20 }}>
              {report.analysis.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section style={{ marginTop: 24, display: 'grid', gap: 16 }}>
        {report.parsed.sheets.map((sheet) => (
          <div key={sheet.name} style={{ padding: 16, borderRadius: 12, background: '#111827' }}>
            <strong>{sheet.name}</strong>
            {sheet.hidden && <span style={{ marginLeft: 8, color: '#fbbf24' }}>(hidden)</span>}
            <p style={{ marginTop: 8, color: '#9ca3af' }}>
              Rows: {sheet.rowCount} · Columns: {sheet.colCount}
            </p>
            {sheet.sampleRows.length > 0 && (
              <div style={{ overflowX: 'auto', marginTop: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <tbody>
                    {sheet.sampleRows.map((row, rowIndex) => (
                      <tr key={`${sheet.name}-row-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${sheet.name}-cell-${rowIndex}-${cellIndex}`}
                            style={{
                              borderBottom: '1px solid #1f2937',
                              padding: '6px 8px',
                              color: rowIndex === 0 ? '#e2e8f0' : '#cbd5f5',
                              fontWeight: rowIndex === 0 ? 600 : 400,
                            }}
                          >
                            {cell === null || cell === undefined || cell === '' ? '-' : String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </section>

      <details style={{ marginTop: 24 }}>
        <summary style={{ cursor: 'pointer', color: '#9ca3af' }}>Show raw report JSON</summary>
        <pre
          style={{
            marginTop: 12,
            whiteSpace: 'pre-wrap',
            background: '#0f172a',
            padding: 12,
            borderRadius: 8,
            color: '#e2e8f0',
            fontSize: 12,
          }}
        >
          {JSON.stringify(report, null, 2)}
        </pre>
      </details>
    </main>
  );
}
