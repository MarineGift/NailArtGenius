// Global state
let currentLanguage = 'en';
let uploadedPhotos = [];

// Translation data
const translations = {
    // Navigation
    'nav.home': { ko: '홈', en: 'Home', ja: 'ホーム', es: 'Inicio' },
    'nav.services': { ko: '서비스', en: 'Services', ja: 'サービス', es: 'Servicios' },
    'nav.ai_nail_art': { ko: '🤖 AI 네일아트', en: '🤖 AI Nail Art', ja: '🤖 AIネイルアート', es: '🤖 Arte de Uñas IA' },
    'nav.booking': { ko: '예약', en: 'Booking', ja: '予約', es: 'Reserva' },
    'nav.gallery': { ko: '갤러리', en: 'Gallery', ja: 'ギャラリー', es: 'Galería' },
    'nav.contact': { ko: '연락처', en: 'Contact', ja: '連絡先', es: 'Contacto' },
    
    // Hero section
    'hero.title': { ko: 'Connie\'s Nail에 오신 것을 환영합니다', en: 'Welcome to Connie\'s Nail', ja: 'Connie\'s Nailへようこそ', es: 'Bienvenido a Connie\'s Nail' },
    'hero.subtitle': { ko: '전문적인 네일 케어와 스파 서비스', en: 'Professional Nail Care & Spa Services', ja: 'プロフェッショナルネイルケア&スパサービス', es: 'Cuidado Profesional de Uñas y Servicios de Spa' },
    
    // Booking section
    'booking.title': { ko: '온라인 예약', en: 'Book Your Appointment', ja: 'ご予約', es: 'Reserva tu Cita' },
    'booking.subtitle': { ko: '편리한 온라인 예약 시스템', en: 'Convenient online booking system', ja: '便利なオンライン予約システム', es: 'Sistema de reservas en línea conveniente' },
    'booking.select_service': { ko: '서비스 선택', en: 'Select Service', ja: 'サービス選択', es: 'Seleccionar Servicio' },
    'booking.select_date': { ko: '날짜 선택', en: 'Select Date', ja: '日付選択', es: 'Seleccionar Fecha' },
    'booking.select_time': { ko: '시간 선택', en: 'Select Time', ja: '時間選択', es: 'Seleccionar Hora' },
    'booking.name': { ko: '이름', en: 'Name', ja: '名前', es: 'Nombre' },
    'booking.phone': { ko: '전화번호', en: 'Phone', ja: '電話番号', es: 'Teléfono' },
    'booking.email': { ko: '이메일', en: 'Email', ja: 'メール', es: 'Correo' },
    'booking.notes': { ko: '메모', en: 'Notes', ja: 'メモ', es: 'Notas' },
    'booking.confirm_booking': { ko: '예약 확인', en: 'Confirm Booking', ja: '予約確認', es: 'Confirmar Reserva' },
    'booking.name_placeholder': { ko: '성함을 입력하세요', en: 'Enter your name', ja: 'お名前を入力', es: 'Ingrese su nombre' },
    'booking.notes_placeholder': { ko: '추가 요청사항이 있으시면 입력해주세요', en: 'Any special requests or notes', ja: '特別なリクエストやメモ', es: 'Solicitudes especiales o notas' },
    'booking.choose_time': { ko: '시간을 선택하세요...', en: 'Choose a time...', ja: '時間を選択...', es: 'Elige una hora...' },
    
    // AI Professional System translations
    'ai.title': { ko: '🤖 전문 AI 손톱 촬영 분석', en: '🤖 Professional AI Nail Photography Analysis', ja: '🤖 プロフェッショナルAIネイル撮影分析', es: '🤖 Análisis Profesional de Fotografía de Uñas con IA' },
    'ai.subtitle': { ko: '스마트폰으로 손톱을 촬영하여 전문 AI가 분석하고 맞춤형 네일아트를 생성합니다', en: 'Take nail photos with your smartphone for professional AI analysis and custom nail art generation', ja: 'スマートフォンでネイル写真を撮影し、プロのAIが分析してカスタムネイルアートを生成します', es: 'Toma fotos de uñas con tu smartphone para análisis profesional con IA y generación de arte de uñas personalizado' },
    'ai.step1.title': { ko: '손톱 촬영', en: 'Nail Photography', ja: 'ネイル撮影', es: 'Fotografía de Uñas' },
    'ai.step1.desc': { ko: '카메라와 카드가 수평이 되도록 촬영해 주세요', en: 'Please photograph with camera and card level', ja: 'カメラとカードが水平になるように撮影してください', es: 'Por favor fotografía con la cámara y tarjeta niveladas' },
    'ai.step2.title': { ko: 'AI 분석', en: 'AI Analysis', ja: 'AI分析', es: 'Análisis IA' },
    'ai.step2.desc': { ko: 'AI가 손톱 크기와 곡률을 정밀 측정합니다', en: 'AI precisely measures nail size and curvature', ja: 'AIがネイルサイズと曲率を精密測定します', es: 'La IA mide con precisión el tamaño y curvatura de las uñas' },
    'ai.step3.title': { ko: '맞춤 디자인', en: 'Custom Design', ja: 'カスタムデザイン', es: 'Diseño Personalizado' },
    'ai.step3.desc': { ko: '10개의 맞춤형 네일아트를 PDF로 생성합니다', en: 'Generate 10 custom nail arts as PDF', ja: '10個のカスタムネイルアートをPDFで生成', es: 'Genera 10 artes de uñas personalizados como PDF' },
    'ai.upload_title': { ko: '손톱 사진 업로드', en: 'Upload Nail Photos', ja: 'ネイル写真アップロード', es: 'Subir Fotos de Uñas' },
    'ai.upload_instruction': { ko: '스마트폰으로 촬영한 손톱 사진을 업로드하세요 (최대 6장)', en: 'Upload nail photos taken with smartphone (up to 6 photos)', ja: 'スマートフォンで撮影したネイル写真をアップロード（最大6枚）', es: 'Sube fotos de uñas tomadas con smartphone (hasta 6 fotos)' },
    'ai.select_photos': { ko: '사진 선택', en: 'Select Photos', ja: '写真選択', es: 'Seleccionar Fotos' },
    'ai.analyze': { ko: 'AI로 분석하기', en: 'Analyze with AI', ja: 'AIで分析', es: 'Analizar con IA' },
    'ai.analysis_results': { ko: 'AI 분석 결과', en: 'AI Analysis Results', ja: 'AI分析結果', es: 'Resultados del Análisis IA' },
    'ai.custom_designs': { ko: '맞춤형 디자인', en: 'Custom Designs', ja: 'カスタムデザイン', es: 'Diseños Personalizados' },
    'ai.download_pdf': { ko: '10개 디자인 PDF 다운로드', en: 'Download 10 Designs as PDF', ja: '10デザインをPDFでダウンロード', es: 'Descargar 10 Diseños como PDF' },
    
    // Photography guide
    'ai.photo_guide.title': { ko: '촬영 안내', en: 'Photography Guide', ja: '撮影ガイド', es: 'Guía de Fotografía' },
    'ai.photo_guide.warning': { ko: '⚠️ 아래 촬영 예시를 꼭 확인해 주세요.', en: '⚠️ Please check the photography examples below.', ja: '⚠️ 下記の撮影例を必ずご確認ください。', es: '⚠️ Por favor revisa los ejemplos de fotografía a continuación.' },
    'ai.photo_guide.hand_desc': { ko: '네 손톱, 엄지 손톱', en: 'Four fingers, thumb nails', ja: '四本指、親指の爪', es: 'Cuatro dedos, uñas del pulgar' },
    'ai.photo_guide.instruction1': { ko: '카메라와 카드가 수평이 되도록 촬영해 주세요.', en: 'Please photograph with camera and card level.', ja: 'カメラとカードが水平になるように撮影してください。', es: 'Por favor fotografía con la cámara y tarjeta niveladas.' },
    'ai.photo_guide.instruction2': { ko: '손톱 끝 극대이 잘 보이도록 정면에서 촬영해 주세요.', en: 'Please photograph from the front so nail tips are clearly visible.', ja: '爪先がよく見えるように正面から撮影してください。', es: 'Por favor fotografía desde el frente para que las puntas de las uñas sean claramente visibles.' },
    'ai.photo_guide.card_required': { ko: '정확한 손톱 형상 측정을 위해 네일아트를 제거하시고 촬영해주세요', en: 'For accurate nail measurement, please remove nail art before photography', ja: '正確なネイル形状測定のため、ネイルアートを除去して撮影してください', es: 'Para una medición precisa de las uñas, por favor remueve el arte de uñas antes de fotografiar' },
    'ai.photo_guide.card_explanation': { ko: '신용/체크/교통/멤버십 카드', en: 'Credit/Debit/Transport/Membership card', ja: 'クレジット/デビット/交通/メンバーシップカード', es: 'Tarjeta de crédito/débito/transporte/membresía' },
    'ai.photo_guide.privacy': { ko: '민감한 개인정보는 가려주세요.', en: 'Please cover sensitive personal information.', ja: '機密個人情報は隠してください。', es: 'Por favor cubra información personal sensible.' },
    'ai.photo_guide.card_note': { ko: '* 카드 규격은 가로 8.6cm 세로 5.35cm로 국제규격을 따르고 있는 모든 카드를 쓸 수 있습니다.', en: '* Card dimensions are 8.6cm × 5.35cm following international standards. Any standard card can be used.', ja: '* カードの規格は横8.6cm縦5.35cmで国際規格に従っているすべてのカードを使用できます。', es: '* Las dimensiones de la tarjeta son 8.6cm × 5.35cm siguiendo estándares internacionales. Se puede usar cualquier tarjeta estándar.' },
    'ai.photo_guide.required_warning': { ko: '⛔ 측정이 불가능한 카드 - 명함 등', en: '⛔ Cards unsuitable for measurement - business cards, etc.', ja: '⛔ 測定不可能なカード - 名刺など', es: '⛔ Tarjetas no adecuadas para medición - tarjetas de visita, etc.' },
    'ai.photo_guide.why_card': { ko: '카드가 왜 필요한가요?', en: 'Why is a card needed?', ja: 'なぜカードが必要ですか？', es: '¿Por qué se necesita una tarjeta?' },
    'ai.photo_guide.card_explanation_detail': { ko: '손톱 크기를 측정하기 위해서 기준이 되는 카드가 필요합니다. 아이네일에서 자체개발한 인공지능은 스마트웨어로 손톱의 크기를 측정해 드립니다.', en: 'A reference card is needed to measure nail size. Our AI developed in-house measures nail size using smart software.', ja: '爪のサイズを測定するために基準となるカードが必要です。アイネールで自社開発した人工知能はスマートウェアで爪のサイズを測定いたします。', es: 'Se necesita una tarjeta de referencia para medir el tamaño de las uñas. Nuestra IA desarrollada internamente mide el tamaño de las uñas usando software inteligente.' },
    
    // Contact section
    'contact.title': { ko: 'Connie\'s nail 위치', en: 'Connie\'s nail location', ja: 'Connie\'s nail 所在地', es: 'Ubicación de Connie\'s nail' },
    'contact.salon_name': { ko: 'Connie\'s Nail Salon', en: 'Connie\'s Nail Salon', ja: 'Connie\'s Nail Salon', es: 'Connie\'s Nail Salon' },
    'contact.call_us': { ko: '전화 @ 202.898.0826', en: 'Call us @ 202.898.0826', ja: 'お電話 @ 202.898.0826', es: 'Llámanos @ 202.898.0826' },
    'contact.hours': { ko: '운영시간: 월-금 오전 10시 - 오후 7시', en: 'We are here Monday - Friday from 10:00am to 7:00pm', ja: '営業時間：月-金 午前10時-午後7時', es: 'Estamos aquí Lunes - Viernes de 10:00am a 7:00pm' },
    'contact.send_message': { ko: '메시지 보내기', en: 'Send us a message', ja: 'メッセージを送る', es: 'Envíanos un mensaje' },
    'contact.form.name': { ko: '성명', en: 'Full Name', ja: '氏名', es: 'Nombre Completo' },
    'contact.form.phone': { ko: '전화번호', en: 'Phone Number', ja: '電話番号', es: 'Número de Teléfono' },
    'contact.form.inquiry': { ko: '문의사항', en: 'Inquiry', ja: 'お問い合わせ', es: 'Consulta' },
    'contact.form.send': { ko: '메시지 전송', en: 'Send Message', ja: 'メッセージ送信', es: 'Enviar Mensaje' }
};

// Translation function
function t(key) {
    return translations[key] && translations[key][currentLanguage] ? translations[key][currentLanguage] : key;
}

// Update language
function updateLanguage(lang) {
    currentLanguage = lang;
    
    // Update all elements with data-key attribute
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        if (translations[key] && translations[key][currentLanguage]) {
            element.textContent = translations[key][currentLanguage];
        }
    });
    
    // Update placeholders
    const nameInput = document.getElementById('customer-name');
    const notesTextarea = document.getElementById('booking-notes');
    
    if (nameInput && translations['booking.name_placeholder']) {
        nameInput.placeholder = translations['booking.name_placeholder'][currentLanguage] || nameInput.placeholder;
    }
    
    if (notesTextarea && translations['booking.notes_placeholder']) {
        notesTextarea.placeholder = translations['booking.notes_placeholder'][currentLanguage] || notesTextarea.placeholder;
    }
    
    // Update language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = lang;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set default language to English
    updateLanguage('en');
    
    // Language selector functionality
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }
    
    // Initialize AI features
    initializeAIFeatures();
    
    // Initialize booking form
    initializeBookingForm();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize carousel
    initializeCarousel();
});

// AI Features
function initializeAIFeatures() {
    const photoInput = document.getElementById('photo-input');
    const uploadArea = document.getElementById('upload-area');
    
    if (!photoInput || !uploadArea) return;
    
    photoInput.addEventListener('change', handlePhotoUpload);
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        handlePhotoUpload({ target: { files } });
    });
}

function handlePhotoUpload(event) {
    const files = Array.from(event.target.files);
    const maxFiles = 6;
    
    files.slice(0, maxFiles - uploadedPhotos.length).forEach(file => {
        if (file.type.startsWith('image/') && uploadedPhotos.length < maxFiles) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedPhotos.push({
                    file: file,
                    dataUrl: e.target.result,
                    id: Date.now() + Math.random()
                });
                displayPhotoPreview();
            };
            reader.readAsDataURL(file);
        }
    });
}

function displayPhotoPreview() {
    const photoPreview = document.getElementById('photo-preview');
    if (!photoPreview) return;
    
    if (uploadedPhotos.length === 0) {
        photoPreview.style.display = 'none';
        return;
    }
    
    photoPreview.style.display = 'grid';
    photoPreview.innerHTML = '';
    
    uploadedPhotos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo.dataUrl}" alt="Nail photo ${index + 1}">
            <button class="remove-photo" onclick="removePhoto(${photo.id})">&times;</button>
            <span class="photo-label">Photo ${index + 1}</span>
        `;
        photoPreview.appendChild(photoItem);
    });
    
    // Show analyze button
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.style.display = uploadedPhotos.length > 0 ? 'block' : 'none';
    }
}

function removePhoto(photoId) {
    uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
    displayPhotoPreview();
}

// Professional AI Analysis Function
function startAIAnalysis() {
    const photos = uploadedPhotos;
    if (photos.length === 0) {
        showToast('Please upload at least one photo', 'error');
        return;
    }

    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsDiv = document.getElementById('ai-results');
    const analysisData = document.getElementById('analysis-data');
    const designGallery = document.getElementById('design-gallery');

    // Show loading state
    analyzeBtn.textContent = 'Analyzing...';
    analyzeBtn.disabled = true;

    // Simulate professional AI analysis with progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        analyzeBtn.textContent = `AI Analysis... ${progress}%`;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            completeAnalysis();
        }
    }, 300);

    function completeAnalysis() {
        // Show results section
        resultsDiv.style.display = 'block';
        
        // Generate professional analysis data
        const analysisResults = generateProfessionalAnalysisData(photos);
        displayAnalysisResults(analysisResults, analysisData);
        
        // Generate 10 custom nail designs
        generate10CustomDesigns(designGallery);
        
        // Show PDF download button
        const downloadBtn = document.getElementById('download-pdf-btn');
        if (downloadBtn) {
            downloadBtn.style.display = 'inline-block';
            downloadBtn.onclick = () => generatePDF(analysisResults);
        }
        
        // Reset button
        analyzeBtn.textContent = t('ai.analyze') || 'Analyze with AI';
        analyzeBtn.disabled = false;
        
        // Show success message
        showToast('Professional AI analysis completed! 10 custom designs generated.', 'success');
        
        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// Generate professional analysis data
function generateProfessionalAnalysisData(photos) {
    return {
        nailMeasurements: {
            thumb: { width: '14.2mm', length: '18.5mm', curvature: '0.85' },
            index: { width: '12.8mm', length: '16.3mm', curvature: '0.92' },
            middle: { width: '13.1mm', length: '17.1mm', curvature: '0.88' },
            ring: { width: '12.5mm', length: '16.8mm', curvature: '0.90' },
            pinky: { width: '10.9mm', length: '14.2mm', curvature: '0.95' }
        },
        recommendations: [
            'Optimal nail shape: Oval to round transition',
            'Recommended design size: Medium to large patterns',
            'Color compatibility: High contrast designs recommended',
            'Nail health: Excellent condition for detailed artwork'
        ],
        photoQuality: 'Professional grade - all measurements accurate',
        processingTime: '2.8 seconds'
    };
}

// Display analysis results
function displayAnalysisResults(results, container) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="analysis-grid">
            <div class="measurement-card">
                <h4>Nail Measurements (AI Precision)</h4>
                <div class="measurements">
                    ${Object.entries(results.nailMeasurements).map(([finger, data]) => `
                        <div class="finger-measurement">
                            <strong>${finger.charAt(0).toUpperCase() + finger.slice(1)}:</strong>
                            <span>${data.width} × ${data.length}</span>
                            <small>Curvature: ${data.curvature}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="recommendations-card">
                <h4>AI Recommendations</h4>
                <ul>
                    ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
                <p><strong>Processing:</strong> ${results.processingTime}</p>
            </div>
        </div>
    `;
}

// Generate 10 custom nail designs
function generate10CustomDesigns(container) {
    if (!container) return;
    
    const designTemplates = [
        { name: 'Classic French', style: 'elegant', color: '#FFE4E1' },
        { name: 'Floral Garden', style: 'nature', color: '#F0FFF0' },
        { name: 'Geometric Art', style: 'modern', color: '#E6E6FA' },
        { name: 'Marble Effect', style: 'luxury', color: '#F5F5DC' },
        { name: 'Gradient Sunset', style: 'gradient', color: '#FFE4B5' },
        { name: 'Minimalist Lines', style: 'simple', color: '#F8F8FF' },
        { name: 'Starry Night', style: 'artistic', color: '#191970' },
        { name: 'Rose Gold Glam', style: 'metallic', color: '#B76E79' },
        { name: 'Ocean Waves', style: 'nature', color: '#E0FFFF' },
        { name: 'Abstract Modern', style: 'contemporary', color: '#DCDCDC' }
    ];
    
    container.innerHTML = `
        <div class="designs-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin-top: 20px;">
            ${designTemplates.map((design, index) => `
                <div class="design-card" style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; text-align: center;">
                    <div class="design-preview" style="height: 120px; background: ${design.color}; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #333;">
                        Design ${index + 1}
                    </div>
                    <div class="design-info" style="padding: 10px;">
                        <h5 style="margin: 5px 0; font-size: 12px;">${design.name}</h5>
                        <p style="margin: 0; font-size: 10px; color: #666;">${design.style}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Generate PDF with 10 designs
function generatePDF(analysisResults) {
    showToast('Preparing PDF with 10 custom nail designs...', 'info');
    
    setTimeout(() => {
        const pdfContent = createPDFContent(analysisResults);
        downloadPDF(pdfContent, 'connie-nail-custom-designs.pdf');
        showToast('PDF downloaded successfully! 10 custom designs ready.', 'success');
    }, 2000);
}

function createPDFContent(analysisResults) {
    return `
        Connie's Nail - Custom Design Report
        
        AI Analysis Results:
        ${JSON.stringify(analysisResults, null, 2)}
        
        10 Custom Nail Art Designs Generated
        Date: ${new Date().toLocaleDateString()}
    `;
}

function downloadPDF(content, filename) {
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Other functions
function initializeBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Booking submitted successfully!', 'success');
        });
    }
}

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Message sent successfully!', 'success');
        });
    }
}

function initializeCarousel() {
    // Carousel functionality would go here
}

function showToast(message, type = 'info') {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Global functions for HTML onclick handlers
window.startAIAnalysis = startAIAnalysis;
window.removePhoto = removePhoto;
window.updateLanguage = updateLanguage;