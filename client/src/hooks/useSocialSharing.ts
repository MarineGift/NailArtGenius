import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ShareData {
  platform: string;
  designId?: string;
  designTitle: string;
  sharedAt: Date;
}

interface SocialSharingStats {
  totalShares: number;
  platformBreakdown: Record<string, number>;
  recentShares: ShareData[];
}

export function useSocialSharing() {
  const [isSharing, setIsSharing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Track social media shares
  const trackShareMutation = useMutation({
    mutationFn: async (shareData: Omit<ShareData, 'sharedAt'>) => {
      return apiRequest('/api/social-shares', {
        method: 'POST',
        body: {
          ...shareData,
          sharedAt: new Date().toISOString()
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-shares'] });
      toast({
        title: "Share Tracked",
        description: "Your design share has been recorded.",
        duration: 2000,
      });
    },
    onError: (error) => {
      console.error('Failed to track share:', error);
    }
  });

  // Generate sharing content with AI enhancement
  const generateShareContentMutation = useMutation({
    mutationFn: async ({ designImage, designTitle }: { designImage: string; designTitle: string }) => {
      return apiRequest('/api/ai/generate-share-content', {
        method: 'POST',
        body: {
          designImage,
          designTitle
        }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Share Content Generated",
        description: "AI-enhanced sharing content is ready!",
        duration: 3000,
      });
    }
  });

  const trackShare = async (platform: string, designId?: string, designTitle?: string) => {
    if (!designTitle) return;
    
    setIsSharing(true);
    try {
      await trackShareMutation.mutateAsync({
        platform,
        designId,
        designTitle
      });
    } finally {
      setIsSharing(false);
    }
  };

  const generateShareContent = async (designImage: string, designTitle: string) => {
    return generateShareContentMutation.mutateAsync({
      designImage,
      designTitle
    });
  };

  // Share to specific platforms with platform-specific optimizations
  const shareToFacebook = (url: string, description: string) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(description)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = (url: string, text: string, hashtags: string[] = []) => {
    const hashtagString = hashtags.join(',');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtagString}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = (url: string, text: string) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToPinterest = (url: string, imageUrl: string, description: string) => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description)}`;
    window.open(pinterestUrl, '_blank', 'width=600,height=400');
  };

  // Native sharing for mobile devices
  const shareNative = async (data: { title: string; text: string; url: string }) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.log('Native share cancelled or failed:', error);
        return false;
      }
    }
    return false;
  };

  return {
    isSharing,
    trackShare,
    generateShareContent,
    shareToFacebook,
    shareToTwitter,
    shareToWhatsApp,
    shareToPinterest,
    shareNative,
    trackShareMutation,
    generateShareContentMutation
  };
}