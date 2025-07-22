import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage, type Language } from "@/lib/i18n";
import { Languages } from "lucide-react";

const languageOptions = [
  { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' }
];

interface LanguageSwitcherProps {
  variant?: 'select' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

export default function LanguageSwitcher({ variant = 'select', size = 'md' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  if (variant === 'button') {
    return (
      <div className="flex items-center gap-2">
        {languageOptions.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? "default" : "outline"}
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            onClick={() => setLanguage(lang.code)}
            className={`${size === 'sm' ? 'px-2 py-1 text-xs' : ''} ${
              language === lang.code ? 'bg-pink-600 hover:bg-pink-700' : ''
            }`}
          >
            <span className="mr-1">{lang.flag}</span>
            {size !== 'sm' && lang.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className={`w-fit ${
        size === 'sm' ? 'h-8 px-2 text-sm' : 
        size === 'lg' ? 'h-12 px-4 text-lg' : 
        'h-10 px-3'
      }`}>
        <div className="flex items-center gap-2">
          <Languages className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
          <span className="flex items-center gap-1">
            <span>{currentLanguage?.flag}</span>
            {size !== 'sm' && <span>{currentLanguage?.name}</span>}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}