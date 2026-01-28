export type GoogleSheetImportRequest = {
  spreadsheetId: string;
  accessToken: string;
};

export async function fetchGoogleSheetAsXlsx(
  input: GoogleSheetImportRequest,
): Promise<Buffer> {
  const exportUrl =
    'https://www.googleapis.com/drive/v3/files/' +
    encodeURIComponent(input.spreadsheetId) +
    '/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  const response = await fetch(exportUrl, {
    headers: {
      Authorization: 'Bearer ' + input.accessToken,
    },
  });

  if (!response.ok) {
    throw new Error('Google export failed with status ' + response.status);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
