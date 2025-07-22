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
  measurement: NailMeasurement, 
  stylePreferences: any, 
  sessionId: string
): Promise<GeneratedNailArt> {
  
  // Create detailed prompt based on measurements and preferences
  const designPrompt = createNailArtPrompt(measurement, stylePreferences);
  
  // Generate nail art image using DALL-E
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: designPrompt,
    n: 1,
    size: "1024x1024",
    quality: "hd",
    style: "vivid",
  });

  const imageUrl = response.data[0].url;
  if (!imageUrl) {
    throw new Error("Failed to generate nail art image");
  }

  // Download and save the generated image
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  
  // Create filename and save path
  const filename = `nail_art_${sessionId}_${measurement.fingerType}_${Date.now()}.png`;
  const savePath = path.join("uploads", "generated_nail_art", filename);
  
  // Ensure directory exists
  await fs.mkdir(path.dirname(savePath), { recursive: true });
  
  // Process image to match nail dimensions
  const processedImageBuffer = await processNailArtImage(
    Buffer.from(imageBuffer), 
    measurement
  );
  
  await fs.writeFile(savePath, processedImageBuffer);
  
  return {
    fingerType: measurement.fingerType,
    imageUrl: `/uploads/generated_nail_art/${filename}`,
    designDescription: generateDesignDescription(measurement, stylePreferences),
    appliedMeasurements: measurement,
  };
}

/**
 * Create detailed prompt for nail art generation based on measurements and preferences
 */
function createNailArtPrompt(measurement: NailMeasurement, stylePreferences: any): string {
  const { personality, colorHarmony, patternPreference, designIntensity, inspirationKeywords } = stylePreferences;
  
  // Shape-specific recommendations
  const shapeGuidance = getShapeSpecificGuidance(measurement);
  
  // Color palette based on harmony theory
  const colorPalette = getColorPalette(colorHarmony);
  
  // Intensity guidance
  const intensityGuidance = getIntensityGuidance(designIntensity);
  
  // Pattern guidance
  const patternGuidance = getPatternGuidance(patternPreference);
  
  return `Create a stunning nail art design for a ${measurement.fingerType} finger with the following specifications:

NAIL DIMENSIONS:
- Width: ${measurement.nailWidth}mm
- Length: ${measurement.nailLength}mm  
- Shape category: ${measurement.shapeCategory}
- Curvature: ${measurement.nailCurvature}mm radius

DESIGN REQUIREMENTS:
${shapeGuidance}

STYLE PREFERENCES:
- Personality: ${personality}
- Color harmony: ${colorHarmony} (${colorPalette})
- Pattern preference: ${patternPreference} (${patternGuidance})
- Design intensity: ${designIntensity} (${intensityGuidance})
- Inspiration: ${inspirationKeywords.join(', ')}

TECHNICAL SPECIFICATIONS:
- High resolution, photorealistic nail art design
- Perfect application on natural nail surface
- Professional salon quality finish
- Optimal proportions for the specified nail dimensions
- Suitable for ${measurement.fingerType} finger positioning
- Clean, precise edges and detailed work
- Proper depth and dimension for realistic appearance

Create a masterpiece that perfectly combines artistry with the specified measurements and style preferences.`;
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
    throw new Error(`Failed to combine nail image: ${error.message}`);
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