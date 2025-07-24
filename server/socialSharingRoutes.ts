import { Router } from 'express';
import { storage } from './storage';
import { z } from 'zod';
import OpenAI from 'openai';

const router = Router();

// Validation schemas
const shareDataSchema = z.object({
  platform: z.string(),
  designId: z.string().optional(),
  designTitle: z.string(),
  sharedAt: z.string()
});

const generateShareContentSchema = z.object({
  designImage: z.string(),
  designTitle: z.string()
});

// Initialize OpenAI for content generation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Track social media shares
router.post('/social-shares', async (req, res) => {
  try {
    const shareData = shareDataSchema.parse(req.body);
    
    // Store share data in database
    const shareRecord = await storage.createSocialShare({
      platform: shareData.platform,
      designId: shareData.designId ? parseInt(shareData.designId) : null,
      designTitle: shareData.designTitle,
      sharedAt: new Date(shareData.sharedAt),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
      GetDate: new Date()
    });

    res.json({ 
      success: true, 
      shareId: shareRecord.id,
      message: 'Share tracked successfully' 
    });
  } catch (error) {
    console.error('Error tracking social share:', error);
    res.status(400).json({ 
      error: 'Failed to track share',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get social sharing statistics
router.get('/social-shares/stats', async (req, res) => {
  try {
    const stats = await storage.getSocialSharingStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting social sharing stats:', error);
    res.status(500).json({ error: 'Failed to get sharing statistics' });
  }
});

// AI-powered share content generation
router.post('/ai/generate-share-content', async (req, res) => {
  try {
    const { designImage, designTitle } = generateShareContentSchema.parse(req.body);

    if (!openai.apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured' 
      });
    }

    // Generate engaging social media content
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a social media expert for a nail salon. Generate engaging, trendy social media posts for nail art designs. Include relevant hashtags and emojis. Keep posts concise but captivating.`
        },
        {
          role: "user",
          content: `Create social media content for this nail design: "${designTitle}". Make it engaging and include relevant hashtags for maximum reach.`
        }
      ],
      max_tokens: 200,
      temperature: 0.8
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Generate platform-specific content
    const platformContent = {
      facebook: generatedContent,
      twitter: generatedContent.substring(0, 240) + (generatedContent.length > 240 ? '...' : ''),
      instagram: generatedContent + '\n\n#NailArt #AIDesign #ConniesNail #BeautyTech #NailInspiration',
      general: generatedContent
    };

    res.json({
      success: true,
      content: platformContent,
      hashtags: ['#NailArt', '#AIDesign', '#ConniesNail', '#BeautyTech', '#NailInspiration', '#DigitalNails']
    });

  } catch (error) {
    console.error('Error generating share content:', error);
    res.status(500).json({ 
      error: 'Failed to generate share content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get popular designs based on social shares
router.get('/popular-designs', async (req, res) => {
  try {
    const popularDesigns = await storage.getPopularSharedDesigns();
    res.json(popularDesigns);
  } catch (error) {
    console.error('Error getting popular designs:', error);
    res.status(500).json({ error: 'Failed to get popular designs' });
  }
});

// Get sharing trends analytics
router.get('/social-shares/trends', async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const trends = await storage.getSharingTrends(period as string);
    res.json(trends);
  } catch (error) {
    console.error('Error getting sharing trends:', error);
    res.status(500).json({ error: 'Failed to get sharing trends' });
  }
});

export default router;