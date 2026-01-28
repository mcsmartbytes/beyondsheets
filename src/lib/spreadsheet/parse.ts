import * as XLSX from 'xlsx';
import type { ParsedSheetSummary, ParsedSpreadsheet } from './types';

const SAMPLE_ROW_LIMIT = 20;
const SAMPLE_COL_LIMIT = 10;
const FORMULA_EXAMPLE_LIMIT = 6;

const VOLATILE_FUNCTIONS = ['NOW', 'TODAY', 'RAND', 'RANDBETWEEN', 'OFFSET', 'INDIRECT'];

function analyzeFormulaRisks(sheet: XLSX.WorkSheet) {
  const rangeRef = sheet['!ref'];
  if (!rangeRef) {
    return {
      totalFormulas: 0,
      riskyFormulas: 0,
      risks: [],
      examples: [],
    };
  }

  const range = XLSX.utils.decode_range(rangeRef);
  const riskCounts: Record<string, number> = {};
  const examples: Array<{ address: string; formula: string; reason: string }> = [];

  let totalFormulas = 0;
  let riskyFormulas = 0;

  for (let r = range.s.r; r <= range.e.r; r += 1) {
    for (let c = range.s.c; c <= range.e.c; c += 1) {
      const address = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[address] as XLSX.CellObject | undefined;
      const formula = cell?.f;
      if (!formula) continue;

      totalFormulas += 1;
      const formulaText = String(formula);
      const reasons: string[] = [];

      if (/#REF!/i.test(formulaText)) {
        reasons.push('Broken reference (#REF!)');
        riskCounts['Broken reference'] = (riskCounts['Broken reference'] || 0) + 1;
      }

      const volatileMatch = VOLATILE_FUNCTIONS.find((fn) =>
        new RegExp(`\\b${fn}\\b`, 'i').test(formulaText),
      );
      if (volatileMatch) {
        reasons.push(`Volatile function (${volatileMatch})`);
        riskCounts['Volatile function'] = (riskCounts['Volatile function'] || 0) + 1;
      }

      if (/[^\w](\d+(\.\d+)?)/.test(formulaText)) {
        reasons.push('Hardcoded number');
        riskCounts['Hardcoded number'] = (riskCounts['Hardcoded number'] || 0) + 1;
      }

      const nestedDepth = (formulaText.match(/\(/g) || []).length;
      if (nestedDepth > 6) {
        reasons.push('Over-nested formula');
        riskCounts['Over-nested formula'] = (riskCounts['Over-nested formula'] || 0) + 1;
      }

      if (reasons.length) {
        riskyFormulas += 1;
        if (examples.length < FORMULA_EXAMPLE_LIMIT) {
          examples.push({
            address,
            formula: formulaText,
            reason: reasons.join('; '),
          });
        }
      }
    }
  }

  const risks = Object.entries(riskCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalFormulas,
    riskyFormulas,
    risks,
    examples,
  };
}

function buildSheetSummary(
  name: string,
  sheet: XLSX.WorkSheet,
  hidden: boolean,
): ParsedSheetSummary {
  const rangeRef = sheet['!ref'];
  if (!rangeRef) {
    return {
      name,
      hidden,
      rowCount: 0,
      colCount: 0,
      sampleRows: [],
    };
  }

  const range = XLSX.utils.decode_range(rangeRef);
  const rowCount = range.e.r - range.s.r + 1;
  const colCount = range.e.c - range.s.c + 1;
  const sampleRange = {
    s: range.s,
    e: {
      r: Math.min(range.s.r + SAMPLE_ROW_LIMIT - 1, range.e.r),
      c: Math.min(range.s.c + SAMPLE_COL_LIMIT - 1, range.e.c),
    },
  };

  const sampleRows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    range: sampleRange,
    blankrows: false,
  }) as unknown[][];

  const formulaStats = analyzeFormulaRisks(sheet);

  return {
    name,
    hidden,
    rowCount,
    colCount,
    sampleRows,
    formulaStats,
  };
}

export async function parseSpreadsheet(
  buffer: Buffer,
  filename?: string,
): Promise<ParsedSpreadsheet> {
  const lowerName = filename?.toLowerCase() ?? '';
  const isCsv = lowerName.endsWith('.csv');
  const workbook = isCsv
    ? XLSX.read(buffer.toString('utf8'), { type: 'string' })
    : XLSX.read(buffer, { type: 'buffer', cellFormula: true, cellDates: true });

  const sheetMetadata = workbook.Workbook?.Sheets ?? [];
  const sheets = workbook.SheetNames.map((name, index) => {
    const hidden = sheetMetadata[index]?.Hidden === 1 || sheetMetadata[index]?.Hidden === 2;
    return buildSheetSummary(name, workbook.Sheets[name], hidden);
  });

  return {
    sheetNames: workbook.SheetNames,
    sheets,
  };
}
