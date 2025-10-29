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
    name: 'Sadece Fiyat',
    description: 'Sadece fiyat grafiğini göster',
    icon: '📈',
    color: 'bg-gray-500',
  },
  {
    id: 'MA' as const,
    name: 'Moving Average',
    description: 'Hareketli ortalama (20 ve 50 günlük)',
    icon: '📊',
    color: 'bg-blue-500',
    info: 'MA, belirli periyottaki fiyat ortalamalarını gösterir. Trend yönünü belirlemek için kullanılır.',
  },
  {
    id: 'RSI' as const,
    name: 'RSI',
    description: 'Relative Strength Index (0-100)',
    icon: '⚡',
    color: 'bg-purple-500',
    info: 'RSI, fiyat momentumunu ölçer. 70 üzeri aşırı alım, 30 altı aşırı satım bölgesi.',
  },
  {
    id: 'MACD' as const,
    name: 'MACD',
    description: 'Moving Average Convergence Divergence',
    icon: '📉',
    color: 'bg-green-500',
    info: 'MACD, trend yönünü ve gücünü gösterir. MACD signal çizgisini kestiğinde al/sat sinyali verir.',
  },
];

export default function TechnicalMenu({ selectedIndicator, onSelect }: TechnicalMenuProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Teknik Analiz Göstergeleri
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        Grafiklere teknik analiz göstergesi eklemek için bir seçenek seçin
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((indicator) => {
          const isSelected = selectedIndicator === indicator.id;

          return (
            <button
              key={indicator.id || 'none'}
              onClick={() => onSelect(indicator.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              {/* Seçili işareti */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* İkon */}
              <div className="text-4xl mb-2">{indicator.icon}</div>

              {/* Başlık */}
              <h3 className="font-bold text-gray-900 mb-1">
                {indicator.name}
              </h3>

              {/* Açıklama */}
              <p className="text-xs text-gray-600 mb-2">
                {indicator.description}
              </p>

              {/* Detaylı bilgi (varsa) */}
              {indicator.info && (
                <p className="text-xs text-gray-500 italic mt-2 pt-2 border-t border-gray-200">
                  {indicator.info}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Seçili gösterge bilgisi */}
      {selectedIndicator && (
        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Aktif Gösterge:</span>{' '}
            {indicators.find((i) => i.id === selectedIndicator)?.name}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Tüm grafiklere bu gösterge uygulanmıştır.
          </p>
        </div>
      )}
    </div>
  );
}
