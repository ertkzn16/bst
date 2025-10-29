'use client';

// Her bir hisse için grafik kartı bileşeni
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,
} from 'recharts';
import { StockDataPoint } from '../lib/fetchStockData';
import { formatDate, formatCurrency } from '@/data/defaultStocks';
import {
  calculateMA,
  calculateRSI,
  calculateMACD,
  IndicatorDataPoint,
  MACDDataPoint,
} from '../lib/technicalIndicators';

// Bileşen props tipi
interface ChartCardProps {
  symbol: string;                    // Hisse sembolü
  name: string;                      // Hisse adı
  data: StockDataPoint[];            // Fiyat verisi
  technicalIndicator?: 'MA' | 'RSI' | 'MACD' | null;  // Seçili teknik gösterge
}

export default function ChartCard({
  symbol,
  name,
  data,
  technicalIndicator = null,
}: ChartCardProps) {
  // Veri yoksa yükleme göster
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">{name} ({symbol})</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Veri yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Fiyat değişimini hesapla (ilk ve son fiyat)
  const firstPrice = data[0].close;
  const lastPrice = data[data.length - 1].close;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = ((priceChange / firstPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  // Grafik için veriyi hazırla
  const chartData = data.map((item) => {
    // Date objesini düzgün parse et
    const dateObj = typeof item.date === 'string' ? new Date(item.date) : item.date;

    return {
      date: formatDate(dateObj),
      timestamp: item.timestamp,
      price: item.close,
      volume: item.volume,
    };
  });

  // Teknik gösterge seçildiyse hesapla
  let technicalData: any[] = [];
  let showSecondChart = false;

  if (technicalIndicator === 'MA') {
    // Moving Average hesapla (20, 50 günlük)
    const ma20 = calculateMA(data, 20);
    const ma50 = calculateMA(data, 50);

    technicalData = chartData.map((item, index) => ({
      ...item,
      ma20: ma20[index]?.value,
      ma50: ma50[index]?.value,
    }));
  } else if (technicalIndicator === 'RSI') {
    // RSI hesapla
    const rsi = calculateRSI(data, 14);
    technicalData = chartData.map((item, index) => ({
      ...item,
      rsi: rsi[index]?.value,
    }));
    showSecondChart = true; // RSI ayrı grafikte gösterilecek
  } else if (technicalIndicator === 'MACD') {
    // MACD hesapla
    const macd = calculateMACD(data);
    technicalData = chartData.map((item, index) => ({
      ...item,
      macd: macd[index]?.macd,
      signal: macd[index]?.signal,
      histogram: macd[index]?.histogram,
    }));
    showSecondChart = true; // MACD ayrı grafikte gösterilecek
  }

  // Kullanılacak veri
  const finalData = technicalIndicator ? technicalData : chartData;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Başlık ve fiyat bilgisi */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(lastPrice)}
            </p>
            <p className={`text-sm font-semibold ${isPositive ? 'text-profit' : 'text-loss'}`}>
              {isPositive ? '+' : ''}{priceChangePercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Ana Fiyat Grafiği */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={finalData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `₺${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: any) => `₺${value?.toFixed(2) ?? 'N/A'}`}
          />
          <Legend />

          {/* Ana fiyat çizgisi */}
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            dot={false}
            name="Fiyat"
          />

          {/* MA çizgileri (eğer seçiliyse) */}
          {technicalIndicator === 'MA' && (
            <>
              <Line
                type="monotone"
                dataKey="ma20"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="MA20"
              />
              <Line
                type="monotone"
                dataKey="ma50"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="MA50"
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* RSI Grafiği (Ayrı grafik) */}
      {technicalIndicator === 'RSI' && showSecondChart && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            RSI (Relative Strength Index)
          </h4>
          <ResponsiveContainer width="100%" height={150}>
            <ComposedChart data={finalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />

              {/* Aşırı alım ve satım çizgileri */}
              <Line
                type="monotone"
                dataKey={() => 70}
                stroke="#ef4444"
                strokeDasharray="5 5"
                dot={false}
                name="Aşırı Alım (70)"
              />
              <Line
                type="monotone"
                dataKey={() => 30}
                stroke="#10b981"
                strokeDasharray="5 5"
                dot={false}
                name="Aşırı Satım (30)"
              />

              {/* RSI çizgisi */}
              <Line
                type="monotone"
                dataKey="rsi"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="RSI"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* MACD Grafiği (Ayrı grafik) */}
      {technicalIndicator === 'MACD' && showSecondChart && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            MACD (Moving Average Convergence Divergence)
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={finalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />

              {/* Histogram (çubuk grafik) */}
              <Bar
                dataKey="histogram"
                fill="#94a3b8"
                name="Histogram"
                opacity={0.5}
              />

              {/* MACD ve Signal çizgileri */}
              <Line
                type="monotone"
                dataKey="macd"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="MACD"
              />
              <Line
                type="monotone"
                dataKey="signal"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                name="Signal"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
