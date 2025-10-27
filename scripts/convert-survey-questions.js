import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the Excel file
const workbook = XLSX.readFile(path.join(__dirname, '../instrumento/Matriz Instrumento miPymes.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Column mapping based on the header row
const headers = data[0];
const ID_COL = 0; // ID_item
const TEXT_COL = 1; // Texto_item
const DIMENSION_COL = 2; // Dimensión
const SUBDIMENSION_COL = 3; // Subdimensión
const SCALE_COL = 8; // Escala

function parseQuestionType(scaleText) {
  if (!scaleText) return 'text';
  
  const scale = scaleText.toLowerCase();
  
  if (scale.includes('likert')) return 'likert';
  if (scale.includes('número entero') || scale.includes('número')) return 'number';
  if (scale.includes('sí / no')) return 'radio';
  if (scale.includes('opción:')) return 'radio';
  if (scale.includes('múltiple')) return 'checkbox';
  if (scale.includes('texto')) return 'textarea';
  
  return 'text';
}

function parseOptions(scaleText) {
  if (!scaleText) return undefined;
  
  const scale = scaleText.toLowerCase();
  
  if (scale.includes('sí / no / no sabe')) {
    return ['Sí', 'No', 'No sabe'];
  }
  if (scale.includes('sí / no')) {
    return ['Sí', 'No'];
  }
  
  return undefined;
}

function parseLikertConfig(scaleText) {
  if (!scaleText || !scaleText.toLowerCase().includes('likert')) {
    return undefined;
  }
  
  return {
    scale_points: 5,
    left_label: 'Totalmente en desacuerdo',
    right_label: 'Totalmente de acuerdo',
    middle_label: 'Neutral'
  };
}

// Convert Excel data to survey questions
const questions = [];
let orderIndex = 1;

// Skip header row and process data rows
for (let i = 1; i < data.length; i++) {
  const row = data[i];
  
  if (!row || !row[ID_COL] || !row[TEXT_COL]) continue;
  
  const id = row[ID_COL];
  const questionText = row[TEXT_COL];
  const dimension = row[DIMENSION_COL] || '';
  const subdimension = row[SUBDIMENSION_COL] || '';
  const scaleText = row[SCALE_COL] || '';
  
  // Skip if question text is too short or seems invalid
  if (typeof questionText !== 'string' || questionText.length < 10) continue;
  
  const questionType = parseQuestionType(scaleText);
  const options = parseOptions(scaleText);
  const likertConfig = parseLikertConfig(scaleText);
  
  const question = {
    id: id,
    survey_id: 'mipymes-diagnostico',
    question_text: questionText,
    question_type: questionType,
    dimension: dimension,
    subdimension: subdimension,
    is_required: true, // Most questions are required
    order_index: orderIndex++
  };
  
  if (options) {
    question.options = options;
  }
  
  if (likertConfig) {
    question.likert_config = likertConfig;
  }
  
  questions.push(question);
}

console.log(`Converted ${questions.length} questions from Excel`);

// Show first few questions for verification
console.log('\nFirst 5 questions:');
questions.slice(0, 5).forEach((q, i) => {
  console.log(`${i + 1}. [${q.id}] ${q.question_text}`);
  console.log(`   Type: ${q.question_type}, Dimension: ${q.dimension}`);
  if (q.options) console.log(`   Options: ${q.options.join(', ')}`);
  console.log('');
});

// Group by dimension for overview
const dimensionCounts = {};
questions.forEach(q => {
  const dim = q.dimension || 'Sin dimensión';
  dimensionCounts[dim] = (dimensionCounts[dim] || 0) + 1;
});

console.log('\nQuestions by dimension:');
Object.entries(dimensionCounts).forEach(([dim, count]) => {
  console.log(`${dim}: ${count} questions`);
});

// Save converted questions
const outputPath = path.join(__dirname, '../src/data/survey-questions.json');
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
console.log(`\nConverted questions saved to: ${outputPath}`);

// Also create a TypeScript file for easier import
const tsContent = `// Auto-generated survey questions from Excel
// Generated on: ${new Date().toISOString()}

import { SurveyQuestion } from '@/types/survey';

export const surveyQuestions: SurveyQuestion[] = ${JSON.stringify(questions, null, 2)};

export default surveyQuestions;
`;

const tsOutputPath = path.join(__dirname, '../src/data/survey-questions.ts');
fs.writeFileSync(tsOutputPath, tsContent);
console.log(`TypeScript file saved to: ${tsOutputPath}`);