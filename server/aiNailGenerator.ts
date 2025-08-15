import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface NailArtGenerationRequest {
  prompt: string;
  style: string;
  colors: string[];
  complexity: string;
}

export interface NailArtGenerationResponse {
  imageUrl: string;
  prompt: string;
  style: string;
  colors: string[];
  complexity: string;
  timestamp: Date;
}

export async function generateNailArt(params: NailArtGenerationRequest): Promise<NailArtGenerationResponse> {
  try {
    // Create a comprehensive prompt for DALL-E
    const enhancedPrompt = createEnhancedPrompt(params);

    // Generate image with DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural" // More realistic for nail art
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image generated');
    }
    
    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL received');
    }

    return {
      imageUrl,
      prompt: params.prompt,
      style: params.style,
      colors: params.colors,
      complexity: params.complexity,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error generating nail art:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate nail art: ${errorMessage}`);
  }
}

function createEnhancedPrompt(params: NailArtGenerationRequest): string {
  let prompt = `Professional nail art design: ${params.prompt}`;

  // Add style characteristics
  if (params.style) {
    const styleDescriptions = {
      minimalist: 'clean, simple, elegant lines, subtle design',
      floral: 'beautiful flowers, petals, botanical elements, nature-inspired',
      geometric: 'precise geometric shapes, lines, patterns, modern symmetry',
      abstract: 'artistic abstract patterns, creative flowing designs',
      vintage: 'classic, retro, timeless elegant style',
      modern: 'contemporary, trendy, cutting-edge design',
      cute: 'adorable, playful, charming, sweet design elements',
      elegant: 'sophisticated, refined, luxurious, graceful'
    };
    
    const styleDesc = styleDescriptions[params.style as keyof typeof styleDescriptions];
    if (styleDesc) {
      prompt += `, featuring ${styleDesc}`;
    }
  }

  // Add color information
  if (params.colors && params.colors.length > 0) {
    const colorNames = params.colors.map(color => {
      // Convert hex to color names for better DALL-E understanding
      const colorMap: { [key: string]: string } = {
        '#FF6B9D': 'pink',
        '#8B5CF6': 'purple',
        '#06B6D4': 'cyan',
        '#10B981': 'emerald',
        '#F59E0B': 'amber',
        '#EF4444': 'red',
        '#EC4899': 'hot pink',
        '#6366F1': 'indigo',
        '#000000': 'black',
        '#FFFFFF': 'white',
        '#9CA3AF': 'gray',
        '#F3F4F6': 'light gray'
      };
      return colorMap[color] || color;
    });
    prompt += `, using colors: ${colorNames.join(', ')}`;
  }

  // Add complexity information
  const complexityDescriptions = {
    simple: 'simple and clean design, minimal details',
    medium: 'moderate detail level, balanced complexity',
    complex: 'intricate details, elaborate patterns, highly detailed'
  };
  
  const complexityDesc = complexityDescriptions[params.complexity as keyof typeof complexityDescriptions];
  if (complexityDesc) {
    prompt += `, with ${complexityDesc}`;
  }

  // Add nail art specific details
  prompt += '. Professional nail salon quality, well-manicured nails, perfect application, high-quality finish, close-up detailed view of fingernails, realistic lighting, studio photography style.';

  return prompt;
}

export async function analyzeNailArt(imageUrl: string): Promise<{
  description: string;
  suggestedStyle: string;
  dominantColors: string[];
  complexity: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this nail art design and provide a detailed description, suggested style category, dominant colors, and complexity level. Return the response in JSON format with keys: description, suggestedStyle, dominantColors (array), complexity."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      description: result.description || 'Beautiful nail art design',
      suggestedStyle: result.suggestedStyle || 'modern',
      dominantColors: result.dominantColors || [],
      complexity: result.complexity || 'medium'
    };
  } catch (error) {
    console.error('Error analyzing nail art:', error);
    // Return default analysis if AI analysis fails
    return {
      description: 'Beautiful nail art design',
      suggestedStyle: 'modern',
      dominantColors: [],
      complexity: 'medium'
    };
  }
}