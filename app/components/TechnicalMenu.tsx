'use client';

// Teknik analiz göstergeleri için menü bileşeni
import React from 'react';

// Mevcut teknik göstergeler
export type TechnicalIndicatorType = 'MA' | 'RSI' | 'MACD' | null;

interface TechnicalMenuProps {
  selectedIndicator: TechnicalIndicatorType;
  onSelect: (indicator: TechnicalIndicatorType) => void;
}

// Gösterge bilgileri
const indicators = [
  {
    id: null,
    name: 'Fiyat',
    description: 'Sadece fiyat grafiği',
  },
  {
    id: 'MA' as const,
    name: 'MA',
    description: 'Hareketli ortalama',
  },
  {
    id: 'RSI' as const,
    name: 'RSI',
    description: 'Momentum göstergesi',
  },
  {
    id: 'MACD' as const,
    name: 'MACD',
    description: 'Trend göstergesi',
  },
];

export default function TechnicalMenu({ selectedIndicator, onSelect }: TechnicalMenuProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Teknik Gösterge</h3>

      <div className="flex flex-wrap gap-2">
        {indicators.map((indicator) => {
          const isSelected = selectedIndicator === indicator.id;

          return (
            <button
              key={indicator.id || 'none'}
              onClick={() => onSelect(indicator.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {indicator.name}
            </button>
          );
        })}
      </div>

      {selectedIndicator && (
        <p className="text-xs text-gray-500 mt-3">
          {indicators.find((i) => i.id === selectedIndicator)?.description}
        </p>
      )}
    </div>
  );
}
