import React, { useState } from 'react';
import type { LabelDefinitions, ElementGroupings, ElementData, HighlightSelection } from '../types';

type QuizMode = null | 'name_to_symbol' | 'symbol_to_name';

interface ControlsProps {
  labelDefinitions: LabelDefinitions;
  elementGroupings: ElementGroupings;
  visibleLabels: Set<keyof ElementData>;
  onLabelToggle: (labelKey: keyof ElementData) => void;
  highlightSelection: HighlightSelection;
  onHighlightChange: (groupKey: string, mode: 'include' | 'exclude') => void;
  onQuizModeChange: (mode: QuizMode) => void;
}

const highlightSections = {
  "Valence Electrons": Array.from({ length: 8 }, (_, i) => `main_group_${i + 1}`),
  "Blocks": ['s-block', 'p-block', 'd-block', 'f-block'],
  "Categories": [
    'alkali_metals',
    'alkaline_earth_metals',
    'lanthanides',
    'actinides',
    'transition_metals',
    'post_transition_metals',
    'metalloids',
    'nonmetals',
    'halogens',
    'noble_gases',
  ],
  "IUPAC Groups": Array.from({ length: 18 }, (_, i) => `group_${i + 1}`),
};

const formatLabel = (key: string) => {
  if (key.startsWith('main_group_') || key.startsWith('valence_')) {
    return key.replace('main_group_', '').replace('valence_', '');
  }
  if (key === 'nobleGasNotation') {
    return 'Noble Gas Notation';
  }
  return key
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(' block', '-block');
};

const Checkbox: React.FC<{
  groupKey: string;
  selection: HighlightSelection;
  onChange: () => void;
}> = ({ groupKey, selection, onChange }) => {
  const isIncluded = selection.include.has(groupKey);
  const isExcluded = selection.exclude.has(groupKey);
  const labelColor = isIncluded ? 'text-green-400' : isExcluded ? 'text-red-400' : 'text-gray-300';
  
  return (
    <label className="flex items-center space-x-2 cursor-pointer hover:text-white">
      <input
        type="checkbox"
        className={`form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 focus:ring-cyan-500 ${isIncluded ? 'text-green-500' : 'text-red-500'}`}
        checked={isIncluded || isExcluded}
        onChange={onChange}
      />
      <span className={`text-sm ${labelColor}`}>{formatLabel(groupKey)}</span>
    </label>
  );
};

export const Controls: React.FC<ControlsProps> = ({
  labelDefinitions,
  visibleLabels,
  onLabelToggle,
  highlightSelection,
  onHighlightChange,
  onQuizModeChange
}) => {
  const displayLabels = ['atomicNumber', 'symbol', 'name', 'atomicMass', 'nobleGasNotation'];
  const [highlightMode, setHighlightMode] = useState<'include' | 'exclude'>('include');

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow-lg mb-6 flex flex-col xl:flex-row gap-6 justify-between items-start">
      
      <div className="w-full xl:w-1/4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Display Labels</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-x-4 gap-y-2">
          {displayLabels.map(key => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer text-gray-300 hover:text-white">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                checked={visibleLabels.has(key as keyof ElementData)}
                onChange={() => onLabelToggle(key as keyof ElementData)}
              />
              <span className="text-sm">{formatLabel(key)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full xl:w-1/2">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Highlight Elements</h3>
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setHighlightMode('include')}
            className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${highlightMode === 'include' ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Include
          </button>
          <button
            onClick={() => setHighlightMode('exclude')}
            className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${highlightMode === 'exclude' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Exclude
          </button>
        </div>
        <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
          {Object.entries(highlightSections).map(([title, keys]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-1">{title}</h4>
              <div className={`grid ${title === 'Valence Electrons' ? 'grid-cols-4 sm:grid-cols-8' : title === 'IUPAC Groups' ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3'} gap-x-4 gap-y-2`}>
                {keys.map(key => (
                  <Checkbox 
                    key={key} 
                    groupKey={key} 
                    selection={highlightSelection}
                    onChange={() => onHighlightChange(key, highlightMode)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full xl:w-1/4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Study Mode</h3>
        <div className="flex flex-col space-y-2">
            <button className="w-full bg-cyan-600 text-white font-semibold rounded-md py-2 px-3 text-left transition-colors">
              Explore Mode
            </button>
            <button 
                onClick={() => onQuizModeChange('name_to_symbol')}
                className="w-full bg-gray-700 hover:bg-cyan-700 text-white font-semibold rounded-md py-2 px-3 text-left transition-colors"
            >
              Quiz: Name to Symbol
            </button>
            <button 
                onClick={() => onQuizModeChange('symbol_to_name')}
                className="w-full bg-gray-700 hover:bg-cyan-700 text-white font-semibold rounded-md py-2 px-3 text-left transition-colors"
            >
              Quiz: Symbol to Name
            </button>
        </div>
      </div>
    </div>
  );
};