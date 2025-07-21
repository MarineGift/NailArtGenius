export type Language = 'en' | 'ko' | 'ja' | 'es';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.login': {
    en: 'Login',
    ko: '로그인',
    ja: 'ログイン',
    es: 'Iniciar sesión'
  },
  'nav.signup': {
    en: 'Sign Up',
    ko: '회원가입',
    ja: 'サインアップ',
    es: 'Registrarse'
  },
  'nav.logout': {
    en: 'Logout',
    ko: '로그아웃',
    ja: 'ログアウト',
    es: 'Cerrar sesión'
  },
  'nav.admin': {
    en: 'Admin',
    ko: '관리자',
    ja: '管理者',
    es: 'Administrador'
  },

  // Landing Page
  'landing.title': {
    en: 'AI-Powered Custom Nail Art',
    ko: 'AI 기술로 완성하는 맞춤형 네일아트',
    ja: 'AIで作るカスタムネイルアート',
    es: 'Arte de Uñas Personalizado con IA'
  },
  'landing.subtitle': {
    en: 'Just take photos of your fingers and AI will analyze the perfect nail shape, then automatically print your chosen design',
    ko: '손가락 사진만 찍으면 AI가 완벽한 네일 모양을 분석하고, 원하는 디자인으로 자동 프린팅까지 한 번에',
    ja: '指の写真を撮るだけでAIが完璧な爪の形を分析し、お好みのデザインを自動プリント',
    es: 'Solo toma fotos de tus dedos y la IA analizará la forma perfecta de las uñas, luego imprimirá automáticamente tu diseño elegido'
  },
  'landing.getStarted': {
    en: 'Get Started',
    ko: '지금 시작하기',
    ja: '今すぐ開始',
    es: 'Comenzar'
  },

  // How it works
  'howItWorks.title': {
    en: 'Simple 5 Steps',
    ko: '간단한 5단계로 완성',
    ja: '簡単な5ステップで完成',
    es: '5 Pasos Simples'
  },
  'howItWorks.step1': {
    en: 'Sign Up',
    ko: '회원가입',
    ja: 'サインアップ',
    es: 'Registrarse'
  },
  'howItWorks.step2': {
    en: 'Take Photos',
    ko: '손가락 촬영',
    ja: '写真撮影',
    es: 'Tomar Fotos'
  },
  'howItWorks.step3': {
    en: 'Choose Design',
    ko: '디자인 선택',
    ja: 'デザイン選択',
    es: 'Elegir Diseño'
  },
  'howItWorks.step4': {
    en: 'Payment',
    ko: '결제',
    ja: '決済',
    es: 'Pago'
  },
  'howItWorks.step5': {
    en: 'Book Visit',
    ko: '방문 예약',
    ja: '来店予約',
    es: 'Reservar Visita'
  },

  // Photo Upload
  'upload.title': {
    en: 'Take Finger Photos',
    ko: '손가락 사진 촬영',
    ja: '指の写真撮影',
    es: 'Tomar Fotos de Dedos'
  },
  'upload.instruction': {
    en: 'Place your fingers on a credit card and take 6 photos total',
    ko: '신용카드에 손가락을 올려놓고 총 6장의 사진을 촬영해주세요',
    ja: 'クレジットカードに指を置いて計6枚の写真を撮影してください',
    es: 'Coloca tus dedos en una tarjeta de crédito y toma 6 fotos en total'
  },

  // AI Processing
  'processing.title': {
    en: 'AI Analysis in Progress',
    ko: 'AI 분석 진행중',
    ja: 'AI分析進行中',
    es: 'Análisis de IA en Progreso'
  },
  'processing.analyzing': {
    en: 'Analyzing uploaded photos to generate optimal nail shapes',
    ko: '업로드된 사진을 분석하여 최적의 네일 모양을 생성하고 있습니다',
    ja: 'アップロードされた写真を分析して最適な爪の形を生成しています',
    es: 'Analizando fotos subidas para generar formas de uñas óptimas'
  },

  // Design Selection
  'designs.title': {
    en: 'Choose Nail Art Design',
    ko: '네일아트 디자인 선택',
    ja: 'ネイルアートデザインを選択',
    es: 'Elegir Diseño de Arte de Uñas'
  },
  'designs.subtitle': {
    en: 'Choose a beautiful design to apply to your generated nail shape',
    ko: '생성된 네일 모양에 적용할 아름다운 디자인을 선택하세요',
    ja: '生成された爪の形に適用する美しいデザインを選択してください',
    es: 'Elige un hermoso diseño para aplicar a tu forma de uña generada'
  },

  // Payment
  'payment.title': {
    en: 'Payment',
    ko: '결제하기',
    ja: '支払い',
    es: 'Pago'
  },
  'payment.subtitle': {
    en: 'Complete your order with secure PayPal payment',
    ko: '안전한 PayPal 결제로 주문을 완료하세요',
    ja: '安全なPayPal決済で注文を完了してください',
    es: 'Completa tu pedido con pago seguro de PayPal'
  },

  // Appointment Booking
  'appointment.title': {
    en: 'Book Salon Visit',
    ko: '네일샵 방문 예약',
    ja: 'ネイルサロン予約',
    es: 'Reservar Visita al Salón'
  },
  'appointment.subtitle': {
    en: 'Schedule your visit after payment completion',
    ko: '결제 완료 후 방문 시간을 예약하세요',
    ja: '決済完了後にご来店時間を予約してください',
    es: 'Programa tu visita después de completar el pago'
  },
  'appointment.selectDate': {
    en: 'Select Visit Date',
    ko: '방문 날짜 선택',
    ja: '来店日を選択',
    es: 'Seleccionar Fecha de Visita'
  },
  'appointment.selectTime': {
    en: 'Select Time Slot',
    ko: '시간대 선택',
    ja: '時間帯を選択',
    es: 'Seleccionar Horario'
  },
  'appointment.selectDateFirst': {
    en: 'Please select a date first',
    ko: '먼저 날짜를 선택해 주세요',
    ja: 'まず日付を選択してください',
    es: 'Por favor selecciona una fecha primero'
  },
  'appointment.summary': {
    en: 'Appointment Summary',
    ko: '예약 요약',
    ja: '予約概要',
    es: 'Resumen de Cita'
  },
  'appointment.date': {
    en: 'Date',
    ko: '날짜',
    ja: '日付',
    es: 'Fecha'
  },
  'appointment.time': {
    en: 'Time',
    ko: '시간',
    ja: '時間',
    es: 'Hora'
  },
  'appointment.orderNumber': {
    en: 'Order Number',
    ko: '주문번호',
    ja: '注文番号',
    es: 'Número de Pedido'
  },
  'appointment.confirmBooking': {
    en: 'Confirm Booking',
    ko: '예약 확정',
    ja: '予約確定',
    es: 'Confirmar Reserva'
  },
  'appointment.booking': {
    en: 'Booking...',
    ko: '예약 중...',
    ja: '予約中...',
    es: 'Reservando...'
  },
  'appointment.success': {
    en: 'Appointment Booked',
    ko: '예약 완료',
    ja: '予約完了',
    es: 'Cita Reservada'
  },
  'appointment.successMessage': {
    en: 'Your appointment has been successfully booked',
    ko: '예약이 성공적으로 완료되었습니다',
    ja: '予約が正常に完了しました',
    es: 'Tu cita ha sido reservada exitosamente'
  },
  'appointment.error': {
    en: 'Booking Failed',
    ko: '예약 실패',
    ja: '予約に失敗しました',
    es: 'Error en la Reserva'
  },
  'appointment.incompleteSelection': {
    en: 'Incomplete Selection',
    ko: '선택이 완료되지 않았습니다',
    ja: '選択が完了していません',
    es: 'Selección Incompleta'
  },
  'appointment.selectDateAndTime': {
    en: 'Please select both date and time',
    ko: '날짜와 시간을 모두 선택해 주세요',
    ja: '日付と時間の両方を選択してください',
    es: 'Por favor selecciona fecha y hora'
  },

  // Admin Panel
  'admin.title': {
    en: 'Admin Panel',
    ko: '관리자 페이지',
    ja: '管理者パネル',
    es: 'Panel de Administración'
  },
  'admin.appointments': {
    en: 'Appointments',
    ko: '예약 관리',
    ja: '予約管理',
    es: 'Citas'
  },
  'admin.orders': {
    en: 'Orders',
    ko: '주문 관리',
    ja: '注文管理',
    es: 'Pedidos'
  },

  // Common
  'common.loading': {
    en: 'Loading...',
    ko: '로딩 중...',
    ja: '読み込み中...',
    es: 'Cargando...'
  },
  'common.unauthorized': {
    en: 'Unauthorized',
    ko: '권한 없음',
    ja: '権限がありません',
    es: 'No Autorizado'
  },
  'common.loginRequired': {
    en: 'You are logged out. Logging in again...',
    ko: '로그아웃되었습니다. 다시 로그인합니다...',
    ja: 'ログアウトされました。再度ログインします...',
    es: 'Sesión cerrada. Iniciando sesión nuevamente...'
  },

  // Footer
  'footer.description': {
    en: 'Personalized nail art service powered by AI technology',
    ko: '인공지능 기술로 완성하는 개인 맞춤형 네일아트 서비스',
    ja: 'AI技術で完成する個人向けネイルアートサービス',
    es: 'Servicio personalizado de arte de uñas impulsado por tecnología AI'
  },
  'footer.services': {
    en: 'Services',
    ko: '서비스',
    ja: 'サービス',
    es: 'Servicios'
  },
  'footer.nailAnalysis': {
    en: 'AI Nail Analysis',
    ko: 'AI 네일 분석',
    ja: 'AIネイル分析',
    es: 'Análisis de Uñas IA'
  },
  'footer.designGallery': {
    en: 'Design Gallery',
    ko: '디자인 갤러리',
    ja: 'デザインギャラリー',
    es: 'Galería de Diseños'
  },
  'footer.autoPrinting': {
    en: 'Auto Printing',
    ko: '자동 프린팅',
    ja: '自動プリンティング',
    es: 'Impresión Automática'
  },
  'footer.support': {
    en: 'Customer Support',
    ko: '고객지원',
    ja: 'カスタマーサポート',
    es: 'Atención al Cliente'
  },
  'footer.faq': {
    en: 'Frequently Asked Questions',
    ko: '자주 묻는 질문',
    ja: 'よくある質問',
    es: 'Preguntas Frecuentes'
  },
  'footer.contact': {
    en: 'Contact Us',
    ko: '문의하기',
    ja: 'お問い合わせ',
    es: 'Contáctanos'
  },
  'footer.terms': {
    en: 'Terms of Service',
    ko: '이용약관',
    ja: '利用規約',
    es: 'Términos de Servicio'
  },
  'footer.contactInfo': {
    en: 'Contact Information',
    ko: '연락처',
    ja: '連絡先',
    es: 'Información de Contacto'
  },
  'footer.copyright': {
    en: '© 2024 AI Nail Studio. All rights reserved.',
    ko: '© 2024 AI Nail Studio. All rights reserved.',
    ja: '© 2024 AI Nail Studio. All rights reserved.',
    es: '© 2024 AI Nail Studio. Todos los derechos reservados.'
  },

  // Admin Panel
  'admin.title': {
    en: 'Admin Panel',
    ko: '관리자 패널',
    ja: '管理者パネル',
    es: 'Panel de Administración'
  },
  'admin.subtitle': {
    en: 'Manage customers, appointments, and orders',
    ko: '고객, 예약, 주문을 관리하세요',
    ja: '顧客、予約、注文を管理してください',
    es: 'Administra clientes, citas y pedidos'
  },
  'admin.totalUsers': {
    en: 'Total Users',
    ko: '전체 사용자',
    ja: '総ユーザー数',
    es: 'Usuarios Totales'
  },
  'admin.totalAppointments': {
    en: 'Total Appointments',
    ko: '전체 예약',
    ja: '総予約数',
    es: 'Citas Totales'
  },
  'admin.totalOrders': {
    en: 'Total Orders',
    ko: '전체 주문',
    ja: '総注文数',
    es: 'Pedidos Totales'
  },
  'admin.todayAppointments': {
    en: 'Today\'s Appointments',
    ko: '오늘의 예약',
    ja: '本日の予約',
    es: 'Citas de Hoy'
  },
  'admin.appointments': {
    en: 'Appointments',
    ko: '예약 관리',
    ja: '予約管理',
    es: 'Citas'
  },
  'admin.users': {
    en: 'Users',
    ko: '사용자 관리',
    ja: 'ユーザー管理',
    es: 'Usuarios'
  },
  'admin.orders': {
    en: 'Orders',
    ko: '주문 관리',
    ja: '注文管理',
    es: 'Pedidos'
  },
  'admin.searchPlaceholder': {
    en: 'Search customers, dates, times...',
    ko: '고객, 날짜, 시간 검색...',
    ja: '顧客、日付、時間を検索...',
    es: 'Buscar clientes, fechas, horas...'
  },
  'admin.refresh': {
    en: 'Refresh',
    ko: '새로고침',
    ja: '更新',
    es: 'Actualizar'
  },
  'admin.appointmentManagement': {
    en: 'Appointment Management',
    ko: '예약 관리',
    ja: '予約管理',
    es: 'Gestión de Citas'
  },
  'admin.userManagement': {
    en: 'User Management',
    ko: '사용자 관리',
    ja: 'ユーザー管理',
    es: 'Gestión de Usuarios'
  },
  'admin.orderManagement': {
    en: 'Order Management',
    ko: '주문 관리',
    ja: '注文管理',
    es: 'Gestión de Pedidos'
  },
  'admin.customer': {
    en: 'Customer',
    ko: '고객',
    ja: '顧客',
    es: 'Cliente'
  },
  'admin.status': {
    en: 'Status',
    ko: '상태',
    ja: 'ステータス',
    es: 'Estado'
  },
  'admin.amount': {
    en: 'Amount',
    ko: '금액',
    ja: '金額',
    es: 'Cantidad'
  },
  'admin.actions': {
    en: 'Actions',
    ko: '작업',
    ja: 'アクション',
    es: 'Acciones'
  },
  'admin.name': {
    en: 'Name',
    ko: '이름',
    ja: '名前',
    es: 'Nombre'
  },
  'admin.email': {
    en: 'Email',
    ko: '이메일',
    ja: 'メール',
    es: 'Email'
  },
  'admin.joinDate': {
    en: 'Join Date',
    ko: '가입일',
    ja: '登録日',
    es: 'Fecha de Registro'
  },
  'admin.orderNumber': {
    en: 'Order #',
    ko: '주문번호',
    ja: '注文番号',
    es: 'Pedido #'
  },
  'admin.paymentStatus': {
    en: 'Payment Status',
    ko: '결제 상태',
    ja: '決済状況',
    es: 'Estado del Pago'
  },
  'admin.printStatus': {
    en: 'Print Status',
    ko: '인쇄 상태',
    ja: '印刷状況',
    es: 'Estado de Impresión'
  },
  'admin.orderDate': {
    en: 'Order Date',
    ko: '주문일',
    ja: '注文日',
    es: 'Fecha del Pedido'
  },
  'admin.editAppointment': {
    en: 'Edit Appointment',
    ko: '예약 수정',
    ja: '予約編集',
    es: 'Editar Cita'
  },
  'admin.editAppointmentDescription': {
    en: 'Make changes to this appointment here',
    ko: '이 예약의 정보를 수정하세요',
    ja: 'この予約の情報を編集してください',
    es: 'Realiza cambios a esta cita aquí'
  },
  'admin.editUser': {
    en: 'Edit User',
    ko: '사용자 수정',
    ja: 'ユーザー編集',
    es: 'Editar Usuario'
  },
  'admin.editUserDescription': {
    en: 'Make changes to this user here',
    ko: '이 사용자의 정보를 수정하세요',
    ja: 'このユーザーの情報を編集してください',
    es: 'Realiza cambios a este usuario aquí'
  },
  'admin.firstName': {
    en: 'First Name',
    ko: '이름',
    ja: '名前',
    es: 'Nombre'
  },
  'admin.lastName': {
    en: 'Last Name',
    ko: '성',
    ja: '姓',
    es: 'Apellido'
  },
  'admin.notes': {
    en: 'Notes',
    ko: '메모',
    ja: 'メモ',
    es: 'Notas'
  },
  'admin.save': {
    en: 'Save Changes',
    ko: '변경사항 저장',
    ja: '変更を保存',
    es: 'Guardar Cambios'
  },
  'admin.success': {
    en: 'Success',
    ko: '성공',
    ja: '成功',
    es: 'Éxito'
  },
  'admin.error': {
    en: 'Error',
    ko: '오류',
    ja: 'エラー',
    es: 'Error'
  },
  'admin.appointmentUpdated': {
    en: 'Appointment updated successfully',
    ko: '예약이 성공적으로 업데이트되었습니다',
    ja: '予約が正常に更新されました',
    es: 'Cita actualizada exitosamente'
  },
  'admin.appointmentDeleted': {
    en: 'Appointment deleted successfully',
    ko: '예약이 성공적으로 삭제되었습니다',
    ja: '予約が正常に削除されました',
    es: 'Cita eliminada exitosamente'
  },
  'admin.userUpdated': {
    en: 'User updated successfully',
    ko: '사용자 정보가 성공적으로 업데이트되었습니다',
    ja: 'ユーザー情報が正常に更新されました',
    es: 'Usuario actualizado exitosamente'
  },
  'admin.confirmDelete': {
    en: 'Are you sure you want to delete this appointment?',
    ko: '이 예약을 삭제하시겠습니까?',
    ja: 'この予約を削除してもよろしいですか？',
    es: '¿Estás seguro de que quieres eliminar esta cita?'
  },
  'common.save': {
    en: 'Save',
    ko: '저장',
    ja: '保存',
    es: 'Guardar'
  },
  'common.cancel': {
    en: 'Cancel',
    ko: '취소',
    ja: 'キャンセル',
    es: 'Cancelar'
  },
  'common.confirm': {
    en: 'Confirm',
    ko: '확인',
    ja: '確認',
    es: 'Confirmar'
  },
  'common.back': {
    en: 'Back',
    ko: '뒤로',
    ja: '戻る',
    es: 'Atrás'
  },
  'common.next': {
    en: 'Next',
    ko: '다음',
    ja: '次へ',
    es: 'Siguiente'
  }
};

// Language context and hooks  
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ko'; // Default to Korean
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
}

export const languageOptions = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
  { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' }
];