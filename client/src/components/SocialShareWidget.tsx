import { useState } from "react";
import { Share2, Facebook, Twitter, Instagram, MessageCircle, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SocialShareWidgetProps {
  designImage: string;
  designTitle: string;
  designDescription?: string;
  designId?: string;
  onShare?: (platform: string) => void;
}

export function SocialShareWidget({
  designImage,
  designTitle,
  designDescription = "Check out my beautiful nail art design created with AI!",
  designId,
  onShare
}: SocialShareWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate sharing URLs
  const baseUrl = window.location.origin;
  const designUrl = designId ? `${baseUrl}/design/${designId}` : window.location.href;
  const encodedUrl = encodeURIComponent(designUrl);
  const encodedTitle = encodeURIComponent(designTitle);
  const encodedDescription = encodeURIComponent(designDescription);
  const encodedImage = encodeURIComponent(`${baseUrl}${designImage}`);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedDescription}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedDescription}&url=${encodedUrl}&hashtags=NailArt,AIDesign,ConniesNail`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing
    whatsapp: `https://wa.me/?text=${encodedDescription}%20${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedDescription}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

  const handleShare = async (platform: string) => {
    onShare?.(platform);

    if (platform === 'instagram') {
      toast({
        title: "Instagram Sharing",
        description: "Download the image and share it manually on Instagram.",
        duration: 3000,
      });
      return;
    }

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: designTitle,
          text: designDescription,
          url: designUrl
        });
        return;
      } catch (error) {
        console.log('Native share cancelled');
      }
    }

    // Open sharing URL in new window
    const url = shareUrls[platform as keyof typeof shareUrls];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(designUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Design link has been copied to clipboard.",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = designImage;
    link.download = `${designTitle.replace(/\s+/g, '_')}_nail_design.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your nail design image is downloading.",
      duration: 2000,
    });

    onShare?.('download');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 size={16} />
          Share Design
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 size={20} />
            Share Your Nail Design
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Design Preview */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img 
              src={designImage} 
              alt={designTitle}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{designTitle}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">{designDescription}</p>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-3">
            <h5 className="font-medium text-sm">Share on Social Media</h5>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('facebook')}
                className="justify-start gap-2 text-blue-600 hover:text-blue-700"
              >
                <Facebook size={16} />
                Facebook
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="justify-start gap-2 text-sky-500 hover:text-sky-600"
              >
                <Twitter size={16} />
                Twitter
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('instagram')}
                className="justify-start gap-2 text-pink-600 hover:text-pink-700"
              >
                <Instagram size={16} />
                Instagram
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('whatsapp')}
                className="justify-start gap-2 text-green-600 hover:text-green-700"
              >
                <MessageCircle size={16} />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="space-y-3 pt-2 border-t">
            <h5 className="font-medium text-sm">Other Options</h5>
            
            {/* Native Share (Mobile) */}
            {navigator.share && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('native')}
                className="w-full justify-start gap-2"
              >
                <Share2 size={16} />
                Share via Device
              </Button>
            )}
            
            {/* Download Image */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadImage}
              className="w-full justify-start gap-2 text-purple-600 hover:text-purple-700"
            >
              <Download size={16} />
              Download Image
            </Button>
            
            {/* Copy Link */}
            <div className="flex gap-2">
              <Input
                value={designUrl}
                readOnly
                className="text-xs"
                placeholder="Design URL"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-600" />
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Hashtag Suggestions */}
          <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
            <strong>Suggested hashtags:</strong> #NailArt #AIDesign #ConniesNail #NailInspiration #DigitalNails #BeautyTech
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}