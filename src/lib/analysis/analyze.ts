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

/**
 * Computes a comprehensive health score based on multiple factors.
 * Each category is scored 0-100, with deductions for issues.
 */
function computeHealthScore(parsed: ParsedSpreadsheet): HealthScore {
  const sheetCount = parsed.sheetNames.length;
  const hiddenCount = parsed.sheets.filter((sheet) => sheet.hidden).length;
  
  // Calculate total formulas and risky formulas
  const totalFormulas = parsed.sheets.reduce(
    (sum, sheet) => sum + (sheet.formulaStats?.totalFormulas || 0),
    0,
  );
  const riskyFormulas = parsed.sheets.reduce(
    (sum, sheet) => sum + (sheet.formulaStats?.riskyFormulas || 0),
    0,
  );
  
  // Calculate average row count (indicator of data volume)
  const avgRowCount = parsed.sheets.length > 0
    ? parsed.sheets.reduce((sum, sheet) => sum + sheet.rowCount, 0) / parsed.sheets.length
    : 0;

  // STRUCTURAL HEALTH (0-100)
  // Penalize: excessive sheets, hidden sheets, very large sheets
  let structural = 100;
  structural -= Math.max(0, sheetCount - 5) * 3; // -3 per sheet over 5
  structural -= hiddenCount * 8; // -8 per hidden sheet (high risk)
  structural -= Math.max(0, (avgRowCount - 1000) / 1000) * 2; // Large sheets slightly risky
  structural = Math.max(0, Math.min(100, structural));

  // FORMULA HEALTH (0-100)
  // Based on ratio of risky formulas to total formulas
  let formulas = 100;
  if (totalFormulas > 0) {
    const riskRatio = riskyFormulas / totalFormulas;
    formulas -= riskRatio * 60; // Up to -60 if all formulas are risky
    formulas -= Math.min(20, totalFormulas / 100); // -1 per 100 formulas (complexity)
  } else {
    // No formulas is neutral (might be just data, which is fine)
    formulas = 85;
  }
  formulas = Math.max(0, Math.min(100, formulas));

  // DATA INTEGRITY (0-100)
  // Check for consistent headers and data patterns
  let integrity = 100;
  parsed.sheets.forEach((sheet) => {
    const headerRow = sheet.sampleRows[0] ?? [];
    const headerText = headerRow.map((cell) => String(cell ?? '').trim());
    
    // Penalize blank headers
    const blankHeaders = headerText.filter((cell) => cell === '').length;
    if (blankHeaders > 0) {
      integrity -= blankHeaders * 3; // -3 per blank header
    }
    
    // Penalize duplicate headers
    const uniqueHeaders = new Set(headerText.filter(Boolean));
    if (uniqueHeaders.size < headerText.filter(Boolean).length) {
      integrity -= 10; // -10 for any duplicate headers
    }
    
    // Check for inconsistent row lengths
    const expectedColumns = headerText.length || sheet.colCount;
    const inconsistentRows = sheet.sampleRows
      .slice(1)
      .filter((row) => row.length !== expectedColumns).length;
    if (inconsistentRows > 0) {
      integrity -= Math.min(15, inconsistentRows * 2); // -2 per inconsistent row, max -15
    }
  });
  integrity = Math.max(0, Math.min(100, integrity));

  // SCALABILITY (0-100)
  // How well can this scale to more data or users?
  let scalability = 100;
  scalability -= Math.max(0, sheetCount - 3) * 4; // Many sheets = harder to scale
  scalability -= Math.max(0, (avgRowCount - 500) / 500) * 3; // Large datasets harder to scale
  if (totalFormulas > 500) {
    scalability -= 15; // Many formulas = recalc overhead
  }
  if (riskyFormulas > 50) {
    scalability -= 20; // Risky formulas = maintenance burden
  }
  scalability = Math.max(0, Math.min(100, scalability));

  // BUS FACTOR (0-100)
  // How much tacit knowledge is embedded? Lower = higher risk
  let busFactor = 100;
  busFactor -= hiddenCount * 15; // Hidden sheets = undocumented logic
  busFactor -= Math.min(30, (totalFormulas - 50) / 20); // Complex formulas = knowledge debt
  if (parsed.sheets.some(sheet => {
    const headerRow = sheet.sampleRows[0] ?? [];
    return headerRow.length === 0 || headerRow.every(cell => !cell);
  })) {
    busFactor -= 20; // Missing headers = no documentation
  }
  busFactor = Math.max(0, Math.min(100, busFactor));

  // OVERALL SCORE (weighted average)
  const overall = Math.round(
    structural * 0.20 +
    formulas * 0.25 +
    integrity * 0.25 +
    scalability * 0.15 +
    busFactor * 0.15
  );

  return {
    overall: Math.max(0, Math.min(100, overall)),
    structural: Math.round(structural),
    formulas: Math.round(formulas),
    integrity: Math.round(integrity),
    scalability: Math.round(scalability),
    busFactor: Math.round(busFactor),
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
