'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

type UploadResult = {
  ok: boolean;
  data?: {
    reportUrl?: string;
    filename?: string;
    healthScore?: number;
    purpose?: string;
  };
  error?: string;
};

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LoaderIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#34A853" d="M5.319 14.504l-.835 3.118-3.054.065A11.946 11.946 0 010 12c0-1.99.484-3.866 1.342-5.519l2.719.499 1.19 2.702A7.133 7.133 0 004.865 12c0 .88.16 1.725.454 2.504z"/>
      <path fill="#FBBC05" d="M23.79 9.758a12.028 12.028 0 01-.053 4.747 11.998 11.998 0 01-4.225 6.853l-3.424-.175-.485-3.025a7.152 7.152 0 003.077-3.652h-6.416V9.758H23.79z"/>
      <path fill="#4285F4" d="M19.512 21.358A11.95 11.95 0 0112 24c-4.57 0-8.543-2.554-10.57-6.313l3.889-3.183a7.135 7.135 0 0010.284 3.654l3.909 3.2z"/>
      <path fill="#EA4335" d="M19.66 2.763l-3.888 3.182a7.137 7.137 0 00-10.52 3.736L1.342 6.481A11.998 11.998 0 0112 0c2.933 0 5.627 1.052 7.72 2.798l-.06-.035z"/>
    </svg>
  );
}

export default function DashboardPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sheetId, setSheetId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [sheetResult, setSheetResult] = useState<UploadResult | null>(null);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [sheetLoading, setSheetLoading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setUploadError(null);
    } else {
      setUploadError('Please upload a valid spreadsheet file (.xlsx, .xls, or .csv)');
    }
  }, []);

  const isValidFile = (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    return validTypes.includes(file.type) || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setUploadError(null);
    } else if (file) {
      setUploadError('Please upload a valid spreadsheet file (.xlsx, .xls, or .csv)');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadError(null);
    setUploadResult(null);
    setUploadLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = (await response.json()) as UploadResult;
      if (!response.ok) {
        setUploadError(json.error || 'Upload failed. Please try again.');
      } else {
        setUploadResult(json);
      }
    } catch {
      setUploadError('Upload failed. Please check your connection and try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleGoogleSheetsImport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSheetError(null);
    setSheetResult(null);

    if (!sheetId.trim()) {
      setSheetError('Please enter a Spreadsheet ID');
      return;
    }

    setSheetLoading(true);
    try {
      const response = await fetch('/api/google-sheets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId: sheetId.trim(),
          accessToken: accessToken.trim() || undefined,
        }),
      });
      const json = (await response.json()) as UploadResult;
      if (!response.ok) {
        setSheetError(json.error || 'Import failed. Please check your credentials.');
      } else {
        setSheetResult(json);
      }
    } catch {
      setSheetError('Import failed. Please check your connection and try again.');
    } finally {
      setSheetLoading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">Analyze</span> Your Spreadsheet
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base max-w-xl mx-auto">
            Upload your Excel or CSV file to get instant insights into health scores, 
            formula risks, and modernization recommendations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Upload Section */}
          <section>
            <div className="card p-4">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FileIcon className="w-3 h-3 text-white" />
                </div>
                Upload File
              </h2>

              {!uploadResult ? (
                <>
                  <div
                    className={`dropzone ${isDragging ? 'drag-active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {selectedFile ? (
                      <div className="space-y-1.5">
                        <div className="w-8 h-8 mx-auto rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                          <FileIcon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-xs text-[var(--color-text-primary)]">{selectedFile.name}</p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="w-8 h-8 mx-auto rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                          <UploadIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                        </div>
                        <div>
                          <p className="font-medium text-xs text-[var(--color-text-primary)]">
                            Drop file or <span className="text-blue-400">browse</span>
                          </p>
                          <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                            .xlsx, .xls, .csv up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {uploadError}
                    </div>
                  )}

                  {selectedFile && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={handleUpload}
                        disabled={uploadLoading}
                        className="btn btn-primary flex-1"
                      >
                        {uploadLoading ? (
                          <>
                            <LoaderIcon className="w-5 h-5" />
                            Analyzing...
                          </>
                        ) : (
                          <>Analyze File</>
                        )}
                      </button>
                      <button
                        onClick={resetUpload}
                        disabled={uploadLoading}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-emerald-400">Analysis Complete!</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        {uploadResult.data?.filename || selectedFile?.name}
                      </p>
                    </div>
                  </div>

                  {uploadResult.data?.healthScore !== undefined && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-tertiary)]">
                      <span className="text-sm text-[var(--color-text-secondary)]">Health Score</span>
                      <span className={`text-xl font-bold ${getScoreColor(uploadResult.data.healthScore)}`}>
                        {uploadResult.data.healthScore}/100
                      </span>
                    </div>
                  )}

                  {uploadResult.data?.purpose && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-tertiary)]">
                      <span className="text-sm text-[var(--color-text-secondary)]">Detected Purpose</span>
                      <span className="font-medium text-sm capitalize">{uploadResult.data.purpose}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {uploadResult.data?.reportUrl && (
                      <Link href={uploadResult.data.reportUrl} className="btn btn-primary flex-1">
                        View Full Report →
                      </Link>
                    )}
                    <button onClick={resetUpload} className="btn btn-secondary">
                      Analyze Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Google Sheets Section */}
          <section>
            <div className="card p-4">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
                  <GoogleIcon className="w-3 h-3" />
                </div>
                Google Sheets
              </h2>

              {!sheetResult ? (
                <form onSubmit={handleGoogleSheetsImport} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                      Spreadsheet ID
                    </label>
                    <input
                      type="text"
                      placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                      value={sheetId}
                      onChange={(e) => setSheetId(e.target.value)}
                      className="input text-sm py-2"
                    />
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      Find this in your Google Sheets URL after /d/
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                      Access Token <span className="text-[var(--color-text-muted)]">(optional)</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Uses .env.local token if not provided"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="input text-sm py-2"
                    />
                  </div>

                  {sheetError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {sheetError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sheetLoading || !sheetId.trim()}
                    className="btn btn-success w-full"
                  >
                    {sheetLoading ? (
                      <>
                        <LoaderIcon className="w-5 h-5" />
                        Importing...
                      </>
                    ) : (
                      <>Import & Analyze</>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-xs text-emerald-400">Import Complete!</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">
                        {sheetResult.data?.filename || 'Google Sheet'}
                      </p>
                    </div>
                  </div>

                  {sheetResult.data?.healthScore !== undefined && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-tertiary)]">
                      <span className="text-sm text-[var(--color-text-secondary)]">Health Score</span>
                      <span className={`text-xl font-bold ${getScoreColor(sheetResult.data.healthScore)}`}>
                        {sheetResult.data.healthScore}/100
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {sheetResult.data?.reportUrl && (
                      <Link href={sheetResult.data.reportUrl} className="btn btn-primary flex-1">
                        View Full Report →
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setSheetResult(null);
                        setSheetId('');
                        setAccessToken('');
                      }}
                      className="btn btn-secondary"
                    >
                      Import Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Features Grid */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-center mb-5">What You&apos;ll Get</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="stat-card text-center">
              <div className="w-7 h-7 mx-auto rounded bg-blue-500/10 flex items-center justify-center mb-2">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-xs mb-0.5">Health Score</h3>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Multi-factor analysis
              </p>
            </div>

            <div className="stat-card text-center">
              <div className="w-7 h-7 mx-auto rounded bg-red-500/10 flex items-center justify-center mb-2">
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-xs mb-0.5">Risk Detection</h3>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Find broken references
              </p>
            </div>

            <div className="stat-card text-center">
              <div className="w-7 h-7 mx-auto rounded bg-purple-500/10 flex items-center justify-center mb-2">
                <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-xs mb-0.5">Migration Plan</h3>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Database guidance
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
