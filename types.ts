
export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  nobleGasNotation: string;
  fullElectronConfiguration: string;
  group: number | string;
  period: number;
  block: 's' | 'p' | 'd' | 'f';
  category: string;
  stateAtSTP: 'Solid' | 'Liquid' | 'Gas' | 'Synthetic';
  meltingPointKelvin: number | null;
  boilingPointKelvin: number | null;
  density_g_cm3: number | null;
  commonOxidationStates: number[];
  valenceElectrons: number;
  description: string;
}

export interface LabelDefinitions {
  [key: string]: string;
}

export interface ElementGrouping {
  description: string;
  elements: string[];
}

export interface ElementGroupings {
  [key: string]: ElementGrouping;
}

export interface HighlightSelection {
  include: Set<string>;
  exclude: Set<string>;
}