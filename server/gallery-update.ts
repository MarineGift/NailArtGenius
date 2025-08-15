import { db } from './db';
import { gallery, galleryDesc } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Update gallery with Gallery_No unique identifiers and comprehensive data
export async function updateGalleryWithGalleryNo() {
  console.log('🖼️ Updating gallery with Gallery_No unique identifiers...');
  
  try {
    // Comprehensive gallery data with unique Gallery_No
    const galleryItems = [
      {
        galleryNo: 'GAL-001',
        title: 'Elegant Floral French Manicure',
        description: 'Classic French manicure enhanced with delicate floral designs and pearl accents',
        imagePath: '/uploads/gallery/floral-french-001.jpg',
        thumbnailPath: '/uploads/gallery/thumbs/floral-french-001-thumb.jpg',
        category: 'nail_art',
        tags: ['french', 'floral', 'elegant', 'wedding', 'classic'],
        displayOrder: 1,
        isActive: true
      },
      {
        galleryNo: 'GAL-002',
        title: 'Geometric Abstract Art Design',
        description: 'Modern geometric patterns with metallic gold and silver accents on matte black base',
        imagePath: '/uploads/gallery/geometric-abstract-002.jpg',
        thumbnailPath: '/uploads/gallery/thumbs/geometric-abstract-002-thumb.jpg',
        category: 'nail_art',
        tags: ['geometric', 'modern', 'metallic', 'abstract', 'trendy'],
        displayOrder: 2,
        isActive: true
      },
      {
        galleryNo: 'GAL-003',
        title: 'Luxury Spa Treatment Experience',
        description: 'Premium spa treatment including paraffin wax, essential oils, and hand massage',
        imagePath: '/uploads/gallery/luxury-spa-003.jpg',
        thumbnailPath: '/uploads/gallery/thumbs/luxury-spa-003-thumb.jpg',
        category: 'spa',
        tags: ['spa', 'luxury', 'treatment', 'relaxation', 'premium'],
        displayOrder: 3,
        isActive: true
      },
      {
        galleryNo: 'GAL-004',
        title: 'Seasonal Winter Wonderland',
        description: 'Winter-themed nail art with snowflakes, icy blue tones, and crystal embellishments',
        imagePath: '/uploads/gallery/winter-wonderland-004.jpg',
        thumbnailPath: '/uploads/gallery/thumbs/winter-wonderland-004-thumb.jpg',
        category: 'nail_art',
        tags: ['seasonal', 'winter', 'snowflake', 'crystal', 'blue'],
        displayOrder: 4,
        isActive: true
      },
      {
        galleryNo: 'GAL-005',
        title: 'Bridal Special Collection',
        description: 'Elegant bridal nail designs with lace patterns, pearls, and subtle shimmer',
        imagePath: '/uploads/gallery/bridal-special-005.jpg',
        thumbnailPath: '/uploads/gallery/thumbs/bridal-special-005-thumb.jpg',
        category: 'nail_art',
        tags: ['bridal', 'wedding', 'lace', 'pearls', 'elegant'],
        displayOrder: 5,
        isActive: true
      },
      {
        galleryNo: 'GAL-006',
        title: 'Minimalist Nude Collection',
        description: 'Sophisticated nude tones with subtle accent details and matte finish options',
        imagePath: '/uploads/gallery/minimalist-nude-006.jpg',
        thumbnailPath: '/uploads/gallery/thumbs/minimalist-nude-006-thumb.jpg',
        category: 'nail_art',
        tags: ['minimalist', 'nude', 'sophisticated', 'matte', 'subtle'],
        displayOrder: 6,
        isActive: true
      }
    ];

    // Detailed descriptions for gallery items
    const galleryDescriptions = [
      {
        galleryNo: 'GAL-001',
        techniquesUsed: 'French tip application, hand-painted floral details, pearl placement, UV gel curing',
        timeRequired: '90-120 minutes',
        difficultyLevel: 'Advanced',
        priceRange: '$65-85',
        maintenanceGuide: 'Avoid harsh chemicals, wear gloves when cleaning, moisturize cuticles daily',
        suitableFor: 'Weddings, special events, formal occasions, romantic dates',
        materials: ['UV gel polish', 'Fine art brushes', 'Pearl embellishments', 'Top coat', 'Base coat']
      },
      {
        galleryNo: 'GAL-002',
        techniquesUsed: 'Geometric stenciling, metallic foil application, matte base coating, precision line work',
        timeRequired: '75-90 minutes',
        difficultyLevel: 'Intermediate',
        priceRange: '$55-70',
        maintenanceGuide: 'Use cuticle oil daily, avoid picking at edges, professional touch-up every 2-3 weeks',
        suitableFor: 'Modern fashion events, art exhibitions, trendy social gatherings',
        materials: ['Matte base coat', 'Metallic foils', 'Geometric stencils', 'Fine liner brushes', 'Sealant top coat']
      },
      {
        galleryNo: 'GAL-003',
        techniquesUsed: 'Paraffin wax treatment, essential oil massage, cuticle care, nail strengthening',
        timeRequired: '60-90 minutes',
        difficultyLevel: 'Professional',
        priceRange: '$80-120',
        maintenanceGuide: 'Weekly cuticle oil application, monthly professional maintenance, daily hand cream',
        suitableFor: 'Stress relief, special self-care, pre-event preparation, therapeutic needs',
        materials: ['Paraffin wax', 'Essential oils', 'Cuticle treatments', 'Hand creams', 'Nail strengtheners']
      },
      {
        galleryNo: 'GAL-004',
        techniquesUsed: 'Snowflake stamping, crystal placement, gradient color blending, winter theme design',
        timeRequired: '85-105 minutes',
        difficultyLevel: 'Advanced',
        priceRange: '$70-90',
        maintenanceGuide: 'Gentle handling of crystals, avoid extreme temperatures, weekly conditioning treatment',
        suitableFor: 'Winter holidays, Christmas parties, New Year celebrations, winter weddings',
        materials: ['Stamping plates', 'Swarovski crystals', 'Winter-themed polishes', 'Gradient sponges', 'Crystal glue']
      },
      {
        galleryNo: 'GAL-005',
        techniquesUsed: 'Lace pattern application, pearl setting, delicate hand-painting, bridal color matching',
        timeRequired: '100-130 minutes',
        difficultyLevel: 'Expert',
        priceRange: '$80-110',
        maintenanceGuide: 'Careful handling during wedding preparations, professional pre-wedding touch-up, post-wedding care',
        suitableFor: 'Wedding ceremonies, bridal showers, engagement parties, anniversary celebrations',
        materials: ['Lace stencils', 'Bridal pearls', 'Wedding-tone polishes', 'Fine detail brushes', 'Long-wear top coat']
      },
      {
        galleryNo: 'GAL-006',
        techniquesUsed: 'Nude tone matching, matte finish application, subtle accent placement, minimalist design',
        timeRequired: '45-60 minutes',
        difficultyLevel: 'Beginner to Intermediate',
        priceRange: '$40-55',
        maintenanceGuide: 'Regular moisturizing, gentle filing, bi-weekly professional maintenance',
        suitableFor: 'Professional settings, everyday wear, minimalist fashion, understated elegance',
        materials: ['Nude polish collection', 'Matte top coat', 'Subtle accent materials', 'Natural base coat', 'Cuticle care']
      }
    ];

    // Clear existing gallery data
    await db.delete(galleryDesc);
    await db.delete(gallery);

    // Insert new gallery items with Gallery_No
    for (const item of galleryItems) {
      await db.insert(gallery).values(item);
    }

    // Insert detailed descriptions
    for (const desc of galleryDescriptions) {
      // Get the gallery item by galleryNo to get the ID
      const galleryItem = await db.select().from(gallery).where(eq(gallery.galleryNo, desc.galleryNo)).limit(1);
      
      if (galleryItem.length > 0) {
        await db.insert(galleryDesc).values({
          galleryId: galleryItem[0].id,
          techniquesUsed: desc.techniquesUsed,
          timeRequired: desc.timeRequired,
          difficultyLevel: desc.difficultyLevel,
          priceRange: desc.priceRange,
          maintenanceGuide: desc.maintenanceGuide,
          suitableFor: desc.suitableFor,
          materials: desc.materials
        });
      }
    }

    console.log(`✅ Successfully updated ${galleryItems.length} gallery items with Gallery_No unique identifiers`);
    console.log(`📝 Added detailed descriptions for all ${galleryDescriptions.length} gallery items`);
    
    return { success: true, galleryItems: galleryItems.length, descriptions: galleryDescriptions.length };
    
  } catch (error) {
    console.error('❌ Error updating gallery with Gallery_No:', error);
    throw error;
  }
}

// Function to get gallery data by Gallery_No
export async function getGalleryByGalleryNo(galleryNo: string) {
  try {
    const galleryItem = await db
      .select()
      .from(gallery)
      .where(eq(gallery.galleryNo, galleryNo))
      .limit(1);

    if (galleryItem.length === 0) {
      return { error: 'Gallery item not found' };
    }

    const description = await db
      .select()
      .from(galleryDesc)
      .where(eq(galleryDesc.galleryId, galleryItem[0].id))
      .limit(1);

    return {
      gallery: galleryItem[0],
      description: description.length > 0 ? description[0] : null
    };
  } catch (error) {
    console.error('Error fetching gallery by Gallery_No:', error);
    throw error;
  }
}