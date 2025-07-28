import OpenAI from "openai";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import type { NailMeasurement } from "./preciseNailMeasurement";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface NailArtGenerationResult {
  generatedImages: string[];
  descriptions: string[];
  designSpecs: Array<{
    fingerType: string;
    designDescription: string;
    colorPalette: string[];
    designComplexity: string;
    estimatedSize: string;
  }>;
}

export async function generatePrecisionNailArt(
  sessionId: string,
  measurements: NailMeasurement[],
  designPreferences?: {
    style?: string;
    colors?: string[];
    theme?: string;
    complexity?: string;
  }
): Promise<NailArtGenerationResult> {
  console.log(`Generating precision nail art for session ${sessionId}`);
  
  const generatedImages: string[] = [];
  const descriptions: string[] = [];
  const designSpecs: any[] = [];

  // 각 손가락별로 맞춤형 디자인 생성
  for (const measurement of measurements) {
    try {
      const artResult = await generateSingleNailArt(measurement, designPreferences);
      
      generatedImages.push(artResult.imageUrl);
      descriptions.push(artResult.description);
      designSpecs.push({
        fingerType: measurement.fingerType,
        designDescription: artResult.description,
        colorPalette: artResult.colors,
        designComplexity: artResult.complexity,
        estimatedSize: `${measurement.realWorldMeasurements.nailWidthMm.toFixed(1)}mm × ${measurement.realWorldMeasurements.nailLengthMm.toFixed(1)}mm`
      });

      // 생성 간격 조정 (API 제한 고려)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Failed to generate art for ${measurement.fingerType}:`, error);
      
      // 실패 시 기본 이미지 생성
      const fallbackResult = await generateFallbackNailArt(measurement);
      generatedImages.push(fallbackResult.imageUrl);
      descriptions.push(fallbackResult.description);
      designSpecs.push({
        fingerType: measurement.fingerType,
        designDescription: fallbackResult.description,
        colorPalette: ['#FFB6C1', '#FFC0CB'],
        designComplexity: 'simple',
        estimatedSize: `${measurement.realWorldMeasurements.nailWidthMm.toFixed(1)}mm × ${measurement.realWorldMeasurements.nailLengthMm.toFixed(1)}mm`
      });
    }
  }

  return {
    generatedImages,
    descriptions,
    designSpecs
  };
}

async function generateSingleNailArt(
  measurement: NailMeasurement,
  preferences?: any
): Promise<{ imageUrl: string; description: string; colors: string[]; complexity: string }> {
  
  // 손가락 특성에 맞는 디자인 프롬프트 생성
  const designPrompt = createDesignPrompt(measurement, preferences);
  
  try {
    // DALL-E 3로 이미지 생성
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: designPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned");
    }

    // 이미지 다운로드 및 저장
    const imageBuffer = await downloadImage(imageUrl);
    const fileName = `nail_art_${measurement.fingerType}_${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'uploads', fileName);
    
    // 정확한 크기로 리사이즈
    const resizedBuffer = await resizeToExactNailSize(imageBuffer, measurement);
    fs.writeFileSync(filePath, resizedBuffer);

    return {
      imageUrl: `/uploads/${fileName}`,
      description: `${measurement.fingerType} 손가락을 위한 맞춤형 네일아트 (${measurement.realWorldMeasurements.nailWidthMm.toFixed(1)}mm × ${measurement.realWorldMeasurements.nailLengthMm.toFixed(1)}mm)`,
      colors: extractColorsFromPreferences(preferences),
      complexity: preferences?.complexity || 'medium'
    };
    
  } catch (error) {
    console.error(`DALL-E generation failed for ${measurement.fingerType}:`, error);
    throw error;
  }
}

async function generateFallbackNailArt(measurement: NailMeasurement): Promise<{ imageUrl: string; description: string }> {
  // SVG로 기본 네일아트 패턴 생성
  const svgContent = createBasicNailArtSVG(measurement);
  const fileName = `fallback_nail_art_${measurement.fingerType}_${Date.now()}.svg`;
  const filePath = path.join(process.cwd(), 'uploads', fileName);
  
  fs.writeFileSync(filePath, svgContent);
  
  return {
    imageUrl: `/uploads/${fileName}`,
    description: `${measurement.fingerType} 손가락용 기본 네일아트 디자인`
  };
}

function createDesignPrompt(measurement: NailMeasurement, preferences?: any): string {
  const fingerName = measurement.fingerType.replace('_', ' ');
  const shapeDesc = getShapeDescription(measurement.shapeCategory);
  const sizeDesc = getSizeDescription(measurement.realWorldMeasurements);
  const curvatureDesc = getCurvatureDescription(measurement.nailCurvature);
  
  let prompt = `Create a beautiful nail art design for a ${fingerName} finger. `;
  prompt += `The nail shape is ${shapeDesc} ${curvatureDesc}. `;
  prompt += `${sizeDesc}. `;
  
  // 선호도 적용
  if (preferences?.style) {
    prompt += `Style: ${preferences.style}. `;
  }
  
  if (preferences?.colors && preferences.colors.length > 0) {
    prompt += `Use colors: ${preferences.colors.join(', ')}. `;
  }
  
  if (preferences?.theme) {
    prompt += `Theme: ${preferences.theme}. `;
  }
  
  // 손가락별 맞춤 요소
  if (measurement.fingerType.includes('thumb')) {
    prompt += `Design should work well for a wider thumb nail. `;
  } else if (measurement.fingerType.includes('pinky')) {
    prompt += `Design should be suitable for a smaller pinky nail. `;
  } else if (measurement.fingerType.includes('middle')) {
    prompt += `Design can be more elaborate for the prominent middle finger. `;
  }
  
  prompt += `High quality, professional nail art, photorealistic, well-lit, clean background. `;
  prompt += `The design should be proportional to the nail size and complement the finger shape.`;
  
  return prompt;
}

function getShapeDescription(shape: string): string {
  const descriptions: Record<string, string> = {
    oval: 'with gentle oval curves',
    square: 'with clean square edges',
    round: 'with soft rounded edges',
    coffin: 'with modern coffin/ballerina shape',
    almond: 'with elegant almond shape'
  };
  return descriptions[shape] || 'with natural shape';
}

function getSizeDescription(measurements: any): string {
  const width = measurements.nailWidthMm;
  const length = measurements.nailLengthMm;
  
  if (width > 15) return 'This is a wide nail';
  if (width < 10) return 'This is a narrow nail';
  if (length > 16) return 'This is a long nail';
  if (length < 12) return 'This is a short nail';
  return 'This is a medium-sized nail';
}

function getCurvatureDescription(curvature: number): string {
  if (curvature > 0.7) return 'with high curvature';
  if (curvature < 0.3) return 'with flat profile';
  return 'with moderate curvature';
}

function extractColorsFromPreferences(preferences?: any): string[] {
  if (preferences?.colors) return preferences.colors;
  return ['#FFB6C1', '#FFC0CB', '#FFFFFF']; // 기본 핑크 톤
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function resizeToExactNailSize(imageBuffer: Buffer, measurement: NailMeasurement): Promise<Buffer> {
  // 실제 네일 크기에 맞게 이미지 리사이즈 (300 DPI 기준)
  const dpi = 300;
  const mmToPixels = dpi / 25.4; // 1mm = DPI/25.4 pixels
  
  const targetWidth = Math.round(measurement.realWorldMeasurements.nailWidthMm * mmToPixels);
  const targetHeight = Math.round(measurement.realWorldMeasurements.nailLengthMm * mmToPixels);
  
  return await sharp(imageBuffer)
    .resize(targetWidth, targetHeight, {
      fit: 'fill',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .png()
    .toBuffer();
}

function createBasicNailArtSVG(measurement: NailMeasurement): string {
  const width = measurement.realWorldMeasurements.nailWidthMm * 10; // 10px per mm
  const height = measurement.realWorldMeasurements.nailLengthMm * 10;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="nailGradient" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:#FFE4E6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FDB2C1;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- 네일 베이스 -->
  <ellipse cx="${width/2}" cy="${height/2}" rx="${width/2-2}" ry="${height/2-2}" 
           fill="url(#nailGradient)" stroke="#F472B6" stroke-width="1"/>
  
  <!-- 간단한 패턴 -->
  <circle cx="${width*0.3}" cy="${height*0.3}" r="3" fill="#FFFFFF" opacity="0.8"/>
  <circle cx="${width*0.7}" cy="${height*0.7}" r="2" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="${width*0.5}" cy="${height*0.2}" r="1.5" fill="#FFFFFF" opacity="0.9"/>
  
  <!-- 글리터 효과 -->
  <circle cx="${width*0.2}" cy="${height*0.8}" r="1" fill="#FCD34D" opacity="0.7"/>
  <circle cx="${width*0.8}" cy="${height*0.3}" r="1" fill="#FCD34D" opacity="0.5"/>
</svg>`;
}