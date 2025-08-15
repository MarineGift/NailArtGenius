import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, CheckCircle } from "lucide-react";

interface PhotoUploadZoneProps {
  label: string;
  onUpload: (file: File) => void;
  isUploaded: boolean;
}

export default function PhotoUploadZone({ label, onUpload, isUploaded }: PhotoUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isUploaded 
          ? 'border-success bg-green-50' 
          : 'border-dashed border-2 border-gray-300 hover:border-secondary'
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="mb-4">
          {isUploaded ? (
            <CheckCircle className="h-8 w-8 text-success mx-auto" />
          ) : (
            <Camera className="h-8 w-8 text-gray-400 mx-auto" />
          )}
        </div>
        
        <p className={`text-sm mb-2 ${isUploaded ? 'text-success font-medium' : 'text-gray-600'}`}>
          {label}
        </p>
        
        <p className="text-xs text-gray-500">
          {isUploaded ? '업로드 완료' : '클릭하여 업로드'}
        </p>
      </CardContent>
    </Card>
  );
}
