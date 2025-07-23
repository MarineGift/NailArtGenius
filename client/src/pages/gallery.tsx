import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Clock, Star, Heart, Image as ImageIcon } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  category: string;
  imagePath: string;
  thumbnailPath?: string;
  tags: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GalleryDetailItem {
  id: number;
  galleryId: number;
  techniquesUsed?: string;
  timeRequired?: string;
  difficultyLevel?: string;
  priceRange?: string;
  maintenanceGuide?: string;
  suitableFor?: string;
  materials?: string[];
}

export default function Gallery() {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<GalleryDetailItem | null>(null);

  // Fetch gallery items from database
  const { data: galleryItems = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery'],
  });

  // Fetch gallery detail when item is selected
  const { data: galleryDetail } = useQuery<GalleryDetailItem>({
    queryKey: ['/api/gallery', selectedItem?.id, 'detail'],
    queryFn: () => 
      fetch(`/api/gallery/${selectedItem?.id}/detail`).then(res => res.json()),
    enabled: !!selectedItem?.id,
  });

  // Create thumbnail from image
  const createThumbnail = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath + '?w=64&h=64&fit=crop';
    }
    return imagePath; // For local images, use as-is for now
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading gallery...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Previous hardcoded data (kept for fallback)
  const fallbackGallery = [
    {
      id: 1,
      title: "클래식 프렌치 매니큐어",
      description: "전통적인 프렌치 매니큐어 스타일",
      category: "classic",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
      price: "$45",
      duration: "45분",
      difficulty: "초급",
      rating: 4.8,
      reviews: 127,
      techniques: ["베이스 코팅", "화이트 팁", "탑 코팅"],
      materials: ["젤 베이스", "화이트 젤", "클리어 탑코트"],
      aftercare: "2-3주 지속, 오일 케어 권장",
      suitableFor: "모든 행사, 직장, 일상"
    },
    {
      id: 2,
      title: "플로럴 디자인",
      description: "섬세한 꽃 무늬 네일아트",
      category: "floral",
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=400&fit=crop",
      price: "$65",
      duration: "90분",
      difficulty: "고급",
      rating: 4.9,
      reviews: 89,
      techniques: ["손그림 아트", "그라데이션", "세밀 터치"],
      materials: ["아크릴 페인트", "세밀 브러시", "젤 탑코트"],
      aftercare: "3-4주 지속, 손 보호 권장",
      suitableFor: "특별한 행사, 웨딩, 파티"
    },
    {
      id: 3,
      title: "지오메트릭 패턴",
      description: "모던한 기하학적 패턴",
      category: "modern", 
      image: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop",
      price: "$55",
      duration: "60분",
      difficulty: "중급",
      rating: 4.7,
      reviews: 156,
      techniques: ["스트라이핑 테이프", "기하학 패턴", "컬러 블로킹"],
      materials: ["젤 폴리시", "스트라이핑 테이프", "정밀 브러시"],
      aftercare: "2-3주 지속, 충격 주의",
      suitableFor: "현대적 스타일, 비즈니스"
    },
    {
      id: 4,
      title: "글리터 & 스파클",
      description: "화려한 글리터 네일아트",
      category: "glamour",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop",
      price: "$70"
    },
    {
      id: 5,
      title: "미니멀리스트 스타일",
      description: "심플하고 세련된 미니멀 디자인",
      category: "minimalist",
      image: "https://images.unsplash.com/photo-1599948174842-84bf74a4b2c5?w=400&h=400&fit=crop",
      price: "$40"
    },
    {
      id: 6,
      title: "시즌 디자인",
      description: "계절감 있는 특별 디자인",
      category: "seasonal",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      price: "$60"
    },
    {
      id: 7,
      title: "웨딩 스페셜",
      description: "결혼식을 위한 우아한 네일아트",
      category: "wedding",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
      price: "$80"
    },
    {
      id: 8,
      title: "옴브레 이펙트",
      description: "부드러운 그라데이션 효과",
      category: "gradient",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
      price: "$65"
    },
    {
      id: 9,
      title: "3D 아트 디자인",
      description: "입체적인 3D 네일아트",
      category: "3d",
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop",
      price: "$90"
    }
  ];

  // 시술 과정 사진
  const treatmentProcess = [
    {
      id: 1,
      title: "네일 준비 단계",
      description: "큐티클 케어와 네일 정리",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "베이스 코팅",
      description: "건강한 네일을 위한 베이스 작업",
      image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "컬러 적용",
      description: "정밀한 컬러 적용 과정",
      image: "https://images.unsplash.com/photo-1604902396830-aca29492adc3?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "마무리 코팅",
      description: "오래가는 광택을 위한 탑 코팅",
      image: "https://images.unsplash.com/photo-1562887495-b65905f149ac?w=400&h=300&fit=crop"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      classic: "bg-blue-100 text-blue-800",
      floral: "bg-pink-100 text-pink-800",
      modern: "bg-purple-100 text-purple-800",
      glamour: "bg-yellow-100 text-yellow-800",
      minimalist: "bg-gray-100 text-gray-800",
      seasonal: "bg-green-100 text-green-800",
      wedding: "bg-rose-100 text-rose-800",
      gradient: "bg-indigo-100 text-indigo-800",
      "3d": "bg-red-100 text-red-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('gallery.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* 네일아트 갤러리 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('gallery.design_gallery')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square relative">
                  <img
                    src={item.imagePath}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <span className="text-lg font-bold text-secondary">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-sm text-gray-500">({item.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{item.duration}</span>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="aspect-video relative rounded-lg overflow-hidden">
                          <img
                            src={item.imagePath}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className={getCategoryColor(item.category)}>
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Gallery Information Table */}
                        {galleryDetail && (
                          <div className="mt-6">
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <ImageIcon className="h-5 w-5" />
                              Gallery Information
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Property</TableHead>
                                  <TableHead>Details</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Image Path</TableCell>
                                  <TableCell>{item.imagePath}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Thumbnail</TableCell>
                                  <TableCell>
                                    <img 
                                      src={createThumbnail(item.imagePath)} 
                                      alt="Thumbnail" 
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Category</TableCell>
                                  <TableCell>{item.category}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Tags</TableCell>
                                  <TableCell>{item.tags?.join(', ') || 'None'}</TableCell>
                                </TableRow>
                                {galleryDetail.techniquesUsed && (
                                  <TableRow>
                                    <TableCell className="font-medium">Techniques Used</TableCell>
                                    <TableCell>{galleryDetail.techniquesUsed}</TableCell>
                                  </TableRow>
                                )}
                                {galleryDetail.timeRequired && (
                                  <TableRow>
                                    <TableCell className="font-medium">Time Required</TableCell>
                                    <TableCell>{galleryDetail.timeRequired}</TableCell>
                                  </TableRow>
                                )}
                                {galleryDetail.difficultyLevel && (
                                  <TableRow>
                                    <TableCell className="font-medium">Difficulty Level</TableCell>
                                    <TableCell>{galleryDetail.difficultyLevel}</TableCell>
                                  </TableRow>
                                )}
                                {galleryDetail.priceRange && (
                                  <TableRow>
                                    <TableCell className="font-medium">Price Range</TableCell>
                                    <TableCell>{galleryDetail.priceRange}</TableCell>
                                  </TableRow>
                                )}
                                {galleryDetail.maintenanceGuide && (
                                  <TableRow>
                                    <TableCell className="font-medium">Maintenance Guide</TableCell>
                                    <TableCell>{galleryDetail.maintenanceGuide}</TableCell>
                                  </TableRow>
                                )}
                                {galleryDetail.suitableFor && (
                                  <TableRow>
                                    <TableCell className="font-medium">Suitable For</TableCell>
                                    <TableCell>{galleryDetail.suitableFor}</TableCell>
                                  </TableRow>
                                )}
                                {galleryDetail.materials && galleryDetail.materials.length > 0 && (
                                  <TableRow>
                                    <TableCell className="font-medium">Materials</TableCell>
                                    <TableCell>{galleryDetail.materials.join(', ')}</TableCell>
                                  </TableRow>
                                )}
                                <TableRow>
                                  <TableCell className="font-medium">Display Order</TableCell>
                                  <TableCell>{item.displayOrder}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Created Date</TableCell>
                                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold">기본 정보</h4>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-600">가격:</span>
                                <span className="font-medium">{item.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">소요 시간:</span>
                                <span className="font-medium">{item.duration}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">난이도:</span>
                                <span className="font-medium">{item.difficulty}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">평점:</span>
                                <span className="font-medium flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  {item.rating} ({item.reviews}개 리뷰)
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold">시술 기법</h4>
                            <div className="flex flex-wrap gap-1">
                              {item.techniques?.map((technique, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {technique}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold">사용 재료</h4>
                          <div className="flex flex-wrap gap-1">
                            {item.materials?.map((material, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold">관리 방법</h4>
                          <p className="text-sm text-gray-600">{item.aftercare}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold">추천 상황</h4>
                          <p className="text-sm text-gray-600">{item.suitableFor}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 시술 과정 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            시술 과정
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentProcess.map((step, index) => (
              <Card key={step.id} className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-secondary text-white">
                      Step {index + 1}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            마음에 드는 디자인이 있으신가요?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            지금 바로 예약하고 전문적인 네일아트 서비스를 경험해보세요
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-secondary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition-colors">
              예약하기
            </button>
            <button className="bg-white text-secondary border border-secondary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-50 transition-colors">
              상담받기
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}