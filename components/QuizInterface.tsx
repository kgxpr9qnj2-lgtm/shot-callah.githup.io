import React from 'react';
import type { ElementData } from '../types';
import { ElementTile } from './ElementTile';

type QuizMode = 'name_to_symbol' | 'symbol_to_name';

interface QuizInterfaceProps {
  mode: QuizMode;
  currentElement: ElementData | null;
  options: ElementData[];
  message: string;
  onAnswer: (answer: ElementData) => void;
  onEndQuiz: () => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  mode,
  currentElement,
  options,
  message,
  onAnswer,
  onEndQuiz,
}) => {
  if (!currentElement) {
    return (
      <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg mb-6 text-center">
        <p className="text-lg">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">Quiz Mode</h2>
        <button
          onClick={onEndQuiz}
          className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          End Quiz
        </button>
      </div>

      <div className="text-center bg-gray-900/50 p-6 rounded-md">
        {mode === 'name_to_symbol' && (
          <h3 className="text-2xl font-semibold text-gray-200">
            Find this element: <span className="text-yellow-400">{currentElement.name}</span>
          </h3>
        )}

        {mode === 'symbol_to_name' && (
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-2xl font-semibold text-gray-200">What is the name of this element?</h3>
            <div className="w-24 h-24">
                <ElementTile 
                    element={currentElement}
                    visibleLabels={new Set(['atomicNumber', 'symbol'])}
                    isHighlighted={true}
                    onClick={() => {}}
                    isQuizActive={true}
                />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
                {options.map(option => (
                    <button
                        key={option.atomicNumber}
                        onClick={() => onAnswer(option)}
                        className="bg-gray-700 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-lg"
                    >
                        {option.name}
                    </button>
                ))}
            </div>
          </div>
        )}
        
        {message && (
          <p className="text-lg text-yellow-300 mt-4 min-h-[28px]">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
