import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Search, Filter, Eye, Clock, Star, Heart, Image as ImageIcon } from 'lucide-react';

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
  galleryNo?: string;
}

interface GalleryResponse {
  items: GalleryItem[];
  pagination: {
    current: number;
    total: number;
    limit: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function Gallery() {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch gallery items with pagination
  const { data: galleryData, isLoading, refetch } = useQuery<GalleryResponse>({
    queryKey: ['/api/gallery', currentPage, searchTerm, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`/api/gallery?${params}`);
      return response.json();
    },
  });

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    refetch();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nail_art': return 'bg-pink-100 text-pink-800';
      case 'spa': return 'bg-blue-100 text-blue-800';
      case 'treatment': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading gallery...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const galleryItems = galleryData?.items || [];
  const pagination = galleryData?.pagination || {
    current: 1,
    total: 0,
    limit: 12,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, pagination.current - 2);
    const end = Math.min(pagination.total, pagination.current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gallery
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover our stunning nail art and spa treatments
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search gallery items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-500 h-4 w-4" />
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="nail_art">Nail Art</SelectItem>
                    <SelectItem value="spa">Spa</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Search Button */}
              <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Results Info */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {galleryItems.length} of {pagination.totalItems} items
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </div>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        {galleryItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {galleryItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.thumbnailPath || item.imagePath || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop'}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{item.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <img
                              src={item.imagePath || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop'}
                              alt={item.title}
                              className="w-full h-64 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop';
                              }}
                            />
                            <div>
                              <h3 className="font-semibold mb-2">Description</h3>
                              <p className="text-gray-600">{item.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(item.tags) && item.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {Array.isArray(item.tags) && item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                        <span>ID: {item.galleryNo || item.id}</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={!pagination.hasPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.current ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={page === pagination.current ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No gallery items found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Gallery items will appear here once they are added'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setCurrentPage(1);
                  refetch();
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}