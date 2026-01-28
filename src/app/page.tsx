export default function HomePage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
      <h1 style={{ fontSize: 42, marginBottom: 12 }}>BeyondSheets</h1>
      <p style={{ fontSize: 18, color: '#9ca3af', marginBottom: 32 }}>
        Spreadsheet risk analysis and modernization guidance.
      </p>
      <section style={{ display: 'grid', gap: 16, maxWidth: 680 }}>
        <div style={{ padding: 16, borderRadius: 12, background: '#111827' }}>
          <strong>Upload + Analyze</strong>
          <p style={{ marginTop: 8, color: '#9ca3af' }}>
            We’ll parse spreadsheets, assess structural health, and flag risky formulas.
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
