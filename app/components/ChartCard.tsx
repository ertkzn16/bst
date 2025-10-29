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
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">{name}</h3>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400">Yükleniyor...</p>
          </div>
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
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all">
      {/* Başlık ve fiyat bilgisi */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(lastPrice)}
            </p>
            <p className={`text-xs font-medium mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{priceChangePercent}%
            </p>
          </div>
        </div>
      </div>

      {/* Ana Fiyat Grafiği */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={finalData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            interval="preserveStartEnd"
            axisLine={{ stroke: '#e5e5e5' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `₺${value.toFixed(0)}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            formatter={(value: any) => `₺${value?.toFixed(2) ?? 'N/A'}`}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />

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
                strokeWidth={1.5}
                dot={false}
                name="MA20"
              />
              <Line
                type="monotone"
                dataKey="ma50"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={false}
                name="MA50"
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* RSI Grafiği (Ayrı grafik) */}
      {technicalIndicator === 'RSI' && showSecondChart && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
            RSI
          </h4>
          <ResponsiveContainer width="100%" height={120}>
            <ComposedChart data={finalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={{ stroke: '#e5e5e5' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              />

              {/* Aşırı alım ve satım çizgileri */}
              <Line
                type="monotone"
                dataKey={() => 70}
                stroke="#fca5a5"
                strokeDasharray="3 3"
                strokeWidth={1}
                dot={false}
                name="Aşırı Alım"
              />
              <Line
                type="monotone"
                dataKey={() => 30}
                stroke="#86efac"
                strokeDasharray="3 3"
                strokeWidth={1}
                dot={false}
                name="Aşırı Satım"
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
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
            MACD
          </h4>
          <ResponsiveContainer width="100%" height={150}>
            <ComposedChart data={finalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={{ stroke: '#e5e5e5' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="line"
              />

              {/* Histogram (çubuk grafik) */}
              <Bar
                dataKey="histogram"
                fill="#cbd5e1"
                name="Histogram"
                opacity={0.6}
              />

              {/* MACD ve Signal çizgileri */}
              <Line
                type="monotone"
                dataKey="macd"
                stroke="#3b82f6"
                strokeWidth={1.5}
                dot={false}
                name="MACD"
              />
              <Line
                type="monotone"
                dataKey="signal"
                stroke="#ef4444"
                strokeWidth={1.5}
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
