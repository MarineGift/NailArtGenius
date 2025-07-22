import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Upload, Image, Save, X } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  price: string;
  duration?: string;
  difficulty?: string;
  rating?: number;
  reviews?: number;
  techniques?: string[];
  materials?: string[];
  aftercare?: string;
  suitableFor?: string;
  isActive: boolean;
  createdAt: Date;
}

export default function GalleryAdmin() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: '',
    description: '',
    category: '',
    image: '',
    price: '',
    duration: '',
    difficulty: 'medium',
    techniques: [],
    materials: [],
    aftercare: '',
    suitableFor: '',
    isActive: true
  });

  // Categories
  const categories = [
    'classic', 'floral', 'modern', 'glamour', 'minimalist', 
    'seasonal', 'wedding', 'gradient', '3d', 'artistic'
  ];

  // Difficulty levels
  const difficultyLevels = [
    { value: 'beginner', label: '초급' },
    { value: 'medium', label: '중급' },
    { value: 'advanced', label: '고급' }
  ];

  // Fetch gallery items
  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['/api/gallery'],
    select: (data: GalleryItem[]) => data
  });

  // Create gallery item mutation
  const createItemMutation = useMutation({
    mutationFn: async (itemData: Partial<GalleryItem>) => {
      return apiRequest('/api/gallery', 'POST', itemData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setShowAddDialog(false);
      resetForm();
      toast({
        title: '성공',
        description: '갤러리 아이템이 추가되었습니다.',
      });
    },
    onError: () => {
      toast({
        title: '오류',
        description: '갤러리 아이템 추가 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  });

  // Update gallery item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ id, ...itemData }: Partial<GalleryItem> & { id: number }) => {
      return apiRequest(`/api/gallery/${id}`, 'PUT', itemData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      setIsEditing(false);
      setSelectedItem(null);
      resetForm();
      toast({
        title: '성공',
        description: '갤러리 아이템이 수정되었습니다.',
      });
    },
    onError: () => {
      toast({
        title: '오류',
        description: '갤러리 아이템 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  });

  // Delete gallery item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/gallery/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({
        title: '성공',
        description: '갤러리 아이템이 삭제되었습니다.',
      });
    },
    onError: () => {
      toast({
        title: '오류',
        description: '갤러리 아이템 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      image: '',
      price: '',
      duration: '',
      difficulty: 'medium',
      techniques: [],
      materials: [],
      aftercare: '',
      suitableFor: '',
      isActive: true
    });
  };

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData(item);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: '필수 필드 누락',
        description: '제목, 설명, 카테고리는 필수 입력 항목입니다.',
        variant: 'destructive',
      });
      return;
    }

    if (isEditing && selectedItem) {
      updateItemMutation.mutate({ ...formData, id: selectedItem.id });
    } else {
      createItemMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('정말로 이 아이템을 삭제하시겠습니까?')) {
      deleteItemMutation.mutate(id);
    }
  };

  const addTechnique = (technique: string) => {
    if (technique.trim() && !formData.techniques?.includes(technique.trim())) {
      setFormData(prev => ({
        ...prev,
        techniques: [...(prev.techniques || []), technique.trim()]
      }));
    }
  };

  const removeTechnique = (technique: string) => {
    setFormData(prev => ({
      ...prev,
      techniques: prev.techniques?.filter(t => t !== technique) || []
    }));
  };

  const addMaterial = (material: string) => {
    if (material.trim() && !formData.materials?.includes(material.trim())) {
      setFormData(prev => ({
        ...prev,
        materials: [...(prev.materials || []), material.trim()]
      }));
    }
  };

  const removeMaterial = (material: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials?.filter(m => m !== material) || []
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              갤러리 관리
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              네일아트 갤러리 컨텐츠를 관리하세요
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            새 아이템 추가
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Image className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{galleryItems.length}</p>
                  <p className="text-gray-600 dark:text-gray-400">총 아이템</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">{galleryItems.filter(item => item.isActive).length}</p>
                  <p className="text-gray-600 dark:text-gray-400">활성 아이템</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📂</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">{new Set(galleryItems.map(item => item.category)).size}</p>
                  <p className="text-gray-600 dark:text-gray-400">카테고리</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⭐</span>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {galleryItems.reduce((sum, item) => sum + (item.rating || 0), 0) / galleryItems.length || 0}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">평균 평점</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={item.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                    {item.isActive ? '활성' : '비활성'}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary">
                    {item.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <span className="text-lg font-bold text-blue-600">{item.price}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  {item.rating && (
                    <Badge variant="outline" className="text-xs">
                      ⭐ {item.rating}
                    </Badge>
                  )}
                  {item.difficulty && (
                    <Badge variant="outline" className="text-xs">
                      {difficultyLevels.find(d => d.value === item.difficulty)?.label}
                    </Badge>
                  )}
                  {item.duration && (
                    <Badge variant="outline" className="text-xs">
                      {item.duration}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={showAddDialog || isEditing} onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setIsEditing(false);
            setSelectedItem(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? '갤러리 아이템 수정' : '새 갤러리 아이템 추가'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">기본 정보</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">제목 *</label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="네일아트 제목"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">설명 *</label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="네일아트 설명"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">카테고리 *</label>
                    <Select 
                      value={formData.category || ''} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">가격</label>
                    <Input
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="$45"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">이미지 URL</label>
                  <Input
                    value={formData.image || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">상세 정보</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">소요시간</label>
                    <Input
                      value={formData.duration || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="45분"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">난이도</label>
                    <Select 
                      value={formData.difficulty || 'medium'} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">시술 기법</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="기법 입력 후 Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTechnique(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.techniques?.map((technique, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {technique}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => removeTechnique(technique)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">사용 재료</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="재료 입력 후 Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addMaterial(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.materials?.map((material, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {material}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => removeMaterial(material)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">관리 방법</label>
                  <Textarea
                    value={formData.aftercare || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, aftercare: e.target.value }))}
                    placeholder="2-3주 지속, 오일 케어 권장"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">추천 상황</label>
                  <Textarea
                    value={formData.suitableFor || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, suitableFor: e.target.value }))}
                    placeholder="모든 행사, 직장, 일상"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setIsEditing(false);
                setSelectedItem(null);
                resetForm();
              }}>
                취소
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
}