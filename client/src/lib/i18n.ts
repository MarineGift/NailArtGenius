import { useState } from 'react';

// Multi-language support for English, Korean, Japanese, and Spanish
export type Language = 'ko' | 'en' | 'ja' | 'es';

// Translation data structure
const translations = {
  // Navigation
  'nav.home': { ko: '홈', en: 'Home', ja: 'ホーム', es: 'Inicio' },
  'nav.services': { ko: '서비스', en: 'Services', ja: 'サービス', es: 'Servicios' },
  'nav.about': { ko: '소개', en: 'About', ja: 'について', es: 'Acerca de' },
  'nav.booking': { ko: '예약', en: 'Booking', ja: '予約', es: 'Reserva' },
  'nav.gallery': { ko: '갤러리', en: 'Gallery', ja: 'ギャラリー', es: 'Galería' },
  'nav.contact': { ko: '연락처', en: 'Contact', ja: 'お問い合わせ', es: 'Contacto' },
  'nav.login': { ko: '로그인', en: 'Login', ja: 'ログイン', es: 'Iniciar sesión' },
  'nav.logout': { ko: '로그아웃', en: 'Logout', ja: 'ログアウト', es: 'Cerrar sesión' },
  'nav.signup': { ko: '회원가입', en: 'Sign Up', ja: 'サインアップ', es: 'Registrarse' },
  'nav.photo_measurement': { ko: '사진 측정', en: 'Photo Measurement', ja: '写真測定', es: 'Medición de fotos' },
  'nav.design_studio': { ko: '디자인 스튜디오', en: 'Design Studio', ja: 'デザインスタジオ', es: 'Estudio de diseño' },
  'nav.analytics': { ko: '분석', en: 'Analytics', ja: 'アナリティクス', es: 'Análisis' },
  'nav.ai_generator': { ko: 'AI 네일아트 생성', en: 'AI Nail Art Generator', ja: 'AI ネイルアート生成', es: 'Generador de arte de uñas IA' },

  // Home page
  'home.title': { ko: 'Connie\'s Nail', en: 'Connie\'s Nail', ja: 'Connie\'s Nail', es: 'Connie\'s Nail' },
  'home.welcome': { ko: '안녕하세요, {name}님! 👋', en: 'Hello, {name}! 👋', ja: 'こんにちは、{name}さん！ 👋', es: '¡Hola, {name}! 👋' },
  'home.subtitle': { ko: '프리미엄 네일 케어와 스파 서비스로 당신의 아름다움을 완성하세요', en: 'Complete your beauty with premium nail care and spa services', ja: 'プレミアムネイルケアとスパサービスで美しさを完成させましょう', es: 'Completa tu belleza con servicios premium de cuidado de uñas y spa' },
  'home.book_appointment': { ko: '예약하기', en: 'Book Appointment', ja: '予約する', es: 'Reservar cita' },
  'home.view_services': { ko: '서비스 보기', en: 'View Services', ja: 'サービスを見る', es: 'Ver servicios' },
  'home.contact_us': { ko: '연락하기', en: 'Contact Us', ja: 'お問い合わせ', es: 'Contáctanos' },
  'home.get_started': { ko: '시작하기', en: 'Get Started', ja: '始める', es: 'Comenzar' },
  'home.test_system': { ko: '시스템 테스트', en: 'Test System', ja: 'システムテスト', es: 'Probar sistema' },
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

  // Booking page
  'booking.title': { ko: '예약 시스템', en: 'Booking System', ja: '予約システム', es: 'Sistema de reservas' },
  'booking.subtitle': { ko: '원하는 서비스와 시간을 선택해 주세요', en: 'Select your preferred service and time', ja: 'お好みのサービスと時間を選択してください', es: 'Selecciona tu servicio y hora preferidos' },
  'booking.select_service': { ko: '서비스 선택', en: 'Select Service', ja: 'サービス選択', es: 'Seleccionar servicio' },
  'booking.select_date': { ko: '날짜 선택', en: 'Select Date', ja: '日付選択', es: 'Seleccionar fecha' },
  'booking.select_time': { ko: '시간 선택', en: 'Select Time', ja: '時間選択', es: 'Seleccionar hora' },
  'booking.customer_info': { ko: '고객 정보', en: 'Customer Information', ja: 'お客様情報', es: 'Información del cliente' },
  'booking.name': { ko: '이름', en: 'Name', ja: '名前', es: 'Nombre' },
  'booking.phone': { ko: '전화번호', en: 'Phone', ja: '電話番号', es: 'Teléfono' },
  'booking.email': { ko: '이메일', en: 'Email', ja: 'メール', es: 'Correo electrónico' },
  'booking.notes': { ko: '요청사항', en: 'Notes', ja: 'ご要望', es: 'Notas' },
  'booking.name_placeholder': { ko: '성함을 입력해 주세요', en: 'Enter your name', ja: 'お名前を入力してください', es: 'Ingresa tu nombre' },
  'booking.notes_placeholder': { ko: '특별한 요청사항이 있으시면 입력해 주세요', en: 'Any special requests', ja: '特別なご要望があれば入力してください', es: 'Cualquier solicitud especial' },
  'booking.selected_date': { ko: '선택된 날짜', en: 'Selected Date', ja: '選択された日付', es: 'Fecha seleccionada' },
  'booking.no_slots_available': { ko: '해당 날짜에 이용 가능한 시간이 없습니다', en: 'No time slots available for this date', ja: 'この日付には利用可能な時間がありません', es: 'No hay horarios disponibles para esta fecha' },
  'booking.visit_type': { ko: '방문 유형', en: 'Visit Type', ja: '訪問タイプ', es: 'Tipo de visita' },
  'booking.visit_types.first_time': { ko: '첫 방문', en: 'First Visit', ja: '初回訪問', es: 'Primera visita' },
  'booking.visit_types.returning': { ko: '재방문', en: 'Returning', ja: '再訪問', es: 'Regreso' },
  'booking.visit_types.regular': { ko: '단골 고객', en: 'Regular Customer', ja: '常連客', es: 'Cliente habitual' },
  'booking.confirm_booking': { ko: '예약 확인', en: 'Confirm Booking', ja: '予約確認', es: 'Confirmar reserva' },
  'booking.submitting': { ko: '예약 중...', en: 'Booking...', ja: '予約中...', es: 'Reservando...' },
  'booking.success_title': { ko: '예약 완료', en: 'Booking Confirmed', ja: '予約完了', es: 'Reserva confirmada' },
  'booking.success_message': { ko: '예약이 성공적으로 완료되었습니다!', en: 'Your booking has been confirmed!', ja: 'ご予約が完了いたしました！', es: '¡Tu reserva ha sido confirmada!' },
  'booking.error_title': { ko: '예약 오류', en: 'Booking Error', ja: '予約エラー', es: 'Error de reserva' },
  'booking.error_message': { ko: '예약 중 오류가 발생했습니다.', en: 'An error occurred while booking.', ja: '予約中にエラーが発生しました。', es: 'Ocurrió un error durante la reserva.' },
  'booking.validation_error': { ko: '입력 오류', en: 'Validation Error', ja: '入力エラー', es: 'Error de validación' },
  'booking.required_fields': { ko: '필수 항목을 모두 입력해 주세요.', en: 'Please fill in all required fields.', ja: '必須項目をすべて入力してください。', es: 'Por favor completa todos los campos requeridos.' },
  
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
  
  // Gallery
  'gallery.title': { ko: '네일아트 갤러리', en: 'Nail Art Gallery', ja: 'ネイルアートギャラリー', es: 'Galería de Arte de Uñas' },
  'gallery.subtitle': { ko: '프로페셔널한 네일아트 디자인을 확인하고 원하는 스타일을 선택하세요', en: 'Browse our professional nail art designs and choose your preferred style', ja: 'プロフェッショナルなネイルアートデザインをご覧になり、お好みのスタイルをお選びください', es: 'Explore nuestros diseños profesionales de arte de uñas y elige tu estilo preferido' },
  
  // Chair Massage
  'services.massage.title': { ko: '체어 마사지', en: 'Chair Massage' },
  'services.massage.10_min': { ko: '10분', en: '10 Minutes' },
  'services.massage.15_min': { ko: '15분', en: '15 Minutes' },
  
  // Kids Services
  'services.kids.title': { ko: '12세 이하 어린이', en: 'For Kids Under 12' },
  'services.kids.mani_pedi': { ko: '매니 & 페디', en: 'Mani & Pedi' },
  'services.kids.finger_polish': { ko: '손톱 폴리시 체인지', en: 'Finger Polish Change' },
  'services.kids.toe_polish': { ko: '발톱 폴리시 체인지', en: 'Toe Polish Change' },

  // Real-time booking
  'realtime.title': { ko: '실시간 예약', en: 'Real-time Booking', ja: 'リアルタイム予約', es: 'Reserva en tiempo real' },
  'realtime.subtitle': { ko: '실시간 예약 현황을 확인하고 즉시 예약하세요', en: 'Check real-time availability and book instantly', ja: 'リアルタイムの空き状況を確認してすぐに予約してください', es: 'Consulta la disponibilidad en tiempo real y reserva al instante' },
  'realtime.availability_status': { ko: '예약 현황', en: 'Availability Status', ja: '予約状況', es: 'Estado de disponibilidad' },
  'realtime.total_slots': { ko: '총 {count}개 슬롯', en: 'Total {count} slots', ja: '合計{count}スロット', es: 'Total {count} espacios' },
  'realtime.available_slots': { ko: '예약 가능: {count}개', en: 'Available: {count}', ja: '予約可能: {count}', es: 'Disponible: {count}' },
  'realtime.booked_slots': { ko: '예약됨: {count}개', en: 'Booked: {count}', ja: '予約済み: {count}', es: 'Reservado: {count}' },
  'realtime.last_updated': { ko: '마지막 업데이트', en: 'Last Updated', ja: '最終更新', es: 'Última actualización' },
  'realtime.auto_refresh': { ko: '자동 새로고침', en: 'Auto Refresh', ja: '自動更新', es: 'Actualización automática' },
  'realtime.status.high': { ko: '예약 가능', en: 'Available', ja: '予約可能', es: 'Disponible' },
  'realtime.status.medium': { ko: '일부 시간 예약 가능', en: 'Partially Available', ja: '一部時間予約可能', es: 'Parcialmente disponible' },
  'realtime.status.low': { ko: '마감 임박', en: 'Almost Full', ja: '満席間近', es: 'Casi completo' },
  'realtime.status.full': { ko: '예약 마감', en: 'Fully Booked', ja: '満席', es: 'Completamente reservado' },
  'realtime.booked_label': { ko: '예약됨', en: 'Booked', ja: '予約済み', es: 'Reservado' },
  'realtime.booking_summary': { ko: '예약 요약', en: 'Booking Summary', ja: '予約概要', es: 'Resumen de reserva' },
  'realtime.service_label': { ko: '서비스', en: 'Service', ja: 'サービス', es: 'Servicio' },
  'realtime.date_label': { ko: '날짜', en: 'Date', ja: '日付', es: 'Fecha' },
  'realtime.time_label': { ko: '시간', en: 'Time', ja: '時間', es: 'Hora' },
  'realtime.customer_label': { ko: '고객명', en: 'Customer', ja: 'お客様名', es: 'Cliente' },
  'realtime.contact_label': { ko: '연락처', en: 'Contact', ja: '連絡先', es: 'Contacto' },
  'realtime.not_selected': { ko: '선택되지 않음', en: 'Not selected', ja: '選択されていません', es: 'No seleccionado' },
  'realtime.not_entered': { ko: '입력되지 않음', en: 'Not entered', ja: '入力されていません', es: 'No ingresado' },
  'realtime.no_availability': { ko: '해당 날짜의 예약 시간을 불러올 수 없습니다.', en: 'Unable to load booking times for this date.', ja: 'この日付の予約時間を読み込めません。', es: 'No se pueden cargar los horarios de reserva para esta fecha.' },

  // Contact page
  'contact.title': { ko: 'Connie\'s nail location', en: 'Connie\'s nail location', ja: 'Connie\'s nailの場所', es: 'Ubicación de Connie\'s nail' },
  'contact.salon_name': { ko: 'Connie\'s Nail Salon', en: 'Connie\'s Nail Salon', ja: 'Connie\'s Nail Salon', es: 'Salón de Uñas Connie\'s' },
  'contact.call_us': { ko: '전화번호 @ 202.898.0826', en: 'Call us @ 202.898.0826', ja: 'お電話 @ 202.898.0826', es: 'Llámanos @ 202.898.0826' },
  'contact.hours': { ko: '월요일 - 금요일 오전 10시부터 오후 7시까지 영업합니다', en: 'We are here Monday - Friday from 10:00am to 7:00pm', ja: '月曜日から金曜日の午前10時から午後7時まで営業しております', es: 'Estamos aquí de lunes a viernes de 10:00am a 7:00pm' },
  'contact.appointment_note': { ko: '전화로 예약해 주시기 바랍니다. 여러분을 만나뵙기를 기대합니다!', en: 'Kindly make your appointments by giving us a call. We look forward to seeing you!', ja: 'お電話でご予約をお願いいたします。皆様にお会いできることを楽しみにしております！', es: '¡Por favor hagan sus citas llamándonos. Esperamos conocerlos!' },

  // Footer translations
  'footer.company_description': { ko: '워싱턴 DC의 프리미엄 네일 살롱으로 전통적인 네일 케어와 혁신적인 AI 네일아트를 제공합니다.', en: 'Premium nail salon in Washington DC offering traditional nail care and innovative AI nail art.', ja: 'ワシントンDCのプレミアムネイルサロンで、伝統的なネイルケアと革新的なAIネイルアートを提供しています。', es: 'Salón de uñas premium en Washington DC que ofrece cuidado tradicional de uñas y arte de uñas AI innovador.' },
  'footer.quick_links': { ko: '빠른 링크', en: 'Quick Links', ja: 'クイックリンク', es: 'Enlaces rápidos' },
  'footer.services_title': { ko: '서비스', en: 'Services', ja: 'サービス', es: 'Servicios' },
  'footer.contact_title': { ko: '연락처', en: 'Contact', ja: 'お問い合わせ', es: 'Contacto' },
  'footer.spa_manicure': { ko: '스파 매니큐어', en: 'Spa Manicure', ja: 'スパマニキュア', es: 'Manicura de spa' },
  'footer.ai_nail_art': { ko: 'AI 네일아트', en: 'AI Nail Art', ja: 'AIネイルアート', es: 'Arte de uñas AI' },
  'footer.waxing_service': { ko: '왁싱 서비스', en: 'Waxing Service', ja: 'ワクシングサービス', es: 'Servicio de depilación' },
  'footer.massage_therapy': { ko: '마사지 테라피', en: 'Massage Therapy', ja: 'マッサージセラピー', es: 'Terapia de masaje' },
  'footer.hours_mon_fri': { ko: '월-금: 오전 10시 - 오후 7시', en: 'Mon-Fri: 10:00 AM - 7:00 PM', ja: '月-金: 午前10時 - 午後7時', es: 'Lun-Vie: 10:00 AM - 7:00 PM' },
  'footer.hours_weekend': { ko: '주말: 휴무', en: 'Weekend: Closed', ja: '週末: 休み', es: 'Fin de semana: Cerrado' },
  'footer.copyright': { ko: '© 2025 Connie\'s Nail. 모든 권리 보유.', en: '© 2025 Connie\'s Nail. All rights reserved.', ja: '© 2025 Connie\'s Nail. 全著作権所有。', es: '© 2025 Connie\'s Nail. Todos los derechos reservados.' },
  'footer.privacy_policy': { ko: '개인정보처리방침', en: 'Privacy Policy', ja: 'プライバシーポリシー', es: 'Política de privacidad' },
  'footer.terms_of_service': { ko: '이용약관', en: 'Terms of Service', ja: '利用規約', es: 'Términos de servicio' },
  'footer.cookie_policy': { ko: '쿠키 정책', en: 'Cookie Policy', ja: 'クッキーポリシー', es: 'Política de cookies' },
  
  // Contact page detailed translations
  'contact.where_title': { ko: '저희 위치는?', en: 'Where are we?', ja: '私たちはどこにいますか？', es: '¿Dónde estamos?' },
  'contact.building': { ko: 'The Ronald Reagan Building & International Trade Center', en: 'The Ronald Reagan Building & International Trade Center', ja: 'The Ronald Reagan Building & International Trade Center', es: 'The Ronald Reagan Building & International Trade Center' },
  'contact.space': { ko: 'Space C-084', en: 'Space C-084', ja: 'Space C-084', es: 'Espacio C-084' },
  'contact.address': { ko: '1300 Pennsylvania Avenue', en: '1300 Pennsylvania Avenue', ja: '1300 Pennsylvania Avenue', es: '1300 Pennsylvania Avenue' },
  'contact.city': { ko: 'Washington, DC 20004', en: 'Washington, DC 20004', ja: 'Washington, DC 20004', es: 'Washington, DC 20004' },
  'contact.directions_title': { ko: '찾아오시는 길', en: 'Directions', ja: 'アクセス', es: 'Direcciones' },
  'contact.metro_title': { ko: '지하철 이용', en: 'Metro Access', ja: '地下鉄アクセス', es: 'Acceso al Metro' },
  'contact.metro_directions': { ko: 'Federal Triangle 역(Blue/Orange/Silver Line)에서 하차 후 도보 2분거리입니다. 12th Street와 Pennsylvania Avenue 방향으로 나오시면 됩니다.', en: 'Take Metro to Federal Triangle station (Blue/Orange/Silver Line), then 2-minute walk. Exit towards 12th Street and Pennsylvania Avenue.', ja: 'フェデラルトライアングル駅（ブルー/オレンジ/シルバーライン）で下車後、徒歩2分です。12thストリートとペンシルベニアアベニュー方向に出てください。', es: 'Toma el Metro hasta la estación Federal Triangle (Línea Azul/Naranja/Plateada), luego camina 2 minutos. Sal hacia 12th Street y Pennsylvania Avenue.' },
  'contact.walking_title': { ko: '도보 안내', en: 'Walking Directions', ja: '徒歩案内', es: 'Direcciones a pie' },
  'contact.walking_directions': { ko: '건물 정면 입구로 들어오신 후 엘리베이터를 타고 C층으로 이동하세요. C-084호를 찾으시면 됩니다.', en: 'Enter through the main entrance, take elevator to C level, and look for room C-084.', ja: '正面玄関から入り、エレベーターでCフロアに上がり、C-084号室を探してください。', es: 'Ingresa por la entrada principal, toma el ascensor al nivel C y busca la habitación C-084.' },
  'contact.location_note': { ko: '건물 내부에 위치해 있어 찾기 어려울 수 있습니다. 길을 잃으셨다면 202.898.0826으로 전화주세요!', en: 'Located inside the building and may be hard to find. If you get lost, call us at 202.898.0826!', ja: '建物内にあるため見つけにくい場合があります。迷われた場合は202.898.0826にお電話ください！', es: 'Ubicado dentro del edificio y puede ser difícil de encontrar. ¡Si te pierdes, llámanos al 202.898.0826!' },
  'contact.feedback_title': { ko: '문의 및 피드백', en: 'Contact & Feedback', ja: 'お問い合わせ・フィードバック', es: 'Contacto y comentarios' },
  'contact.email_note': { ko: '서비스 문의, 피드백, 제안사항이 있으시면 언제든 이메일로 연락주세요.', en: 'For service inquiries, feedback, or suggestions, feel free to contact us via email anytime.', ja: 'サービスに関するお問い合わせ、フィードバック、ご提案がございましたら、いつでもメールでご連絡ください。', es: 'Para consultas de servicios, comentarios o sugerencias, no dudes en contactarnos por correo electrónico en cualquier momento.' },
  'contact.email': { ko: 'Sungimconniekim@gmail.com', en: 'Sungimconniekim@gmail.com', ja: 'Sungimconniekim@gmail.com', es: 'Sungimconniekim@gmail.com' },
  'contact.appointment_call': { ko: '예약은 전화로 부탁드립니다', en: 'Please call to make appointments', ja: 'ご予約はお電話でお願いします', es: 'Por favor llama para hacer citas' },
  'contact.open_maps': { ko: 'Google 지도에서 열기', en: 'Open in Google Maps', ja: 'Googleマップで開く', es: 'Abrir en Google Maps' },
  'contact.call_now': { ko: '지금 전화하기: 202.898.0826', en: 'Call Now: 202.898.0826', ja: '今すぐ電話: 202.898.0826', es: 'Llamar ahora: 202.898.0826' },
  
  // Contact Form
  'contact.form.title': { ko: '문의하기', en: 'Contact Us', ja: 'お問い合わせ', es: 'Contáctanos' },
  'contact.form.name': { ko: '성명', en: 'Full Name', ja: 'お名前', es: 'Nombre completo' },
  'contact.form.phone': { ko: '전화번호', en: 'Phone Number', ja: '電話番号', es: 'Número de teléfono' },
  'contact.form.inquiry': { ko: '문의내용', en: 'Inquiry', ja: 'お問い合わせ内容', es: 'Consulta' },
  'contact.form.submit': { ko: '문의 전송', en: 'Send Inquiry', ja: 'お問い合わせ送信', es: 'Enviar consulta' },
  'contact.form.success': { ko: '문의가 성공적으로 전송되었습니다', en: 'Inquiry sent successfully', ja: 'お問い合わせが正常に送信されました', es: 'Consulta enviada exitosamente' },

  // Landing page
  'landing.title': { ko: 'Connie\'s Nail에 오신 것을 환영합니다', en: 'Welcome to Connie\'s Nail', ja: 'Connie\'s Nailへようこそ', es: 'Bienvenido a Connie\'s Nail' },
  'landing.subtitle': { ko: '전문적인 네일 케어와 스파 서비스로 아름다움을 완성하세요', en: 'Complete your beauty with professional nail care and spa services', ja: 'プロフェッショナルなネイルケアとスパサービスで美しさを完成', es: 'Completa tu belleza con cuidado profesional de uñas y servicios de spa' },
  'landing.getStarted': { ko: '예약하기', en: 'Book Now', ja: '予約する', es: 'Reservar Ahora' },

  // Signup
  'signup.title': { ko: '회원가입', en: 'Sign Up', ja: 'サインアップ', es: 'Registrarse' },

  // How it Works
  'howItWorks.title': { ko: '작동 방식', en: 'How It Works', ja: '仕組み', es: 'Cómo Funciona' },
  'howItWorks.step1': { ko: '1. 손톱 사진 업로드', en: '1. Upload Nail Photos', ja: '1. ネイル写真をアップロード', es: '1. Subir Fotos de Uñas' },
  'howItWorks.step2': { ko: '2. AI 분석', en: '2. AI Analysis', ja: '2. AI分析', es: '2. Análisis AI' },
  'howItWorks.step3': { ko: '3. 디자인 선택', en: '3. Design Selection', ja: '3. デザイン選択', es: '3. Selección de Diseño' },
  'howItWorks.step4': { ko: '4. 결제', en: '4. Payment', ja: '4. 支払い', es: '4. Pago' },
  'howItWorks.step5': { ko: '5. 인쇄', en: '5. Printing', ja: '5. 印刷', es: '5. Impresión' },



  // Header/Admin
  'header.adminPanel': { ko: '관리자 패널', en: 'Admin Panel', ja: '管理者パネル', es: 'Panel de Administrador' },

  // Carousel
  'carousel.salon.title': { ko: 'Connie\'s Nail Salon', en: 'Connie\'s Nail Salon', ja: 'Connie\'s Nail Salon', es: 'Salón Connie\'s Nail' },
  'carousel.salon.description': { ko: '워싱턴 DC 프리미엄 네일 살롱', en: 'Premium Nail Salon in Washington DC', ja: 'ワシントンDCのプレミアムネイルサロン', es: 'Salón de uñas premium en Washington DC' },
  'carousel.art1.title': { ko: '아름다운 네일아트', en: 'Beautiful Nail Art', ja: '美しいネイルアート', es: 'Arte de uñas hermoso' },
  'carousel.art1.description': { ko: '전문가의 세심한 디자인', en: 'Expert meticulous design', ja: '専門家の繊細なデザイン', es: 'Diseño meticuloso de expertos' },
  'carousel.art2.title': { ko: 'AI 맞춤 네일', en: 'AI Custom Nails', ja: 'AIカスタムネイル', es: 'Uñas personalizadas con IA' },
  'carousel.art2.description': { ko: '혁신적인 AI 기술로 완성', en: 'Completed with innovative AI technology', ja: '革新的なAI技術で完成', es: 'Completado con tecnología IA innovadora' },
  'carousel.art3.title': { ko: '프리미엄 케어', en: 'Premium Care', ja: 'プレミアムケア', es: 'Cuidado premium' },
  'carousel.art3.description': { ko: '최고급 네일 서비스 경험', en: 'Premium nail service experience', ja: '最高級ネイルサービス体験', es: 'Experiencia de servicio de uñas premium' },


  'gallery.design_gallery': { ko: '네일아트 디자인 갤러리', en: 'Nail Art Design Gallery', ja: 'ネイルアートデザインギャラリー', es: 'Galería de Diseños de Arte de Uñas' },
  'gallery.classic_french_desc': { ko: '전통적인 프렌치 매니큐어 스타일', en: 'Traditional French manicure style', ja: '伝統的なフレンチマニキュアスタイル', es: 'Estilo tradicional de manicura francesa' },
  'gallery.duration_45min': { ko: '45분', en: '45 minutes', ja: '45分', es: '45 minutos' },
  'gallery.difficulty_beginner': { ko: '초급', en: 'Beginner', ja: '初級', es: 'Principiante' },
  'gallery.view_detail': { ko: '상세히 보기', en: 'View Detail', ja: '詳細を見る', es: 'Ver detalle' },
  
  // AI Service Section
  'ai.service_title': { ko: '⭐ 프리미엄 네일 서비스 예약 ⭐', en: '⭐ Premium Nail Service Booking ⭐', ja: '⭐ プレミアムネイルサービス予約 ⭐', es: '⭐ Reserva de Servicio Premium de Uñas ⭐' },
  'ai.service_subtitle': { ko: '전문가의 손길과 혁신적인 AI 기술로 완성된 완벽한 네일 케어 경험', en: 'Perfect nail care experience with expert touch and innovative AI technology', ja: '専門家の技と革新的なAI技術で完成された完璧なネイルケア体験', es: 'Experiencia perfecta de cuidado de uñas con toque experto y tecnología IA innovadora' },
  'ai.book_now': { ko: '지금 예약하세요', en: 'Book Now', ja: '今すぐ予約', es: 'Reservar Ahora' },
  'ai.instant_booking': { ko: '즉시 예약', en: 'Instant Booking', ja: 'インスタント予約', es: 'Reserva Instantánea' },
  'ai.realtime_desc': { ko: '온라인으로 간편하게 예약하고 독점적인 예약 할인을 받으세요', en: 'Book online easily and receive exclusive booking discounts', ja: 'オンラインで簡単に予約し、独占的な予約割引を受けましょう', es: 'Reserve en línea fácilmente y reciba descuentos exclusivos de reserva' },
  'ai.special_offer': { ko: '특별 혜택', en: 'Special Offer', ja: '特別オファー', es: 'Oferta Especial' },
  'ai.special_desc': { ko: '온라인 예약 시 10% 할인 혜택', en: '10% discount on online bookings', ja: 'オンライン予約で10%割引', es: '10% de descuento en reservas en línea' },
  'ai.book_appointment': { ko: '예약하기', en: 'Book Appointment', ja: '予約する', es: 'Reservar Cita' },
  
  // Errors
  'error.upload_failed': { ko: '업로드에 실패했습니다', en: 'Upload failed', ja: 'アップロードに失敗しました', es: 'Error en la carga' },
  'error.analysis_failed': { ko: 'AI 분석에 실패했습니다', en: 'AI analysis failed', ja: 'AI分析に失敗しました', es: 'Análisis AI falló' },
  'error.quota_exceeded': { ko: 'API 할당량이 초과되었습니다', en: 'API quota exceeded', ja: 'API割当量을超過しました', es: 'Cuota de API excedida' }
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
    if (saved && (saved === 'en' || saved === 'ko' || saved === 'ja' || saved === 'es')) {
      return saved;
    }
  } catch (e) {
    // Silent fail for environments without localStorage
  }
  
  // FORCE English as absolute default - no Korean fallback
  return 'en';
}

// Hook for using translations in components
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return loadLanguagePreference();
    }
    return 'en';
  });

  const t = (key: string, params?: { [key: string]: string | number }): string => {
    const translation = (translations as any)[key];
    if (!translation) {
      return key;
    }
    
    let text = translation[currentLanguage] || translation.en || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }
    
    return text;
  };

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    saveLanguagePreference(lang);
  };

  return { t, currentLanguage, changeLanguage };
}