export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hakkında</h2>

        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            BIST Analiz, Borsa İstanbul hisse senetlerini takip etmek ve teknik analiz yapmak için
            geliştirilmiş modern bir web platformudur.
          </p>

          <p>
            Bu uygulama <strong>eğitim amaçlı</strong> hazırlanmış olup, Next.js, React ve TypeScript
            gibi modern web teknolojilerini öğretmek için tasarlanmıştır.
          </p>

          <div className="pt-4 border-t border-gray-100 mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Özellikler</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Gerçek zamanlı hisse verisi</li>
              <li>• Teknik analiz göstergeleri (MA, RSI, MACD)</li>
              <li>• Responsive tasarım</li>
              <li>• Minimalist arayüz</li>
            </ul>
          </div>

          <p className="text-xs text-gray-400 pt-4 border-t border-gray-100 mt-6">
            Veriler Yahoo Finance API üzerinden çekilmektedir. Bu uygulama yatırım tavsiyesi değildir.
          </p>
        </div>
      </div>
    </div>
  );
}
