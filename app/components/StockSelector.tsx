'use client';

// Kullanıcının yeni hisse eklemesini sağlayan bileşen
import React, { useState } from 'react';
import { formatStockSymbol } from '@/data/defaultStocks';

interface StockSelectorProps {
  onAddStock: (symbol: string) => void;  // Yeni hisse eklendiğinde çağrılacak fonksiyon
  loading?: boolean;                     // Yükleme durumu
}

export default function StockSelector({ onAddStock, loading = false }: StockSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  // Form submit işlemi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Boş değer kontrolü
    if (!inputValue.trim()) {
      setError('Lütfen bir hisse sembolü girin');
      return;
    }

    // Sembolü formatla (büyük harf + .IS ekle)
    const formattedSymbol = formatStockSymbol(inputValue);

    // Üst component'e bildir
    onAddStock(formattedSymbol);

    // Input'u temizle
    setInputValue('');
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Hisse Senedi Ara</h2>
        <p className="text-blue-100 text-sm">
          BIST hisse sembolü girerek analiz ekleyin (örn: ASELS, SASA, EREGL)
        </p>
      </div>

      {/* Arama formu */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ASELS, SASA, EREGL..."
            className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            disabled={loading}
          />
          {error && (
            <p className="text-red-200 text-sm mt-2">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Yükleniyor...
            </span>
          ) : (
            'Ekle'
          )}
        </button>
      </form>

      {/* Örnek semboller */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-sm text-blue-100 mb-2">Popüler hisseler:</p>
        <div className="flex flex-wrap gap-2">
          {['ASELS', 'SASA', 'EREGL', 'TUPRS', 'BIMAS', 'SAHOL'].map((symbol) => (
            <button
              key={symbol}
              onClick={() => onAddStock(formatStockSymbol(symbol))}
              disabled={loading}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
            >
              {symbol}.IS
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
