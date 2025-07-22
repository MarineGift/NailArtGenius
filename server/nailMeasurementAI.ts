import OpenAI from "openai";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Card dimensions for scale reference
const CARD_DIMENSIONS = {
  width: 85.60, // mm
  height: 53.98, // mm
  thickness: 0.76 // mm
};

export interface NailMeasurement {
  fingerType: string;
  nailWidth: number; // mm
  nailLength: number; // mm
  nailCurvature: number; // mm (radius)
  fingerWidth: number; // mm
  fingerLength: number; // mm
  shapeCategory: string;
  confidence: number; // 0-100
}

export interface PhotoAnalysisResult {
  cardDetected: boolean;
  cardPixelWidth?: number;
  cardPixelHeight?: number;
  scaleFactor?: number; // mm per pixel
  measurements?: NailMeasurement;
  error?: string;
}

/**
 * Analyze uploaded photos to extract precise nail measurements using card as scale reference
 */
export async function analyzeNailPhotos(sessionId: string, photoFiles: any[]): Promise<NailMeasurement[]> {
  const measurements: NailMeasurement[] = [];
  
  try {
    // Find reference card photo first
    const cardPhoto = photoFiles.find(photo => photo.fingerType === 'reference_card');
    if (!cardPhoto) {
      throw new Error("참조 카드 사진이 필요합니다.");
    }

    // Analyze card photo to establish scale
    const cardAnalysis = await analyzeCardForScale(cardPhoto.filePath);
    if (!cardAnalysis.cardDetected || !cardAnalysis.scaleFactor) {
      throw new Error("카드를 인식할 수 없습니다. 카드와 손가락이 명확하게 보이는 사진을 다시 촬영해주세요.");
    }

    // Analyze each finger photo using established scale
    const fingerPhotos = photoFiles.filter(photo => photo.fingerType !== 'reference_card');
    
    for (const photo of fingerPhotos) {
      try {
        const measurement = await analyzeSingleFingerPhoto(
          photo.filePath,
          photo.fingerType,
          cardAnalysis.scaleFactor
        );
        measurements.push(measurement);
      } catch (error) {
        console.error(`Error analyzing ${photo.fingerType}:`, error);
        // Continue with other fingers even if one fails
        measurements.push({
          fingerType: photo.fingerType,
          nailWidth: 0,
          nailLength: 0,
          nailCurvature: 0,
          fingerWidth: 0,
          fingerLength: 0,
          shapeCategory: 'unknown',
          confidence: 0
        });
      }
    }

    return measurements;
  } catch (error) {
    console.error("Photo analysis error:", error);
    throw error;
  }
}

/**
 * Analyze reference card photo to establish scale factor
 */
async function analyzeCardForScale(cardPhotoPath: string): Promise<PhotoAnalysisResult> {
  try {
    // Read and process image
    const imageBuffer = await fs.readFile(cardPhotoPath);
    const imageBase64 = imageBuffer.toString('base64');
    
    // Use OpenAI Vision to detect card in image
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert in image analysis for precise measurements. Analyze the image to detect a standard card (credit card or business card) and provide its pixel dimensions.

Card specifications:
- Width: 85.60mm
- Height: 53.98mm

Return your analysis in this exact JSON format:
{
  "cardDetected": boolean,
  "cardPixelWidth": number (if detected),
  "cardPixelHeight": number (if detected),
  "scaleFactor": number (mm per pixel ratio),
  "confidence": number (0-100),
  "notes": "explanation of detection"
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this image to detect the card and calculate the scale factor for precise measurements."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    
    if (analysis.cardDetected && analysis.cardPixelWidth && analysis.cardPixelHeight) {
      // Calculate scale factor based on card width (more reliable than height)
      const scaleFactor = CARD_DIMENSIONS.width / analysis.cardPixelWidth;
      
      return {
        cardDetected: true,
        cardPixelWidth: analysis.cardPixelWidth,
        cardPixelHeight: analysis.cardPixelHeight,
        scaleFactor: scaleFactor
      };
    }

    return {
      cardDetected: false,
      error: "카드를 감지할 수 없습니다."
    };

  } catch (error) {
    console.error("Card analysis error:", error);
    return {
      cardDetected: false,
      error: "카드 분석 중 오류가 발생했습니다."
    };
  }
}

/**
 * Analyze individual finger photo for nail measurements
 */
async function analyzeSingleFingerPhoto(
  photoPath: string,
  fingerType: string,
  scaleFactor: number
): Promise<NailMeasurement> {
  try {
    // Read and process image
    const imageBuffer = await fs.readFile(photoPath);
    const imageBase64 = imageBuffer.toString('base64');
    
    // Use OpenAI Vision to analyze nail measurements
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert nail technician and measurement specialist. Analyze the ${fingerType} finger in this image to extract precise nail measurements.

Scale factor: ${scaleFactor} mm per pixel

Measure the following in pixels, then convert to millimeters:
1. Nail width (widest part of the nail bed)
2. Nail length (from cuticle to tip)
3. Finger width (at the nail base)
4. Finger length (visible portion)
5. Nail curvature (estimate radius of curvature)

Classify the nail shape as one of: oval, square, round, almond, coffin, squoval

Return your analysis in this exact JSON format:
{
  "nailWidthPixels": number,
  "nailLengthPixels": number,
  "fingerWidthPixels": number,
  "fingerLengthPixels": number,
  "curvatureRadiusPixels": number,
  "nailWidth": number (mm),
  "nailLength": number (mm),
  "fingerWidth": number (mm),
  "fingerLength": number (mm),
  "nailCurvature": number (mm),
  "shapeCategory": string,
  "confidence": number (0-100),
  "notes": "detailed analysis explanation"
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze the ${fingerType} finger in this image and provide precise measurements using the given scale factor.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    
    return {
      fingerType,
      nailWidth: analysis.nailWidth || 0,
      nailLength: analysis.nailLength || 0,
      nailCurvature: analysis.nailCurvature || 0,
      fingerWidth: analysis.fingerWidth || 0,
      fingerLength: analysis.fingerLength || 0,
      shapeCategory: analysis.shapeCategory || 'oval',
      confidence: analysis.confidence || 0
    };

  } catch (error) {
    console.error(`Analysis error for ${fingerType}:`, error);
    throw new Error(`${fingerType} 분석 중 오류가 발생했습니다.`);
  }
}

/**
 * Generate nail art design based on measured nail dimensions
 */
export async function generateNailArtWithMeasurements(
  measurements: NailMeasurement[],
  customPrompt: string,
  stylePreferences?: any
): Promise<string> {
  try {
    // Build detailed prompt with measurements
    let prompt = `Create a professional nail art design with these specifications:\n\n`;
    prompt += `Custom Design Request: ${customPrompt}\n\n`;
    
    prompt += `Precise Nail Measurements:\n`;
    measurements.forEach(measurement => {
      if (measurement.confidence > 50) {
        prompt += `- ${measurement.fingerType}: ${measurement.nailWidth.toFixed(1)}mm wide × ${measurement.nailLength.toFixed(1)}mm long, ${measurement.shapeCategory} shape\n`;
      }
    });
    
    if (stylePreferences) {
      prompt += `\nStyle Preferences:\n`;
      if (stylePreferences.preferredColors?.length > 0) {
        prompt += `- Colors: ${stylePreferences.preferredColors.join(", ")}\n`;
      }
      if (stylePreferences.preferredStyles?.length > 0) {
        prompt += `- Styles: ${stylePreferences.preferredStyles.join(", ")}\n`;
      }
      prompt += `- Complexity: ${stylePreferences.complexity}\n`;
      if (stylePreferences.occasions?.length > 0) {
        prompt += `- Occasions: ${stylePreferences.occasions.join(", ")}\n`;
      }
    }
    
    prompt += `\nDesign Requirements:
- Create a design that perfectly fits each nail's measured dimensions
- Ensure the design is proportionate to the actual nail sizes
- Make the design suitable for nail art printing technology
- Include detailed placement guidelines for precise application
- Create a professional, salon-quality design
- Ensure the design is Instagram-worthy and photogenic
- Consider the natural nail shapes and curvature

Please create a detailed, technically accurate nail art design that can be precisely applied to these measured nails.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url;
  } catch (error) {
    console.error("Design generation error:", error);
    throw new Error("네일아트 디자인 생성 중 오류가 발생했습니다.");
  }
}