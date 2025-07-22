import { useState, useEffect, createContext, useContext } from 'react';
import { 
  Language, 
  loadLanguagePreference, 
  saveLanguagePreference, 
  t as translateFunction 
} from '@/lib/i18n';

// Language Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: any) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Custom hook for language management
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
}

// Language provider hook for managing language state
export function useLanguageProvider() {
  const [language, setLanguageState] = useState<Language>('en');

  // Initialize language from localStorage or browser
  useEffect(() => {
    const savedLanguage = loadLanguagePreference();
    setLanguageState(savedLanguage);
  }, []);

  // Set language and save preference
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguagePreference(lang);
  };

  // Translation function with current language
  const t = (key: any) => translateFunction(key, language);

  return {
    language,
    setLanguage,
    t,
  };
}