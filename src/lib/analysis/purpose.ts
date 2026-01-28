export type PurposeSignal = {
  label: string;
  score: number;
  matches: string[];
};

export type PurposeSummary = {
  primary: string;
  secondary: string | null;
  signals: PurposeSignal[];
};

const PURPOSE_KEYWORDS: Record<string, string[]> = {
  Payroll: [
    'payroll',
    'employee',
    'wages',
    'hours',
    'overtime',
    'pay rate',
    'salary',
    'deductions',
    'taxes',
    'gross',
    'net',
    'paycheck',
  ],
  Budget: ['budget', 'expense', 'actual', 'forecast', 'variance', 'capex', 'opex'],
  'Job Costing': ['job', 'project', 'estimate', 'labor', 'material', 'unit cost', 'markup'],
  Inventory: ['sku', 'stock', 'on hand', 'warehouse', 'inventory', 'item', 'qty', 'quantity'],
  CRM: ['customer', 'client', 'lead', 'pipeline', 'deal', 'opportunity', 'contact'],
  Scheduling: ['dispatch', 'route', 'calendar', 'shift', 'crew', 'schedule'],
  'Sales Tracking': ['order', 'invoice', 'sales', 'revenue', 'price', 'total'],
};

function normalizeToken(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase();
}

function tokenizeCell(value: unknown): string[] {
  const normalized = normalizeToken(value);
  if (!normalized) return [];
  return normalized.split(/[^a-z0-9]+/).filter(Boolean);
}

function extractRowTokens(sampleRows: unknown[][], rowCount = 3): string[] {
  if (!sampleRows.length) return [];
  return sampleRows.slice(0, rowCount).flatMap((row) => row.flatMap((cell) => tokenizeCell(cell)));
}

export function detectPurpose(sheetNames: string[], sampleRows: unknown[][][]): PurposeSummary {
  const signals: PurposeSignal[] = [];

  const tokens = new Set<string>();
  sheetNames.forEach((name) => tokenizeCell(name).forEach((token) => tokens.add(token)));
  sampleRows.forEach((rows) => extractRowTokens(rows).forEach((token) => tokens.add(token)));

  for (const [label, keywords] of Object.entries(PURPOSE_KEYWORDS)) {
    const matches = keywords.filter((keyword) => tokens.has(keyword));
    signals.push({
      label,
      score: matches.length,
      matches,
    });
  }

  signals.sort((a, b) => b.score - a.score);

  const primary = signals[0]?.score ? signals[0].label : 'General Spreadsheet';
  const secondary = signals[1]?.score ? signals[1].label : null;

  return {
    primary,
    secondary,
    signals,
  };
}
