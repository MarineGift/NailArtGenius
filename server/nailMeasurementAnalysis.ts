import OpenAI from "openai";
import { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/nail-analysis',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

interface NailMeasurement {
  nailLength: number;
  nailWidth: number;
  nailArea: number;
  shape: string;
  confidence: number;
}

export const uploadHandler = upload.single('image');

export async function analyzeNailMeasurement(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No image file provided' 
      });
    }

    const { fingerType } = req.body;
    if (!fingerType) {
      return res.status(400).json({ 
        error: 'Finger type is required' 
      });
    }

    // Process and optimize the image
    const imagePath = req.file.path;
    const processedImagePath = `${imagePath}-processed.jpg`;
    
    // Resize and optimize the image for analysis
    await sharp(imagePath)
      .resize(1024, 1024, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toFile(processedImagePath);

    // Convert image to base64 for OpenAI
    const imageBuffer = await fs.readFile(processedImagePath);
    const base64Image = imageBuffer.toString('base64');

    // Analyze the nail with OpenAI Vision API
    const analysisPrompt = `
You are a professional nail measurement expert. Analyze this nail photo that includes a standard credit card for scale reference.

Credit card dimensions for scale: 85.60mm × 53.98mm × 0.76mm

Please measure and analyze:
1. Nail length (from cuticle to tip) in millimeters
2. Nail width (at widest point) in millimeters
3. Calculate nail surface area in square millimeters
4. Determine nail shape (oval, square, round, almond, coffin, stiletto)
5. Provide confidence level (0.0 to 1.0)

The finger type being analyzed is: ${fingerType}

Respond with accurate measurements in JSON format:
{
  "nailLength": number,
  "nailWidth": number,
  "nailArea": number,
  "shape": string,
  "confidence": number,
  "fingerType": string,
  "analysisNotes": string
}

Be precise with measurements using the credit card as reference scale.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: analysisPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.1, // Low temperature for consistent measurements
    });

    const analysisResult = JSON.parse(response.choices[0].message.content!);

    // Validate the analysis result
    const measurement: NailMeasurement = {
      nailLength: parseFloat(analysisResult.nailLength) || 0,
      nailWidth: parseFloat(analysisResult.nailWidth) || 0,
      nailArea: parseFloat(analysisResult.nailArea) || 0,
      shape: analysisResult.shape || 'unknown',
      confidence: parseFloat(analysisResult.confidence) || 0
    };

    // Clean up temporary files
    try {
      await fs.unlink(imagePath);
      await fs.unlink(processedImagePath);
    } catch (error) {
      console.warn('Error cleaning up temporary files:', error);
    }

    // Log the analysis for debugging
    console.log(`Nail analysis completed for ${fingerType}:`, measurement);

    res.json({
      success: true,
      fingerType,
      ...measurement,
      analysisNotes: analysisResult.analysisNotes || '',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Nail measurement analysis error:', error);
    
    // Clean up files on error
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
        await fs.unlink(`${req.file.path}-processed.jpg`);
      } catch (cleanupError) {
        console.warn('Error cleaning up files after error:', cleanupError);
      }
    }

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(500).json({
          error: 'OpenAI API configuration error',
          message: 'Please check API key configuration'
        });
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return res.status(429).json({
          error: 'API rate limit exceeded',
          message: 'Please try again in a few minutes'
        });
      }
    }

    res.status(500).json({
      error: 'Analysis failed',
      message: 'Unable to analyze nail measurements. Please try again.'
    });
  }
}

// Utility function to validate measurements
export function validateMeasurements(measurement: NailMeasurement): boolean {
  return (
    measurement.nailLength > 0 && 
    measurement.nailLength < 50 && // Reasonable upper limit
    measurement.nailWidth > 0 && 
    measurement.nailWidth < 30 && // Reasonable upper limit
    measurement.nailArea > 0 &&
    measurement.confidence >= 0 &&
    measurement.confidence <= 1 &&
    ['oval', 'square', 'round', 'almond', 'coffin', 'stiletto', 'unknown'].includes(measurement.shape.toLowerCase())
  );
}

// Helper function to create upload directory
export async function ensureUploadDirectory() {
  const uploadDir = 'uploads/nail-analysis';
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
}