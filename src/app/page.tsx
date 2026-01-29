'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-2xl font-bold text-white">BeyondSheets</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
            <Link 
              href="/dashboard" 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Stop Guessing.
            <br />
            <span className="text-blue-500">Know Your Spreadsheet Risk.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Upload your Excel or CSV files and get instant insights into formula risks, 
            data integrity issues, and modernization recommendations. Transform spreadsheet 
            chaos into database clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
            >
              Analyze Your Spreadsheet
            </Link>
            <Link 
              href="#how-it-works" 
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold rounded-lg transition"
            >
              See How It Works
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure & private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto bg-slate-800/50 backdrop-blur rounded-2xl p-12 border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            The Hidden Cost of Spreadsheets
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-red-500 mb-2">88%</div>
              <p className="text-gray-300">of spreadsheets contain errors</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">$10M+</div>
              <p className="text-gray-300">average cost of spreadsheet failures</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-500 mb-2">50%</div>
              <p className="text-gray-300">of finance professionals don't trust their data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Comprehensive Spreadsheet Analysis
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Get actionable insights in seconds, not hours
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Purpose Detection</h3>
              <p className="text-gray-400">
                Automatically identifies whether your spreadsheet is for payroll, budgeting, inventory, or other business functions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Formula Risk Detection</h3>
              <p className="text-gray-400">
                Scans for volatile functions, broken references, hardcoded values, and over-nested formulas that could break.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Health Score (0-100)</h3>
              <p className="text-gray-400">
                Get a single executive-friendly score based on structural integrity, formula safety, and scalability.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Database Migration Guidance</h3>
              <p className="text-gray-400">
                Get step-by-step recommendations for moving your spreadsheet data into a proper database system.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Reports</h3>
              <p className="text-gray-400">
                Detailed, shareable reports showing exactly what's safe and what will break first.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Google Sheets Support</h3>
              <p className="text-gray-400">
                Import directly from Google Sheets with OAuth integration for seamless cloud analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Modernize Your Spreadsheets?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get your first analysis free. No credit card required.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-block px-10 py-4 bg-white text-blue-600 text-lg font-bold rounded-lg hover:bg-gray-100 transition shadow-xl"
          >
            Start Analyzing Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">BeyondSheets</h3>
              <p className="text-gray-400 text-sm">
                Spreadsheet risk analysis and modernization guidance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition">Features</Link></li>
                <li><Link href="/api/health" className="hover:text-white transition">API Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://github.com/mcsmartbytes/beyondsheets" className="hover:text-white transition">Documentation</a></li>
                <li><a href="https://github.com/mcsmartbytes/beyondsheets/issues" className="hover:text-white transition">Report Issue</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Built With</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Next.js 16</li>
                <li>Prisma ORM</li>
                <li>PostgreSQL</li>
                <li>Vercel</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-gray-400 text-sm">
            <p>© 2026 BeyondSheets. Built by MC Smart Bytes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
