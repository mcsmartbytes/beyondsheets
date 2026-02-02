'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/2 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-3xl transform -translate-x-1/2" />
        </div>

        <div className="relative container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-5 border border-blue-500/20">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Instant Analysis • No Signup Required
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Stop Guessing.
              <br />
              <span className="text-gradient">Know Your Risk.</span>
            </h1>

            <p className="text-base text-[var(--color-text-secondary)] mb-6 leading-relaxed max-w-xl mx-auto">
              Upload your Excel or CSV files and get instant insights into formula risks, 
              data integrity issues, and modernization recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard" className="btn btn-primary text-sm px-6 py-3">
                Analyze Your Spreadsheet
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a href="#how-it-works" className="btn btn-secondary text-sm px-6 py-3">
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Stats */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-6 lg:p-8 backdrop-blur-sm">
            <h2 className="text-xl lg:text-2xl font-bold text-center mb-6">
              The Hidden Cost of Spreadsheets
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-red-400 mb-1">88%</div>
                <p className="text-sm text-[var(--color-text-secondary)]">of spreadsheets contain errors</p>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-1">$10M+</div>
                <p className="text-sm text-[var(--color-text-secondary)]">average cost of failures</p>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-orange-400 mb-1">50%</div>
                <p className="text-sm text-[var(--color-text-secondary)]">don&apos;t trust their data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              Comprehensive Spreadsheet Analysis
            </h2>
            <p className="text-base text-[var(--color-text-secondary)]">
              Get actionable insights in seconds, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card p-5 hover:border-[var(--color-border-hover)] transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-2">Purpose Detection</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Identifies if your spreadsheet is for payroll, budgeting, or inventory.
              </p>
            </div>

            <div className="card p-5 hover:border-[var(--color-border-hover)] transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-2">Formula Risk Detection</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Scans for volatile functions and broken references.
              </p>
            </div>

            <div className="card p-5 hover:border-[var(--color-border-hover)] transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-2">Health Score (0-100)</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Executive-friendly score based on integrity and safety.
              </p>
            </div>

            <div className="card p-5 hover:border-[var(--color-border-hover)] transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-2">Database Migration</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Step-by-step guidance to move to a proper database.
              </p>
            </div>

            <div className="card p-5 hover:border-[var(--color-border-hover)] transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-2">Instant Reports</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Shareable reports showing what&apos;s safe and what&apos;s risky.
              </p>
            </div>

            <div className="card p-5 hover:border-[var(--color-border-hover)] transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#2dd4bf' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-2">Google Sheets</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Import directly with OAuth integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 bg-[var(--color-bg-secondary)]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Three Steps to Clarity
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">01</div>
              <h3 className="text-base font-bold mb-2">Upload</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Drag and drop your file or import from Google Sheets.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">02</div>
              <h3 className="text-base font-bold mb-2">Analyze</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Our engine scans structure and formulas in seconds.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">03</div>
              <h3 className="text-base font-bold mb-2">Act</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">Get health scores and actionable migration steps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl p-8 lg:p-10 text-center" style={{ background: 'var(--gradient-primary)' }}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                Ready to Modernize Your Spreadsheets?
              </h2>
              <p className="text-base text-white/80 mb-5">
                Get your first analysis free. No credit card required.
              </p>
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 text-sm font-bold rounded-lg hover:bg-gray-100 transition shadow-lg"
              >
                Start Analyzing Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                  </svg>
                </div>
                <span className="font-bold text-sm">BeyondSheets</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Spreadsheet risk analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Product</h4>
              <ul className="space-y-1 text-xs text-[var(--color-text-muted)]">
                <li><Link href="/dashboard" className="hover:text-[var(--color-text-primary)] transition">Dashboard</Link></li>
                <li><a href="#how-it-works" className="hover:text-[var(--color-text-primary)] transition">Features</a></li>
                <li><Link href="/api/health" className="hover:text-[var(--color-text-primary)] transition">API Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Support</h4>
              <ul className="space-y-1 text-xs text-[var(--color-text-muted)]">
                <li><a href="https://github.com/mcsmartbytes/beyondsheets" className="hover:text-[var(--color-text-primary)] transition">Docs</a></li>
                <li><a href="https://github.com/mcsmartbytes/beyondsheets/issues" className="hover:text-[var(--color-text-primary)] transition">Issues</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Built With</h4>
              <ul className="space-y-1 text-xs text-[var(--color-text-muted)]">
                <li>Next.js 16 • Prisma • PostgreSQL</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
            <p>© 2026 BeyondSheets</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
