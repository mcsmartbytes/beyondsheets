import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'BeyondSheets - Spreadsheet Risk Analysis',
  description: 'Analyze spreadsheet health, detect formula risks, and get modernization guidance.',
};

function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--color-bg-primary)]/80 border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <span className="text-sm font-bold text-[var(--color-text-primary)]">BeyondSheets</span>
        </Link>
        
        <div className="flex items-center gap-1">
          <Link href="/" className="nav-link text-xs py-1 px-2">
            Home
          </Link>
          <Link href="/dashboard" className="nav-link text-xs py-1 px-2">
            Dashboard
          </Link>
          <Link href="/dashboard" className="btn btn-primary ml-1 py-1.5 px-3 text-xs">
            Analyze
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <div className="pt-12">
          {children}
        </div>
      </body>
    </html>
  );
}
