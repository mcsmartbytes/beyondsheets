import * as XLSX from 'xlsx';
import type { ParsedSheetSummary, ParsedSpreadsheet } from './types';

const SAMPLE_ROW_LIMIT = 20;
const SAMPLE_COL_LIMIT = 10;

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

  return {
    name,
    hidden,
    rowCount,
    colCount,
    sampleRows,
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
