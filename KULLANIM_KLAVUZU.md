# 📘 BIST Borsa Analiz - Kullanım Kılavuzu

## 🎯 Proje Özeti

Bu Next.js uygulaması, Borsa İstanbul hisse senetlerini takip etmek, grafiklendirmek ve teknik analiz yapmak için geliştirilmiş eğitim amaçlı bir projedir.

---

## 📦 Kurulum Adımları

### 1. Bağımlılıkları Yükleyin

\`\`\`bash
npm install
\`\`\`

Bu komut şu paketleri yükleyecek:
- ✅ **next** - React framework
- ✅ **react & react-dom** - React kütüphaneleri
- ✅ **recharts** - Grafik çizim kütüphanesi
- ✅ **yahoo-finance2** - Yahoo Finance API client
- ✅ **tailwindcss** - CSS framework
- ✅ **typescript** - Tip kontrolü

### 2. Geliştirme Sunucusunu Başlatın

\`\`\`bash
npm run dev
\`\`\`

Tarayıcınızda **http://localhost:3000** adresini açın.

---

## 🖥️ Uygulama Nasıl Kullanılır?

### 1️⃣ Varsayılan Hisseler

Uygulama açıldığında otomatik olarak 3 BIST hissesi yüklenir:
- **GARAN.IS** - Garanti BBVA
- **AKBNK.IS** - Akbank
- **THYAO.IS** - Türk Hava Yolları

Her hisse için son 2 yıllık günlük fiyat verileri Yahoo Finance'den çekilir.

### 2️⃣ Yeni Hisse Ekleme

**"Hisse Senedi Ara"** bölümünden:
1. BIST sembolünü yazın (örn: ASELS, SASA)
2. **"Ekle"** butonuna tıklayın
3. Sistem otomatik olarak `.IS` uzantısını ekler
4. Grafik oluşturulur ve listelenir

**Popüler Hisseler:** Hızlı test için hazır butonlar var (ASELS, SASA, EREGL, vb.)

### 3️⃣ Teknik Analiz Göstergeleri

**"Teknik Analiz Göstergeleri"** menüsünden bir seçenek seçin:

#### 📊 Sadece Fiyat
Hiçbir gösterge olmadan sadece kapanış fiyatları

#### 📊 Moving Average (MA)
- **MA20:** 20 günlük hareketli ortalama (mavi çizgi)
- **MA50:** 50 günlük hareketli ortalama (turuncu çizgi)
- **Kullanım:** Trend yönünü belirler
  - Fiyat MA'nın üzerindeyse → Yükseliş trendi
  - Fiyat MA'nın altındaysa → Düşüş trendi

#### ⚡ RSI (Relative Strength Index)
- 0-100 arası değer
- **70 üzeri:** Aşırı alım bölgesi (overbought) - Satış sinyali
- **30 altı:** Aşırı satım bölgesi (oversold) - Alış sinyali
- Ayrı grafikte gösterilir

#### 📉 MACD
- **MACD Çizgisi:** 12 günlük EMA - 26 günlük EMA
- **Signal Çizgisi:** MACD'nin 9 günlük EMA'sı
- **Histogram:** MACD - Signal farkı
- **Kullanım:**
  - MACD, Signal'ı yukarı keserse → AL sinyali 🟢
  - MACD, Signal'ı aşağı keserse → SAT sinyali 🔴

### 4️⃣ Hisse Silme

Her grafik kartının sağ üst köşesinde **❌** butonu var. Tıklayarak o hisseyi listeden kaldırabilirsiniz.

---

## 📂 Dosya Yapısı ve Açıklamaları

### **app/** - Ana Uygulama Klasörü

#### **app/page.tsx** (Ana Sayfa)
- Tüm bileşenleri bir araya getirir
- State yönetimi (useState)
- API çağrıları (useEffect)
- Hisse ekleme/silme işlemleri

#### **app/layout.tsx** (Layout)
- Header ve Footer
- HTML yapısı
- SEO metadata

#### **app/globals.css** (Global Stiller)
- Tailwind CSS import
- Custom scrollbar
- Genel stil tanımları

---

### **app/components/** - React Bileşenleri

#### **ChartCard.tsx** (Grafik Kartı)
**Görevleri:**
- Recharts kullanarak LineChart çizer
- Fiyat verilerini görselleştirir
- Seçilen teknik göstergeyi grafiğe ekler
- RSI ve MACD için ikinci grafik oluşturur

**Önemli Kod Parçaları:**
\`\`\`typescript
// Recharts'ın LineChart component'i
<LineChart data={finalData}>
  <Line dataKey="price" stroke={color} />
  {technicalIndicator === 'MA' && (
    <>
      <Line dataKey="ma20" stroke="blue" />
      <Line dataKey="ma50" stroke="orange" />
    </>
  )}
</LineChart>
\`\`\`

#### **StockSelector.tsx** (Hisse Arama)
**Görevleri:**
- Kullanıcıdan input alır
- Sembolü formatlar (.IS ekler)
- Parent component'e bildirir (onAddStock)
- Loading state gösterir

**Önemli Kod Parçaları:**
\`\`\`typescript
const formattedSymbol = formatStockSymbol(inputValue);
onAddStock(formattedSymbol);
\`\`\`

#### **TechnicalMenu.tsx** (Teknik Analiz Menüsü)
**Görevleri:**
- 4 seçenek sunar (None, MA, RSI, MACD)
- Seçili göstergeyi vurgular
- Parent'a bildirir (onSelect)
- Her gösterge için açıklama gösterir

---

### **app/lib/** - Yardımcı Fonksiyonlar

#### **fetchStockData.ts** (API Fonksiyonları)
**Görevleri:**
- Yahoo Finance API'den veri çeker
- Veriyi temizler ve formatlar
- Hata yönetimi yapar

**Ana Fonksiyonlar:**

##### \`fetchStockData(symbol, period)\`
\`\`\`typescript
const data = await fetchStockData('GARAN.IS', '2y');
// Dönen veri: StockDataPoint[]
// { date, timestamp, open, high, low, close, volume }
\`\`\`

##### \`fetchMultipleStocks(symbols, period)\`
Birden fazla hisseyi paralel çeker:
\`\`\`typescript
const data = await fetchMultipleStocks(['GARAN.IS', 'AKBNK.IS'], '2y');
\`\`\`

#### **technicalIndicators.ts** (Teknik Analiz Hesaplamaları)

##### \`calculateMA(data, period)\`
Hareketli ortalama hesaplar:
\`\`\`typescript
// Son 20 günün ortalaması
const ma20 = calculateMA(stockData, 20);
\`\`\`

**Algoritma:**
\`\`\`
MA = (Fiyat[t] + Fiyat[t-1] + ... + Fiyat[t-n]) / n
\`\`\`

##### \`calculateRSI(data, period)\`
RSI hesaplar:
\`\`\`typescript
const rsi = calculateRSI(stockData, 14);
\`\`\`

**Algoritma:**
\`\`\`
1. Günlük fiyat değişimlerini hesapla
2. Kazançları ve kayıpları ayır
3. Ortalama kazanç ve kayıp hesapla
4. RS = Ortalama Kazanç / Ortalama Kayıp
5. RSI = 100 - (100 / (1 + RS))
\`\`\`

##### \`calculateMACD(data)\`
MACD hesaplar:
\`\`\`typescript
const macd = calculateMACD(stockData);
// Döner: { macd, signal, histogram }
\`\`\`

**Algoritma:**
\`\`\`
1. EMA12 hesapla (12 günlük Exponential Moving Average)
2. EMA26 hesapla (26 günlük)
3. MACD = EMA12 - EMA26
4. Signal = MACD'nin 9 günlük EMA'sı
5. Histogram = MACD - Signal
\`\`\`

---

### **data/** - Veri Dosyaları

#### **defaultStocks.ts**
- Varsayılan 3 hisse tanımlar
- Yardımcı fonksiyonlar:
  - \`formatStockSymbol()\` - .IS ekler
  - \`calculatePriceChange()\` - % değişim hesaplar
  - \`formatCurrency()\` - Para formatlar
  - \`formatDate()\` - Tarih formatlar

---

## 🧪 Test Senaryoları

### Test 1: Varsayılan Yükleme
1. \`npm run dev\` çalıştır
2. http://localhost:3000 aç
3. 3 hissenin yüklendiğini kontrol et
4. Grafiklerin göründüğünü doğrula

### Test 2: Yeni Hisse Ekleme
1. "Hisse Senedi Ara" bölümüne "ASELS" yaz
2. "Ekle" butonuna tıkla
3. Yeni grafiğin eklendiğini kontrol et

### Test 3: Teknik Gösterge Ekleme
1. "Moving Average" seç
2. Tüm grafiklere MA20 ve MA50 çizgilerinin eklendiğini gör
3. "RSI" seç → Her grafiğin altında RSI grafiği çıksın
4. "MACD" seç → MACD grafiği görünsün

### Test 4: Hisse Silme
1. Bir grafiğin sağ üstündeki ❌ butonuna tıkla
2. Grafiğin silindiğini doğrula

---

## ⚠️ Olası Hatalar ve Çözümler

### Hata: "Veri çekilemedi"
**Sebep:** Yahoo Finance API erişilemiyor veya sembol yanlış

**Çözüm:**
- İnternet bağlantısını kontrol edin
- Sembolün doğru olduğundan emin olun (örn: GARAN.IS)
- Birkaç saniye bekleyip tekrar deneyin

### Hata: Grafik görünmüyor
**Sebep:** Recharts yüklenmemiş veya veri boş

**Çözüm:**
\`\`\`bash
npm install
npm run dev
\`\`\`

### Hata: TypeScript hataları
**Çözüm:**
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

---

## 🚀 Production'a Alma

### Build Oluşturma
\`\`\`bash
npm run build
\`\`\`

### Production Sunucu Çalıştırma
\`\`\`bash
npm start
\`\`\`

### Vercel'e Deploy
1. Vercel hesabı oluşturun (vercel.com)
2. GitHub'a push edin
3. Vercel'de "Import Project" seçin
4. Otomatik deploy olur

---

## 📚 Öğrenim Hedefleri

Bu proje ile şunları öğreneceksiniz:

### 1. **Next.js App Router**
- File-based routing
- Server/Client Components
- Layout ve Metadata

### 2. **React Hooks**
- useState - State yönetimi
- useEffect - Side effects (API çağrıları)

### 3. **TypeScript**
- Interface tanımlama
- Tip güvenliği
- Generic tipler

### 4. **API Entegrasyonu**
- Async/await
- Error handling
- Loading states

### 5. **Data Visualization**
- Recharts kullanımı
- Grafik customization
- Multi-line charts

### 6. **Finans Algoritmaları**
- Moving Average hesaplama
- RSI algoritması
- MACD hesaplama

### 7. **Tailwind CSS**
- Utility-first CSS
- Responsive design
- Custom colors

---

## 🎓 İleri Seviye Geliştirmeler

Projeyi daha da geliştirebilirsiniz:

1. **Veri Caching** - SWR veya React Query ile
2. **Real-time Updates** - WebSocket entegrasyonu
3. **Karşılaştırma Modu** - İki hisseyi yan yana göster
4. **Daha Fazla Gösterge** - Bollinger Bands, Fibonacci
5. **Export Özelliği** - Grafikleri PNG olarak indir
6. **Dark Mode** - Tema değiştirme
7. **Database** - Favoriler kaydetme
8. **Alert Sistemi** - Fiyat uyarıları

---

## 💡 Faydalı Kaynaklar

- **Next.js Dokümantasyon:** https://nextjs.org/docs
- **Recharts Dokümantasyon:** https://recharts.org/
- **Yahoo Finance API:** https://github.com/gadicc/node-yahoo-finance2
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Technical Analysis:** https://www.investopedia.com/

---

**🎉 Başarılar!** Herhangi bir sorunuz olursa README.md dosyasına bakabilirsiniz.
