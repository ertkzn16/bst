// Yahoo Finance API'den hisse senedi verilerini çeken fonksiyonlar
// Doğrudan fetch API kullanarak (yahoo-finance2 yerine)

// Hisse verisi için tip tanımı
export interface StockDataPoint {
  date: Date;           // Tarih
  timestamp: number;    // Unix timestamp
  open: number;         // Açılış fiyatı
  high: number;         // Gün içi en yüksek
  low: number;          // Gün içi en düşük
  close: number;        // Kapanış fiyatı
  volume: number;       // İşlem hacmi
}

/**
 * Yahoo Finance API'den hisse senedi verilerini çeker
 * @param symbol - Hisse sembolü (örn: GARAN.IS)
 * @param period - Veri çekilecek zaman aralığı (varsayılan: 2y = 2 yıl)
 * @returns Promise ile StockDataPoint dizisi döner
 */
export async function fetchStockData(
  symbol: string,
  period: '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' = '2y'
): Promise<StockDataPoint[]> {
  try {
    console.log(`Fetching data for ${symbol} with period ${period}...`);

    // Periyodu timestamp'e çevir
    const now = Math.floor(Date.now() / 1000);
    const periodSeconds = getPeriodInSeconds(period);
    const period1 = now - periodSeconds;
    const period2 = now;

    // Yahoo Finance Chart API
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=1d`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // API yanıtını kontrol et
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      throw new Error('Veri bulunamadı');
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    // Veriyi işle ve dönüştür
    const stockData: StockDataPoint[] = timestamps.map((timestamp: number, index: number) => ({
      date: new Date(timestamp * 1000),
      timestamp: timestamp * 1000,
      open: quotes.open[index] || 0,
      high: quotes.high[index] || 0,
      low: quotes.low[index] || 0,
      close: quotes.close[index] || 0,
      volume: quotes.volume[index] || 0,
    })).filter((point: StockDataPoint) =>
      point.open > 0 && point.close > 0 // Geçersiz verileri filtrele
    );

    console.log(`Successfully fetched ${stockData.length} data points for ${symbol}`);
    return stockData;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw new Error(`${symbol} için veri çekilemedi. Sembol doğru mu kontrol edin.`);
  }
}

/**
 * Period string'ini saniyeye çevirir
 * @param period - Zaman aralığı string'i
 * @returns Saniye cinsinden süre
 */
function getPeriodInSeconds(period: string): number {
  const day = 24 * 60 * 60;

  switch (period) {
    case '1mo':
      return 30 * day;
    case '3mo':
      return 90 * day;
    case '6mo':
      return 180 * day;
    case '1y':
      return 365 * day;
    case '2y':
      return 730 * day;
    case '5y':
      return 1825 * day;
    default:
      return 730 * day;
  }
}

/**
 * Hisse senedinin mevcut fiyat bilgisini çeker (quote)
 * @param symbol - Hisse sembolü
 * @returns Mevcut fiyat bilgileri
 */
export async function fetchCurrentQuote(symbol: string) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.chart.result[0];
    const meta = result.meta;

    return {
      symbol: meta.symbol,
      regularMarketPrice: meta.regularMarketPrice ?? 0,
      regularMarketChange: meta.regularMarketPrice - meta.previousClose ?? 0,
      regularMarketChangePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100) ?? 0,
      regularMarketDayHigh: meta.regularMarketDayHigh ?? 0,
      regularMarketDayLow: meta.regularMarketDayLow ?? 0,
      regularMarketVolume: meta.regularMarketVolume ?? 0,
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Birden fazla hisse için veri çeker (paralel)
 * @param symbols - Hisse sembolleri dizisi
 * @param period - Zaman aralığı
 * @returns Her hisse için veri içeren obje
 */
export async function fetchMultipleStocks(
  symbols: string[],
  period: '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' = '2y'
): Promise<Record<string, StockDataPoint[]>> {
  try {
    // Tüm hisseleri paralel olarak çek
    const promises = symbols.map(async (symbol) => {
      const data = await fetchStockData(symbol, period);
      return { symbol, data };
    });

    const results = await Promise.all(promises);

    // Sonuçları obje formatına çevir
    const stockDataMap: Record<string, StockDataPoint[]> = {};
    results.forEach(({ symbol, data }) => {
      stockDataMap[symbol] = data;
    });

    return stockDataMap;
  } catch (error) {
    console.error('Error fetching multiple stocks:', error);
    throw error;
  }
}
