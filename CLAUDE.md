# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📈 BIST Borsa Analiz Uygulaması

Next.js ile geliştirilmiş, gerçek zamanlı hisse senedi takip ve teknik analiz platformu.

### Proje Hakkında

Bu proje, Borsa İstanbul (BIST) hisse senetlerini takip etmek, grafiklerle görselleştirmek ve teknik analiz yapmak için geliştirilmiş bir web uygulamasıdır. **Eğitim amaçlı** hazırlanmıştır ve modern web geliştirme konseptlerini öğretmek için tasarlanmıştır.

### Özellikler

- **Gerçek Zamanlı Veri:** Yahoo Finance API kullanarak canlı hisse verileri
- **Varsayılan Hisseler:** GARAN.IS, AKBNK.IS, THYAO.IS otomatik yüklenir
- **Dinamik Hisse Ekleme:** Kullanıcı istediği BIST hissesini arayabilir
- **Teknik Analiz Araçları:**
  - Moving Average (MA) - 20 ve 50 günlük
  - Relative Strength Index (RSI) - 14 günlük
  - MACD (Moving Average Convergence Divergence)
- **Responsive Tasarım:** Mobil, tablet ve desktop uyumlu
- **Grafik Görselleştirme:** Recharts kütüphanesi ile interaktif grafikler

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Komutlar

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (http://localhost:3000)
npm run dev

# Production build
npm run build
npm start

# Lint çalıştır
npm run lint

# Build cache'i temizle (sorun yaşandığında)
rm -rf .next && npm run dev
```

---

## 🗂️ Proje Yapısı

```
claude_test/
│
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── stock/
│   │       └── route.ts          # Yahoo Finance API proxy (server-side)
│   │
│   ├── components/               # React bileşenleri (tümü 'use client')
│   │   ├── ChartCard.tsx        # Grafik kartı + teknik göstergeler
│   │   ├── StockSelector.tsx    # Hisse arama/ekleme formu
│   │   └── TechnicalMenu.tsx    # Teknik analiz seçici
│   │
│   ├── lib/                      # Yardımcı fonksiyonlar
│   │   ├── fetchStockData.ts    # Yahoo Finance fetch (API route'da kullanılır)
│   │   └── technicalIndicators.ts # MA, RSI, MACD hesaplamaları
│   │
│   ├── layout.tsx                # Root layout (header/footer)
│   ├── page.tsx                  # Ana sayfa (state management)
│   └── globals.css               # Tailwind + custom styles
│
├── data/
│   └── defaultStocks.ts          # Varsayılan hisseler + formatters
│
├── public/                       # Statik dosyalar
│
├── tailwind.config.ts            # Tailwind v4 config
├── postcss.config.mjs            # PostCSS (@tailwindcss/postcss)
├── tsconfig.json                 # TypeScript config
└── next.config.ts                # Next.js config
```

---

## 🏗️ Mimari ve Veri Akışı

### Data Flow

1. **Browser (Client)** → `fetch('/api/stock?symbol=GARAN.IS&period=2y')`
2. **API Route** (`app/api/stock/route.ts`) → Server-side Yahoo Finance fetch
3. **Yahoo Finance API** → `https://query1.finance.yahoo.com/v8/finance/chart/{symbol}`
4. **API Route** → JSON response to client
5. **Client** (`page.tsx`) → State update + render `ChartCard` components
6. **ChartCard** → Recharts visualization + optional technical indicators

### Kritik Teknik Kararlar

#### ⚠️ Yahoo Finance Entegrasyonu

**ÖNEMLİ:** `yahoo-finance2` npm paketini **client component'lerde kullanmayın!**

- Turbopack ile uyumsuzluk nedeniyle module resolution hataları oluşur
- Çözüm: Doğrudan `fetch()` kullanarak Yahoo Finance REST API'ye istek at
- Tüm Yahoo Finance çağrıları `app/api/stock/route.ts` üzerinden server-side yapılır
- Client'tan kullanım: `fetch('/api/stock?symbol=...')`

**API Endpoint:**
```
https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?period1={start}&period2={end}&interval=1d
```

#### 📅 Tarih Yönetimi (Date Handling)

**Kritik Sorun:** API route'lar üzerinden geçen Date objeleri JSON serialization'da ISO string'e dönüşür.

**Çözüm:**
```typescript
// API'den gelen veriyi client'ta parse et
const dateObj = typeof item.date === 'string' ? new Date(item.date) : item.date;
```

**Yahoo Finance tarihleri:**
- Unix timestamp olarak gelir: `1698768000`
- JavaScript Date'e çevirme: `new Date(timestamp * 1000)`
- Örnek: `app/components/ChartCard.tsx:64`

#### 🎨 Styling (Tailwind CSS)

- **Tailwind CSS v4** kullanılıyor
- `postcss.config.mjs` içinde `@tailwindcss/postcss` plugin'i kullanılmalı
- Eski `tailwindcss` plugin'i **ÇALIŞMAZ** (hata verir)
- Custom renkler: `profit` (yeşil), `loss` (kırmızı)

---

## 🧮 Teknik Analiz Hesaplamaları

Tüm hesaplamalar `app/lib/technicalIndicators.ts` içinde client-side yapılır (harici kütüphane yok).

### Moving Average (MA)

```typescript
// 20 günlük basit hareketli ortalama
const ma20 = calculateMA(data, 20);
```

- Algoritma: Son N günün fiyat ortalaması
- Kullanım: Trend yönünü gösterir
- Grafik: Mavi (MA20), Turuncu (MA50)

### RSI (Relative Strength Index)

```typescript
// 14 günlük RSI (0-100 arası)
const rsi = calculateRSI(data, 14);
```

- Algoritma: Kazanç/kayıp oranı → smoothed EMA
- **70 üzeri:** Aşırı alım (overbought) - SAT sinyali
- **30 altı:** Aşırı satım (oversold) - AL sinyali
- Ayrı grafikte gösterilir (alt panel)

### MACD

```typescript
const macd = calculateMACD(data);
// Returns: { macd, signal, histogram }
```

- MACD Line: 12-day EMA - 26-day EMA
- Signal Line: MACD'nin 9-day EMA'sı
- Histogram: MACD - Signal
- **AL sinyali:** MACD signal'ı yukarı keserse
- **SAT sinyali:** MACD signal'ı aşağı keserse

---

## 🧩 Component Yapısı

### State Management

**Tüm state `page.tsx` içinde React hooks ile yönetilir** (harici state library yok).

```typescript
// page.tsx içindeki ana state
const [stocks, setStocks] = useState<StockState[]>([]);
const [technicalIndicator, setTechnicalIndicator] = useState<TechnicalIndicatorType>(null);
```

### Component Hiyerarşisi

```
page.tsx
├── StockSelector
│   └── (form + quick add buttons)
│
├── TechnicalMenu
│   └── (4 seçenek: None, MA, RSI, MACD)
│
└── ChartCard[] (her hisse için)
    ├── LineChart (fiyat)
    ├── MA lines (seçiliyse)
    └── Second Chart (RSI/MACD için)
```

### Yeni Teknik Gösterge Ekleme

1. **Hesaplama:** `app/lib/technicalIndicators.ts` içine fonksiyon ekle
2. **Menü:** `TechnicalMenu.tsx` indicators array'ine ekle
3. **Görselleştirme:** `ChartCard.tsx` içinde switch case ekle
4. **Recharts:** Uygun grafik tipi seç (Line/Bar/ComposedChart)

---

## 📚 Kullanılan Teknolojiler

- **Next.js 16** - App Router + Turbopack
- **React 19** - Client components
- **TypeScript 5.9** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **Recharts 3.3** - Chart library
- **Yahoo Finance API** - Stock data (direct fetch, no npm package)
- **date-fns 4.1** - Date utilities

---

## 🧪 Test Senaryoları

### Popüler BIST Hisseleri

Test için kullanabileceğiniz semboller:
- `ASELS.IS` (Aselsan)
- `SASA.IS` (Sasa Polyester)
- `EREGL.IS` (Ereğli Demir Çelik)
- `TUPRS.IS` (Tüpraş)
- `BIMAS.IS` (BİM)
- `SAHOL.IS` (Sabancı Holding)

### Kullanım Adımları

1. Varsayılan 3 hisse otomatik yüklenir
2. Yeni hisse eklemek için sembol gir (otomatik `.IS` eklenir)
3. Teknik analiz menüsünden gösterge seç
4. Grafiklerdeki değişimi gözlemle
5. Hisse kartlarındaki ❌ ile silme

---

## 🐛 Yaygın Sorunlar ve Çözümler

### "Invalid time value" RangeError

**Sebep:** Date objesi JSON serialization'dan string olarak geliyor.

**Çözüm:**
```typescript
const dateObj = typeof item.date === 'string' ? new Date(item.date) : item.date;
formatDate(dateObj);
```

### "Module not found: yahoo-finance2"

**Sebep:** Client component'te import edilmeye çalışılıyor.

**Çözüm:**
- Client'tan `fetch('/api/stock?...')` kullan
- Yahoo Finance çağrıları sadece API route'ta

### Tailwind Stilleri Yüklenmiyor

**Sebep:** Eski `tailwindcss` PostCSS plugin'i kullanılıyor.

**Çözüm:**
```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### Grafikler Render Olmuyor

**Kontrol listesi:**
1. Browser console'da Recharts hatası var mı?
2. `StockDataPoint[]` array'i boş mu?
3. Date parse düzgün çalışıyor mu?
4. `npm install` yapıldı mı?

### "Veri çekilemedi" API Hatası

**Olası sebepler:**
- İnternet bağlantısı yok
- Hisse sembolü yanlış (`.IS` uzantısı eksik)
- Yahoo Finance API rate limit
- Sembol geçersiz/delisted

---

## 📝 Önemli Notlar

- **Eğitim amaçlıdır** - Gerçek yatırım kararlarında kullanmayın
- **Yahoo Finance API** ücretsiz ancak rate limiting var
- **Veri gecikmesi** 15-20 dakika olabilir
- **CORS:** Yahoo Finance direkt client'tan çağrılamaz, API route gerekli
- **Lisans:** MIT (eğitim amaçlı)

---

## 🎓 Öğrenme Kaynakları

Bu projede kullanılan konseptler:

1. **Next.js App Router** - Server/client component ayrımı
2. **API Routes** - Server-side data fetching
3. **React Hooks** - useState, useEffect
4. **TypeScript** - Interface'ler ve type safety
5. **Async/Await** - API çağrıları
6. **Recharts** - Data visualization
7. **Tailwind CSS** - Utility-first styling
8. **Technical Analysis** - Finansal algoritmalar

---

**Geliştirici Notu:** Bu proje web geliştirme ve finans teknolojileri öğrenmek için hazırlanmıştır. Gerçek yatırım kararlarınızda kullanmayın! 📚💻
