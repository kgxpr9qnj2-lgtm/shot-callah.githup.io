import React, { useEffect } from 'react';
import type { ElementData } from '../types';
import { OrbitalDiagram } from './OrbitalDiagram';

interface ElementDetailModalProps {
  element: ElementData | null;
  onClose: () => void;
}

const categoryColors: { [key: string]: string } = {
  "Nonmetal": "border-green-500",
  "Noble Gas": "border-purple-500",
  "Alkali Metal": "border-red-500",
  "Alkaline Earth Metal": "border-orange-500",
  "Metalloid": "border-teal-500",
  "Halogen": "border-blue-500",
  "Post-transition Metal": "border-indigo-500",
  "Transition Metal": "border-yellow-500",
  "Lanthanide": "border-rose-500",
  "Actinide": "border-pink-500",
  "Synthetic": "border-gray-500",
};


const DetailItem: React.FC<{ label: string; value: any; fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => (
  <div className={`py-2 ${fullWidth ? 'col-span-2 sm:col-span-3' : ''}`}>
    <dt className="text-sm font-medium text-gray-400">{label}</dt>
    <dd className="mt-1 text-md text-white break-words">{value === null || value === undefined ? 'N/A' : String(value)}</dd>
  </div>
);


export const ElementDetailModal: React.FC<ElementDetailModalProps> = ({ element, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!element) return null;

  const borderColorClass = categoryColors[element.category] || 'border-gray-500';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`relative bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-t-8 ${borderColorClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-4xl font-bold text-cyan-400">{element.name} ({element.symbol})</h2>
              <p className="text-xl text-gray-300">Atomic Number: {element.atomicNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-base text-gray-300 mb-6 bg-gray-900/50 p-4 rounded-md">{element.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Orbital Diagram</h3>
            <OrbitalDiagram configuration={element.fullElectronConfiguration} />
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
            <DetailItem label="Atomic Mass" value={`${element.atomicMass.toFixed(4)} u`} />
            <DetailItem label="Category" value={element.category} />
            <DetailItem label="Valence Electrons" value={element.valenceElectrons} />
            <DetailItem label="Group | Period" value={`${element.group} | ${element.period}`} />
            <DetailItem label="Block" value={`${element.block}-block`} />
            <DetailItem label="State at STP" value={element.stateAtSTP} />
            <DetailItem label="Melting Point" value={element.meltingPointKelvin ? `${element.meltingPointKelvin} K` : 'N/A'} />
            <DetailItem label="Boiling Point" value={element.boilingPointKelvin ? `${element.boilingPointKelvin} K` : 'N/A'} />
            <DetailItem label="Density" value={element.density_g_cm3 ? `${element.density_g_cm3} g/cm³` : 'N/A'} />
            <DetailItem label="Oxidation States" value={element.commonOxidationStates.join(', ')} />
            <DetailItem label="Noble Gas Notation" value={element.nobleGasNotation} fullWidth={true}/>
            <DetailItem label="Electron Configuration" value={element.fullElectronConfiguration} fullWidth={true}/>
          </dl>
        </div>
      </div>
    </div>
  );
};