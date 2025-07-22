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
  'designs.titleLong': {
    en: 'Choose Nail Art Design',
    ko: '네일아트 디자인 선택',
    ja: 'ネイルアートデザインを選択',
    es: 'Elegir Diseño de Arte de Uñas'
  },
  'designs.subtitleOriginal': {
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
  'common.back': {
    en: 'Back',
    ko: '뒤로',
    ja: '戻る',
    es: 'Atrás'
  },
  'common.next': {
    en: 'Next',
    ko: '다음',
    ja: '次',
    es: 'Siguiente'
  },
  'common.previous': {
    en: 'Previous',
    ko: '이전',
    ja: '前',
    es: 'Anterior'
  },
  'common.close': {
    en: 'Close',
    ko: '닫기',
    ja: '閉じる',
    es: 'Cerrar'
  },
  'photoGuide.title': {
    en: 'Photography Guide',
    ko: '촬영 가이드',
    ja: '撮影ガイド',
    es: 'Guía de Fotografía'
  },
  'photoGuide.thumb.title': {
    en: 'Thumb Photography',
    ko: '엄지손톱 촬영법',
    ja: '親指撮影法',
    es: 'Fotografía del Pulgar'
  },
  'photoGuide.thumb.description': {
    en: 'Take a close-up photo of your thumb nail from the front. Make sure the entire nail is clearly visible.',
    ko: '엄지손톱을 정면에서 클로즈업으로 촬영해주세요. 손톱 전체가 선명하게 보이도록 합니다.',
    ja: '親指の爪を正面からクローズアップで撮影してください。爪全体がはっきり見えるようにしてください。',
    es: 'Toma una foto de primer plano de tu uña del pulgar desde el frente. Asegúrate de que toda la uña sea claramente visible.'
  },
  'photoGuide.fingers.title': {
    en: 'Four Fingers Photography',
    ko: '네손톱 촬영법',
    ja: '四本指撮影法',
    es: 'Fotografía de Cuatro Dedos'
  },
  'photoGuide.fingers.description': {
    en: 'Spread your four fingers naturally and take a photo so all nails are visible.',
    ko: '손가락 4개를 자연스럽게 펼치고 손톱이 모두 보이도록 촬영해주세요.',
    ja: '4本の指を自然に広げて、すべての爪が見えるように撮影してください。',
    es: 'Extiende tus cuatro dedos naturalmente y toma una foto para que todas las uñas sean visibles.'
  },
  'photoGuide.rightThumb.title': {
    en: 'Right Thumb',
    ko: '오른손 엄지',
    ja: '右手の親指',
    es: 'Pulgar Derecho'
  },
  'photoGuide.rightThumb.description': {
    en: 'Take a close-up photo of your right thumb nail only.',
    ko: '오른손 엄지손톱만 따로 클로즈업하여 촬영해주세요.',
    ja: '右手の親指の爪だけをクローズアップで撮影してください。',
    es: 'Toma una foto de primer plano solo de tu uña del pulgar derecho.'
  },
  'photoGuide.rightFingers.title': {
    en: 'Right Hand Four Nails',
    ko: '오른손 네손톱',
    ja: '右手四本の爪',
    es: 'Cuatro Uñas de la Mano Derecha'
  },
  'photoGuide.rightFingers.description': {
    en: 'Take a photo of your right hand\'s four nails spread out so all are visible.',
    ko: '오른손 네손톱을 펼친 상태로 전체가 보이게 촬영해주세요.',
    ja: '右手の4本の爪を広げた状態で全体が見えるように撮影してください。',
    es: 'Toma una foto de las cuatro uñas de tu mano derecha extendidas para que todas sean visibles.'
  },
  'photoGuide.leftThumb.title': {
    en: 'Left Thumb',
    ko: '왼손 엄지',
    ja: '左手の親指',
    es: 'Pulgar Izquierdo'
  },
  'photoGuide.leftThumb.description': {
    en: 'Take a close-up photo of your left thumb nail only.',
    ko: '왼손 엄지손톱만 따로 클로즈업하여 촬영해주세요.',
    ja: '左手の親指の爪だけをクローズアップで撮影してください。',
    es: 'Toma una foto de primer plano solo de tu uña del pulgar izquierdo.'
  },
  'photoGuide.leftFingers.title': {
    en: 'Left Hand Four Nails',
    ko: '왼손 네손톱',
    ja: '左手四本の爪',
    es: 'Cuatro Uñas de la Mano Izquierda'
  },
  'photoGuide.leftFingers.description': {
    en: 'Take a photo of your left hand\'s four nails spread out so all are visible.',
    ko: '왼손 네손톱을 펼친 상태로 전체가 보이게 촬영해주세요.',
    ja: '左手の4本の爪を広げた状態で全体が見えるように撮影してください。',
    es: 'Toma una foto de las cuatro uñas de tu mano izquierda extendidas para que todas sean visibles.'
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
  'admin.panelTitle': {
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
  'admin.appointmentsTab': {
    en: 'Appointments',
    ko: '예약 관리',
    ja: '予약管理',
    es: 'Citas'
  },
  'admin.usersTab': {
    en: 'Users',
    ko: '사용자 관리',
    ja: 'ユーザー管理',
    es: 'Usuarios'
  },
  'admin.ordersTab': {
    en: 'Orders',
    ko: '주문 관리',
    ja: '注文管理',
    es: 'Pedidos'
  },

  // Signup page
  'signup.title': {
    en: 'Sign Up',
    ko: '회원가입',
    ja: 'サインアップ',
    es: 'Registrarse'
  },
  'signup.subtitle': {
    en: 'Create your account to get started',
    ko: '시작하려면 계정을 생성하세요',
    ja: 'アカウントを作成して始めましょう',
    es: 'Crea tu cuenta para comenzar'
  },
  'signup.fullName': {
    en: 'Full Name',
    ko: '성명',
    ja: '氏名',
    es: 'Nombre Completo'
  },
  'signup.email': {
    en: 'Email',
    ko: '이메일',
    ja: 'メール',
    es: 'Correo Electrónico'
  },
  'signup.phoneNumber': {
    en: 'Phone Number',
    ko: '전화번호',
    ja: '電話番号',
    es: 'Número de Teléfono'
  },
  'signup.workplace': {
    en: 'Workplace',
    ko: '직장',
    ja: '職場',
    es: 'Lugar de Trabajo'
  },
  'signup.region': {
    en: 'Region',
    ko: '지역',
    ja: '地域',
    es: 'Región'
  },
  'signup.postalCode': {
    en: 'Postal Code',
    ko: '우편번호',
    ja: '郵便番号',
    es: 'Código Postal'
  },
  'signup.submit': {
    en: 'Create Account',
    ko: '계정 생성',
    ja: 'アカウント作成',
    es: 'Crear Cuenta'
  },
  'signup.alreadyHaveAccount': {
    en: 'Already have an account?',
    ko: '이미 계정이 있으신가요?',
    ja: 'すでにアカウントをお持ちですか？',
    es: '¿Ya tienes una cuenta?'
  },
  'signup.signIn': {
    en: 'Sign In',
    ko: '로그인',
    ja: 'ログイン',
    es: 'Iniciar Sesión'
  },

  // Header admin button
  'header.adminPanel': {
    en: 'Admin Panel',
    ko: '관리자 패널',
    ja: '管理者パネル',
    es: 'Panel de Administración'
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
  },
  'common.previous': {
    en: 'Previous',
    ko: '이전',
    ja: '前へ',
    es: 'Anterior'
  },
  'common.close': {
    en: 'Close',
    ko: '닫기',
    ja: '閉じる',
    es: 'Cerrar'
  },

  // Design Selection - Shopping Mall Style
  'designs.title': {
    en: 'Choose Nail Design',
    ko: '네일 디자인 선택',
    ja: 'ネイルデザインを選択',
    es: 'Elegir Diseño de Uñas'
  },
  'designs.subtitle': {
    en: 'Choose your favorite nail design',
    ko: '마음에 드는 네일 디자인을 선택해주세요',
    ja: 'お気に入りのネイルデザインを選んでください',
    es: 'Elige tu diseño de uñas favorito'
  },
  'designs.allCategories': {
    en: 'All',
    ko: '전체',
    ja: 'すべて',
    es: 'Todos'
  },
  'designs.classic': {
    en: 'Classic',
    ko: '클래식',
    ja: 'クラシック',
    es: 'Clásico'
  },
  'designs.french': {
    en: 'French',
    ko: '프렌치',
    ja: 'フレンチ',
    es: 'Francés'
  },
  'designs.gradient': {
    en: 'Gradient',
    ko: '그라데이션',
    ja: 'グラデーション',
    es: 'Gradiente'
  },
  'designs.glitter': {
    en: 'Glitter',
    ko: '글리터',
    ja: 'グリッター',
    es: 'Brillantina'
  },
  'designs.floral': {
    en: 'Floral',
    ko: '플로럴',
    ja: 'フローラル',
    es: 'Floral'
  },
  'designs.geometric': {
    en: 'Geometric',
    ko: '기하학',
    ja: '幾何学',
    es: 'Geométrico'
  },
  'designs.viewDetails': {
    en: 'View Details',
    ko: '상세보기',
    ja: '詳細を見る',
    es: 'Ver Detalles'
  },
  'designs.select': {
    en: 'Select',
    ko: '선택하기',
    ja: '選択',
    es: 'Seleccionar'
  },
  'designs.selected': {
    en: 'Selected',
    ko: '선택됨',
    ja: '選択済み',
    es: 'Seleccionado'
  },
  'designs.popular': {
    en: 'HOT',
    ko: 'HOT',
    ja: 'HOT',
    es: 'HOT'
  },
  'designs.new': {
    en: 'NEW',
    ko: 'NEW',
    ja: 'NEW',
    es: 'NEW'
  },
  'designs.selectedDesign': {
    en: 'Selected Design',
    ko: '선택된 디자인',
    ja: '選択されたデザイン',
    es: 'Diseño Seleccionado'
  },
  'designs.aiPreview': {
    en: 'AI Preview',
    ko: 'AI 미리보기',
    ja: 'AIプレビュー',
    es: 'Vista Previa IA'
  },
  'designs.proceed': {
    en: 'Proceed to Payment',
    ko: '결제하기',
    ja: '支払いに進む',
    es: 'Proceder al Pago'
  },

  // Design Detail Modal
  'designDetail.features': {
    en: 'Design Features',
    ko: '디자인 특징',
    ja: 'デザインの特徴',
    es: 'Características del Diseño'
  },
  'designDetail.professionalDesign': {
    en: '• Professional nail artist design',
    ko: '• 전문 네일 아티스트 디자인',
    ja: '• プロのネイルアーティストデザイン',
    es: '• Diseño de artista profesional de uñas'
  },
  'designDetail.highQuality': {
    en: '• High-quality nail printing material',
    ko: '• 고품질 네일 프린팅 소재',
    ja: '• 高品質ネイルプリンティング素材',
    es: '• Material de impresión de uñas de alta calidad'
  },
  'designDetail.duration': {
    en: '• Lasts approximately 7-10 days',
    ko: '• 약 7-10일 지속',
    ja: '• 約7-10日持続',
    es: '• Dura aproximadamente 7-10 días'
  },
  'designDetail.naturalFinish': {
    en: '• Natural finish',
    ko: '• 자연스러운 마감',
    ja: '• 自然な仕上がり',
    es: '• Acabado natural'
  },
  'designDetail.treatmentInfo': {
    en: 'Treatment Information',
    ko: '시술 안내',
    ja: '施術案内',
    es: 'Información del Tratamiento'
  },
  'designDetail.treatmentTime': {
    en: '• Treatment time: approximately 60 minutes',
    ko: '• 시술 시간: 약 60분',
    ja: '• 施術時間: 約60分',
    es: '• Tiempo de tratamiento: aproximadamente 60 minutos'
  },
  'designDetail.process': {
    en: '• Base coat + Design + Top coat',
    ko: '• 베이스코트 + 디자인 + 탑코트',
    ja: '• ベースコート + デザイン + トップコート',
    es: '• Capa base + Diseño + Capa superior'
  },
  'designDetail.uvLamp': {
    en: '• Professional UV lamp used',
    ko: '• 전문 UV 램프 사용',
    ja: '• 専用UVランプ使用',
    es: '• Uso de lámpara UV profesional'
  },
  'designDetail.waterproof': {
    en: '• 24-hour waterproof',
    ko: '• 24시간 방수',
    ja: '• 24時間防水',
    es: '• Resistente al agua 24 horas'
  },
  'designDetail.selectThis': {
    en: 'Select This Design',
    ko: '이 디자인 선택하기',
    ja: 'このデザインを選択',
    es: 'Seleccionar Este Diseño'
  },

  // AI Preview Page
  'preview.title': {
    en: 'AI Design Preview',
    ko: 'AI 디자인 미리보기',
    ja: 'AIデザインプレビュー',
    es: 'Vista Previa del Diseño IA'
  },
  'preview.subtitle': {
    en: 'See how your selected design will look on your nails',
    ko: '선택한 디자인이 회원님의 손톱에 어떻게 보일지 확인해보세요',
    ja: '選択したデザインがあなたの爪にどのように見えるかを確認してください',
    es: 'Ve cómo se verá tu diseño seleccionado en tus uñas'
  },
  'preview.generating': {
    en: 'AI is generating your design',
    ko: 'AI가 디자인을 생성하고 있습니다',
    ja: 'AIがデザインを生成しています',
    es: 'La IA está generando tu diseño'
  },
  'preview.progress': {
    en: 'Progress',
    ko: '진행상황',
    ja: '進行状況',
    es: 'Progreso'
  },
  'preview.analyzing': {
    en: 'Analyzing uploaded nail images...',
    ko: '업로드한 손톱 이미지를 분석하고 있습니다...',
    ja: 'アップロードされた爪の画像を分析しています...',
    es: 'Analizando las imágenes de uñas subidas...'
  },
  'preview.measuring': {
    en: 'Measuring nail shape and size...',
    ko: '손톱 형태와 크기를 측정하고 있습니다...',
    ja: '爪の形とサイズを測定しています...',
    es: 'Midiendo la forma y el tamaño de las uñas...'
  },
  'preview.applying': {
    en: 'Applying your selected design...',
    ko: '선택하신 디자인을 적용하고 있습니다...',
    ja: '選択されたデザインを適用しています...',
    es: 'Aplicando tu diseño seleccionado...'
  },
  'preview.finalizing': {
    en: 'Finalizing the image...',
    ko: '최종 이미지를 완성하고 있습니다...',
    ja: '最終画像を完成しています...',
    es: 'Finalizando la imagen...'
  },
  'preview.results': {
    en: 'AI Generation Results',
    ko: 'AI 생성 결과',
    ja: 'AI生成結果',
    es: 'Resultados de Generación IA'
  },
  'preview.regenerate': {
    en: 'Regenerate',
    ko: '다시 생성',
    ja: '再生成',
    es: 'Regenerar'
  },
  'preview.before': {
    en: 'Before',
    ko: '적용 전',
    ja: '適用前',
    es: 'Antes'
  },
  'preview.after': {
    en: 'After',
    ko: '적용 후',
    ja: '適用後',
    es: 'Después'
  },
  'preview.originalNails': {
    en: 'Original nail image',
    ko: '원본 손톱 이미지',
    ja: '元の爪の画像',
    es: 'Imagen original de uñas'
  },
  'preview.appliedDesign': {
    en: 'Classic French Applied',
    ko: '클래식 프렌치 적용',
    ja: 'クラシックフレンチ適用',
    es: 'Francés Clásico Aplicado'
  },
  'preview.disclaimer': {
    en: '💡 Actual treatment results may differ. This is for reference only.',
    ko: '💡 실제 시술 결과와 차이가 있을 수 있습니다. 참고용으로만 사용해주세요.',
    ja: '💡 実際の施術結果と異なる場合があります。参考用としてご利用ください。',
    es: '💡 Los resultados reales del tratamiento pueden diferir. Esto es solo de referencia.'
  },
  'preview.designInfo': {
    en: 'Design Information',
    ko: '디자인 정보',
    ja: 'デザイン情報',
    es: 'Información del Diseño'
  },
  'preview.designName': {
    en: 'Design Name',
    ko: '디자인명',
    ja: 'デザイン名',
    es: 'Nombre del Diseño'
  },
  'preview.estimatedTime': {
    en: 'Estimated Time',
    ko: '예상 소요시간',
    ja: '予想所要時間',
    es: 'Tiempo Estimado'
  },
  'preview.duration60': {
    en: '60 minutes',
    ko: '60분',
    ja: '60分',
    es: '60 minutos'
  },
  'preview.durability': {
    en: 'Durability',
    ko: '지속 기간',
    ja: '持続期間',
    es: 'Durabilidad'
  },
  'preview.durability710': {
    en: '7-10 days',
    ko: '7-10일',
    ja: '7-10日',
    es: '7-10 días'
  },
  'preview.price': {
    en: 'Price',
    ko: '가격',
    ja: '価格',
    es: 'Precio'
  },
  'preview.nextSteps': {
    en: 'Next Steps',
    ko: '다음 단계',
    ja: '次のステップ',
    es: 'Próximos Pasos'
  },
  'preview.proceedPayment': {
    en: 'Proceed to Payment',
    ko: '결제 진행하기',
    ja: '支払いに進む',
    es: 'Proceder al Pago'
  },
  'preview.chooseOther': {
    en: 'Choose Different Design',
    ko: '다른 디자인 선택',
    ja: '別のデザインを選択',
    es: 'Elegir Diseño Diferente'
  },
  'preview.savePdf': {
    en: 'Save Preview PDF',
    ko: '미리보기 PDF 저장',
    ja: 'プレビューPDFを保存',
    es: 'Guardar Vista Previa PDF'
  },
  'preview.saveSuccess': {
    en: 'Preview Saved',
    ko: '미리보기 저장 완료',
    ja: 'プレビュー保存完了',
    es: 'Vista Previa Guardada'
  },
  'preview.saveSuccessMsg': {
    en: 'Design preview PDF has been downloaded.',
    ko: '디자인 미리보기 PDF가 다운로드되었습니다.',
    ja: 'デザインプレビューPDFがダウンロードされました。',
    es: 'El PDF de vista previa del diseño ha sido descargado.'
  },
  'preview.saveFailed': {
    en: 'Save Failed',
    ko: '저장 실패',
    ja: '保存失敗',
    es: 'Error al Guardar'
  },
  'preview.saveFailedMsg': {
    en: 'PDF save failed. Please try again.',
    ko: 'PDF 저장 중 오류가 발생했습니다. 다시 시도해주세요.',
    ja: 'PDF保存中にエラーが発生しました。再度お試しください。',
    es: 'Error al guardar PDF. Por favor intenta de nuevo.'
  },

  // PDF and Printing
  'printing.title': {
    en: 'Treatment Progress',
    ko: '시술 진행 상황',
    ja: '施術進行状況',
    es: 'Progreso del Tratamiento'
  },
  'printing.subtitle': {
    en: 'Check your current order progress',
    ko: '현재 주문의 진행 상황을 확인하세요',
    ja: '現在のオーダーの進行状況を確認してください',
    es: 'Verifica el progreso de tu pedido actual'
  },
  'printing.downloadGuide': {
    en: 'Nail Design Guide Download',
    ko: '네일 디자인 가이드 다운로드',
    ja: 'ネイルデザインガイドダウンロード',
    es: 'Descarga de Guía de Diseño de Uñas'
  },
  'printing.downloadDescription': {
    en: 'Download a PDF nail design guide that can be referenced during treatment.',
    ko: '시술 시 참고할 수 있는 네일 디자인 가이드를 PDF로 다운로드하세요.',
    ja: '施術時に参考にできるネイルデザインガイドをPDFでダウンロードしてください。',
    es: 'Descarga una guía de diseño de uñas en PDF que puede ser referenciada durante el tratamiento.'
  },
  'printing.downloadBtn': {
    en: 'Download Treatment Guide PDF',
    ko: '시술 가이드 PDF 다운로드',
    ja: '施術ガイドPDFをダウンロード',
    es: 'Descargar Guía de Tratamiento PDF'
  },
  'printing.downloadInfo': {
    en: '• Includes order information, design preview, treatment instructions',
    ko: '• 주문정보, 디자인 미리보기, 시술 안내사항 포함',
    ja: '• 注文情報、デザインプレビュー、施術案内事項を含む',
    es: '• Incluye información del pedido, vista previa del diseño, instrucciones de tratamiento'
  },
  'printing.contactStore': {
    en: 'Contact Store',
    ko: '매장에 연락하기',
    ja: '店舗に連絡',
    es: 'Contactar Tienda'
  },
  'printing.goHome': {
    en: 'Go to Home',
    ko: '홈으로 돌아가기',
    ja: 'ホームに戻る',
    es: 'Ir a Casa'
  },
  'printing.pdfDownloadSuccess': {
    en: 'PDF Download Complete',
    ko: 'PDF 다운로드 완료',
    ja: 'PDFダウンロード完了',
    es: 'Descarga de PDF Completa'
  },
  'printing.pdfDownloadSuccessMsg': {
    en: 'Nail design guide PDF has been generated.',
    ko: '네일 디자인 가이드 PDF가 생성되었습니다.',
    ja: 'ネイルデザインガイドPDFが生成されました。',
    es: 'Se ha generado la guía de diseño de uñas en PDF.'
  },
  'printing.pdfDownloadFailed': {
    en: 'PDF Generation Failed',
    ko: 'PDF 생성 실패',
    ja: 'PDF生成失敗',
    es: 'Error en Generación de PDF'
  },
  'printing.pdfDownloadFailedMsg': {
    en: 'PDF generation failed. Please try again.',
    ko: 'PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
    ja: 'PDF生成中にエラーが発生しました。再度お試しください。',
    es: 'Error en la generación de PDF. Por favor intenta de nuevo.'
  },

  // Footer translations
  'footer.company.description': {
    en: 'Revolutionary AI-powered nail art studio providing personalized beauty experiences through cutting-edge technology.',
    ko: '최첨단 AI 기술로 개인 맞춤형 뷰티 경험을 제공하는 혁신적인 네일아트 스튜디오입니다.',
    ja: '最先端のAI技術でパーソナライズされた美容体験を提供する革新的なネイルアートスタジオです。',
    es: 'Estudio revolucionario de arte de uñas con IA que ofrece experiencias de belleza personalizadas a través de tecnología de vanguardia.'
  },
  'footer.quickLinks.title': {
    en: 'Quick Links',
    ko: '빠른 링크',
    ja: 'クイックリンク',
    es: 'Enlaces Rápidos'
  },
  'footer.quickLinks.about': {
    en: 'About Us',
    ko: '회사 소개',
    ja: '会社概要',
    es: 'Acerca de Nosotros'
  },
  'footer.quickLinks.services': {
    en: 'Services',
    ko: '서비스',
    ja: 'サービス',
    es: 'Servicios'
  },
  'footer.quickLinks.pricing': {
    en: 'Pricing',
    ko: '가격',
    ja: '料金',
    es: 'Precios'
  },
  'footer.quickLinks.gallery': {
    en: 'Gallery',
    ko: '갤러리',
    ja: 'ギャラリー',
    es: 'Galería'
  },
  'footer.quickLinks.contact': {
    en: 'Contact',
    ko: '연락처',
    ja: 'お問い合わせ',
    es: 'Contacto'
  },
  'footer.services.title': {
    en: 'Services',
    ko: '서비스',
    ja: 'サービス',
    es: 'Servicios'
  },
  'footer.services.aiAnalysis': {
    en: 'AI Analysis',
    ko: 'AI 분석',
    ja: 'AI分析',
    es: 'Análisis de IA'
  },
  'footer.services.customDesign': {
    en: 'Custom Design',
    ko: '맞춤 디자인',
    ja: 'カスタムデザイン',
    es: 'Diseño Personalizado'
  },
  'footer.services.printing': {
    en: 'Nail Printing',
    ko: '네일 프린팅',
    ja: 'ネイルプリンティング',
    es: 'Impresión de Uñas'
  },
  'footer.services.consultation': {
    en: 'Consultation',
    ko: '상담',
    ja: 'コンサルテーション',
    es: 'Consulta'
  },
  'footer.contact.title': {
    en: 'Contact Info',
    ko: '연락처 정보',
    ja: '連絡先情報',
    es: 'Información de Contacto'
  },
  'footer.contact.address': {
    en: '123 Teheran-ro, Gangnam-gu, Seoul, 2nd Floor',
    ko: '서울특별시 강남구 테헤란로 123, 2층',
    ja: 'ソウル特別市江南区テヘラン路123, 2階',
    es: 'Teheran-ro 123, Gangnam-gu, Seúl, 2º Piso'
  },
  'footer.contact.phone': {
    en: '02-1234-5678',
    ko: '02-1234-5678',
    ja: '02-1234-5678',
    es: '02-1234-5678'
  },
  'footer.contact.email': {
    en: 'info@ainailstudio.com',
    ko: 'info@ainailstudio.com',
    ja: 'info@ainailstudio.com',
    es: 'info@ainailstudio.com'
  },
  'footer.contact.hours.weekdays': {
    en: 'Mon-Fri: 09:00-18:00',
    ko: '월-금: 09:00-18:00',
    ja: '月-金: 09:00-18:00',
    es: 'Lun-Vie: 09:00-18:00'
  },
  'footer.contact.hours.weekend': {
    en: 'Sat-Sun: 10:00-17:00',
    ko: '토-일: 10:00-17:00',
    ja: '土-日: 10:00-17:00',
    es: 'Sáb-Dom: 10:00-17:00'
  },
  'footer.copyright': {
    en: 'All rights reserved.',
    ko: '모든 권리 보유.',
    ja: '全著作権所有。',
    es: 'Todos los derechos reservados.'
  },
  'footer.legal.privacy': {
    en: 'Privacy Policy',
    ko: '개인정보처리방침',
    ja: 'プライバシーポリシー',
    es: 'Política de Privacidad'
  },
  'footer.legal.terms': {
    en: 'Terms of Service',
    ko: '이용약관',
    ja: '利用規約',
    es: 'Términos de Servicio'
  },
  'footer.legal.cookies': {
    en: 'Cookie Policy',
    ko: '쿠키 정책',
    ja: 'クッキーポリシー',
    es: 'Política de Cookies'
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