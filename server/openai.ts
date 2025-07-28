import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface NailAnalysisResult {
  fingerType: string;
  shape: {
    width: number;
    length: number;
    curvature: number;
    nailBedRatio: number;
  };
  recommendations: string[];
  confidence: number;
}

export async function analyzeNailShape(base64Images: string[], fingerTypes: string[]): Promise<NailAnalysisResult[]> {
  try {
    const analysisPrompt = `Analyze these nail photos and provide detailed nail shape analysis for each finger. 
    For each image, determine:
    1. Nail width and length proportions
    2. Natural curvature of the nail
    3. Nail bed ratio
    4. Shape recommendations for nail art application
    
    Respond with JSON in this format:
    {
      "results": [
        {
          "fingerType": "thumb",
          "shape": {
            "width": 12.5,
            "length": 15.2,
            "curvature": 0.7,
            "nailBedRatio": 0.6
          },
          "recommendations": ["rounded shape works best", "avoid sharp corners"],
          "confidence": 0.95
        }
      ]
    }`;

    const messages: any[] = [
      {
        role: "system",
        content: "You are an expert nail technician and AI analyst specializing in nail shape analysis for nail art applications. Provide precise measurements and professional recommendations."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: analysisPrompt
          },
          ...base64Images.map((image, index) => ({
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${image}`
            }
          }))
        ]
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.results || [];
  } catch (error) {
    console.error("Error analyzing nail shapes:", error);
    throw new Error("Failed to analyze nail shapes: " + (error as Error).message);
  }
}

export async function generateNailShapeImage(analysisResult: NailAnalysisResult): Promise<string> {
  try {
    const prompt = `Create a detailed, professional nail shape visualization based on these measurements:
    - Width: ${analysisResult.shape.width}mm
    - Length: ${analysisResult.shape.length}mm  
    - Curvature: ${analysisResult.shape.curvature}
    - Nail bed ratio: ${analysisResult.shape.nailBedRatio}
    
    Generate a clean, technical illustration of the nail shape from top view, suitable for nail art design reference. 
    Style: minimalist, professional, clean background, precise proportions.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url || "";
  } catch (error) {
    console.error("Error generating nail shape image:", error);
    throw new Error("Failed to generate nail shape image: " + (error as Error).message);
  }
}

export async function enhanceDesignForNail(designPrompt: string, nailShape: NailAnalysisResult): Promise<string> {
  try {
    const prompt = `Create a beautiful nail art design with these specifications:
    Design theme: ${designPrompt}
    
    Nail specifications:
    - Width: ${nailShape.shape.width}mm
    - Length: ${nailShape.shape.length}mm
    - Natural curvature: ${nailShape.shape.curvature}
    - Recommendations: ${nailShape.recommendations.join(", ")}
    
    Create an elegant, professionally designed nail art that complements the nail shape perfectly. 
    Style: high-quality nail art photography, professional salon quality, perfect lighting.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url || "";
  } catch (error) {
    console.error("Error enhancing design for nail:", error);
    throw new Error("Failed to enhance design for nail: " + (error as Error).message);
  }
}
