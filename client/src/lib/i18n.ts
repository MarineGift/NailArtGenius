// Multi-language support for Korean and English
export type Language = 'ko' | 'en';

// Translation data structure
const translations = {
  // Navigation
  'nav.home': { ko: '홈', en: 'Home' },
  'nav.photo_measurement': { ko: '정밀 측정', en: 'Photo Measurement' },
  'nav.design_studio': { ko: '디자인 스튜디오', en: 'Design Studio' },
  'nav.analytics': { ko: '분석 대시보드', en: 'Analytics' },
  'nav.login': { ko: '로그인', en: 'Login' },
  'nav.logout': { ko: '로그아웃', en: 'Logout' },

  // Home page
  'home.title': { ko: 'AI Nail Studio', en: 'AI Nail Studio' },
  'home.welcome': { ko: '안녕하세요, {name}님! 👋', en: 'Hello, {name}! 👋' },
  'home.subtitle': { ko: 'AI가 그려낸 당신만의 손끝 예술, 지금부터 시작해보세요', en: 'Your personalized fingertip art created by AI, start now' },
  'home.get_started': { ko: '새 네일아트 시작하기', en: 'Start New Nail Art' },
  'home.test_system': { ko: '🧪 전체 시스템 테스트하기', en: '🧪 Test Complete System' },
  'home.pdf_preview': { ko: '📄 PDF 미리보기', en: '📄 PDF Preview' },

  // Photo measurement
  'photo.title': { ko: '정밀 손가락 측정', en: 'Precise Finger Measurement' },
  'photo.card_required': { ko: '신용카드가 필요합니다', en: 'Credit card required' },
  'photo.finger_types.left_thumb': { ko: '왼손 엄지', en: 'Left Thumb' },
  'photo.finger_types.right_index': { ko: '오른손 검지', en: 'Right Index' },

  // PDF
  'pdf.title': { ko: 'PDF 미리보기', en: 'PDF Preview' },
  'pdf.download': { ko: '다운로드', en: 'Download' },
  'pdf.print': { ko: '인쇄', en: 'Print' },

  // Common
  'common.loading': { ko: '로딩 중...', en: 'Loading...' },
  'common.save': { ko: '저장', en: 'Save' },
  'common.cancel': { ko: '취소', en: 'Cancel' },
  'common.next': { ko: '다음', en: 'Next' },

  // Errors
  'error.upload_failed': { ko: '업로드에 실패했습니다', en: 'Upload failed' },
  'error.analysis_failed': { ko: 'AI 분석에 실패했습니다', en: 'AI analysis failed' },
  'error.quota_exceeded': { ko: 'API 할당량이 초과되었습니다', en: 'API quota exceeded' }
};

// Translation function
export function t(key: string, lang?: Language): string {
  const currentLang = lang || loadLanguagePreference();
  const translation = (translations as any)[key];
  
  if (!translation) {
    console.warn(`Translation key "${key}" not found`);
    return key;
  }
  
  return translation[currentLang] || translation.en || key;
}

// Language preference management
export function saveLanguagePreference(lang: Language): void {
  try {
    localStorage.setItem('preferred-language', lang);
  } catch (e) {
    // Silent fail for environments without localStorage
  }
}

export function loadLanguagePreference(): Language {
  try {
    const saved = localStorage.getItem('preferred-language') as Language;
    if (saved && (saved === 'ko' || saved === 'en')) {
      return saved;
    }
  } catch (e) {
    // Silent fail for environments without localStorage
  }
  
  // Auto-detect browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ko')) {
      return 'ko';
    }
  }
  
  return 'en'; // Default to English
}