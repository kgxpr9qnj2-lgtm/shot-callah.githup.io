import React from 'react';
import { ElementTile } from './ElementTile';
import { PlaceholderTile } from './PlaceholderTile';
import type { ElementData, HighlightSelection } from '../types';

interface PeriodicTableProps {
  elements: ElementData[];
  visibleLabels: Set<keyof ElementData>;
  highlightedSymbols: Set<string>;
  onElementClick: (element: ElementData) => void;
  isQuizActive: boolean;
  highlightSelection: HighlightSelection;
}

const getElementPosition = (el: ElementData) => {
    if (el.atomicNumber >= 57 && el.atomicNumber <= 71) { // Lanthanides
        return { row: 8, col: el.atomicNumber - 57 + 3 };
    }
    if (el.atomicNumber >= 89 && el.atomicNumber <= 103) { // Actinides
        return { row: 9, col: el.atomicNumber - 89 + 3 };
    }
    const group = typeof el.group === 'string' ? 3 : el.group;
    return { row: el.period, col: group };
};

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ elements, visibleLabels, highlightedSymbols, onElementClick, isQuizActive, highlightSelection }) => {
  return (
    <div className="relative inline-block">
      <div 
        className="grid gap-1"
        style={{
          gridTemplateColumns: 'repeat(18, 75px)',
          gridAutoRows: '75px',
        }}
      >
        {elements.map(element => {
          const position = getElementPosition(element);
          
          const hasActiveSelection = highlightSelection.include.size > 0 || highlightSelection.exclude.size > 0;
          const isHighlighted = hasActiveSelection
            ? highlightedSymbols.has(element.symbol)
            : !isQuizActive; // Default state: highlight all when not in quiz mode and no selections are active

          return (
            <div
              key={element.atomicNumber}
              style={{
                gridRowStart: position.row,
                gridColumnStart: position.col,
              }}
              className="w-full h-full"
            >
              <ElementTile
                element={element}
                visibleLabels={visibleLabels}
                isHighlighted={isHighlighted}
                onClick={() => onElementClick(element)}
                isQuizActive={isQuizActive}
              />
            </div>
          );
        })}

        <div style={{ gridRow: 6, gridColumn: 3 }}>
          <PlaceholderTile label="57-71" series="lanthanide" />
        </div>
        <div style={{ gridRow: 7, gridColumn: 3 }}>
          <PlaceholderTile label="89-103" series="actinide" />
        </div>

      </div>
    </div>
  );
};
