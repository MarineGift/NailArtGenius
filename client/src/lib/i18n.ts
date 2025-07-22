// Multi-language support for Korean and English
export type Language = 'ko' | 'en';

// Translation data structure
const translations = {
  // Navigation
  'nav.home': { ko: '홈', en: 'Home' },
  'nav.services': { ko: '서비스', en: 'Services' },
  'nav.about': { ko: '소개', en: 'About' },
  'nav.booking': { ko: '예약', en: 'Booking' },
  'nav.gallery': { ko: '갤러리', en: 'Gallery' },
  'nav.contact': { ko: '연락처', en: 'Contact' },
  'nav.login': { ko: '로그인', en: 'Login' },
  'nav.logout': { ko: '로그아웃', en: 'Logout' },

  // Home page
  'home.title': { ko: 'Connie\'s Nail', en: 'Connie\'s Nail' },
  'home.welcome': { ko: '안녕하세요, {name}님! 👋', en: 'Hello, {name}! 👋' },
  'home.subtitle': { ko: '프리미엄 네일 케어와 스파 서비스로 당신의 아름다움을 완성하세요', en: 'Complete your beauty with premium nail care and spa services' },
  'home.book_appointment': { ko: '예약하기', en: 'Book Appointment' },
  'home.view_services': { ko: '서비스 보기', en: 'View Services' },
  'home.contact_us': { ko: '연락하기', en: 'Contact Us' },

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

  // Services page
  'services.title': { ko: 'Connie\'s Nail Services', en: 'Connie\'s Nail Services' },
  
  // Spa Specials
  'services.spa.title': { ko: 'Connie\'s Spa Specials', en: 'Connie\'s Spa Specials' },
  'services.spa.manicure': { ko: '스파 매니큐어', en: 'Spa Manicure' },
  'services.spa.pedicure': { ko: '스파 페디큐어', en: 'Spa Pedicure' },
  
  // Nail Treatments
  'services.treatments.title': { ko: 'Connie\'s Nail Treatments', en: 'Connie\'s Nail Treatments' },
  'services.treatments.regular_manicure': { ko: '일반 매니큐어', en: 'Regular Manicure' },
  'services.treatments.buff_shine': { ko: '버프 & 샤인 매니큐어', en: 'Buff & Shine Manicure' },
  'services.treatments.french_manicure': { ko: '프렌치 매니큐어', en: 'French Manicure' },
  'services.treatments.regular_pedicure': { ko: '일반 페디큐어', en: 'Regular Pedicure' },
  'services.treatments.gel_manicure': { ko: '컬러 젤 매니큐어', en: 'Color Gel Manicure' },
  'services.treatments.gel_french': { ko: '컬러 젤 프렌치 매니큐어', en: 'Color Gel French Manicure' },
  'services.treatments.polish_change_finger': { ko: '폴리시 체인지 (손톱)', en: 'Polish Change (Finger nails)' },
  'services.treatments.polish_change_toe': { ko: '폴리시 체인지 (발톱)', en: 'Polish Change (Toenails)' },
  'services.treatments.gel_pedicure': { ko: '젤 페디큐어', en: 'Gel Pedicure' },
  'services.treatments.manicure_paraffin': { ko: '매니큐어 & 파라핀 트리트먼트', en: 'Manicure & Paraffin Treatment' },
  'services.treatments.pedicure_paraffin': { ko: '페디큐어 & 파라핀 트리트먼트', en: 'Pedicure & Paraffin Treatment' },
  'services.treatments.pedicure_callus': { ko: '페디큐어 & 파라핀 with 각질 트리트먼트', en: 'Pedicure & Paraffin with Callus Treatment' },
  
  // Waxing
  'services.waxing.title': { ko: '왁싱', en: 'Waxing' },
  'services.waxing.eyebrows': { ko: '눈썹', en: 'Eyebrows' },
  'services.waxing.lip': { ko: '입술', en: 'Lip' },
  'services.waxing.chin': { ko: '턱', en: 'Chin' },
  'services.waxing.sideburns': { ko: '구레나룻', en: 'Side burns' },
  'services.waxing.complete_face': { ko: '전체 얼굴', en: 'Complete face' },
  'services.waxing.underarms': { ko: '겨드랑이', en: 'Under arms' },
  'services.waxing.full_arms': { ko: '전체 팔', en: 'Full arms' },
  'services.waxing.half_arms': { ko: '반팔/팔뚝', en: 'Half arms/Forearms' },
  'services.waxing.half_legs': { ko: '반다리/정강이', en: 'Half legs/Shins' },
  'services.waxing.bikini': { ko: '비키니', en: 'Bikini' },
  'services.waxing.full_legs': { ko: '전체 다리', en: 'Full legs' },
  'services.waxing.stomach': { ko: '배', en: 'Stomach' },
  'services.waxing.back': { ko: '등', en: 'Back' },
  'services.waxing.chest': { ko: '가슴', en: 'Chest' },
  'services.waxing.brazilian': { ko: '브라질리언', en: 'Brazilian' },
  
  // Nail Design
  'services.design.title': { ko: 'Connie\'s Nail Design', en: 'Connie\'s Nail Design' },
  'services.design.full_set': { ko: '풀 세트', en: 'Full Set' },
  'services.design.fill_in': { ko: '필인', en: 'Fill-In' },
  'services.design.gel_x': { ko: '젤 X', en: 'Gel X' },
  'services.design.pink_white': { ko: '핑크 & 화이트', en: 'Pink & White' },
  'services.design.silk_wrap': { ko: '실크 랩', en: 'Silk Wrap' },
  'services.design.gel_acrylic': { ko: '젤 컬러 & 아크릴', en: 'Gel Color & Acrylic' },
  'services.design.acrylic': { ko: '아크릴', en: 'Acrylic' },
  'services.design.removal': { ko: '제거', en: 'Removal' },
  'services.design.dip_powder': { ko: '딥 파우더', en: 'DIP Powder' },
  
  // Chair Massage
  'services.massage.title': { ko: '체어 마사지', en: 'Chair Massage' },
  'services.massage.10_min': { ko: '10분', en: '10 Minutes' },
  'services.massage.15_min': { ko: '15분', en: '15 Minutes' },
  
  // Kids Services
  'services.kids.title': { ko: '12세 이하 어린이', en: 'For Kids Under 12' },
  'services.kids.mani_pedi': { ko: '매니 & 페디', en: 'Mani & Pedi' },
  'services.kids.finger_polish': { ko: '손톱 폴리시 체인지', en: 'Finger Polish Change' },
  'services.kids.toe_polish': { ko: '발톱 폴리시 체인지', en: 'Toe Polish Change' },

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