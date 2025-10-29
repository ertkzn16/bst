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
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Arama formu */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Hisse sembolü girin (örn: ASELS, SASA)"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            disabled={loading}
          />
          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Ekleniyor
            </span>
          ) : (
            'Ekle'
          )}
        </button>
      </form>

      {/* Örnek semboller */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Hızlı ekle:</p>
        <div className="flex flex-wrap gap-2">
          {['ASELS', 'SASA', 'EREGL', 'TUPRS', 'BIMAS', 'SAHOL'].map((symbol) => (
            <button
              key={symbol}
              onClick={() => onAddStock(formatStockSymbol(symbol))}
              disabled={loading}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
