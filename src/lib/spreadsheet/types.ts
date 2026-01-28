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

export type AnalysisSummary = {
  purpose: {
    primary: string;
    secondary: string | null;
    signals: Array<{ label: string; score: number; matches: string[] }>;
  };
  healthScore: {
    overall: number;
    structural: number;
    formulas: number;
    integrity: number;
    scalability: number;
    busFactor: number;
  };
  notes: string[];
};

export type UploadAnalysisResult = {
  fingerprint: string;
  filename: string;
  size: number;
  mimeType: string | null;
  parsed: ParsedSpreadsheet;
  analysis?: AnalysisSummary;
};
