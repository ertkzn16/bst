'use client';

// Ana sayfa - Hisse grafiklerini ve analiz araçlarını gösterir
import React, { useState, useEffect } from 'react';
import ChartCard from './components/ChartCard';
import StockSelector from './components/StockSelector';
import TechnicalMenu, { TechnicalIndicatorType } from './components/TechnicalMenu';
import { defaultStocks } from '@/data/defaultStocks';
import { StockDataPoint } from './lib/fetchStockData';

// Her hisse için state tipi
interface StockState {
  symbol: string;
  name: string;
  data: StockDataPoint[];
  loading: boolean;
  error: string | null;
}

export default function HomePage() {
  // State tanımlamaları
  const [stocks, setStocks] = useState<StockState[]>([]);
  const [technicalIndicator, setTechnicalIndicator] = useState<TechnicalIndicatorType>(null);
  const [isAddingStock, setIsAddingStock] = useState(false);

  // Component ilk yüklendiğinde varsayılan hisseleri çek
  useEffect(() => {
    loadDefaultStocks();
  }, []);

  /**
   * Varsayılan 3 hisseyi yükle
   */
  const loadDefaultStocks = async () => {
    const initialStocks: StockState[] = defaultStocks.map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      data: [],
      loading: true,
      error: null,
    }));

    setStocks(initialStocks);

    // Her hisse için paralel veri çekimi - API route kullan
    for (const stock of defaultStocks) {
      try {
        const response = await fetch(`/api/stock?symbol=${stock.symbol}&period=2y`);
        if (!response.ok) {
          throw new Error('API hatası');
        }
        const data: StockDataPoint[] = await response.json();

        setStocks((prev) =>
          prev.map((s) =>
            s.symbol === stock.symbol
              ? { ...s, data, loading: false }
              : s
          )
        );
      } catch (error) {
        console.error(`Error loading ${stock.symbol}:`, error);
        setStocks((prev) =>
          prev.map((s) =>
            s.symbol === stock.symbol
              ? { ...s, loading: false, error: 'Veri yüklenemedi' }
              : s
          )
        );
      }
    }
  };

  /**
   * Kullanıcı yeni hisse eklediğinde çağrılır
   */
  const handleAddStock = async (symbol: string) => {
    // Aynı hisse zaten var mı kontrol et
    if (stocks.some((s) => s.symbol === symbol)) {
      alert(`${symbol} zaten ekli!`);
      return;
    }

    setIsAddingStock(true);

    // Yeni hisse state'i ekle
    const newStock: StockState = {
      symbol,
      name: symbol,
      data: [],
      loading: true,
      error: null,
    };

    setStocks((prev) => [...prev, newStock]);

    // Veriyi çek - API route kullan
    try {
      const response = await fetch(`/api/stock?symbol=${symbol}&period=2y`);
      if (!response.ok) {
        throw new Error('API hatası');
      }
      const data: StockDataPoint[] = await response.json();

      setStocks((prev) =>
        prev.map((s) =>
          s.symbol === symbol
            ? { ...s, data, loading: false }
            : s
        )
      );
    } catch (error: any) {
      console.error(`Error adding ${symbol}:`, error);
      setStocks((prev) =>
        prev.map((s) =>
          s.symbol === symbol
            ? { ...s, loading: false, error: error.message || 'Veri yüklenemedi' }
            : s
        )
      );
    } finally {
      setIsAddingStock(false);
    }
  };

  /**
   * Hisse silme
   */
  const handleRemoveStock = (symbol: string) => {
    setStocks((prev) => prev.filter((s) => s.symbol !== symbol));
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      {/* Hisse Arama - Minimalist */}
      <div className="mb-12">
        <StockSelector onAddStock={handleAddStock} loading={isAddingStock} />
      </div>

      {/* Teknik Analiz */}
      <div className="mb-12">
        <TechnicalMenu
          selectedIndicator={technicalIndicator}
          onSelect={setTechnicalIndicator}
        />
      </div>

      {/* Grafik Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="relative">
            {/* Silme butonu - Minimalist */}
            {stocks.length > 1 && (
              <button
                onClick={() => handleRemoveStock(stock.symbol)}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-red-500 transition-colors"
                title="Kaldır"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Hata durumu */}
            {stock.error ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="text-lg font-medium mb-3">{stock.name}</h3>
                <div className="text-center py-8">
                  <p className="text-sm text-red-500 mb-3">{stock.error}</p>
                  <button
                    onClick={() => handleRemoveStock(stock.symbol)}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            ) : (
              <ChartCard
                symbol={stock.symbol}
                name={stock.name}
                data={stock.data}
                technicalIndicator={technicalIndicator}
              />
            )}
          </div>
        ))}
      </div>

      {/* Boş durum */}
      {stocks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-sm text-gray-400">
            Hisse eklemek için yukarıdaki arama kutusunu kullanın
          </p>
        </div>
      )}
    </div>
  );
}
