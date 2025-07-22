import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface DesignGenerationParams {
  customPrompt: string;
  stylePreferences?: any;
  nailAnalysis?: any;
  baseDesignId?: number;
}

export interface DesignCustomization {
  colors: string[];
  style: string;
  complexity: string;
  occasion: string;
  personalizedElements: string[];
}

// Generate AI-powered nail design prompt based on user preferences
export async function generateDesignPrompt(params: DesignGenerationParams): Promise<string> {
  const { customPrompt, stylePreferences, nailAnalysis } = params;
  
  let enhancedPrompt = `Create a professional nail art design with the following specifications:\n\n`;
  
  // User's custom request
  enhancedPrompt += `Custom Request: ${customPrompt}\n\n`;
  
  // Style preferences
  if (stylePreferences) {
    if (stylePreferences.preferredColors?.length > 0) {
      enhancedPrompt += `Preferred Colors: ${stylePreferences.preferredColors.join(", ")}\n`;
    }
    
    if (stylePreferences.preferredStyles?.length > 0) {
      enhancedPrompt += `Style Preferences: ${stylePreferences.preferredStyles.join(", ")}\n`;
    }
    
    if (stylePreferences.occasions?.length > 0) {
      enhancedPrompt += `Occasions: ${stylePreferences.occasions.join(", ")}\n`;
    }
    
    enhancedPrompt += `Complexity Level: ${stylePreferences.complexity}\n`;
    enhancedPrompt += `Budget Range: ${stylePreferences.budget}\n`;
    
    if (stylePreferences.skinTone) {
      enhancedPrompt += `Skin Tone: ${stylePreferences.skinTone}\n`;
    }
    
    if (stylePreferences.lifestyle) {
      enhancedPrompt += `Lifestyle: ${stylePreferences.lifestyle}\n`;
    }
  }
  
  // Nail analysis data
  if (nailAnalysis?.length > 0) {
    enhancedPrompt += `\nNail Shape Analysis:\n`;
    nailAnalysis.forEach((nail: any) => {
      enhancedPrompt += `- ${nail.fingerType}: ${nail.shape || 'oval'} shape, ${nail.width}mm wide, ${nail.length}mm long\n`;
    });
  }
  
  // Design guidelines
  enhancedPrompt += `\nDesign Guidelines:
- Create a design that is wearable and practical
- Ensure the design complements the nail shape
- Use high-quality, salon-appropriate techniques
- Consider the occasion and lifestyle requirements
- Make the design Instagram-worthy and photogenic
- Ensure proper color harmony and balance
- Design should be suitable for nail art printing technology

Please create a detailed, professional nail art design that incorporates all these elements harmoniously.`;

  return enhancedPrompt;
}

// Generate custom nail design image using DALL-E
export async function generateCustomDesignImage(prompt: string): Promise<string> {
  try {
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional nail art design: ${prompt}. High-quality, salon-style, detailed nail art on natural nails, studio lighting, clean background, professional photography style.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    return response.data[0].url || "";
  } catch (error) {
    console.error("Error generating design image:", error);
    throw new Error("Failed to generate design image");
  }
}

// Analyze and enhance design based on user feedback
export async function enhanceDesignWithFeedback(
  originalPrompt: string,
  feedback: string,
  preferences: any
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a professional nail art designer who specializes in creating custom designs based on client feedback and preferences."
        },
        {
          role: "user",
          content: `
Original design prompt: ${originalPrompt}

Client feedback: ${feedback}

Client preferences: ${JSON.stringify(preferences, null, 2)}

Please create an improved design prompt that addresses the client's feedback while maintaining their original preferences. The new prompt should be detailed and specific for DALL-E image generation.
`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    return response.choices[0].message.content || originalPrompt;
  } catch (error) {
    console.error("Error enhancing design with feedback:", error);
    throw new Error("Failed to enhance design");
  }
}

// Calculate custom design pricing based on complexity and features
export function calculateCustomDesignPricing(customization: DesignCustomization): number {
  let basePrice = 50000; // Base price in KRW (50,000)
  
  // Complexity multiplier
  const complexityMultipliers = {
    simple: 1.0,
    medium: 1.3,
    complex: 1.7
  };
  
  basePrice *= complexityMultipliers[customization.complexity as keyof typeof complexityMultipliers] || 1.0;
  
  // Color complexity
  if (customization.colors.length > 3) {
    basePrice *= 1.2;
  }
  
  // Style complexity
  const complexStyles = ["gradient", "marble", "glitter", "3d", "hand-painted"];
  if (complexStyles.some(style => customization.style.toLowerCase().includes(style))) {
    basePrice *= 1.4;
  }
  
  // Occasion premium
  const premiumOccasions = ["wedding", "special_event", "party"];
  if (premiumOccasions.includes(customization.occasion)) {
    basePrice *= 1.3;
  }
  
  // Personalized elements
  if (customization.personalizedElements.length > 0) {
    basePrice += customization.personalizedElements.length * 10000; // 10,000 KRW per element
  }
  
  return Math.round(basePrice);
}

// Generate multiple design variations
export async function generateDesignVariations(
  basePrompt: string,
  variationCount: number = 3
): Promise<string[]> {
  const variations = [];
  
  const variationModifiers = [
    "with a minimalist approach",
    "with bold, dramatic elements",
    "with subtle, elegant details",
    "with playful, fun elements",
    "with sophisticated, luxury touches"
  ];
  
  for (let i = 0; i < Math.min(variationCount, variationModifiers.length); i++) {
    try {
      const modifiedPrompt = `${basePrompt} ${variationModifiers[i]}`;
      const imageUrl = await generateCustomDesignImage(modifiedPrompt);
      variations.push(imageUrl);
    } catch (error) {
      console.error(`Error generating variation ${i + 1}:`, error);
    }
  }
  
  return variations;
}