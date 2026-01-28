import type { ParsedSpreadsheet } from '@/lib/spreadsheet/types';
import { detectPurpose, type PurposeSummary } from './purpose';

export type HealthScore = {
  overall: number;
  structural: number;
  formulas: number;
  integrity: number;
  scalability: number;
  busFactor: number;
};

export type AnalysisSummary = {
  purpose: PurposeSummary;
  formulaRisk: {
    totalFormulas: number;
    riskyFormulas: number;
    topRisks: Array<{ type: string; count: number }>;
  };
  sheetIssues: Array<{
    sheet: string;
    issues: Array<{ title: string; impact: string; fix: string }>;
  }>;
  healthScore: HealthScore;
  notes: string[];
  issues: Array<{ title: string; impact: string; fix: string }>;
  dbPrep: string[];
};

function computeHealthScore(parsed: ParsedSpreadsheet): HealthScore {
  const sheetCount = parsed.sheetNames.length;
  const hiddenCount = parsed.sheets.filter((sheet) => sheet.hidden).length;

  let overall = 78;
  overall -= Math.max(0, sheetCount - 6) * 2;
  overall -= hiddenCount * 4;
  overall = Math.max(40, Math.min(95, overall));

  return {
    overall,
    structural: Math.min(95, overall + 4),
    formulas: Math.min(90, overall - 6),
    integrity: Math.min(92, overall - 2),
    scalability: Math.min(88, overall - 8),
    busFactor: Math.min(90, overall - 4),
  };
}

export function analyzeSpreadsheet(parsed: ParsedSpreadsheet): AnalysisSummary {
  const purpose = detectPurpose(
    parsed.sheetNames,
    parsed.sheets.map((sheet) => sheet.sampleRows),
  );

  const notes: string[] = [];
  const issues: Array<{ title: string; impact: string; fix: string }> = [];
  const dbPrep: string[] = [];
  const sheetIssues: Array<{
    sheet: string;
    issues: Array<{ title: string; impact: string; fix: string }>;
  }> = [];

  const totalFormulas = parsed.sheets.reduce(
    (sum, sheet) => sum + (sheet.formulaStats?.totalFormulas || 0),
    0,
  );
  const riskyFormulas = parsed.sheets.reduce(
    (sum, sheet) => sum + (sheet.formulaStats?.riskyFormulas || 0),
    0,
  );
  const riskCounts: Record<string, number> = {};
  parsed.sheets.forEach((sheet) => {
    sheet.formulaStats?.risks.forEach((risk) => {
      riskCounts[risk.type] = (riskCounts[risk.type] || 0) + risk.count;
    });
  });
  const topRisks = Object.entries(riskCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  if (riskyFormulas > 0) {
    issues.push({
      title: 'Formula risk detected',
      impact: `${riskyFormulas} of ${totalFormulas} formulas include risk patterns.`,
      fix: 'Review volatile functions, hardcoded numbers, and broken references.',
    });
  }
  if (parsed.sheets.some((sheet) => sheet.hidden)) {
    notes.push('Hidden sheets detected. Review hidden logic for critical inputs.');
    issues.push({
      title: 'Hidden sheets',
      impact: 'Hidden tabs can hide critical calculations or inputs.',
      fix: 'Unhide and document any sheets used for calculations.',
    });
  }
  if (parsed.sheetNames.length > 8) {
    notes.push('Sheet count is high. Consider consolidating to reduce complexity.');
    issues.push({
      title: 'Sheet sprawl',
      impact: 'High sheet count increases maintenance risk.',
      fix: 'Consolidate related sheets or move repeating data into tables.',
    });
  }

  const headerTokens = parsed.sheets
    .flatMap((sheet) => sheet.sampleRows.slice(0, 1))
    .flatMap((row) => row)
    .map((cell) => String(cell || '').toLowerCase());
  const hasId = headerTokens.some((token) => token.includes('id') || token.includes('uuid'));
  if (!hasId) {
    issues.push({
      title: 'Missing stable identifiers',
      impact: 'Rows may not map cleanly into database tables.',
      fix: 'Add an ID column for each primary entity (e.g. customer_id, order_id).',
    });
  }

  dbPrep.push('Add unique IDs for primary entities (customers, orders, items).');
  dbPrep.push('Split repeating groups into separate tables (line items, history).');
  dbPrep.push('Standardize dates, currency, and units before migration.');
  dbPrep.push('Remove merged cells and ensure every column has a header.');

  parsed.sheets.forEach((sheet) => {
    const sheetLevelIssues: Array<{ title: string; impact: string; fix: string }> = [];
    const headerRow = sheet.sampleRows[0] ?? [];
    const headerText = headerRow.map((cell) => String(cell ?? '').trim());

    if (headerText.length === 0 || headerText.every((cell) => cell === '')) {
      sheetLevelIssues.push({
        title: 'Missing header row',
        impact: 'Columns cannot be mapped consistently.',
        fix: 'Add a header row with descriptive column names.',
      });
    }

    const blankHeaders = headerText.filter((cell) => cell === '').length;
    if (blankHeaders > 0) {
      sheetLevelIssues.push({
        title: 'Blank column headers',
        impact: 'Unlabeled columns make data ambiguous.',
        fix: 'Name all columns in the header row.',
      });
    }

    const headerCounts = headerText.reduce<Record<string, number>>((acc, value) => {
      if (!value) return acc;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    const duplicateHeaders = Object.entries(headerCounts)
      .filter(([, count]) => count > 1)
      .map(([name]) => name);
    if (duplicateHeaders.length > 0) {
      sheetLevelIssues.push({
        title: 'Duplicate column headers',
        impact: `Duplicate headers found: ${duplicateHeaders.join(', ')}`,
        fix: 'Rename duplicate headers to make each column unique.',
      });
    }

    const expectedColumns = headerText.length || sheet.colCount;
    const inconsistentRows = sheet.sampleRows.slice(1).filter((row) => row.length !== expectedColumns).length;
    if (inconsistentRows > 0) {
      sheetLevelIssues.push({
        title: 'Inconsistent row length',
        impact: `${inconsistentRows} sample rows have a different column count.`,
        fix: 'Align row lengths and remove stray separators or merged cells.',
      });
    }

    if (sheetLevelIssues.length > 0) {
      sheetIssues.push({ sheet: sheet.name, issues: sheetLevelIssues });
    }
  });

  return {
    purpose,
    formulaRisk: {
      totalFormulas,
      riskyFormulas,
      topRisks,
    },
    sheetIssues,
    healthScore: computeHealthScore(parsed),
    notes,
    issues,
    dbPrep,
  };
}
