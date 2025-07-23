import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Image, Trash2, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CustomerNailImage, InsertCustomerNailImage, Customer } from '@shared/schema';

export function CustomerNailImageManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');

  // Fetch customers
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });

  // Fetch customer nail images
  const { data: customerImages = [], refetch: refetchImages } = useQuery<CustomerNailImage[]>({
    queryKey: ['/api/customer-nail-images', selectedCustomerId],
    enabled: !!selectedCustomerId,
  });

  // Upload images mutation
  const uploadImagesMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/customer-nail-images/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload images');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "이미지 업로드 완료",
        description: "고객 네일 이미지가 성공적으로 업로드되었습니다.",
      });
      refetchImages();
    },
    onError: (error) => {
      toast({
        title: "업로드 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update image notes mutation
  const updateImageMutation = useMutation({
    mutationFn: async ({ imageId, notes }: { imageId: number; notes: string }) => {
      const response = await fetch(`/api/customer-nail-images/${imageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) throw new Error('Failed to update image');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "이미지 업데이트 완료",
        description: "이미지 메모가 업데이트되었습니다.",
      });
      setEditingImageId(null);
      refetchImages();
    },
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: number) => {
      const response = await fetch(`/api/customer-nail-images/${imageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete image');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "이미지 삭제 완료",
        description: "이미지가 성공적으로 삭제되었습니다.",
      });
      refetchImages();
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedCustomerId) return;

    const formData = new FormData();
    formData.append('userId', selectedCustomerId);
    
    Array.from(files).forEach((file, index) => {
      formData.append('images', file);
      formData.append(`fingerType_${index}`, 'index'); // Default finger type
      formData.append(`handType_${index}`, 'right'); // Default hand type
    });

    uploadImagesMutation.mutate(formData);
  };

  const handleEditSave = (imageId: number) => {
    updateImageMutation.mutate({ imageId, notes: editNotes });
  };

  const getFingerTypeLabel = (fingerType: string) => {
    const labels: Record<string, string> = {
      thumb: '엄지',
      index: '검지',
      middle: '중지',
      ring: '약지',
      pinky: '새끼'
    };
    return labels[fingerType] || fingerType;
  };

  const getHandTypeLabel = (handType: string) => {
    return handType === 'left' ? '왼손' : '오른손';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            고객 네일 이미지 관리 (12개 이미지)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Customer Selection */}
            <div>
              <Label htmlFor="customer-select">고객 선택</Label>
              <select
                id="customer-select"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">고객을 선택해 주세요</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.userId || customer.id}>
                    {customer.name} ({customer.phoneNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            {selectedCustomerId && (
              <div>
                <Label htmlFor="image-upload">네일 이미지 업로드 (최대 12개)</Label>
                <Input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mt-1"
                  disabled={uploadImagesMutation.isPending}
                />
                <p className="text-sm text-gray-600 mt-1">
                  각 손가락별로 이미지를 업로드할 수 있습니다 (양손 10개 + 추가 2개)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Images Display */}
      {selectedCustomerId && customerImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>업로드된 이미지 ({customerImages.length}/12)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customerImages.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt={`${getHandTypeLabel(image.handType || '')} ${getFingerTypeLabel(image.fingerType || '')}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl">🖼️</div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <div className="flex gap-1 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {getHandTypeLabel(image.handType || '')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getFingerTypeLabel(image.fingerType || '')}
                      </Badge>
                    </div>
                    
                    {editingImageId === image.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="메모 입력..."
                          className="text-xs"
                          rows={2}
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleEditSave(image.id)}
                            disabled={updateImageMutation.isPending}
                            className="flex-1"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingImageId(null)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {image.notes || '메모 없음'}
                        </p>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingImageId(image.id);
                              setEditNotes(image.notes || '');
                            }}
                            className="flex-1"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteImageMutation.mutate(image.id)}
                            disabled={deleteImageMutation.isPending}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedCustomerId && customerImages.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">선택한 고객의 네일 이미지가 없습니다.</p>
            <p className="text-sm text-gray-500">위에서 이미지를 업로드해 주세요.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}