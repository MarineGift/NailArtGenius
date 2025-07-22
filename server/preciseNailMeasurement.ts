import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 표준 신용카드 크기 (85.60mm × 53.98mm × 0.76mm)
const CARD_WIDTH_MM = 85.60;
const CARD_HEIGHT_MM = 53.98;

export interface NailMeasurement {
  fingerType: string;
  nailWidth: number;
  nailLength: number;
  nailCurvature: number;
  fingerWidth: number;
  fingerLength: number;
  shapeCategory: string;
  confidence: number;
  cardScale: number;
  realWorldMeasurements: {
    nailWidthMm: number;
    nailLengthMm: number;
    fingerWidthMm: number;
    fingerLengthMm: number;
  };
}

export interface PhotoAnalysisResult {
  cardDetected: boolean;
  cardDimensions: {
    width: number;
    height: number;
    pixelsPerMm: number;
  };
  fingerMeasurements: NailMeasurement[];
  analysisConfidence: number;
  recommendations: string[];
}

export async function analyzePreciseNailMeasurements(
  sessionId: string,
  photos: Array<{ filePath: string; fingerType: string; photoType: string }>
): Promise<PhotoAnalysisResult> {
  console.log(`Starting precise nail measurement analysis for session ${sessionId}`);
  
  const allMeasurements: NailMeasurement[] = [];
  let overallConfidence = 0;
  let cardScale = 0;
  const recommendations: string[] = [];

  // Step 1: 카드 기준점 분석
  const cardPhoto = photos.find(p => p.photoType === 'card_reference');
  if (!cardPhoto) {
    throw new Error("카드 기준 사진이 필요합니다");
  }

  const cardAnalysis = await analyzeCardReference(cardPhoto.filePath);
  cardScale = cardAnalysis.pixelsPerMm;
  
  if (cardScale === 0) {
    recommendations.push("카드가 명확하게 보이지 않습니다. 다시 촬영해주세요.");
  }

  // Step 2: 각 손가락 분석
  const fingerPhotos = photos.filter(p => p.photoType === 'finger_with_card');
  
  for (const photo of fingerPhotos) {
    try {
      const measurement = await analyzeFingerWithCard(photo.filePath, photo.fingerType, cardScale);
      allMeasurements.push(measurement);
      overallConfidence += measurement.confidence;
    } catch (error) {
      console.error(`Error analyzing ${photo.fingerType}:`, error);
      recommendations.push(`${photo.fingerType} 손가락 분석에 실패했습니다. 다시 촬영해주세요.`);
    }
  }

  // Step 3: 곡률 분석을 위한 측면 사진 분석
  const curvaturePhotos = photos.filter(p => p.photoType === 'finger_curvature');
  for (const photo of curvaturePhotos) {
    await enhanceCurvatureAnalysis(photo.filePath, allMeasurements);
  }

  // Step 4: 모든 10개 손가락 데이터 완성
  const completeMeasurements = generateCompleteFingerSet(allMeasurements);

  return {
    cardDetected: cardScale > 0,
    cardDimensions: {
      width: CARD_WIDTH_MM,
      height: CARD_HEIGHT_MM,
      pixelsPerMm: cardScale
    },
    fingerMeasurements: completeMeasurements,
    analysisConfidence: completeMeasurements.length > 0 ? overallConfidence / completeMeasurements.length : 0,
    recommendations
  };
}

async function analyzeCardReference(imagePath: string): Promise<{ pixelsPerMm: number; cardDetected: boolean }> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `이 이미지에서 신용카드를 찾아 분석해주세요. 신용카드의 표준 크기는 85.60mm × 53.98mm입니다.

카드의 픽셀 크기를 측정하고 mm당 픽셀 수를 계산해주세요.

JSON 형식으로 다음 정보를 제공해주세요:
{
  "cardDetected": boolean,
  "cardPixelWidth": number,
  "cardPixelHeight": number,
  "pixelsPerMm": number,
  "confidence": number
}`
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
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      pixelsPerMm: result.pixelsPerMm || 0,
      cardDetected: result.cardDetected || false
    };
  } catch (error) {
    console.error("Card analysis failed:", error);
    return { pixelsPerMm: 0, cardDetected: false };
  }
}

async function analyzeFingerWithCard(
  imagePath: string, 
  fingerType: string, 
  cardPixelsPerMm: number
): Promise<NailMeasurement> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `이 이미지에서 ${fingerType} 손가락의 손톱을 정밀 측정해주세요. 
이미지에 신용카드가 기준점으로 있으며, 1mm당 ${cardPixelsPerMm.toFixed(2)} 픽셀입니다.

다음을 측정해주세요:
1. 손톱의 가로 길이 (픽셀)
2. 손톱의 세로 길이 (픽셀)
3. 손가락의 가로 폭 (픽셀)
4. 손가락의 세로 길이 (픽셀)
5. 손톱 모양 분류 (oval, square, round, coffin, almond)
6. 손톱의 곡률 정도 (0.0-1.0)

JSON 형식으로 응답해주세요:
{
  "nailWidthPixels": number,
  "nailLengthPixels": number,
  "fingerWidthPixels": number,
  "fingerLengthPixels": number,
  "shapeCategory": string,
  "curvature": number,
  "confidence": number
}`
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
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // 픽셀을 실제 mm로 변환
    const nailWidthMm = (result.nailWidthPixels || 0) / cardPixelsPerMm;
    const nailLengthMm = (result.nailLengthPixels || 0) / cardPixelsPerMm;
    const fingerWidthMm = (result.fingerWidthPixels || 0) / cardPixelsPerMm;
    const fingerLengthMm = (result.fingerLengthPixels || 0) / cardPixelsPerMm;

    return {
      fingerType,
      nailWidth: result.nailWidthPixels || 0,
      nailLength: result.nailLengthPixels || 0,
      nailCurvature: result.curvature || 0.3,
      fingerWidth: result.fingerWidthPixels || 0,
      fingerLength: result.fingerLengthPixels || 0,
      shapeCategory: result.shapeCategory || 'oval',
      confidence: result.confidence || 0.5,
      cardScale: cardPixelsPerMm,
      realWorldMeasurements: {
        nailWidthMm,
        nailLengthMm,
        fingerWidthMm,
        fingerLengthMm
      }
    };
  } catch (error) {
    console.error(`Finger analysis failed for ${fingerType}:`, error);
    // 기본값 반환
    return {
      fingerType,
      nailWidth: 0,
      nailLength: 0,
      nailCurvature: 0.3,
      fingerWidth: 0,
      fingerLength: 0,
      shapeCategory: 'oval',
      confidence: 0.1,
      cardScale: cardPixelsPerMm,
      realWorldMeasurements: {
        nailWidthMm: 0,
        nailLengthMm: 0,
        fingerWidthMm: 0,
        fingerLengthMm: 0
      }
    };
  }
}

async function enhanceCurvatureAnalysis(imagePath: string, measurements: NailMeasurement[]): Promise<void> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `이 측면 사진에서 각 손가락의 곡률을 정밀 분석해주세요.
각 손가락별로 0.0(평평함)에서 1.0(매우 굽음) 사이의 곡률 값을 측정해주세요.

JSON 형식으로 응답해주세요:
{
  "curvatureAnalysis": [
    {
      "fingerType": "thumb",
      "curvature": number,
      "confidence": number
    },
    ...
  ]
}`
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
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // 곡률 데이터를 기존 측정값에 병합
    if (result.curvatureAnalysis) {
      for (const curvatureData of result.curvatureAnalysis) {
        const measurement = measurements.find(m => m.fingerType === curvatureData.fingerType);
        if (measurement && curvatureData.confidence > 0.5) {
          measurement.nailCurvature = curvatureData.curvature;
        }
      }
    }
  } catch (error) {
    console.error("Curvature analysis failed:", error);
  }
}

function generateCompleteFingerSet(baseMeasurements: NailMeasurement[]): NailMeasurement[] {
  const allFingers = [
    'left_thumb', 'left_index', 'left_middle', 'left_ring', 'left_pinky',
    'right_thumb', 'right_index', 'right_middle', 'right_ring', 'right_pinky'
  ];

  const completeMeasurements: NailMeasurement[] = [];

  for (const fingerType of allFingers) {
    let measurement = baseMeasurements.find(m => m.fingerType === fingerType);
    
    if (!measurement) {
      // 측정되지 않은 손가락의 경우 유사한 손가락 데이터로 추정
      const baseType = fingerType.replace('left_', '').replace('right_', '');
      const baseMeasurement = baseMeasurements.find(m => m.fingerType.includes(baseType));
      
      if (baseMeasurement) {
        measurement = {
          ...baseMeasurement,
          fingerType,
          confidence: baseMeasurement.confidence * 0.7 // 추정값이므로 신뢰도 감소
        };
      } else {
        // 기본값 생성
        measurement = createDefaultMeasurement(fingerType);
      }
    }
    
    completeMeasurements.push(measurement);
  }

  return completeMeasurements;
}

function createDefaultMeasurement(fingerType: string): NailMeasurement {
  const baseType = fingerType.replace('left_', '').replace('right_', '');
  
  // 손가락별 기본 크기 (mm 단위)
  const defaultSizes: Record<string, any> = {
    thumb: { width: 14, length: 12, fingerWidth: 20, fingerLength: 48 },
    index: { width: 12, length: 15, fingerWidth: 17, fingerLength: 75 },
    middle: { width: 13, length: 17, fingerWidth: 18, fingerLength: 85 },
    ring: { width: 12, length: 15, fingerWidth: 17, fingerLength: 78 },
    pinky: { width: 9, length: 12, fingerWidth: 14, fingerLength: 65 }
  };

  const size = defaultSizes[baseType] || defaultSizes.index;
  
  return {
    fingerType,
    nailWidth: size.width * 3.78, // mm to pixels 근사치
    nailLength: size.length * 3.78,
    nailCurvature: 0.35,
    fingerWidth: size.fingerWidth * 3.78,
    fingerLength: size.fingerLength * 3.78,
    shapeCategory: 'oval',
    confidence: 0.3,
    cardScale: 3.78,
    realWorldMeasurements: {
      nailWidthMm: size.width,
      nailLengthMm: size.length,
      fingerWidthMm: size.fingerWidth,
      fingerLengthMm: size.fingerLength
    }
  };
}