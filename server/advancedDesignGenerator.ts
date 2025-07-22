import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AdvancedStylePreferences {
  // Basic preferences
  preferredColors: string[];
  preferredStyles: string[];
  occasions: string[];
  complexity: "simple" | "medium" | "complex";
  budget: "low" | "medium" | "high";
  skinTone?: "fair" | "medium" | "tan" | "deep";
  lifestyle?: string;
  notes?: string;
  
  // Advanced customization
  finishType?: string[];
  intensity?: "subtle" | "moderate" | "bold" | "dramatic";
  patternPreference?: "solid" | "gradient" | "pattern" | "mixed";
  colorHarmony?: "monochromatic" | "complementary" | "triadic" | "analogous";
  personalityTraits?: string[];
  inspirationKeywords?: string;
}

export interface NailMeasurement {
  fingerType: string;
  nailWidth: number;
  nailLength: number;
  nailCurvature: number;
  fingerWidth: number;
  fingerLength: number;
  shapeCategory: string;
  confidence: number;
}

/**
 * Generate advanced AI nail design using comprehensive style preferences and nail measurements
 */
export async function generateAdvancedNailDesign(
  measurements: NailMeasurement[],
  preferences: AdvancedStylePreferences,
  customPrompt?: string
): Promise<string> {
  try {
    const prompt = buildAdvancedDesignPrompt(measurements, preferences, customPrompt);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: preferences.intensity === "dramatic" ? "vivid" : "natural",
    });

    return response.data[0].url;
  } catch (error) {
    console.error("Advanced design generation error:", error);
    throw new Error("고급 네일아트 디자인 생성 중 오류가 발생했습니다.");
  }
}

/**
 * Build comprehensive design prompt based on measurements and advanced preferences
 */
function buildAdvancedDesignPrompt(
  measurements: NailMeasurement[],
  preferences: AdvancedStylePreferences,
  customPrompt?: string
): string {
  let prompt = `Create a professional nail art design with these specifications:\n\n`;

  // Custom request if provided
  if (customPrompt) {
    prompt += `Custom Design Request: ${customPrompt}\n\n`;
  }

  // Precise nail measurements
  prompt += `Precise Nail Measurements (use for perfect proportions):\n`;
  measurements.forEach(measurement => {
    if (measurement.confidence > 50) {
      prompt += `- ${measurement.fingerType}: ${measurement.nailWidth.toFixed(1)}mm wide × ${measurement.nailLength.toFixed(1)}mm long, ${measurement.shapeCategory} shape\n`;
    }
  });

  // Color preferences with harmony theory
  if (preferences.preferredColors.length > 0) {
    prompt += `\nColor Palette: ${preferences.preferredColors.join(", ")}`;
    if (preferences.colorHarmony) {
      prompt += ` (using ${preferences.colorHarmony} color harmony theory)`;
    }
    prompt += `\n`;
  }

  // Style and personality integration
  if (preferences.preferredStyles.length > 0) {
    prompt += `Style Elements: ${preferences.preferredStyles.join(", ")}\n`;
  }

  if (preferences.personalityTraits && preferences.personalityTraits.length > 0) {
    prompt += `Personality Expression: Design should reflect ${preferences.personalityTraits.join(", ")} characteristics\n`;
  }

  // Pattern and finish specifications
  if (preferences.patternPreference) {
    prompt += `Pattern Style: ${preferences.patternPreference} approach\n`;
  }

  if (preferences.finishType && preferences.finishType.length > 0) {
    prompt += `Finish Type: ${preferences.finishType.join(" and ")} finish\n`;
  }

  // Intensity and complexity
  if (preferences.intensity) {
    const intensityDescriptions = {
      subtle: "subtle and understated",
      moderate: "balanced and elegant", 
      bold: "striking and eye-catching",
      dramatic: "bold and theatrical"
    };
    prompt += `Design Intensity: ${intensityDescriptions[preferences.intensity]}\n`;
  }

  if (preferences.complexity) {
    const complexityDescriptions = {
      simple: "clean and minimalist with few elements",
      medium: "balanced complexity with moderate detail",
      complex: "intricate and detailed with multiple design elements"
    };
    prompt += `Complexity Level: ${complexityDescriptions[preferences.complexity]}\n`;
  }

  // Occasion-specific requirements
  if (preferences.occasions.length > 0) {
    prompt += `Suitable for: ${preferences.occasions.join(", ")}\n`;
  }

  // Skin tone consideration
  if (preferences.skinTone) {
    prompt += `Skin Tone Compatibility: Optimize colors for ${preferences.skinTone} skin tone\n`;
  }

  // Inspiration keywords
  if (preferences.inspirationKeywords) {
    prompt += `Creative Inspiration: ${preferences.inspirationKeywords}\n`;
  }

  // Lifestyle considerations
  if (preferences.lifestyle) {
    prompt += `Lifestyle Considerations: ${preferences.lifestyle}\n`;
  }

  // Budget-appropriate techniques
  if (preferences.budget) {
    const budgetTechniques = {
      low: "cost-effective techniques using basic colors and simple patterns",
      medium: "balanced approach with moderate embellishments and color variety",
      high: "premium techniques with luxury finishes, complex artwork, and high-end materials"
    };
    prompt += `Technique Level: ${budgetTechniques[preferences.budget]}\n`;
  }

  // Additional notes
  if (preferences.notes) {
    prompt += `Special Requirements: ${preferences.notes}\n`;
  }

  // Technical requirements
  prompt += `\nTechnical Requirements:
- Design must be precisely proportioned to the measured nail dimensions
- Each finger should have a cohesive yet appropriately sized design variation
- Consider the natural nail curvature for realistic application
- Ensure the design is suitable for nail art printing technology
- Create high-resolution artwork suitable for professional application
- Design should photograph beautifully and be Instagram-worthy
- Include proper color transitions and shading for depth
- Ensure design elements align with nail shape categories

Visual Style:
- Professional salon-quality appearance
- Photorealistic rendering with proper lighting
- Show design on actual nail-shaped surfaces
- Include subtle shadows and highlights for dimension
- Demonstrate how the design flows with nail curvature
- Present the design in a way that showcases its wearability

Create a stunning, personalized nail art design that perfectly balances artistic expression with practical wearability.`;

  return prompt;
}

/**
 * Generate multiple design variations based on user preferences
 */
export async function generateDesignVariations(
  measurements: NailMeasurement[],
  preferences: AdvancedStylePreferences,
  variationCount: number = 3
): Promise<string[]> {
  const designUrls: string[] = [];
  
  try {
    // Create variations by modifying intensity and pattern preferences
    const intensityVariations: Array<AdvancedStylePreferences["intensity"]> = ["subtle", "moderate", "bold"];
    const patternVariations: Array<AdvancedStylePreferences["patternPreference"]> = ["solid", "gradient", "pattern"];
    
    for (let i = 0; i < Math.min(variationCount, 3); i++) {
      const variationPreferences = {
        ...preferences,
        intensity: intensityVariations[i] || preferences.intensity,
        patternPreference: patternVariations[i] || preferences.patternPreference,
      };
      
      const designUrl = await generateAdvancedNailDesign(measurements, variationPreferences);
      designUrls.push(designUrl);
    }
    
    return designUrls;
  } catch (error) {
    console.error("Design variations generation error:", error);
    throw new Error("디자인 변형 생성 중 오류가 발생했습니다.");
  }
}

/**
 * Analyze and provide design recommendations based on measurements and preferences
 */
export async function analyzeDesignRecommendations(
  measurements: NailMeasurement[],
  preferences: AdvancedStylePreferences
): Promise<{
  recommendations: string[];
  colorSuggestions: string[];
  styleSuggestions: string[];
  warnings: string[];
}> {
  try {
    const prompt = `As a professional nail technician and design expert, analyze these nail measurements and style preferences to provide personalized recommendations:

Nail Measurements:
${measurements.map(m => `- ${m.fingerType}: ${m.nailWidth}mm × ${m.nailLength}mm, ${m.shapeCategory} shape`).join('\n')}

Style Preferences:
- Colors: ${preferences.preferredColors.join(', ')}
- Styles: ${preferences.preferredStyles.join(', ')}
- Occasions: ${preferences.occasions.join(', ')}
- Complexity: ${preferences.complexity}
- Personality: ${preferences.personalityTraits?.join(', ') || 'Not specified'}
- Inspiration: ${preferences.inspirationKeywords || 'Not specified'}

Provide analysis in this JSON format:
{
  "recommendations": ["specific design recommendations based on nail shape and size"],
  "colorSuggestions": ["color combinations that work well with preferences and skin tone"],
  "styleSuggestions": ["style modifications to enhance the overall look"],
  "warnings": ["potential issues or considerations for the chosen preferences"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert nail technician with extensive knowledge of nail art design, color theory, and technical application. Provide detailed, professional recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Design analysis error:", error);
    return {
      recommendations: ["정밀한 측정 데이터를 바탕으로 맞춤형 디자인을 생성할 수 있습니다."],
      colorSuggestions: ["선택하신 색상들이 잘 어울릴 것 같습니다."],
      styleSuggestions: ["선호하신 스타일을 반영한 디자인을 추천드립니다."],
      warnings: []
    };
  }
}