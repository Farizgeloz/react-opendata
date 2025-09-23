// utils/downloadJSON.js

export function downloadJSON(data, filename = 'data') {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  const fullFilename = `dataset-${filename}-${timestamp}.json`;

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fullFilename;
  a.click();
  URL.revokeObjectURL(url);
}