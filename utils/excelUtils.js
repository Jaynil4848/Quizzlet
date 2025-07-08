import * as XLSX from 'xlsx';

// Parse questions from an uploaded Excel file (expects columns: Question, Option1, Option2, Option3, Option4, CorrectAnswer)
export function parseQuestionsFromExcel(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    // Remove header row
    const rows = json.slice(1);
    const questions = rows.map(row => ({
      question: row[0] || '',
      options: [row[1] || '', row[2] || '', row[3] || '', row[4] || ''],
      correctAnswer: typeof row[5] === 'number' ? row[5] : 0
    }));
    callback(questions);
  };
  reader.readAsArrayBuffer(file);
}

// Export quiz data to Excel
export function exportQuizToExcel(quiz, filename = 'quiz.xlsx') {
  const wsData = [
    ['Question', 'Option1', 'Option2', 'Option3', 'Option4', 'CorrectAnswer'],
    ...quiz.questions.map(q => [q.question, ...q.options, q.correctAnswer])
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Quiz');
  XLSX.writeFile(wb, filename);
}

// Export participant answers/results to Excel
export function exportResultsToExcel(results, filename = 'results.xlsx') {
  const wsData = [
    ['Question', 'Your Answer', 'Correct Answer', 'Is Correct'],
    ...results.detailedResults.map(r => [r.question, r.userAnswer, r.correctAnswer, r.isCorrect ? 'Yes' : 'No'])
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Results');
  XLSX.writeFile(wb, filename);
}
