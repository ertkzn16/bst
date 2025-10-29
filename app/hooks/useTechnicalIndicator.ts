// Custom hook - Teknik analiz gösterge tercihini local storage'da saklar
import { useState, useEffect } from 'react';

// Teknik gösterge tipi
export type TechnicalIndicatorType = 'MA' | 'RSI' | 'MACD' | null;

// Local storage key
const STORAGE_KEY = 'technical-indicator-preference';

/**
 * Teknik gösterge tercihini local storage ile senkronize eder
 * @param defaultValue - Varsayılan değer (local storage'da değer yoksa kullanılır)
 * @returns [currentValue, setValue] - React state gibi çalışır
 */
export function useTechnicalIndicator(
  defaultValue: TechnicalIndicatorType = null
): [TechnicalIndicatorType, (value: TechnicalIndicatorType) => void] {
  // State tanımla
  const [indicator, setIndicatorState] = useState<TechnicalIndicatorType>(defaultValue);

  // Component mount olduğunda local storage'dan oku
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      if (storedValue !== null) {
        // JSON parse et (null, "MA", "RSI", "MACD" olabilir)
        const parsed = JSON.parse(storedValue) as TechnicalIndicatorType;
        setIndicatorState(parsed);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      // Hata durumunda varsayılan değeri kullan
      setIndicatorState(defaultValue);
    }
  }, []); // Sadece ilk render'da çalış

  // Değeri hem state'e hem local storage'a yaz
  const setIndicator = (value: TechnicalIndicatorType) => {
    try {
      // State'i güncelle
      setIndicatorState(value);
      // Local storage'a kaydet
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [indicator, setIndicator];
}

/**
 * Local storage'daki tercihi temizle
 */
export function clearTechnicalIndicatorPreference() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
