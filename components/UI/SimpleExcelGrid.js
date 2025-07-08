import React, { useState, useEffect } from 'react';
import { ExcelToolbar } from './ExcelToolbar';

const DEFAULT_ROWS = 8;
const DEFAULT_COLS = 8;

const createEmptyGrid = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ value: '', style: {} }))
  );
};

export const SimpleExcelGrid = ({ data, onChange, readOnly = false }) => {
  const [grid, setGrid] = useState(() => {
    if (data && data.length > 0 && data[0].length > 0) {
      return data.map((row) =>
        row.map((cell) => ({ value: cell.value, style: cell.style || {} }))
      );
    }
    return createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS);
  });

  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });

  useEffect(() => {
    if (onChange) {
      onChange(grid);
    }
  }, [grid, onChange]);

  const handleCellChange = (rowIndex, colIndex, value) => {
    if (readOnly) return;

    const newGrid = grid.map((row) => [...row]);
    newGrid[rowIndex][colIndex] = { ...newGrid[rowIndex][colIndex], value };

    if (rowIndex === newGrid.length - 1) {
      newGrid.push(Array(newGrid[0].length).fill().map(() => ({ value: '', style: {} })));
    }

    if (colIndex === newGrid[0].length - 1) {
      newGrid.forEach((row) => row.push({ value: '', style: {} }));
    }

    setGrid(newGrid);
  };

  const handleStyleChange = (style, value) => {
    if (readOnly) return;

    const { row, col } = selectedCell;
    const newGrid = grid.map((r) => [...r]);
    const currentStyle = newGrid[row][col].style || {};

    // Toggle for bold, italic, underline
    if (['fontWeight', 'fontStyle', 'textDecoration'].includes(style)) {
      newGrid[row][col].style = {
        ...currentStyle,
        [style]: currentStyle[style] === value ? 'normal' : value,
      };
    } else {
      newGrid[row][col].style = { ...currentStyle, [style]: value };
    }

    setGrid(newGrid);
  };

  const getColumnLabel = (index) => {
    let label = '';
    let temp = index;
    while (temp >= 0) {
      label = String.fromCharCode(65 + (temp % 26)) + label;
      temp = Math.floor(temp / 26) - 1;
    }
    return label;
  };

  return (
    <div>
      {!readOnly && <ExcelToolbar onStyleChange={handleStyleChange} />}
      <div
        className="border border-gray-300 rounded-b-lg overflow-auto"
        style={{ maxHeight: 400, maxWidth: '100%' }}
      >
        <table className="min-w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-12 h-8 border border-gray-300 bg-gray-200 text-xs font-medium text-gray-600 sticky top-0 z-10"></th>
              {grid[0]?.map((_, colIndex) => (
                <th
                  key={colIndex}
                  className="w-24 h-8 border border-gray-300 bg-gray-200 text-xs font-medium text-gray-600 px-2 sticky top-0 z-10"
                >
                  {getColumnLabel(colIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="w-12 h-8 border border-gray-300 bg-gray-100 text-xs font-medium text-gray-600 text-center sticky left-0 z-10">
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="w-24 h-8 border border-gray-300 p-0"
                    onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                  >
                    <input
                      type="text"
                      value={cell?.value || ''}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      readOnly={readOnly}
                      style={cell?.style || {}}
                      className={`w-full h-full px-2 text-sm border-none outline-none focus:bg-blue-50 ${
                        readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                      } ${
                        selectedCell.row === rowIndex && selectedCell.col === colIndex
                          ? 'ring-2 ring-blue-500'
                          : ''
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};