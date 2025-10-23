import React from 'react';

interface PlaceholderTileProps {
  label: string;
  series: 'lanthanide' | 'actinide';
}

const seriesColors: { [key: string]: string } = {
    lanthanide: 'bg-rose-900/80 text-rose-300',
    actinide: 'bg-pink-900/80 text-pink-300',
};


export const PlaceholderTile: React.FC<PlaceholderTileProps> = ({ label, series }) => {
  const colorClass = seriesColors[series];

  return (
    <div
      className={`relative p-1 w-full h-full rounded-md shadow-md flex items-center justify-center text-center text-[11px] font-semibold ${colorClass}`}
    >
      <div>{label}</div>
    </div>
  );
};