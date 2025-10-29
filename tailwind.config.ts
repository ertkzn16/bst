import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Finans temalı renkler
        profit: '#10b981', // Yeşil - Kar/Artış
        loss: '#ef4444',   // Kırmızı - Zarar/Düşüş
      },
    },
  },
  plugins: [],
}
export default config
