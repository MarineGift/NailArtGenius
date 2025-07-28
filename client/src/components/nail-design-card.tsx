import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NailDesign {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  imageUrl: string;
}

interface NailDesignCardProps {
  design: NailDesign;
  isSelected: boolean;
  onSelect: () => void;
}

export default function NailDesignCard({ design, isSelected, onSelect }: NailDesignCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'border-2 border-secondary shadow-lg' : 'border border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        <img 
          src={design.imageUrl} 
          alt={design.name}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
          {design.name}
        </h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {design.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-secondary">
            ₩{parseInt(design.price).toLocaleString()}
          </span>
          <Badge variant="outline" className="text-xs">
            {design.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
