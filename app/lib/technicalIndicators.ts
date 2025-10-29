// Teknik analiz göstergelerini hesaplayan fonksiyonlar
import { StockDataPoint } from './fetchStockData';

// Teknik gösterge veri noktası tipi
export interface IndicatorDataPoint {
  date: Date;
  value: number | null;
}

// MACD için özel tip (3 çizgi var)
export interface MACDDataPoint {
  date: Date;
  macd: number | null;       // MACD çizgisi
  signal: number | null;     // Sinyal çizgisi
  histogram: number | null;  // Histogram (MACD - Signal)
}

/**
 * MOVING AVERAGE (Hareketli Ortalama) hesaplama
 * MA, belirli bir periyottaki fiyatların ortalamasıdır
 * Trend yönünü belirlemek için kullanılır
 *
 * @param data - Hisse verisi
 * @param period - Periyot (örn: 20 günlük MA için 20)
 * @returns MA değerleri
 */
export function calculateMA(
  data: StockDataPoint[],
  period: number = 20
): IndicatorDataPoint[] {
  const result: IndicatorDataPoint[] = [];

  // Her veri noktası için hesaplama yap
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      // Yeterli veri yoksa null döndür
      result.push({
        date: data[i].date,
        value: null,
      });
    } else {
      // Son 'period' günün kapanış fiyatlarının ortalamasını al
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      const average = sum / period;

      result.push({
        date: data[i].date,
        value: average,
      });
    }
  }

  return result;
}

/**
 * RELATIVE STRENGTH INDEX (Göreceli Güç Endeksi) hesaplama
 * RSI, fiyat momentumunu ölçer (0-100 arası)
 * 70 üzeri: Aşırı alım bölgesi
 * 30 altı: Aşırı satım bölgesi
 *
 * @param data - Hisse verisi
 * @param period - Periyot (varsayılan: 14)
 * @returns RSI değerleri
 */
export function calculateRSI(
  data: StockDataPoint[],
  period: number = 14
): IndicatorDataPoint[] {
  const result: IndicatorDataPoint[] = [];

  // İlk periyot için yeterli veri olmadığında null dön
  for (let i = 0; i < period; i++) {
    result.push({
      date: data[i].date,
      value: null,
    });
  }

  // Kazanç ve kayıpları hesapla
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  // İlk ortalama kazanç ve kayıp
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  // İlk RSI değerini hesapla
  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  let rsi = 100 - 100 / (1 + rs);

  result.push({
    date: data[period].date,
    value: rsi,
  });

  // Kalan değerler için smoothed RSI hesapla
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi = 100 - 100 / (1 + rs);

    result.push({
      date: data[i + 1].date,
      value: rsi,
    });
  }

  return result;
}

/**
 * Exponential Moving Average (Üssel Hareketli Ortalama) hesaplama
 * MACD hesaplamasında kullanılır
 *
 * @param data - Hisse verisi
 * @param period - Periyot
 * @returns EMA değerleri
 */
function calculateEMA(data: StockDataPoint[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);

  // İlk EMA değeri = SMA (Simple Moving Average)
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  ema.push(sum / period);

  // Sonraki EMA değerleri
  for (let i = period; i < data.length; i++) {
    const value = (data[i].close - ema[ema.length - 1]) * multiplier + ema[ema.length - 1];
    ema.push(value);
  }

  return ema;
}

/**
 * MACD (Moving Average Convergence Divergence) hesaplama
 * MACD = 12 günlük EMA - 26 günlük EMA
 * Signal = MACD'nin 9 günlük EMA'sı
 * Histogram = MACD - Signal
 *
 * Kullanımı:
 * - MACD signal'ı yukarı keserse: AL sinyali
 * - MACD signal'ı aşağı keserse: SAT sinyali
 *
 * @param data - Hisse verisi
 * @returns MACD, Signal ve Histogram değerleri
 */
export function calculateMACD(data: StockDataPoint[]): MACDDataPoint[] {
  const shortPeriod = 12;
  const longPeriod = 26;
  const signalPeriod = 9;

  // 12 ve 26 günlük EMA'ları hesapla
  const ema12 = calculateEMA(data, shortPeriod);
  const ema26 = calculateEMA(data, longPeriod);

  // MACD çizgisi = EMA12 - EMA26
  const macdLine: number[] = [];
  for (let i = 0; i < ema26.length; i++) {
    macdLine.push(ema12[i + (ema12.length - ema26.length)] - ema26[i]);
  }

  // MACD'nin 9 günlük EMA'sını hesapla (Signal Line)
  const signalLine: number[] = [];
  const multiplier = 2 / (signalPeriod + 1);

  // İlk signal değeri
  let sum = 0;
  for (let i = 0; i < signalPeriod && i < macdLine.length; i++) {
    sum += macdLine[i];
  }
  signalLine.push(sum / signalPeriod);

  // Sonraki signal değerleri
  for (let i = signalPeriod; i < macdLine.length; i++) {
    const value = (macdLine[i] - signalLine[signalLine.length - 1]) * multiplier + signalLine[signalLine.length - 1];
    signalLine.push(value);
  }

  // Sonuçları birleştir
  const result: MACDDataPoint[] = [];
  const startIndex = longPeriod - 1;

  for (let i = 0; i < data.length; i++) {
    if (i < startIndex) {
      // Yeterli veri yoksa null
      result.push({
        date: data[i].date,
        macd: null,
        signal: null,
        histogram: null,
      });
    } else {
      const macdIndex = i - startIndex;
      const signalIndex = macdIndex - (signalPeriod - 1);

      result.push({
        date: data[i].date,
        macd: macdLine[macdIndex] ?? null,
        signal: signalIndex >= 0 ? signalLine[signalIndex] : null,
        histogram:
          signalIndex >= 0
            ? macdLine[macdIndex] - signalLine[signalIndex]
            : null,
      });
    }
  }

  return result;
}

/**
 * Birden fazla MA çizgisi hesapla (kısa, orta, uzun vadeli)
 * Örnek: 20, 50, 200 günlük MA'lar
 */
export function calculateMultipleMA(data: StockDataPoint[]): {
  ma20: IndicatorDataPoint[];
  ma50: IndicatorDataPoint[];
  ma200: IndicatorDataPoint[];
} {
  return {
    ma20: calculateMA(data, 20),
    ma50: calculateMA(data, 50),
    ma200: calculateMA(data, 200),
  };
}
