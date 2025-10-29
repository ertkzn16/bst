// Varsayılan olarak gösterilecek BIST hisseleri
// .IS uzantısı Borsa Istanbul hisselerini temsil eder

export interface Stock {
  symbol: string;      // Hisse sembolü (örn: GARAN.IS)
  name: string;        // Hisse adı (örn: Garanti Bankası)
  description: string; // Kısa açıklama
}

// 3 popüler BIST hissesi
export const defaultStocks: Stock[] = [
  {
    symbol: 'GARAN.IS',
    name: 'Garanti BBVA',
    description: 'Türkiye Garanti Bankası A.Ş.'
  },
  {
    symbol: 'AKBNK.IS',
    name: 'Akbank',
    description: 'Akbank T.A.Ş.'
  },
  {
    symbol: 'THYAO.IS',
    name: 'Türk Hava Yolları',
    description: 'Türk Hava Yolları A.O.'
  }
];

// Hisse sembolünü formatlamak için yardımcı fonksiyon
export function formatStockSymbol(symbol: string): string {
  // Sembolü büyük harfe çevir ve .IS ekle (eğer yoksa)
  const upperSymbol = symbol.toUpperCase().trim();
  if (!upperSymbol.endsWith('.IS')) {
    return `${upperSymbol}.IS`;
  }
  return upperSymbol;
}

// Fiyat değişimini yüzde olarak hesaplama
export function calculatePriceChange(currentPrice: number, previousPrice: number): number {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

// Sayıyı para formatına çevirme (₺ işareti ile)
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Tarihi formatlamak için yardımcı fonksiyon
export function formatDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}
