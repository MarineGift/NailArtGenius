'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash, Eye, X, Send } from 'lucide-react'

interface NewsItem {
  id: number
  title: string
  content: string
  summary: string | null
  imageUrl: string | null
  author: string
  isPublished: boolean
  createdAt: string
  publishedAt: string | null
}

export function NewsManager() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    imageUrl: '',
    author: ''
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/news')
      
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch news items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('adminToken')
      const url = editingItem ? `/api/news/${editingItem.id}` : '/api/news'
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
        setFormData({ title: '', content: '', summary: '', imageUrl: '', author: '' })
      }
    } catch (error) {
      console.error('Failed to save news item:', error)
    }
  }

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      summary: item.summary || '',
      imageUrl: item.imageUrl || '',
      author: item.author
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news item?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to delete news item:', error)
    }
  }

  const handlePublish = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/news/${id}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to publish news item:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading news items...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News Management</h2>
          <p className="text-gray-600">Create and manage news articles</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          data-testid="button-add-news"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add News Article
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>By {item.author}</CardDescription>
                  {item.summary && (
                    <p className="text-sm text-gray-600 mt-2">{item.summary}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.isPublished ? 'Published' : 'Draft'}
                  </span>
                  {item.imageUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                  {item.publishedAt && (
                    <span className="ml-4">
                      Published: {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
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
                  {!item.isPublished && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublish(item.id)}
                      data-testid={`button-publish-${item.id}`}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingItem ? 'Edit' : 'Add'} News Article</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowForm(false)
                    setEditingItem(null)
                    setFormData({ title: '', content: '', summary: '', imageUrl: '', author: '' })
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
                    Summary
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="Brief summary of the article"
                    data-testid="input-summary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={8}
                    required
                    data-testid="input-content"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Optional image URL"
                    data-testid="input-image-url"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    data-testid="input-author"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    data-testid="button-save-news"
                  >
                    {editingItem ? 'Update' : 'Create'} Article
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingItem(null)
                      setFormData({ title: '', content: '', summary: '', imageUrl: '', author: '' })
                    }}
                    data-testid="button-cancel-news"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>News Article Details</CardTitle>
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
              <div className="space-y-6">
                {selectedItem.imageUrl && (
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium mb-2">Title</h4>
                  <p className="text-gray-900 text-lg">{selectedItem.title}</p>
                </div>
                {selectedItem.summary && (
                  <div>
                    <h4 className="font-medium mb-2">Summary</h4>
                    <p className="text-gray-600">{selectedItem.summary}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium mb-2">Content</h4>
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedItem.content}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium">Author</h4>
                    <p className="text-gray-600">{selectedItem.author}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Status</h4>
                    <p className="text-gray-600">{selectedItem.isPublished ? 'Published' : 'Draft'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Created</h4>
                    <p className="text-gray-600">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedItem.publishedAt && (
                    <div>
                      <h4 className="font-medium">Published</h4>
                      <p className="text-gray-600">{new Date(selectedItem.publishedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}