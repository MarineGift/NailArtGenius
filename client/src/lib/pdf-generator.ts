import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface NailDesignData {
  id: string;
  name: string;
  price: number;
  orderNumber: string;
  customerName: string;
  appointmentDate: string;
  appointmentTime: string;
  designCategory: string;
}

export const generateNailDesignPDF = async (designData: NailDesignData): Promise<void> => {
  try {
    // Create new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // PDF dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AI Nail Studio', pageWidth / 2, 30, { align: 'center' });

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text('네일 디자인 시술 가이드', pageWidth / 2, 45, { align: 'center' });

    // Order Information Box
    pdf.setDrawColor(233, 30, 99); // Pink color
    pdf.setFillColor(252, 231, 243); // Light pink
    pdf.roundedRect(margin, 60, pageWidth - (margin * 2), 50, 5, 5, 'FD');

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('주문 정보', margin + 10, 75);

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const orderInfo = [
      `주문번호: ${designData.orderNumber}`,
      `고객명: ${designData.customerName}`,
      `디자인명: ${designData.name}`,
      `가격: ₩${designData.price.toLocaleString()}`,
      `예약일시: ${designData.appointmentDate} ${designData.appointmentTime}`,
      `카테고리: ${designData.designCategory}`
    ];

    orderInfo.forEach((info, index) => {
      pdf.text(info, margin + 10, 88 + (index * 7));
    });

    // Design Preview Section
    let currentY = 130;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('디자인 미리보기', margin, currentY);

    // Design image placeholder (in real implementation, this would be the actual generated image)
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, currentY + 10, 80, 60, 'FD');

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('AI 생성된 네일 디자인', margin + 40, currentY + 43, { align: 'center' });
    pdf.text('(실제 시술 시 참고용)', margin + 40, currentY + 53, { align: 'center' });

    // Instructions Section
    currentY = 210;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('시술 안내사항', margin, currentY);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const instructions = [
      '1. 시술 전 손을 깨끗이 세척해주세요',
      '2. 기존 매니큐어는 완전히 제거해주세요',
      '3. 시술 시간은 약 60-90분 소요됩니다',
      '4. 시술 후 24시간 동안 물에 장시간 노출을 피해주세요',
      '5. 베이스코트 → 디자인 적용 → 탑코트 순서로 진행됩니다',
      '6. UV 램프 건조 과정이 포함됩니다',
      '7. 지속 기간: 약 7-14일 (개인차 있음)',
      '8. 문제 발생 시 매장으로 연락 부탁드립니다'
    ];

    instructions.forEach((instruction, index) => {
      pdf.text(instruction, margin, currentY + 15 + (index * 8));
    });

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('AI Nail Studio | 서울시 강남구 테헤란로 123 | 02-1234-5678', pageWidth / 2, pageHeight - 15, { align: 'center' });
    pdf.text(`생성일시: ${new Date().toLocaleString('ko-KR')}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

    // Save the PDF
    const fileName = `nail_design_${designData.orderNumber}_${designData.name.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);

    console.log('PDF generated successfully:', fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('PDF 생성 중 오류가 발생했습니다.');
  }
};

export const generateDesignPreviewPDF = async (elementId: string, fileName: string = 'nail_design_preview.pdf'): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('PDF로 변환할 요소를 찾을 수 없습니다.');
    }

    // Convert HTML element to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate image dimensions to fit page
    const imgAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = pageWidth / pageHeight;
    
    let imgWidth = pageWidth - 20; // 10mm margin on each side
    let imgHeight = imgWidth / imgAspectRatio;
    
    if (imgHeight > pageHeight - 20) {
      imgHeight = pageHeight - 20;
      imgWidth = imgHeight * imgAspectRatio;
    }

    // Center the image
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    
    // Add header text
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('네일 디자인 미리보기', pageWidth / 2, 15, { align: 'center' });

    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating preview PDF:', error);
    throw new Error('미리보기 PDF 생성 중 오류가 발생했습니다.');
  }
};