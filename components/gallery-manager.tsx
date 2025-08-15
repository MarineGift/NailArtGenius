'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Search, Plus, Image, Eye, EyeOff, Edit, Trash2 } from 'lucide-react'
import type { GalleryItem } from '@/lib/types'

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  // Mock data for now
  useEffect(() => {
    const mockData: GalleryItem[] = [
      {
        id: 1,
        title: 'Modern Office Space',
        description: 'State-of-the-art office environment',
        imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400',
        category: 'office',
        isPublished: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        title: 'Team Collaboration',
        description: 'Our team working together',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
        category: 'team',
        isPublished: true,
        createdAt: '2024-01-14T10:00:00Z',
        updatedAt: '2024-01-14T10:00:00Z'
      },
      {
        id: 3,
        title: 'Technology Infrastructure',
        description: 'Advanced technology setup',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        category: 'technology',
        isPublished: false,
        createdAt: '2024-01-13T10:00:00Z',
        updatedAt: '2024-01-13T10:00:00Z'
      }
    ]
    setItems(mockData)
    setLoading(false)
  }, [])

  const togglePublishStatus = (id: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isPublished: !item.isPublished } : item
    ))
    toast({
      title: "Success",
      description: "Gallery item updated"
    })
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))]

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading gallery items...</div>
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gallery items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Item</DialogTitle>
              <DialogDescription>
                Upload a new item to the gallery
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter title" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter description" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" placeholder="Enter image URL" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button>Add Item</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={item.isPublished ? "default" : "secondary"}>
                  {item.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{item.category}</Badge>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePublishStatus(item.id)}
                  >
                    {item.isPublished ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No gallery items found
        </div>
      )}
    </div>
  )
}