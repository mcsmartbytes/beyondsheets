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
  healthScore: HealthScore;
  notes: string[];
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
  if (parsed.sheets.some((sheet) => sheet.hidden)) {
    notes.push('Hidden sheets detected. Review hidden logic for critical inputs.');
  }
  if (parsed.sheetNames.length > 8) {
    notes.push('Sheet count is high. Consider consolidating to reduce complexity.');
  }

  return {
    purpose,
    healthScore: computeHealthScore(parsed),
    notes,
  };
}
