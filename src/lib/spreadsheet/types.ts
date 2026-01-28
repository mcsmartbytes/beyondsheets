export type ParsedSheetSummary = {
  name: string;
  hidden: boolean;
  rowCount: number;
  colCount: number;
  sampleRows: unknown[][];
  formulaStats?: {
    totalFormulas: number;
    riskyFormulas: number;
    risks: Array<{ type: string; count: number }>;
    examples: Array<{ address: string; formula: string; reason: string }>;
  };
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
  formulaRisk: {
    totalFormulas: number;
    riskyFormulas: number;
    topRisks: Array<{ type: string; count: number }>;
  };
  sheetIssues: Array<{
    sheet: string;
    issues: Array<{ title: string; impact: string; fix: string }>;
  }>;
  healthScore: {
    overall: number;
    structural: number;
    formulas: number;
    integrity: number;
    scalability: number;
    busFactor: number;
  };
  notes: string[];
  issues: Array<{ title: string; impact: string; fix: string }>;
  dbPrep: string[];
};

export type UploadAnalysisResult = {
  fingerprint: string;
  filename: string;
  size: number;
  mimeType: string | null;
  parsed: ParsedSpreadsheet;
  analysis?: AnalysisSummary;
};
