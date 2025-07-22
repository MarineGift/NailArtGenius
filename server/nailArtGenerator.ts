import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { NailMeasurement } from "./nailMeasurementAI";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface NailArtGenerationRequest {
  measurements: NailMeasurement[];
  stylePreferences: {
    personality: string;
    colorHarmony: string;
    patternPreference: string;
    designIntensity: string;
    inspirationKeywords: string[];
  };
  sessionId: string;
}

export interface GeneratedNailArt {
  fingerType: string;
  imageUrl: string;
  designDescription: string;
  appliedMeasurements: NailMeasurement;
}

export interface CombinedNailImage {
  fingerType: string;
  originalNailImagePath: string;
  combinedImageUrl: string;
  designOverlayUrl: string;
}

/**
 * Generate comprehensive nail art for all 10 fingers based on measurements from 5 fingers
 */
export async function generateComprehensiveNailArt(
  sessionId: string,
  measurements: any[],
  photos: any[]
): Promise<{ generatedImages: string[], descriptions: string[] }> {
  const fingerTypes = ['thumb', 'index', 'middle', 'ring', 'pinky'];
  const generatedImages: string[] = [];
  const descriptions: string[] = [];
  
  console.log(`Generating nail art for all 10 fingers (both hands) based on ${measurements.length} measurements`);
  
  // Generate nail art for both hands (left and right)
  for (let hand = 0; hand < 2; hand++) {
    const handName = hand === 0 ? 'left' : 'right';
    
    for (let finger = 0; finger < 5; finger++) {
      const fingerType = fingerTypes[finger];
      const measurement = measurements.find(m => m.fingerType === fingerType) || measurements[0];
      
      try {
        console.log(`Generating nail art for ${handName} ${fingerType}...`);
        
        const nailArtImage = await generateSingleNailArt(
          measurement, 
          getDefaultStylePreferences(), 
          sessionId,
          handName,
          fingerType
        );
        
        generatedImages.push(nailArtImage.imageUrl);
        descriptions.push(nailArtImage.designDescription);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error generating nail art for ${handName} ${fingerType}:`, error);
        
        // Add placeholder for failed generation
        generatedImages.push('');
        descriptions.push(`Failed to generate nail art for ${handName} ${fingerType}`);
      }
    }
  }
  
  console.log(`Successfully generated ${generatedImages.filter(img => img).length} out of 10 nail art images`);
  
  return {
    generatedImages,
    descriptions
  };
}

/**
 * Get default style preferences for nail art generation
 */
function getDefaultStylePreferences() {
  return {
    personality: "elegant",
    colorHarmony: "complementary",
    patternPreference: "minimal",
    designIntensity: "medium",
    inspirationKeywords: ["modern", "chic", "sophisticated"]
  };
}

/**
 * Generate AI nail art images based on precise measurements and style preferences
 */
export async function generateNailArtImages(request: NailArtGenerationRequest): Promise<GeneratedNailArt[]> {
  const generatedArt: GeneratedNailArt[] = [];
  
  for (const measurement of request.measurements) {
    try {
      const nailArtImage = await generateSingleNailArt(measurement, request.stylePreferences, request.sessionId);
      generatedArt.push(nailArtImage);
    } catch (error) {
      console.error(`Error generating nail art for ${measurement.fingerType}:`, error);
      // Continue with other fingers even if one fails
    }
  }
  
  return generatedArt;
}

/**
 * Generate nail art for a single finger based on its measurements
 */
async function generateSingleNailArt(
  measurement: any, 
  stylePreferences: any, 
  sessionId: string,
  handName: string = 'left',
  fingerType: string = 'index'
): Promise<GeneratedNailArt> {
  
  // Create detailed prompt based on measurements and preferences
  const designPrompt = createNailArtPrompt(measurement, stylePreferences, handName, fingerType);
  
  // Generate nail art image using DALL-E
  const response = await openai.images.generate({
    model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    prompt: designPrompt,
    n: 1,
    size: "1024x1024",
    quality: "hd",
    style: "vivid",
  });
  
  if (!response.data || response.data.length === 0) {
    throw new Error('No image generated from DALL-E');
  }
  
  const imageUrl = response.data[0].url;
  if (!imageUrl) {
    throw new Error('No image URL received from DALL-E');
  }
  
  // Save the generated image locally
  const imageFileName = `nail_art_${handName}_${fingerType}_${sessionId}_${Date.now()}.png`;
  const imagePath = path.join(process.cwd(), 'uploads', 'generated_nail_art', imageFileName);
  
  // Ensure directory exists
  await fs.mkdir(path.dirname(imagePath), { recursive: true });
  
  // Download and save the image
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  await fs.writeFile(imagePath, Buffer.from(imageBuffer));
  
  return {
    fingerType: `${handName}_${fingerType}`,
    imageUrl: `/uploads/generated_nail_art/${imageFileName}`,
    designDescription: `AI-generated nail art for ${handName} ${fingerType} finger`,
    appliedMeasurements: measurement
  };
}

/**
 * Create detailed prompt for nail art generation based on measurements and preferences
 */
function createNailArtPrompt(
  measurement: any, 
  stylePreferences: any, 
  handName: string = 'left', 
  fingerType: string = 'index'
): string {
  const { personality, colorHarmony, patternPreference, designIntensity, inspirationKeywords } = stylePreferences;
  
  // Create comprehensive nail art prompt
  const basePrompt = `Create a stunning, professional nail art design for a ${fingerType} finger on the ${handName} hand. `;
  
  const shapeDescription = measurement?.shapeCategory ? 
    `The nail shape is ${measurement.shapeCategory} with dimensions approximately ${measurement.nailWidth}mm wide and ${measurement.nailLength}mm long. ` :
    `Design for a medium-sized ${fingerType} fingernail. `;
  
  const styleDescription = `Style: ${personality} and ${patternPreference} with ${designIntensity} intensity. `;
  
  const colorDescription = `Color harmony: ${colorHarmony} palette. `;
  
  const inspirationDescription = inspirationKeywords?.length > 0 ? 
    `Inspiration: ${inspirationKeywords.join(', ')}. ` : 
    'Modern and elegant design. ';
  
  const technicalRequirements = `
    Requirements:
    - High-resolution, professional nail art photography style
    - Clean, well-lit studio lighting
    - Focus on the nail design only
    - Realistic nail texture and finish
    - Beautiful color gradients and patterns
    - Show the nail from a top-down perspective
    - Professional manicure quality
    - No hands or fingers visible, just the designed nail
    - White or neutral background
  `;
  
  return basePrompt + shapeDescription + styleDescription + colorDescription + inspirationDescription + technicalRequirements;
}

/**
 * Process generated image to match specific nail measurements
 */
async function processNailArtImage(imageBuffer: Buffer, measurement: NailMeasurement): Promise<Buffer> {
  // Calculate optimal dimensions for the nail art
  const aspectRatio = measurement.nailWidth / measurement.nailLength;
  const targetWidth = Math.min(512, Math.max(256, measurement.nailWidth * 20)); // Scale for visibility
  const targetHeight = Math.round(targetWidth / aspectRatio);
  
  return await sharp(imageBuffer)
    .resize(targetWidth, targetHeight, {
      fit: 'fill',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png({ quality: 95 })
    .toBuffer();
}

/**
 * Combine customer's actual nail photo with generated design
 */
export async function combineNailWithDesign(
  originalNailImagePath: string,
  generatedDesignPath: string,
  measurement: NailMeasurement,
  sessionId: string
): Promise<CombinedNailImage> {
  
  try {
    // Load both images
    const originalImage = sharp(originalNailImagePath);
    const designImage = sharp(generatedDesignPath);
    
    // Get original image metadata
    const originalMetadata = await originalImage.metadata();
    
    // Calculate nail area in the original photo based on measurements
    const nailArea = await detectNailArea(originalNailImagePath, measurement);
    
    // Resize design to match nail area
    const resizedDesign = await designImage
      .resize(nailArea.width, nailArea.height, { fit: 'fill' })
      .png()
      .toBuffer();
    
    // Create overlay composite
    const combinedImage = await originalImage
      .composite([{
        input: resizedDesign,
        left: nailArea.x,
        top: nailArea.y,
        blend: 'overlay'
      }])
      .png({ quality: 95 })
      .toBuffer();
    
    // Save combined image
    const filename = `combined_nail_${sessionId}_${measurement.fingerType}_${Date.now()}.png`;
    const savePath = path.join("uploads", "combined_nails", filename);
    
    await fs.mkdir(path.dirname(savePath), { recursive: true });
    await fs.writeFile(savePath, combinedImage);
    
    return {
      fingerType: measurement.fingerType,
      originalNailImagePath,
      combinedImageUrl: `/uploads/combined_nails/${filename}`,
      designOverlayUrl: generatedDesignPath,
    };
    
  } catch (error) {
    console.error(`Error combining nail image for ${measurement.fingerType}:`, error);
    throw new Error(`Failed to combine nail image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Detect nail area in the original photo using AI vision
 */
async function detectNailArea(imagePath: string, measurement: NailMeasurement): Promise<{x: number, y: number, width: number, height: number}> {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing nail photos. Detect the exact nail area coordinates and dimensions in the image."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this ${measurement.fingerType} nail photo and provide the exact coordinates and dimensions of the nail area. The nail measurements are: width ${measurement.nailWidth}mm, length ${measurement.nailLength}mm. Return JSON with: {"x": number, "y": number, "width": number, "height": number} representing pixel coordinates of the nail area.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      x: result.x || 0,
      y: result.y || 0, 
      width: result.width || 100,
      height: result.height || 120
    };
    
  } catch (error) {
    console.error("Error detecting nail area:", error);
    // Return default area if detection fails
    return { x: 50, y: 50, width: 100, height: 120 };
  }
}

// Helper functions for style guidance
function getShapeSpecificGuidance(measurement: NailMeasurement): string {
  const { shapeCategory, nailWidth, nailLength } = measurement;
  
  switch (shapeCategory.toLowerCase()) {
    case 'oval':
      return "Design elements should follow the natural oval curve, avoiding sharp corners. Use flowing patterns that complement the rounded shape.";
    case 'square':
      return "Utilize the full nail surface with geometric patterns. Sharp, clean lines work well with this shape.";
    case 'round':
      return "Focus on central design elements that draw attention to the nail's natural roundness. Avoid overwhelming the smaller surface area.";
    case 'almond':
      return "Elongate design elements to enhance the elegant almond shape. Use vertical patterns to emphasize length.";
    default:
      return "Adapt design to the natural nail shape, ensuring proportional balance and visual harmony.";
  }
}

function getColorPalette(colorHarmony: string): string {
  switch (colorHarmony.toLowerCase()) {
    case 'monochromatic':
      return "various shades and tints of a single color";
    case 'complementary':
      return "opposite colors on the color wheel for high contrast";
    case 'triadic':
      return "three evenly spaced colors on the color wheel";
    case 'analogous':
      return "adjacent colors on the color wheel for harmony";
    default:
      return "balanced color selection";
  }
}

function getIntensityGuidance(designIntensity: string): string {
  switch (designIntensity.toLowerCase()) {
    case 'subtle':
      return "minimalist design with delicate details, soft colors, understated elegance";
    case 'moderate':
      return "balanced design with moderate detail level, medium contrast, refined appearance";
    case 'bold':
      return "striking design with vibrant colors, strong patterns, eye-catching elements";
    case 'dramatic':
      return "maximum impact design with high contrast, intricate details, artistic complexity";
    default:
      return "appropriately styled design";
  }
}

function getPatternGuidance(patternPreference: string): string {
  switch (patternPreference.toLowerCase()) {
    case 'solid':
      return "solid color application with smooth, even coverage";
    case 'gradient':
      return "smooth color transitions and ombre effects";
    case 'patterns':
      return "decorative patterns, textures, and artistic designs";
    case 'mixed':
      return "combination of solid areas, gradients, and patterns for dynamic interest";
    default:
      return "appropriate pattern selection";
  }
}

function generateDesignDescription(measurement: NailMeasurement, stylePreferences: any): string {
  return `Custom ${stylePreferences.designIntensity} nail art design for ${measurement.fingerType} finger (${measurement.nailWidth}mm × ${measurement.nailLength}mm). Features ${stylePreferences.colorHarmony} color harmony with ${stylePreferences.patternPreference} styling, inspired by ${stylePreferences.inspirationKeywords.join(', ')}. Optimized for ${measurement.shapeCategory} nail shape.`;
}