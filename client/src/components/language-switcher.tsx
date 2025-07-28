import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

type Language = 'en' | 'ko' | 'ja' | 'es';

const languageOptions = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
  { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' }
];

export default function LanguageSwitcher() {
  const getCurrentLanguage = (): Language => {
    try {
      const saved = localStorage.getItem('preferred-language') as Language;
      if (saved && (saved === 'en' || saved === 'ko' || saved === 'ja' || saved === 'es')) {
        return saved;
      }
    } catch (e) {
      // Silent fail
    }
    return 'en'; // Default to English for Connie's Nail
  };

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem('preferred-language', lang);
      window.location.reload(); // Simple reload to update all components
    } catch (e) {
      // Silent fail
    }
  };

  const currentLanguage = languageOptions.find(lang => lang.code === getCurrentLanguage());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span>{currentLanguage?.flag}</span>
          <span className="hidden sm:inline">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center space-x-2 ${
              getCurrentLanguage() === lang.code ? 'bg-secondary/10' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}