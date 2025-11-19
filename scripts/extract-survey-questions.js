import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the Excel file
const workbook = XLSX.readFile(path.join(__dirname, '../instrumento/Matriz Instrumento miPymes.xlsx'));

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('Excel data structure:');
console.log('Total rows:', data.length);
console.log('First 10 rows:');
data.slice(0, 10).forEach((row, index) => {
  console.log(`Row ${index}:`, row);
});

// Try to find question patterns
console.log('\n=== Looking for question patterns ===');
data.forEach((row, index) => {
  if (row && row.length > 0) {
    const firstCell = row[0];
    if (typeof firstCell === 'string' && firstCell.includes('?')) {
      console.log(`Row ${index}: ${firstCell}`);
    }
  }
});

// Save raw data to JSON for inspection
const outputPath = path.join(__dirname, '../src/data/raw-excel-data.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`\nRaw data saved to: ${outputPath}`);