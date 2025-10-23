import React from 'react';

interface OrbitalDiagramProps {
  configuration: string;
}

interface Orbital {
  level: number;
  type: 's' | 'p' | 'd' | 'f';
  electrons: number;
}

const parseFullConfiguration = (config: string): Orbital[] => {
  const orbitals: Orbital[] = [];
  const orbitalRegex = /(\d+)([spdf])(\d+)/g;
  let match;
  while ((match = orbitalRegex.exec(config)) !== null) {
    orbitals.push({
      level: parseInt(match[1], 10),
      type: match[2] as 's' | 'p' | 'd' | 'f',
      electrons: parseInt(match[3], 10)
    });
  }
  return orbitals;
};

const orbitalBoxCounts = { s: 1, p: 3, d: 5, f: 7 };

const getArrowsForOrbital = (type: 's' | 'p' | 'd' | 'f', electrons: number): string[] => {
  const numBoxes = orbitalBoxCounts[type];
  const arrows = Array(numBoxes).fill('');

  // Fill singly first (Hund's rule)
  for (let i = 0; i < numBoxes && i < electrons; i++) {
    arrows[i] = '↑';
  }

  // Pair up
  if (electrons > numBoxes) {
      const pairedElectrons = electrons - numBoxes;
      for (let i = 0; i < pairedElectrons; i++) {
        arrows[i] = '↑↓';
      }
  }

  return arrows;
};


export const OrbitalDiagram: React.FC<OrbitalDiagramProps> = ({ configuration }) => {
  const orbitals = parseFullConfiguration(configuration);

  if (orbitals.length === 0) {
    return <div className="text-gray-400">Diagram not available.</div>;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-gray-900/50 p-3 rounded-md">
      {orbitals.map((orbital, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-lg font-mono text-gray-300 w-10 text-right">{`${orbital.level}${orbital.type}`}</span>
          <div className="flex space-x-px">
            {getArrowsForOrbital(orbital.type, orbital.electrons).map((arrow, i) => (
              <div
                key={i}
                className="w-8 h-8 border border-gray-600 flex items-center justify-center text-yellow-400 font-semibold text-lg"
                aria-label={`orbital ${orbital.level}${orbital.type} box ${i+1} with ${arrow === '↑' ? '1 up spin electron' : arrow === '↑↓' ? '2 electrons, one up spin, one down spin' : '0 electrons'}`}
              >
                {arrow}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};