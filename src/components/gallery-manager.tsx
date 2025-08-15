'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash, Eye, X } from 'lucide-react'

interface GalleryItem {
  id: number
  title: string
  description: string | null
  imageUrl: string
  category: string
  isPublished: boolean
  createdAt: string
}

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'nail-art'
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/gallery')
      
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch gallery items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('adminToken')
      const url = editingItem ? `/api/gallery/${editingItem.id}` : '/api/gallery'
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        fetchItems()
        setShowForm(false)
        setEditingItem(null)
        setFormData({ title: '', description: '', imageUrl: '', category: 'nail-art' })
      }
    } catch (error) {
      console.error('Failed to save gallery item:', error)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      category: item.category
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to delete gallery item:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading gallery items...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
          <p className="text-gray-600">Manage gallery images and content</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          data-testid="button-add-gallery"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            <CardContent>
              {item.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>
              )}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItem(item)}
                  data-testid={`button-view-${item.id}`}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  data-testid={`button-edit-${item.id}`}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  data-testid={`button-delete-${item.id}`}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingItem ? 'Edit' : 'Add'} Gallery Item</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowForm(false)
                    setEditingItem(null)
                    setFormData({ title: '', description: '', imageUrl: '', category: 'nail-art' })
                  }}
                  data-testid="button-close-form"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    data-testid="input-description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    data-testid="input-image-url"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    data-testid="select-category"
                  >
                    <option value="nail-art">Nail Art</option>
                    <option value="spa">Spa</option>
                    <option value="treatment">Treatment</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    data-testid="button-save-gallery"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingItem(null)
                      setFormData({ title: '', description: '', imageUrl: '', category: 'nail-art' })
                    }}
                    data-testid="button-cancel-gallery"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Gallery Item Details</CardTitle>
                  <CardDescription>{selectedItem.title}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                  data-testid="button-close-detail"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Title</h4>
                  <p className="text-gray-600">{selectedItem.title}</p>
                </div>
                {selectedItem.description && (
                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-gray-600">{selectedItem.description}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium">Category</h4>
                  <p className="text-gray-600 capitalize">{selectedItem.category.replace('-', ' ')}</p>
                </div>
                <div>
                  <h4 className="font-medium">Status</h4>
                  <p className="text-gray-600">{selectedItem.isPublished ? 'Published' : 'Draft'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Created</h4>
                  <p className="text-gray-600">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}