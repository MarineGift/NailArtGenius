import { db } from './db';
import { carouselImages, gallery, galleryDesc, aiNailArtImages } from '@shared/schema';

export async function seedComprehensiveData() {
  console.log('🌱 Starting comprehensive data seeding...');

  try {
    // Seed Carousel Images - Converting current hardcoded images to database
    console.log('📸 Seeding carousel images...');
    
    const carouselData = [
      {
        page: 'home',
        imagePath: '/attached_assets/KakaoTalk_20250721_192724735_1753148426746.jpg',
        headerText: 'Professional Nail Care Services',
        detailedDescription: 'Experience premium nail care with our expert technicians using the latest techniques and high-quality products.',
        displayOrder: 1,
        isActive: true
      },
      {
        page: 'home',
        imagePath: '/attached_assets/KakaoTalk_20250721_192903601_1753232262709.jpg',
        headerText: 'Artistic Nail Designs',
        detailedDescription: 'Transform your nails with stunning artistic designs crafted by our skilled nail artists.',
        displayOrder: 2,
        isActive: true
      },
      {
        page: 'home',
        imagePath: '/attached_assets/KakaoTalk_20250721_192953866_1753232262709.jpg',
        headerText: 'Relaxing Spa Experience',
        detailedDescription: 'Unwind and rejuvenate with our comprehensive spa treatments in a serene environment.',
        displayOrder: 3,
        isActive: true
      },
      {
        page: 'home',
        imagePath: '/attached_assets/nailart1_1753154093464.jpg',
        headerText: 'Elegant Nail Art Collection',
        detailedDescription: 'Discover our signature nail art collection featuring elegant designs for every occasion.',
        displayOrder: 4,
        isActive: true
      },
      {
        page: 'home',
        imagePath: '/attached_assets/nailart2_1753154093464.jpg',
        headerText: 'Seasonal Special Designs',
        detailedDescription: 'Stay trendy with our seasonal nail art designs that capture the essence of every season.',
        displayOrder: 5,
        isActive: true
      },
      {
        page: 'home',
        imagePath: '/attached_assets/nailart3_1753154093464.jpg',
        headerText: 'Bridal Nail Packages',
        detailedDescription: 'Make your special day perfect with our exclusive bridal nail packages and wedding designs.',
        displayOrder: 6,
        isActive: true
      }
    ];

    for (const item of carouselData) {
      await db.insert(carouselImages).values(item).onConflictDoNothing();
    }

    // Seed Gallery Items with comprehensive English content
    console.log('🖼️ Seeding gallery items...');
    
    const galleryData = [
      {
        title: 'Classic French Manicure',
        description: 'Timeless elegance with our signature French manicure',
        imagePath: '/attached_assets/KakaoTalk_20250721_223405822_01_1753153723937.jpg',
        category: 'nail_art',
        tags: ['classic', 'french', 'elegant', 'professional'],
        displayOrder: 1,
        isActive: true
      },
      {
        title: 'Floral Design Collection',
        description: 'Delicate floral patterns for a feminine touch',
        imagePath: '/attached_assets/KakaoTalk_20250721_223405822_02_1753153723938.jpg',
        category: 'nail_art',
        tags: ['floral', 'feminine', 'spring', 'artistic'],
        displayOrder: 2,
        isActive: true
      },
      {
        title: 'Geometric Pattern Art',
        description: 'Modern geometric designs for contemporary style',
        imagePath: '/attached_assets/KakaoTalk_20250721_223405822_03_1753153723938.jpg',
        category: 'nail_art',
        tags: ['geometric', 'modern', 'contemporary', 'bold'],
        displayOrder: 3,
        isActive: true
      },
      {
        title: 'Glitter & Sparkle',
        description: 'Glamorous sparkle effects for special occasions',
        imagePath: '/attached_assets/KakaoTalk_20250721_223405822_04_1753153723938.jpg',
        category: 'nail_art',
        tags: ['glitter', 'sparkle', 'glamorous', 'party'],
        displayOrder: 4,
        isActive: true
      },
      {
        title: 'Minimalist Elegance',
        description: 'Simple yet sophisticated minimal designs',
        imagePath: '/attached_assets/KakaoTalk_20250721_223405822_05_1753153723938.jpg',
        category: 'nail_art',
        tags: ['minimalist', 'simple', 'sophisticated', 'clean'],
        displayOrder: 5,
        isActive: true
      },
      {
        title: 'Spa Treatment Room',
        description: 'Relaxing environment for premium spa services',
        imagePath: '/attached_assets/2025062712531758680_0_600_1753148426744.jpg',
        category: 'spa',
        tags: ['spa', 'relaxing', 'treatment', 'luxury'],
        displayOrder: 6,
        isActive: true
      },
      {
        title: 'Professional Treatment Setup',
        description: 'State-of-the-art equipment and sterile environment',
        imagePath: '/attached_assets/2025070117363378753_0_600_1753148426745.jpg',
        category: 'treatment',
        tags: ['professional', 'sterile', 'equipment', 'safety'],
        displayOrder: 7,
        isActive: true
      },
      {
        title: 'Nail Care Before & After',
        description: 'Dramatic transformation showcasing our expertise',
        imagePath: '/attached_assets/nailart4_1753154093465.jpg',
        category: 'before_after',
        tags: ['transformation', 'before_after', 'results', 'professional'],
        displayOrder: 8,
        isActive: true
      }
    ];

    const insertedGalleryItems = [];
    for (const item of galleryData) {
      const [inserted] = await db.insert(gallery).values(item).returning();
      insertedGalleryItems.push(inserted);
    }

    // Seed Gallery Detailed Descriptions
    console.log('📝 Seeding gallery detailed descriptions...');
    
    const galleryDescData = [
      {
        galleryId: insertedGalleryItems[0].id, // Classic French Manicure
        detailTitle: 'Classic French Manicure - Timeless Elegance',
        detailDescription: 'Our signature French manicure represents the pinnacle of nail care elegance. Using premium quality products and precise techniques, we create the perfect pink and white combination that complements any outfit and occasion.',
        technicalDetails: 'Base coat application, precise white tip painting, pink nail bed coverage, high-gloss top coat finish',
        duration: '45-60 minutes',
        price: '$45 - Premium French Manicure',
        beforeAfterImages: ['/attached_assets/nailart5_1753154093465.jpg'],
        additionalImages: ['/attached_assets/nailart6_1753154093465.jpg'],
        tips: 'Maintain your French manicure with cuticle oil daily and avoid harsh chemicals. Schedule touch-ups every 2-3 weeks.'
      },
      {
        galleryId: insertedGalleryItems[1].id, // Floral Design
        detailTitle: 'Floral Design Collection - Artistic Expression',
        detailDescription: 'Transform your nails into a canvas of natural beauty with our hand-painted floral designs. Each flower is meticulously crafted using specialized nail art brushes and premium acrylic paints.',
        technicalDetails: 'Hand-painted technique, multiple color layers, detail brush work, protective seal coating',
        duration: '75-90 minutes',
        price: '$65 - Custom Floral Design',
        beforeAfterImages: [],
        additionalImages: [],
        tips: 'Floral designs last longer with proper top coat maintenance. Avoid excessive water exposure in the first 24 hours.'
      },
      {
        galleryId: insertedGalleryItems[2].id, // Geometric Pattern
        detailTitle: 'Geometric Pattern Art - Modern Style',
        detailDescription: 'Express your contemporary style with our precision geometric patterns. Using advanced stenciling techniques and steady hand work, we create clean lines and perfect symmetry.',
        technicalDetails: 'Precision stenciling, gradient applications, geometric alignment, matte and gloss combinations',
        duration: '60-75 minutes',
        price: '$55 - Geometric Pattern Design',
        beforeAfterImages: [],
        additionalImages: [],
        tips: 'Geometric designs maintain their crisp appearance with weekly top coat applications.'
      },
      {
        galleryId: insertedGalleryItems[3].id, // Glitter & Sparkle
        detailTitle: 'Glitter & Sparkle - Glamorous Finish',
        detailDescription: 'Add stunning sparkle to your look with our premium glitter applications. From subtle shimmer to full glamour, we create the perfect level of sparkle for any occasion.',
        technicalDetails: 'Premium glitter application, gradient sparkle effects, holographic elements, durable top coating',
        duration: '50-65 minutes',
        price: '$70 - Glitter & Sparkle Design',
        beforeAfterImages: [],
        additionalImages: [],
        tips: 'Glitter nails require gentle removal with acetone and cotton pads. Allow 15-20 minutes for proper removal.'
      },
      {
        galleryId: insertedGalleryItems[4].id, // Minimalist
        detailTitle: 'Minimalist Elegance - Sophisticated Simplicity',
        detailDescription: 'Embrace the beauty of simplicity with our minimalist nail designs. Clean lines, neutral tones, and subtle accents create a sophisticated look perfect for professional settings.',
        technicalDetails: 'Clean application technique, neutral color palette, subtle accent details, natural finish',
        duration: '30-45 minutes',
        price: '$40 - Minimalist Design',
        beforeAfterImages: [],
        additionalImages: [],
        tips: 'Minimalist designs are low-maintenance and perfect for extending wear with simple top coat applications.'
      },
      {
        galleryId: insertedGalleryItems[5].id, // Spa Treatment Room
        detailTitle: 'Premium Spa Treatment Experience',
        detailDescription: 'Step into our tranquil spa environment designed for ultimate relaxation. Our treatment rooms feature comfortable seating, ambient lighting, and a peaceful atmosphere for your nail care journey.',
        technicalDetails: 'Sanitized treatment stations, ergonomic seating, proper ventilation, ambient lighting',
        duration: 'Various treatment durations available',
        price: 'Treatment prices vary by service',
        beforeAfterImages: [],
        additionalImages: [],
        tips: 'Arrive 10 minutes early to settle in and enjoy the full relaxation experience.'
      },
      {
        galleryId: insertedGalleryItems[6].id, // Professional Setup
        detailTitle: 'Professional Treatment Setup - Safety First',
        detailDescription: 'Experience peace of mind with our professional-grade equipment and strict sanitation protocols. Every tool is sterilized, and all surfaces are disinfected between clients.',
        technicalDetails: 'UV sterilization, disposable tools where applicable, hospital-grade disinfectants, ventilation systems',
        duration: 'Setup maintained throughout all services',
        price: 'Included in all service prices',
        beforeAfterImages: [],
        additionalImages: [],
        tips: 'Our safety protocols ensure a hygienic environment. Feel free to ask about our sanitation procedures.'
      },
      {
        galleryId: insertedGalleryItems[7].id, // Before & After
        detailTitle: 'Nail Transformation - Before & After Results',
        detailDescription: 'Witness the remarkable transformation possible with professional nail care. From damaged or neglected nails to beautiful, healthy-looking results.',
        technicalDetails: 'Assessment, repair work, strengthening treatments, protective coatings, artistic enhancement',
        duration: '90-120 minutes for full transformation',
        price: '$80-120 depending on condition and desired result',
        beforeAfterImages: [],
        additionalImages: [],
        tips: 'Nail transformations require patience and multiple sessions for best results. Follow aftercare instructions carefully.'
      }
    ];

    for (const desc of galleryDescData) {
      await db.insert(galleryDesc).values(desc).onConflictDoNothing();
    }

    // Seed AI Nail Art sample data
    console.log('🤖 Seeding AI nail art sample data...');
    
    const aiNailArtData = [
      {
        customerPhone: '010-1111-2222',
        nailPosition: 'right_index',
        direction: 'front',
        originalImagePath: '/uploads/ai_nails/sample_nail_01.jpg',
        aiGeneratedImagePath: '/uploads/ai_generated/elegant_rose_design.jpg',
        designPrompt: 'Create an elegant rose design with soft pink gradients and gold accents',
        nailName: 'Elegant Rose Design',
        sessionId: 'ai_session_001'
      },
      {
        customerPhone: '010-1111-2222',
        nailPosition: 'right_middle',
        direction: 'front',
        originalImagePath: '/uploads/ai_nails/sample_nail_02.jpg',
        aiGeneratedImagePath: '/uploads/ai_generated/geometric_gold.jpg',
        designPrompt: 'Modern geometric pattern with gold lines and navy blue base',
        nailName: 'Geometric Gold Pattern',
        sessionId: 'ai_session_001'
      },
      {
        customerPhone: '010-3333-4444',
        nailPosition: 'left_thumb',
        direction: 'front',
        originalImagePath: '/uploads/ai_nails/sample_nail_03.jpg',
        aiGeneratedImagePath: '/uploads/ai_generated/cherry_blossom.jpg',
        designPrompt: 'Delicate cherry blossom design with pink petals and brown branches',
        nailName: 'Cherry Blossom Spring',
        sessionId: 'ai_session_002'
      },
      {
        customerPhone: '010-5555-6666',
        nailPosition: 'right_ring',
        direction: 'front',
        originalImagePath: '/uploads/ai_nails/sample_nail_04.jpg',
        aiGeneratedImagePath: '/uploads/ai_generated/ocean_waves.jpg',
        designPrompt: 'Ocean wave design with blue gradients and white foam details',
        nailName: 'Ocean Waves',
        sessionId: 'ai_session_003'
      }
    ];

    for (const aiData of aiNailArtData) {
      await db.insert(aiNailArtImages).values(aiData).onConflictDoNothing();
    }

    console.log('✅ Comprehensive data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding comprehensive data:', error);
    throw error;
  }
}