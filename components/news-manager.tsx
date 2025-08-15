'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Search, Plus, FileText, Eye, EyeOff, Edit, Trash2 } from 'lucide-react'
import type { NewsItem } from '@/lib/types'

export function NewsManager() {
  const [articles, setArticles] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  // Mock data for now
  useEffect(() => {
    const mockData: NewsItem[] = [
      {
        id: 1,
        title: 'KICT Group Announces New Partnership',
        summary: 'Exciting new collaboration to drive innovation',
        content: 'We are pleased to announce a strategic partnership that will enhance our service offerings and expand our reach in the technology sector...',
        author: 'KICT Group Communications',
        isPublished: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        title: 'New Technology Platform Launch',
        summary: 'Introducing our latest technology platform',
        content: 'Today marks the launch of our revolutionary new technology platform, designed specifically to meet the evolving needs of enterprise clients...',
        author: 'Product Development Team',
        isPublished: false,
        createdAt: '2024-01-14T10:00:00Z',
        updatedAt: '2024-01-14T10:00:00Z'
      },
      {
        id: 3,
        title: 'Q4 Performance Report',
        summary: 'Outstanding results for the fourth quarter',
        content: 'We are thrilled to share our Q4 performance results, which exceeded all expectations and set new records for the company...',
        author: 'Finance Team',
        isPublished: true,
        createdAt: '2024-01-13T10:00:00Z',
        updatedAt: '2024-01-13T10:00:00Z'
      }
    ]
    setArticles(mockData)
    setLoading(false)
  }, [])

  const togglePublishStatus = (id: number) => {
    setArticles(prev => prev.map(article => 
      article.id === id ? { ...article, isPublished: !article.isPublished } : article
    ))
    toast({
      title: "Success",
      description: "Article status updated"
    })
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading news articles...</div>
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create News Article</DialogTitle>
              <DialogDescription>
                Write and publish a new news article
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter article title" />
              </div>
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" placeholder="Enter brief summary" rows={2} />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" placeholder="Enter article content" rows={8} />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" placeholder="Enter author name" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="outline">Save Draft</Button>
                <Button>Publish</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold">{article.title}</h3>
                  <Badge variant={article.isPublished ? "default" : "secondary"}>
                    {article.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                {article.summary && (
                  <p className="text-muted-foreground mb-2">{article.summary}</p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.content}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    By {article.author} • {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => togglePublishStatus(article.id)}
                >
                  {article.isPublished ? (
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
          </div>
        ))}
        
        {filteredArticles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No articles found
          </div>
        )}
      </div>
    </div>
  )
}