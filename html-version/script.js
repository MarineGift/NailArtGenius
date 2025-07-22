// Translation system with English as default
const translations = {
    // Navigation
    'nav.home': { ko: '홈', en: 'Home', ja: 'ホーム', es: 'Inicio' },
    'nav.services': { ko: '서비스', en: 'Services', ja: 'サービス', es: 'Servicios' },
    'nav.booking': { ko: '예약', en: 'Booking', ja: '予約', es: 'Reserva' },
    'nav.gallery': { ko: '갤러리', en: 'Gallery', ja: 'ギャラリー', es: 'Galería' },
    'nav.contact': { ko: '연락처', en: 'Contact', ja: 'お問い合わせ', es: 'Contacto' },

    // Home page
    'home.title': { ko: 'Connie\'s Nail', en: 'Connie\'s Nail', ja: 'Connie\'s Nail', es: 'Connie\'s Nail' },
    'home.subtitle': { ko: '프리미엄 네일 케어와 스파 서비스로 당신의 아름다움을 완성하세요', en: 'Complete your beauty with premium nail care and spa services', ja: 'プレミアムネイルケアとスパサービスで美しさを完成させましょう', es: 'Completa tu belleza con servicios premium de cuidado de uñas y spa' },
    'home.book_appointment': { ko: '예약하기', en: 'Book Appointment', ja: '予約する', es: 'Reservar cita' },
    'home.view_services': { ko: '서비스 보기', en: 'View Services', ja: 'サービスを見る', es: 'Ver servicios' },

    // Carousel
    'carousel.salon.title': { ko: 'Connie\'s Nail Salon', en: 'Connie\'s Nail Salon', ja: 'Connie\'s Nail Salon', es: 'Salón Connie\'s Nail' },
    'carousel.salon.description': { ko: '워싱턴 DC 프리미엄 네일 살롱', en: 'Premium Nail Salon in Washington DC', ja: 'ワシントンDCのプレミアムネイルサロン', es: 'Salón de uñas premium en Washington DC' },
    'carousel.art1.title': { ko: '아름다운 네일아트', en: 'Beautiful Nail Art', ja: '美しいネイルアート', es: 'Arte de uñas hermoso' },
    'carousel.art1.description': { ko: '전문가의 세심한 디자인', en: 'Expert meticulous design', ja: '専門家の繊細なデザイン', es: 'Diseño meticuloso de expertos' },
    'carousel.art2.title': { ko: 'AI 맞춤 네일', en: 'AI Custom Nails', ja: 'AIカスタムネイル', es: 'Uñas personalizadas con IA' },
    'carousel.art2.description': { ko: '혁신적인 AI 기술로 완성', en: 'Completed with innovative AI technology', ja: '革新的なAI技術で完成', es: 'Completado con tecnología IA innovadora' },

    // AI Service Section
    'ai.service_title': { ko: '⭐ 프리미엄 네일 서비스 예약 ⭐', en: '⭐ Premium Nail Service Booking ⭐', ja: '⭐ プレミアムネイルサービス予約 ⭐', es: '⭐ Reserva de Servicio Premium de Uñas ⭐' },
    'ai.service_subtitle': { ko: '전문가의 손길과 혁신적인 AI 기술로 완성된 완벽한 네일 케어 경험', en: 'Perfect nail care experience with expert touch and innovative AI technology', ja: '専門家の技と革新的なAI技術で完成された完璧なネイルケア体験', es: 'Experiencia perfecta de cuidado de uñas con toque experto y tecnología IA innovadora' },
    'ai.instant_booking': { ko: '즉시 예약', en: 'Instant Booking', ja: 'インスタント予約', es: 'Reserva Instantánea' },
    'ai.realtime_desc': { ko: '온라인으로 간편하게 예약하고 독점적인 예약 할인을 받으세요', en: 'Book online easily and receive exclusive booking discounts', ja: 'オンラインで簡単に予約し、独占的な予約割引を受けましょう', es: 'Reserve en línea fácilmente y reciba descuentos exclusivos de reserva' },
    'ai.special_offer': { ko: '특별 혜택', en: 'Special Offer', ja: '特別オファー', es: 'Oferta Especial' },
    'ai.special_desc': { ko: '온라인 예약 시 10% 할인 혜택', en: '10% discount on online bookings', ja: 'オンライン予約で10%割引', es: '10% de descuento en reservas en línea' },
    'ai.book_now': { ko: '지금 예약하세요', en: 'Book Now', ja: '今すぐ予約', es: 'Reservar Ahora' },

    // Services
    'services.title': { ko: 'Connie\'s Nail Services', en: 'Connie\'s Nail Services', ja: 'Connie\'s Nail サービス', es: 'Servicios de Connie\'s Nail' },
    'services.spa.title': { ko: 'Connie\'s Spa Specials', en: 'Connie\'s Spa Specials', ja: 'Connie\'s スパスペシャル', es: 'Especiales de Spa Connie\'s' },
    'services.spa.manicure': { ko: '스파 매니큐어', en: 'Spa Manicure', ja: 'スパマニキュア', es: 'Manicura de Spa' },
    'services.spa.pedicure': { ko: '스파 페디큐어', en: 'Spa Pedicure', ja: 'スパペディキュア', es: 'Pedicura de Spa' },
    'services.treatments.title': { ko: 'Connie\'s Nail Treatments', en: 'Connie\'s Nail Treatments', ja: 'Connie\'s ネイルトリートメント', es: 'Tratamientos de Uñas Connie\'s' },
    'services.treatments.regular_manicure': { ko: '일반 매니큐어', en: 'Regular Manicure', ja: '通常マニキュア', es: 'Manicura Regular' },
    'services.treatments.french_manicure': { ko: '프렌치 매니큐어', en: 'French Manicure', ja: 'フレンチマニキュア', es: 'Manicura Francesa' },
    'services.treatments.gel_manicure': { ko: '컬러 젤 매니큐어', en: 'Color Gel Manicure', ja: 'カラージェルマニキュア', es: 'Manicura de Gel de Color' },
    'services.treatments.gel_pedicure': { ko: '젤 페디큐어', en: 'Gel Pedicure', ja: 'ジェルペディキュア', es: 'Pedicura de Gel' },
    'services.waxing.title': { ko: '왁싱', en: 'Waxing', ja: 'ワックス脱毛', es: 'Depilación con Cera' },
    'services.waxing.eyebrows': { ko: '눈썹', en: 'Eyebrows', ja: '眉毛', es: 'Cejas' },
    'services.waxing.lip': { ko: '입술', en: 'Lip', ja: '唇', es: 'Labio' },
    'services.waxing.chin': { ko: '턱', en: 'Chin', ja: '顎', es: 'Barbilla' },
    'services.waxing.full_legs': { ko: '전체 다리', en: 'Full legs', ja: '脚全体', es: 'Piernas completas' },

    // Booking
    'booking.title': { ko: '예약 시스템', en: 'Booking System', ja: '予約システム', es: 'Sistema de Reservas' },
    'booking.select_service': { ko: '서비스 선택', en: 'Select Service', ja: 'サービス選択', es: 'Seleccionar Servicio' },
    'booking.select_date': { ko: '날짜 선택', en: 'Select Date', ja: '日付選択', es: 'Seleccionar Fecha' },
    'booking.select_time': { ko: '시간 선택', en: 'Select Time', ja: '時間選択', es: 'Seleccionar Hora' },
    'booking.name': { ko: '이름', en: 'Name', ja: '名前', es: 'Nombre' },
    'booking.phone': { ko: '전화번호', en: 'Phone', ja: '電話番号', es: 'Teléfono' },
    'booking.email': { ko: '이메일', en: 'Email', ja: 'メール', es: 'Correo electrónico' },
    'booking.notes': { ko: '요청사항', en: 'Notes', ja: 'ご要望', es: 'Notas' },
    'booking.name_placeholder': { ko: '성함을 입력해 주세요', en: 'Enter your name', ja: 'お名前を入力してください', es: 'Ingresa tu nombre' },
    'booking.notes_placeholder': { ko: '특별한 요청사항이 있으시면 입력해 주세요', en: 'Any special requests', ja: '特別なご要望があれば入力してください', es: 'Cualquier solicitud especial' },
    'booking.confirm_booking': { ko: '예약 확인', en: 'Confirm Booking', ja: '予約確認', es: 'Confirmar Reserva' },

    // Gallery
    'gallery.title': { ko: '네일아트 갤러리', en: 'Nail Art Gallery', ja: 'ネイルアートギャラリー', es: 'Galería de Arte de Uñas' },
    'gallery.subtitle': { ko: '전문 네일아트 디자인을 둘러보고 원하는 스타일을 선택하세요', en: 'Browse our professional nail art designs and choose your preferred style', ja: 'プロのネイルアートデザインを閲覧し、お好みのスタイルをお選びください', es: 'Explora nuestros diseños profesionales de arte de uñas y elige tu estilo preferido' },
    'gallery.classic_french_desc': { ko: '전통적인 프렌치 매니큐어 스타일', en: 'Traditional French manicure style', ja: '伝統的なフレンチマニキュアスタイル', es: 'Estilo tradicional de manicura francesa' },

    // Contact
    'contact.title': { ko: 'Connie\'s nail location', en: 'Connie\'s nail location', ja: 'Connie\'s nailの場所', es: 'Ubicación de Connie\'s nail' },
    'contact.salon_name': { ko: 'Connie\'s Nail Salon', en: 'Connie\'s Nail Salon', ja: 'Connie\'s Nail Salon', es: 'Salón de Uñas Connie\'s' },
    'contact.call_us': { ko: '전화번호 @ 202.898.0826', en: 'Call us @ 202.898.0826', ja: 'お電話 @ 202.898.0826', es: 'Llámanos @ 202.898.0826' },
    'contact.hours': { ko: '월요일 - 금요일 오전 10시부터 오후 7시까지 영업합니다', en: 'We are here Monday - Friday from 10:00am to 7:00pm', ja: '月曜日から金曜日の午前10時から午後7時まで営業しております', es: 'Estamos aquí de lunes a viernes de 10:00am a 7:00pm' },
    'contact.form.name': { ko: '성명', en: 'Full Name', ja: 'お名前', es: 'Nombre completo' },
    'contact.form.phone': { ko: '전화번호', en: 'Phone Number', ja: '電話番号', es: 'Número de teléfono' },
    'contact.form.inquiry': { ko: '문의내용', en: 'Inquiry', ja: 'お問い合わせ内容', es: 'Consulta' },
    'contact.form.submit': { ko: '문의 전송', en: 'Send Inquiry', ja: 'お問い合わせ送信', es: 'Enviar consulta' },
    
    // Additional missing translations
    'carousel.art3.title': { ko: '프리미엄 케어', en: 'Premium Care', ja: 'プレミアムケア', es: 'Cuidado Premium' },
    'carousel.art3.description': { ko: '최고급 네일 서비스 경험', en: 'Premium nail service experience', ja: '最高級ネイルサービス体験', es: 'Experiencia de servicio de uñas premium' }
};

// Current language (default to English)
let currentLanguage = 'en';

// Language management
function saveLanguage(lang) {
    localStorage.setItem('preferred-language', lang);
}

function loadLanguage() {
    const saved = localStorage.getItem('preferred-language');
    if (saved && ['en', 'ko', 'ja', 'es'].includes(saved)) {
        return saved;
    }
    return 'en'; // Default to English
}

function t(key) {
    const translation = translations[key];
    if (!translation) {
        console.warn(`Translation key "${key}" not found`);
        return key;
    }
    return translation[currentLanguage] || translation.en || key;
}

function updateLanguage(lang) {
    currentLanguage = lang;
    saveLanguage(lang);
    
    // Add transition class
    document.body.classList.add('language-switching');
    
    // Update all elements with data-key attributes
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        const translatedText = t(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.hasAttribute('data-placeholder')) {
                element.placeholder = translatedText;
            }
        } else {
            element.textContent = translatedText;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-placeholder');
        element.placeholder = t(key);
    });
    
    // Update language selector
    document.getElementById('language-select').value = lang;
    
    // Remove transition class after animation
    setTimeout(() => {
        document.body.classList.remove('language-switching');
    }, 200);
}

// Initialize language system
function initializeLanguage() {
    // Force English as default regardless of saved preference initially
    currentLanguage = 'en';
    const savedLang = loadLanguage();
    
    // Clear any existing Korean preferences and force English
    localStorage.removeItem('preferred-language');
    localStorage.setItem('preferred-language', 'en');
    
    // Update to English first
    updateLanguage('en');
    
    // If user had a different preference, respect it after initial load
    if (savedLang && savedLang !== 'en') {
        setTimeout(() => {
            updateLanguage(savedLang);
        }, 100);
    }
}

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function currentSlideIndex(index) {
    currentSlide = index - 1;
    showSlide(currentSlide);
}

// Auto-advance carousel
function startCarousel() {
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Toast notification system
function showToast(message, type = 'success', title = '') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        ${title ? `<h4>${title}</h4>` : ''}
        <p>${message}</p>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Form handling
function initializeForms() {
    // Booking form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                service: document.getElementById('service-select').value,
                date: document.getElementById('booking-date').value,
                time: document.getElementById('time-select').value,
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                email: document.getElementById('customer-email').value,
                notes: document.getElementById('booking-notes').value
            };
            
            // Validate required fields
            if (!formData.service || !formData.date || !formData.time || !formData.name || !formData.phone || !formData.email) {
                showToast(t('booking.required_fields'), 'error', t('booking.validation_error'));
                return;
            }
            
            // Show loading state
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = t('booking.submitting');
            submitBtn.disabled = true;
            
            try {
                // Simulate API call (replace with actual API endpoint)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                showToast(t('booking.success_message'), 'success', t('booking.success_title'));
                bookingForm.reset();
            } catch (error) {
                showToast(t('booking.error_message'), 'error', t('booking.error_title'));
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contact-name').value,
                phone: document.getElementById('contact-phone').value,
                inquiry: document.getElementById('contact-inquiry').value
            };
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call (replace with actual API endpoint)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                showToast(t('contact.form.success'), 'success', 'Success');
                contactForm.reset();
            } catch (error) {
                showToast('Failed to send inquiry. Please try again.', 'error', 'Error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Set minimum date for booking (today)
function setMinBookingDate() {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .ai-feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Force immediate English initialization
    currentLanguage = 'en';
    localStorage.setItem('preferred-language', 'en');
    
    // Initialize all components
    initializeLanguage();
    initializeNavigation();
    initializeForms();
    setMinBookingDate();
    initializeAnimations();
    startCarousel();
    
    // Language selector event listener
    const languageSelect = document.getElementById('language-select');
    languageSelect.value = 'en'; // Force English selection
    languageSelect.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });
    
    // Window functions for carousel controls (called from HTML)
    window.nextSlide = nextSlide;
    window.previousSlide = previousSlide;
    window.currentSlide = currentSlideIndex;
    
    // Force update all text elements to English immediately
    setTimeout(() => {
        updateLanguage('en');
    }, 50);
});

// Export functions for external use
window.ConnieNail = {
    updateLanguage,
    t,
    showToast
};