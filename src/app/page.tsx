'use client';

import { useState } from 'react';

type UploadResult = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

export default function HomePage() {
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [sheetId, setSheetId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [sheetResult, setSheetResult] = useState<UploadResult | null>(null);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [sheetLoading, setSheetLoading] = useState(false);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadError(null);
    setUploadResult(null);

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setUploadError('Select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadLoading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = (await response.json()) as UploadResult;
      if (!response.ok) {
        setUploadError(json.error || 'Upload failed.');
      } else {
        setUploadResult(json);
      }
    } catch (error) {
      setUploadError('Upload failed.');
      console.error(error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleGoogleSheetsImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSheetError(null);
    setSheetResult(null);

    if (!sheetId || !accessToken) {
      setSheetError('Spreadsheet ID and access token are required.');
      return;
    }

    setSheetLoading(true);
    try {
      const response = await fetch('/api/google-sheets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId: sheetId,
          accessToken: accessToken,
        }),
      });
      const json = (await response.json()) as UploadResult;
      if (!response.ok) {
        setSheetError(json.error || 'Import failed.');
      } else {
        setSheetResult(json);
      }
    } catch (error) {
      setSheetError('Import failed.');
      console.error(error);
    } finally {
      setSheetLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', padding: '64px 24px' }}>
      <h1 style={{ fontSize: 42, marginBottom: 12 }}>BeyondSheets</h1>
      <p style={{ fontSize: 18, color: '#9ca3af', marginBottom: 32 }}>
        Spreadsheet risk analysis and modernization guidance.
      </p>

      <section style={{ display: 'grid', gap: 24, marginBottom: 48 }}>
        <div style={{ padding: 20, borderRadius: 12, background: '#111827' }}>
          <h2 style={{ marginTop: 0 }}>Upload a spreadsheet</h2>
          <form onSubmit={handleUpload} style={{ display: 'grid', gap: 12 }}>
            <input
              name="file"
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ color: '#d1d5db' }}
            />
            <button
              type="submit"
              disabled={uploadLoading}
              style={{
                padding: '10px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              {uploadLoading ? 'Uploading...' : 'Analyze file'}
            </button>
          </form>
          {uploadError && (
            <p style={{ color: '#fca5a5', marginTop: 12 }}>{uploadError}</p>
          )}
          {uploadResult && (
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
              {JSON.stringify(uploadResult, null, 2)}
            </pre>
          )}
        </div>

        <div style={{ padding: 20, borderRadius: 12, background: '#111827' }}>
          <h2 style={{ marginTop: 0 }}>Import from Google Sheets</h2>
          <form onSubmit={handleGoogleSheetsImport} style={{ display: 'grid', gap: 12 }}>
            <input
              type="text"
              placeholder="Spreadsheet ID"
              value={sheetId}
              onChange={(event) => setSheetId(event.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #1f2937',
                background: '#0f172a',
                color: '#e5e7eb',
              }}
            />
            <input
              type="text"
              placeholder="Access token (OAuth)"
              value={accessToken}
              onChange={(event) => setAccessToken(event.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #1f2937',
                background: '#0f172a',
                color: '#e5e7eb',
              }}
            />
            <button
              type="submit"
              disabled={sheetLoading}
              style={{
                padding: '10px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              {sheetLoading ? 'Importing...' : 'Import Google Sheet'}
            </button>
          </form>
          {sheetError && (
            <p style={{ color: '#fca5a5', marginTop: 12 }}>{sheetError}</p>
          )}
          {sheetResult && (
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
              {JSON.stringify(sheetResult, null, 2)}
            </pre>
          )}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 16, maxWidth: 720 }}>
        <div style={{ padding: 16, borderRadius: 12, background: '#111827' }}>
          <strong>Upload + Analyze</strong>
          <p style={{ marginTop: 8, color: '#9ca3af' }}>
            We parse spreadsheets, assess structural health, and flag risky formulas.
          </p>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: '#111827' }}>
          <strong>Health Score</strong>
          <p style={{ marginTop: 8, color: '#9ca3af' }}>
            A single score executives can understand, with a clear breakdown.
          </p>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: '#111827' }}>
          <strong>Actionable Report</strong>
          <p style={{ marginTop: 8, color: '#9ca3af' }}>
            A human-readable report that explains what’s safe and what will break first.
          </p>
        </div>
      </section>
    </main>
  );
}
