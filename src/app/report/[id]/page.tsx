import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { prisma } from '@/lib/db';

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
    formulaRisk: {
      totalFormulas: number;
      riskyFormulas: number;
      topRisks: Array<{ type: string; count: number }>;
    };
    sheetIssues: Array<{
      sheet: string;
      issues: Array<{ title: string; impact: string; fix: string }>;
    }>;
    healthScore: {
      overall: number;
      structural: number;
      formulas: number;
      integrity: number;
      scalability: number;
      busFactor: number;
    };
    notes: string[];
    issues: Array<{ title: string; impact: string; fix: string }>;
    dbPrep: string[];
  };
  parsed: {
    sheetNames: string[];
    sheets: Array<{
      name: string;
      hidden: boolean;
      rowCount: number;
      colCount: number;
      sampleRows: unknown[][];
      formulaStats?: {
        totalFormulas: number;
        riskyFormulas: number;
        risks: Array<{ type: string; count: number }>;
        examples: Array<{ address: string; formula: string; reason: string }>;
      };
    }>;
  };
};

async function loadReport(id: string): Promise<ReportData | null> {
  try {
    const report = await prisma.report.findUnique({
      where: { id },
    });
    
    if (report) {
      return {
        id: report.id,
        filename: report.filename,
        size: report.size,
        mimeType: report.mimeType,
        createdAt: report.createdAt.toISOString(),
        parsed: report.parsed as ReportData['parsed'],
        analysis: report.analysis as ReportData['analysis'],
      };
    }
  } catch (dbError) {
    console.error('[Report] Database load failed, falling back to file system:', dbError);
  }
  
  const reportPath = path.join(process.cwd(), 'data', 'uploads', `${id}.report.json`);
  try {
    const raw = await fs.readFile(reportPath, 'utf8');
    return JSON.parse(raw) as ReportData;
  } catch {
    return null;
  }
}

function getScoreGrade(score: number): { label: string; color: string; bgColor: string; gradient: string } {
  if (score >= 80) return { 
    label: 'Excellent', 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/10',
    gradient: 'from-emerald-500 to-teal-500'
  };
  if (score >= 60) return { 
    label: 'Good', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/10',
    gradient: 'from-blue-500 to-cyan-500'
  };
  if (score >= 40) return { 
    label: 'Fair', 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-500/10',
    gradient: 'from-amber-500 to-orange-500'
  };
  return { 
    label: 'Critical', 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/10',
    gradient: 'from-red-500 to-rose-500'
  };
}

function HealthGauge({ score, size = 'large' }: { score: number; size?: 'large' | 'small' }) {
  const grade = getScoreGrade(score);
  const radius = size === 'large' ? 56 : 30;
  const strokeWidth = size === 'large' ? 8 : 5;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const dimensions = size === 'large' ? 140 : 75;
  
  const getStrokeColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative" style={{ width: dimensions, height: dimensions }}>
      <svg className="transform -rotate-90" width={dimensions} height={dimensions}>
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke="var(--color-bg-tertiary)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${getStrokeColor()}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {size === 'large' ? (
          <>
            <span className={`text-3xl font-bold ${grade.color}`}>{score}</span>
            <span className="text-xs text-[var(--color-text-muted)]">/ 100</span>
          </>
        ) : (
          <span className={`text-base font-bold ${grade.color}`}>{score}</span>
        )}
      </div>
    </div>
  );
}

function ScoreBar({ label, score, weight }: { label: string; score: number; weight: string }) {
  const grade = getScoreGrade(score);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--color-text-muted)]">{weight}</span>
          <span className={`font-semibold ${grade.color}`}>{score}</span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill bg-gradient-to-r ${grade.gradient}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext, icon }: { label: string; value: string | number; subtext?: string; icon: React.ReactNode }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value}</p>
          {subtext && <p className="text-sm text-[var(--color-text-muted)] mt-1">{subtext}</p>}
        </div>
        <div className="w-7 h-7 rounded bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-muted)]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function IssueCard({ title, impact, fix, severity = 'warning' }: { title: string; impact: string; fix: string; severity?: 'critical' | 'warning' | 'info' }) {
  const severityClass = severity === 'critical' ? 'issue-card-critical' : severity === 'info' ? 'issue-card-info' : 'issue-card';
  
  return (
    <div className={severityClass}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-[var(--color-text-primary)]">{title}</h4>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{impact}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
        <p className="text-sm">
          <span className="text-[var(--color-text-muted)]">Fix: </span>
          <span className="text-[var(--color-text-primary)]">{fix}</span>
        </p>
      </div>
    </div>
  );
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await loadReport(id);

  if (!report) {
    return (
      <main className="min-h-screen py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[var(--color-bg-secondary)] flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Report Not Found</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            We couldn&apos;t find a report with that ID. It may have been deleted or never existed.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const grade = report.analysis ? getScoreGrade(report.analysis.healthScore.overall) : null;
  const totalRows = report.parsed.sheets.reduce((sum, sheet) => sum + sheet.rowCount, 0);
  const hiddenSheets = report.parsed.sheets.filter(s => s.hidden).length;

  return (
    <main className="min-h-screen py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition mb-3">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{report.filename}</h1>
              <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
                {(report.size / 1024).toFixed(1)} KB • Analyzed {new Date(report.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            {report.analysis?.purpose && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${grade?.bgColor} ${grade?.color} font-medium`}>
                <span className="capitalize">{report.analysis.purpose.primary}</span>
              </div>
            )}
          </div>
        </div>

        {/* Health Score Section */}
        {report.analysis && (
          <section className="card p-5 mb-5">
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
              {/* Main Gauge */}
              <div className="flex flex-col items-center">
                <HealthGauge score={report.analysis.healthScore.overall} />
                <div className={`mt-2 px-3 py-1 rounded-full text-sm ${grade?.bgColor}`}>
                  <span className={`font-semibold ${grade?.color}`}>{grade?.label}</span>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="flex-1 space-y-3">
                <h3 className="text-base font-semibold mb-3">Score Breakdown</h3>
                <ScoreBar label="Structural Health" score={report.analysis.healthScore.structural} weight="20%" />
                <ScoreBar label="Formula Safety" score={report.analysis.healthScore.formulas} weight="25%" />
                <ScoreBar label="Data Integrity" score={report.analysis.healthScore.integrity} weight="25%" />
                <ScoreBar label="Scalability" score={report.analysis.healthScore.scalability} weight="15%" />
                <ScoreBar label="Bus Factor" score={report.analysis.healthScore.busFactor} weight="15%" />
              </div>
            </div>
          </section>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <StatCard
            label="Total Sheets"
            value={report.parsed.sheetNames.length}
            subtext={hiddenSheets > 0 ? `${hiddenSheets} hidden` : undefined}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
            }
          />
          <StatCard
            label="Total Rows"
            value={totalRows.toLocaleString()}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            }
          />
          {report.analysis && (
            <>
              <StatCard
                label="Formulas"
                value={report.analysis.formulaRisk.totalFormulas}
                subtext={report.analysis.formulaRisk.riskyFormulas > 0 ? `${report.analysis.formulaRisk.riskyFormulas} risky` : 'None risky'}
                icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
                }
              />
              <StatCard
                label="Issues Found"
                value={report.analysis.issues.length}
                icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
                }
              />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Issues & Recommendations */}
            {report.analysis && report.analysis.issues.length > 0 && (
              <section className="card p-4">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  Issues & Recommendations
                </h2>
                <div className="space-y-2">
                  {report.analysis.issues.map((issue, idx) => (
                    <IssueCard
                      key={`issue-${idx}`}
                      title={issue.title}
                      impact={issue.impact}
                      fix={issue.fix}
                      severity={idx === 0 ? 'critical' : 'warning'}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Formula Risks */}
            {report.analysis && report.analysis.formulaRisk.topRisks.length > 0 && (
              <section className="card p-4">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  Formula Risks
                </h2>
                <div className="space-y-2">
                  {report.analysis.formulaRisk.topRisks.map((risk) => (
                    <div key={risk.type} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-bg-tertiary)] text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="font-medium capitalize">{risk.type.replace(/_/g, ' ')}</span>
                      </div>
                      <span className="text-[var(--color-text-muted)]">{risk.count} occurrence{risk.count !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Database Prep */}
            {report.analysis && report.analysis.dbPrep.length > 0 && (
              <section className="card p-4">
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  Database Migration Steps
                </h2>
                <ol className="space-y-2">
                  {report.analysis.dbPrep.map((step, idx) => (
                    <li key={`step-${idx}`} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-[var(--color-text-secondary)]">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Sheet Overview */}
            <section className="card p-4">
              <h3 className="font-semibold text-sm mb-3">Sheet Overview</h3>
              <div className="space-y-2">
                {report.parsed.sheets.map((sheet) => (
                  <div key={sheet.name} className="p-2 rounded bg-[var(--color-bg-tertiary)]">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-xs truncate">{sheet.name}</span>
                      {sheet.hidden && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Hidden</span>
                      )}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">
                      {sheet.rowCount} rows • {sheet.colCount} cols
                      {sheet.formulaStats && sheet.formulaStats.totalFormulas > 0 && (
                        <> • {sheet.formulaStats.totalFormulas} formulas</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Purpose Signals */}
            {report.analysis && report.analysis.purpose.signals.some(s => s.score > 0) && (
              <section className="card p-4">
                <h3 className="font-semibold text-sm mb-3">Purpose Signals</h3>
                <div className="space-y-1.5">
                  {report.analysis.purpose.signals
                    .filter(s => s.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .map((signal) => (
                      <div key={signal.label} className="flex items-center justify-between text-xs">
                        <span className="text-[var(--color-text-secondary)]">{signal.label}</span>
                        <span className="font-medium">{signal.score}</span>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Notes */}
            {report.analysis && report.analysis.notes.length > 0 && (
              <section className="card p-4">
                <h3 className="font-semibold text-sm mb-3">Additional Notes</h3>
                <ul className="space-y-1.5">
                  {report.analysis.notes.map((note, idx) => (
                    <li key={`note-${idx}`} className="text-xs text-[var(--color-text-secondary)] flex items-start gap-1.5">
                      <span className="text-[var(--color-text-muted)]">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Data Preview */}
        <section className="mt-5 card p-4">
          <h2 className="text-base font-semibold mb-4">Data Preview</h2>
          <div className="space-y-6">
            {report.parsed.sheets.slice(0, 3).map((sheet) => (
              <div key={sheet.name}>
                <h3 className="font-medium text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
                  {sheet.name}
                  {sheet.hidden && (
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">Hidden</span>
                  )}
                </h3>
                {sheet.sampleRows.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
                    <table className="data-table">
                      <thead>
                        <tr>
                          {sheet.sampleRows[0]?.map((cell, idx) => (
                            <th key={`header-${idx}`}>
                              {cell === null || cell === undefined || cell === '' 
                                ? `Col ${idx + 1}` 
                                : String(cell)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sheet.sampleRows.slice(1, 6).map((row, rowIdx) => (
                          <tr key={`row-${rowIdx}`}>
                            {row.map((cell, cellIdx) => (
                              <td key={`cell-${rowIdx}-${cellIdx}`}>
                                {cell === null || cell === undefined || cell === '' 
                                  ? <span className="text-[var(--color-text-muted)]">—</span>
                                  : String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)]">No data preview available</p>
                )}
              </div>
            ))}
            {report.parsed.sheets.length > 3 && (
              <p className="text-sm text-[var(--color-text-muted)] text-center">
                + {report.parsed.sheets.length - 3} more sheet{report.parsed.sheets.length - 3 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </section>

        {/* Raw JSON Toggle */}
        <details className="mt-8">
          <summary className="cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition">
            Show raw report JSON
          </summary>
          <pre className="mt-4 p-6 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-x-auto text-xs font-mono text-[var(--color-text-secondary)]">
            {JSON.stringify(report, null, 2)}
          </pre>
        </details>
      </div>
    </main>
  );
}
