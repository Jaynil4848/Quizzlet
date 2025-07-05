import React, { useState, useEffect } from 'react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import Spreadsheet from 'react-spreadsheet';

export const QuestionForm = ({
  question,
  onQuestionChange,
  onAddQuestion,
  isValid
}) => {
  const type = question.type || 'mcq';
  const [excelData, setExcelData] = useState(
    Array.isArray(question.excelInitialData) ? question.excelInitialData : [[{ value: '' }]]
  );

  useEffect(() => {
    if (type === 'excel' && !Array.isArray(question.excelInitialData)) {
      setExcelData([[{ value: '' }]]);
    }
  }, [type, question.excelInitialData]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    onQuestionChange({
      ...question,
      type: newType,
      ...(newType === 'mcq'
        ? { options: ['', '', '', ''], correctAnswer: 0 }
        : { excelInitialData: [[{ value: '' }]] }
      )
    });
  };

  return (
    <div className="border-t pt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Add Question</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">Question Type</label>
        <select
          value={type}
          onChange={handleTypeChange}
          className="border rounded p-2"
        >
          <option value="mcq">MCQ</option>
          <option value="excel">Excel Problem</option>
        </select>
      </div>
      <Input
        label="Question"
        value={question.question}
        onChange={(e) => onQuestionChange({ ...question, question: e.target.value })}
        placeholder="Enter your question..."
      />
      {type === 'mcq' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={question.correctAnswer === index}
                onChange={() => onQuestionChange({ ...question, correctAnswer: index })}
                className="text-blue-600"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[index] = e.target.value;
                  onQuestionChange({ ...question, options: newOptions });
                }}
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Option ${index + 1}...`}
              />
            </div>
          ))}
        </div>
      )}
      {type === 'excel' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Excel Sheet (Initial State)</label>
          <Spreadsheet
            data={excelData}
            onChange={setExcelData}
          />
          <Button
            onClick={() => onQuestionChange({ ...question, excelInitialData: excelData })}
            variant="outline"
            className="mt-2"
          >
            Save Excel Data
          </Button>
        </div>
      )}
      <Button
        onClick={onAddQuestion}
        disabled={!isValid}
        variant="success"
        className="mt-4"
      >
        Add Question
      </Button>
    </div>
  );
};