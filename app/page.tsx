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
    <div className="container mx-auto px-4 py-8">
      {/* Başlık Bölümü */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Hoş Geldiniz 👋
        </h2>
        <p className="text-gray-600">
          BIST hisse senetlerini takip edin, teknik analiz yapın ve grafik verilerini görselleştirin
        </p>
      </div>

      {/* Hisse Arama Bölümü */}
      <div className="mb-8">
        <StockSelector onAddStock={handleAddStock} loading={isAddingStock} />
      </div>

      {/* Teknik Analiz Menüsü */}
      <div className="mb-8">
        <TechnicalMenu
          selectedIndicator={technicalIndicator}
          onSelect={setTechnicalIndicator}
        />
      </div>

      {/* Hisse Grafikleri */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Hisse Grafikleri
          </h3>
          <p className="text-sm text-gray-500">
            {stocks.length} hisse gösteriliyor
          </p>
        </div>

        {/* Grafik Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="relative">
              {/* Silme butonu */}
              {stocks.length > 1 && (
                <button
                  onClick={() => handleRemoveStock(stock.symbol)}
                  className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
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
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-4">{stock.name} ({stock.symbol})</h3>
                  <div className="text-center py-12">
                    <p className="text-red-500 mb-2">❌ {stock.error}</p>
                    <button
                      onClick={() => handleRemoveStock(stock.symbol)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ) : (
                // Grafik kartı
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

        {/* Hisse yoksa mesaj */}
        {stocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Henüz hisse eklenmedi. Yukarıdaki arama kutusunu kullanarak hisse ekleyebilirsiniz.
            </p>
          </div>
        )}
      </div>

      {/* Bilgilendirme Bölümü */}
      <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="font-bold text-gray-900 mb-2">ℹ️ Bilgilendirme</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Veriler Yahoo Finance API&apos;den gerçek zamanlı olarak çekilmektedir</li>
          <li>• Varsayılan olarak son 2 yıllık günlük veriler gösterilir</li>
          <li>• Teknik analiz göstergeleri otomatik olarak hesaplanır</li>
          <li>• Bu uygulama sadece eğitim amaçlıdır, yatırım tavsiyesi değildir</li>
        </ul>
      </div>
    </div>
  );
}
