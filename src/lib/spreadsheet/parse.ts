export type ParsedSpreadsheet = {
  sheetNames: string[];
  sheets: Record<string, unknown>;
};

export async function parseSpreadsheet(): Promise<ParsedSpreadsheet> {
  return {
    sheetNames: [],
    sheets: {},
  };
}
