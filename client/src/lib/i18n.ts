// Multi-language support for Korean, English, Japanese, and Spanish
export type Language = 'ko' | 'en' | 'ja' | 'es';

// Translation data structure
const translations = {
  // Navigation
  'nav.home': { ko: '홈', en: 'Home', ja: 'ホーム', es: 'Inicio' },
  'nav.services': { ko: '서비스', en: 'Services', ja: 'サービス', es: 'Servicios' },
  'nav.about': { ko: '소개', en: 'About', ja: 'について', es: 'Acerca de' },
  'nav.booking': { ko: '예약', en: 'Booking', ja: '予約', es: 'Reservas' },
  'nav.gallery': { ko: '갤러리', en: 'Gallery', ja: 'ギャラリー', es: 'Galería' },
  'nav.contact': { ko: '연락처', en: 'Contact', ja: 'お問い合わせ', es: 'Contacto' },
  'nav.login': { ko: '로그인', en: 'Login', ja: 'ログイン', es: 'Iniciar sesión' },
  'nav.logout': { ko: '로그아웃', en: 'Logout', ja: 'ログアウト', es: 'Cerrar sesión' },
  'nav.signup': { ko: '회원가입', en: 'Sign Up', ja: 'サインアップ', es: 'Registrarse' },
  'nav.photo_measurement': { ko: '사진 측정', en: 'Photo Measurement', ja: '写真測定', es: 'Medición de fotos' },
  'nav.design_studio': { ko: '디자인 스튜디오', en: 'Design Studio', ja: 'デザインスタジオ', es: 'Estudio de Diseño' },
  'nav.analytics': { ko: '분석', en: 'Analytics', ja: 'アナリティクス', es: 'Análisis' },

  // Home page
  'home.title': { ko: 'Connie\'s Nail', en: 'Connie\'s Nail', ja: 'Connie\'s Nail', es: 'Connie\'s Nail' },
  'home.welcome': { ko: '안녕하세요, {name}님! 👋', en: 'Hello, {name}! 👋', ja: 'こんにちは、{name}さん！ 👋', es: '¡Hola, {name}! 👋' },
  'home.subtitle': { ko: '프리미엄 네일 케어와 스파 서비스로 당신의 아름다움을 완성하세요', en: 'Complete your beauty with premium nail care and spa services', ja: 'プレミアムネイルケアとスパサービスで美しさを完成させましょう', es: 'Completa tu belleza con servicios premium de cuidado de uñas y spa' },
  'home.book_appointment': { ko: '예약하기', en: 'Book Appointment', ja: '予約する', es: 'Reservar Cita' },
  'home.view_services': { ko: '서비스 보기', en: 'View Services', ja: 'サービスを見る', es: 'Ver Servicios' },
  'home.contact_us': { ko: '연락하기', en: 'Contact Us', ja: 'お問い合わせ', es: 'Contáctanos' },
  'home.get_started': { ko: '시작하기', en: 'Get Started', ja: '始める', es: 'Empezar' },
  'home.test_system': { ko: '시스템 테스트', en: 'Test System', ja: 'システムテスト', es: 'Probar Sistema' },
  'home.pdf_preview': { ko: 'PDF 미리보기', en: 'PDF Preview', ja: 'PDFプレビュー', es: 'Vista previa PDF' },

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

  // Contact page
  'contact.title': { ko: 'Connie\'s nail location', en: 'Connie\'s nail location' },
  'contact.salon_name': { ko: 'Connie\'s Nail Salon', en: 'Connie\'s Nail Salon' },
  'contact.call_us': { ko: '전화번호 @ 202.898.0826', en: 'Call us @ 202.898.0826' },
  'contact.hours': { ko: '월요일 - 금요일 오전 10시부터 오후 7시까지 영업합니다', en: 'We are here Monday - Friday from 10:00am to 7:00pm' },
  'contact.appointment_note': { ko: '전화로 예약해 주시기 바랍니다. 여러분을 만나뵙기를 기대합니다!', en: 'Kindly make your appointments by giving us a call. We look forward to seeing you!' },
  'contact.where_title': { ko: '저희 위치는?', en: 'Where are we?' },
  'contact.building': { ko: 'The Ronald Reagan Building & International Trade Center', en: 'The Ronald Reagan Building & International Trade Center' },
  'contact.space': { ko: 'Space C-084', en: 'Space C-084' },
  'contact.address': { ko: '1300 Pennsylvania Avenue', en: '1300 Pennsylvania Avenue' },
  'contact.city': { ko: 'Washington DC, 20004', en: 'Washington DC, 20004' },
  'contact.directions_title': { ko: '- 길찾기 -', en: '- Directions -' },
  'contact.metro_title': { ko: 'FEDERAL TRIANGLE STATION에서:', en: 'FROM FEDERAL TRIANGLE STATION:' },
  'contact.metro_directions': { ko: 'Federal Triangle Metro에서 내린 후, 2개의 에스컬레이터가 있습니다. 첫 번째 에스컬레이터만 이용하여 올라가서 Ronald Reagan Building 방향으로 걸어가세요. 저희는 야외를 향한 가운데 매장입니다.', en: 'Once you get off at Federal Triangle Metro, there are 2 rising escalators. Go up ONLY the FIRST escalator, walk towards the Ronald Reagan Building. We are the middle store facing the outdoors.' },
  'contact.walking_title': { ko: '건물까지 걸어서:', en: 'WALKING TO THE BUILDING:' },
  'contact.walking_directions': { ko: 'CVS 앞에 도착하면, 중정을 향해 길을 건너세요. 테이블과 벤치가 보일 것입니다. Woodrow Wilson Plaza로 내려가는 계단 옆의 장미 조각상이 보일 때까지 계속 걸으세요. 저희는 배너 아래 가운데 매장입니다.', en: 'Once you are in front of CVS, cross the street towards the courtyard. You will see tables and benches. Keep walking until you see a rose statue right next to the stair case downstairs to the Woodrow Wilson Plaza. We are the middle store under the banners.' },
  'contact.location_note': { ko: '저희는 TIMGAD와 Market 2 Market 사이, 콘코스 레벨의 두 번째 매장입니다.', en: 'We are the second store on the concourse level, between TIMGAD and Market 2 Market.' },
  'contact.feedback_title': { ko: '고객님의 의견을 듣고 싶습니다!', en: 'We love to hear from you!' },
  'contact.email_note': { ko: '개인적으로 이메일을 보내실 수도 있습니다 @', en: 'You can also personally email us @' },
  'contact.email': { ko: 'Sungimconniekim@gmail.com', en: 'Sungimconniekim@gmail.com' },
  'contact.appointment_call': { ko: '**예약을 위해서는 202.898.0826으로 전화해 주세요!', en: '**For appointments, please call us 202.898.0826!' },

  // Landing page
  'landing.title': { ko: 'AI 네일 스튜디오에 오신 것을 환영합니다', en: 'Welcome to AI Nail Studio', ja: 'AIネイルスタジオへようこそ', es: 'Bienvenido al Estudio de Uñas AI' },
  'landing.subtitle': { ko: '혁신적인 AI 기술로 완벽한 네일아트를 만나보세요', en: 'Discover perfect nail art with innovative AI technology', ja: '革新的なAI技術で完璧なネイルアートを発見', es: 'Descubre el arte de uñas perfecto con tecnología AI innovadora' },
  'landing.getStarted': { ko: '시작하기', en: 'Get Started', ja: '開始する', es: 'Comenzar' },

  // Signup
  'signup.title': { ko: '회원가입', en: 'Sign Up', ja: 'サインアップ', es: 'Registrarse' },

  // How it Works
  'howItWorks.title': { ko: '작동 방식', en: 'How It Works', ja: '仕組み', es: 'Cómo Funciona' },
  'howItWorks.step1': { ko: '1. 손톱 사진 업로드', en: '1. Upload Nail Photos', ja: '1. ネイル写真をアップロード', es: '1. Subir Fotos de Uñas' },
  'howItWorks.step2': { ko: '2. AI 분석', en: '2. AI Analysis', ja: '2. AI分析', es: '2. Análisis AI' },
  'howItWorks.step3': { ko: '3. 디자인 선택', en: '3. Design Selection', ja: '3. デザイン選択', es: '3. Selección de Diseño' },
  'howItWorks.step4': { ko: '4. 결제', en: '4. Payment', ja: '4. 支払い', es: '4. Pago' },
  'howItWorks.step5': { ko: '5. 인쇄', en: '5. Printing', ja: '5. 印刷', es: '5. Impresión' },

  // Footer
  'footer.description': { ko: '전문적인 네일아트 서비스', en: 'Professional nail art services', ja: 'プロフェッショナルネイルアートサービス', es: 'Servicios profesionales de arte de uñas' },
  'footer.services': { ko: '서비스', en: 'Services', ja: 'サービス', es: 'Servicios' },
  'footer.nailAnalysis': { ko: '네일 분석', en: 'Nail Analysis', ja: 'ネイル分析', es: 'Análisis de Uñas' },
  'footer.designGallery': { ko: '디자인 갤러리', en: 'Design Gallery', ja: 'デザインギャラリー', es: 'Galería de Diseños' },
  'footer.autoPrinting': { ko: '자동 인쇄', en: 'Auto Printing', ja: '自動印刷', es: 'Impresión Automática' },
  'footer.support': { ko: '지원', en: 'Support', ja: 'サポート', es: 'Soporte' },
  'footer.faq': { ko: 'FAQ', en: 'FAQ', ja: 'FAQ', es: 'Preguntas Frecuentes' },
  'footer.contact': { ko: '연락처', en: 'Contact', ja: 'お問い合わせ', es: 'Contacto' },
  'footer.terms': { ko: '이용약관', en: 'Terms', ja: '利用規約', es: 'Términos' },
  'footer.contactInfo': { ko: '연락 정보', en: 'Contact Info', ja: '連絡先情報', es: 'Información de Contacto' },
  'footer.copyright': { ko: '© 2025 Connie\'s Nail. 모든 권리 보유.', en: '© 2025 Connie\'s Nail. All rights reserved.', ja: '© 2025 Connie\'s Nail. 無断転載禁止。', es: '© 2025 Connie\'s Nail. Todos los derechos reservados.' },
  'footer.company.description': { ko: 'Connie\'s Nail은 최첨단 AI 기술을 활용한 프리미엄 네일아트 서비스를 제공합니다.', en: 'Connie\'s Nail provides premium nail art services using cutting-edge AI technology.', ja: 'Connie\'s Nailは最新のAI技術を使用したプレミアムネイルアートサービスを提供します。', es: 'Connie\'s Nail ofrece servicios premium de arte de uñas utilizando tecnología AI de vanguardia.' },
  'footer.quickLinks.title': { ko: '빠른 링크', en: 'Quick Links', ja: 'クイックリンク', es: 'Enlaces Rápidos' },
  'footer.quickLinks.about': { ko: '소개', en: 'About', ja: 'について', es: 'Acerca de' },
  'footer.quickLinks.services': { ko: '서비스', en: 'Services', ja: 'サービス', es: 'Servicios' },
  'footer.quickLinks.pricing': { ko: '가격', en: 'Pricing', ja: '料金', es: 'Precios' },
  'footer.quickLinks.gallery': { ko: '갤러리', en: 'Gallery', ja: 'ギャラリー', es: 'Galería' },
  'footer.quickLinks.contact': { ko: '연락처', en: 'Contact', ja: 'お問い合わせ', es: 'Contacto' },
  'footer.services.title': { ko: '서비스', en: 'Services', ja: 'サービス', es: 'Servicios' },
  'footer.services.aiAnalysis': { ko: 'AI 네일 분석', en: 'AI Nail Analysis', ja: 'AIネイル分析', es: 'Análisis AI de Uñas' },
  'footer.services.customDesign': { ko: '맞춤 디자인', en: 'Custom Design', ja: 'カスタムデザイン', es: 'Diseño Personalizado' },
  'footer.services.printing': { ko: '3D 프린팅', en: '3D Printing', ja: '3Dプリンティング', es: 'Impresión 3D' },
  'footer.services.consultation': { ko: '상담', en: 'Consultation', ja: 'コンサルテーション', es: 'Consulta' },
  'footer.contact.title': { ko: '연락처', en: 'Contact', ja: 'お問い合わせ', es: 'Contacto' },
  'footer.contact.address': { ko: '1300 Pennsylvania Avenue, Washington DC', en: '1300 Pennsylvania Avenue, Washington DC', ja: '1300 Pennsylvania Avenue, Washington DC', es: '1300 Pennsylvania Avenue, Washington DC' },
  'footer.contact.phone': { ko: '202.898.0826', en: '202.898.0826', ja: '202.898.0826', es: '202.898.0826' },
  'footer.contact.email': { ko: 'Sungimconniekim@gmail.com', en: 'Sungimconniekim@gmail.com', ja: 'Sungimconniekim@gmail.com', es: 'Sungimconniekim@gmail.com' },
  'footer.contact.hours.weekdays': { ko: '월-금: 10:00am - 7:00pm', en: 'Mon-Fri: 10:00am - 7:00pm', ja: '月-金: 10:00am - 7:00pm', es: 'Lun-Vie: 10:00am - 7:00pm' },
  'footer.contact.hours.weekend': { ko: '주말: 휴무', en: 'Weekend: Closed', ja: '週末: 休み', es: 'Fin de semana: Cerrado' },
  'footer.legal.privacy': { ko: '개인정보처리방침', en: 'Privacy Policy', ja: 'プライバシーポリシー', es: 'Política de Privacidad' },
  'footer.legal.terms': { ko: '이용약관', en: 'Terms of Service', ja: '利用規約', es: 'Términos de Servicio' },
  'footer.legal.cookies': { ko: '쿠키 정책', en: 'Cookie Policy', ja: 'クッキーポリシー', es: 'Política de Cookies' },

  // Header/Admin
  'header.adminPanel': { ko: '관리자 패널', en: 'Admin Panel', ja: '管理者パネル', es: 'Panel de Administrador' },

  // Errors
  'error.upload_failed': { ko: '업로드에 실패했습니다', en: 'Upload failed', ja: 'アップロードに失敗しました', es: 'Error en la carga' },
  'error.analysis_failed': { ko: 'AI 분석에 실패했습니다', en: 'AI analysis failed', ja: 'AI分析に失敗しました', es: 'Análisis AI falló' },
  'error.quota_exceeded': { ko: 'API 할당량이 초과되었습니다', en: 'API quota exceeded', ja: 'API割当量を超過しました', es: 'Cuota de API excedida' }
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
    if (saved && (saved === 'ko' || saved === 'en' || saved === 'ja' || saved === 'es')) {
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
    } else if (browserLang.startsWith('ja')) {
      return 'ja';
    } else if (browserLang.startsWith('es')) {
      return 'es';
    }
  }
  
  return 'en'; // Default to English
}