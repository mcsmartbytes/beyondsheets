export type ParsedSheetSummary = {
  name: string;
  hidden: boolean;
  rowCount: number;
  colCount: number;
  sampleRows: unknown[][];
};

export type ParsedSpreadsheet = {
  sheetNames: string[];
  sheets: ParsedSheetSummary[];
};

export type UploadAnalysisResult = {
  fingerprint: string;
  filename: string;
  size: number;
  mimeType: string | null;
  parsed: ParsedSpreadsheet;
};
