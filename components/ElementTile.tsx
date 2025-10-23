import React from 'react';
import type { ElementData } from '../types';

interface ElementTileProps {
  element: ElementData;
  visibleLabels: Set<keyof ElementData>;
  isHighlighted: boolean;
  onClick: () => void;
  isQuizActive: boolean;
}

const categoryColors: { [key: string]: string } = {
  "Nonmetal": "bg-green-700 hover:bg-green-600",
  "Noble Gas": "bg-purple-800 hover:bg-purple-700",
  "Alkali Metal": "bg-red-700 hover:bg-red-600",
  "Alkaline Earth Metal": "bg-orange-600 hover:bg-orange-500",
  "Metalloid": "bg-teal-700 hover:bg-teal-600",
  "Halogen": "bg-blue-700 hover:bg-blue-600",
  "Post-transition Metal": "bg-indigo-700 hover:bg-indigo-600",
  "Transition Metal": "bg-yellow-700 hover:bg-yellow-600 text-gray-900",
  "Lanthanide": "bg-rose-800 hover:bg-rose-700",
  "Actinide": "bg-pink-800 hover:bg-pink-700",
  "Synthetic": "bg-gray-600 hover:bg-gray-500",
};

export const ElementTile: React.FC<ElementTileProps> = ({ element, visibleLabels, isHighlighted, onClick, isQuizActive }) => {
  const colorClass = categoryColors[element.category] || 'bg-gray-700 hover:bg-gray-600';

  const formatValue = (key: keyof ElementData, value: any): string => {
    if (value === null) return 'N/A';
    if (key === 'atomicMass') return Number(value).toFixed(3);
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  const quizLabels = new Set(['atomicNumber', 'symbol']);
  const labelsToShow = isQuizActive ? quizLabels : visibleLabels;
  
  const showName = labelsToShow.has('name');
  const showSymbol = labelsToShow.has('symbol');
  const showAtomicMass = labelsToShow.has('atomicMass');
  const showAtomicNumber = labelsToShow.has('atomicNumber');
  const showNobleGasNotation = labelsToShow.has('nobleGasNotation');

  // Use a smaller font size for longer element names to help them fit.
  const nameFontSizeClass = element.name.length > 10 ? 'text-[8px]' : 'text-[10px]';

  return (
    <div
      onClick={onClick}
      className={`relative p-1 w-full h-full rounded-md shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 border-2 flex flex-col ${colorClass} ${
        isHighlighted ? 'opacity-100 border-cyan-400' : 'opacity-50 border-transparent hover:opacity-100'
      } ${isQuizActive && isHighlighted ? 'hover:border-white' : ''}`}
    >
      {showAtomicNumber && (
        <div className={`absolute top-1 left-1 font-medium ${showName ? 'text-[10px]' : 'text-xs'}`}>{element.atomicNumber}</div>
      )}
      
      {/* This container grows to fill the tile, and centers its content. This guarantees uniform tile size. */}
      <div className="flex-grow flex flex-col justify-center text-center">
        {showName ? (
          // Layout when name IS visible
          <>
            {showSymbol && (
              <div className="text-lg font-bold leading-tight">{element.symbol}</div>
            )}
            {/* Fixed height container allows name to wrap without breaking layout */}
            <div className={`h-5 flex items-center justify-center leading-tight ${nameFontSizeClass}`}>
              {element.name}
            </div>
            {showAtomicMass && (
              <div className="text-[9px] leading-tight mt-px">{formatValue('atomicMass', element.atomicMass)}</div>
            )}
          </>
        ) : (
          // Layout when name is HIDDEN - fonts are larger
          <>
            {showSymbol && (
              <div className="text-3xl font-bold leading-none">{element.symbol}</div>
            )}
            {showAtomicMass && (
              <div className="text-sm leading-tight mt-1">{formatValue('atomicMass', element.atomicMass)}</div>
            )}
          </>
        )}
      </div>
      
      {showNobleGasNotation && (
        <div className="absolute bottom-0.5 w-full left-0 px-1 text-center text-[7px] truncate">{formatValue('nobleGasNotation', element.nobleGasNotation)}</div>
      )}
    </div>
  );
};