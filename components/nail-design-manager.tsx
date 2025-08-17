'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, TrendingUp, Palette, Sparkles, Camera } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NailDesign {
  id: string
  name: string
  category: string
  colors: string[]
  pattern: string
  price: number
  duration: number
  description: string
  trending: boolean
  thumbnail: string
}

export function NailDesignManager() {
  const [designs, setDesigns] = useState<NailDesign[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDesign, setEditingDesign] = useState<NailDesign | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    colors: ['#FFFFFF'],
    pattern: '',
    price: 0,
    duration: 60,
    description: ''
  })

  // Fetch designs from API
  useEffect(() => {
    fetchDesigns()
  }, [])

  const fetchDesigns = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/nail-designs')
      const data = await response.json()
      if (data.success) {
        setDesigns(data.designs)
      }
    } catch (error) {
      console.error('Failed to fetch designs:', error)
      toast({
        title: "로드 실패",
        description: "네일 디자인을 불러올 수 없습니다.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDesign = async () => {
    try {
      const response = await fetch('/api/nail-designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      if (data.success) {
        setDesigns([...designs, data.design])
        setShowAddForm(false)
        resetForm()
        toast({
          title: "디자인 추가됨",
          description: "새로운 네일 디자인이 추가되었습니다."
        })
      }
    } catch (error) {
      console.error('Failed to add design:', error)
      toast({
        title: "추가 실패",
        description: "디자인 추가에 실패했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleToggleTrending = async (id: string) => {
    setDesigns(designs.map(design => 
      design.id === id 
        ? { ...design, trending: !design.trending }
        : design
    ))
    
    toast({
      title: "트렌딩 업데이트",
      description: "트렌딩 상태가 변경되었습니다."
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      colors: ['#FFFFFF'],
      pattern: '',
      price: 0,
      duration: 60,
      description: ''
    })
    setEditingDesign(null)
  }

  const addColorToDesign = () => {
    if (formData.colors.length < 5) {
      setFormData({
        ...formData,
        colors: [...formData.colors, '#FFFFFF']
      })
    }
  }

  const updateColor = (index: number, color: string) => {
    const newColors = [...formData.colors]
    newColors[index] = color
    setFormData({ ...formData, colors: newColors })
  }

  const removeColor = (index: number) => {
    if (formData.colors.length > 1) {
      setFormData({
        ...formData,
        colors: formData.colors.filter((_, i) => i !== index)
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="admin-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-700">네일 디자인 관리</CardTitle>
                <p className="text-sm text-purple-600">2024 트렌딩 디자인 및 커스텀 아트</p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              새 디자인
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add/Edit Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-purple-700">
                {editingDesign ? '디자인 수정' : '새 디자인 추가'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">디자인 이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: Chrome Glass"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                      <SelectItem value="Classic">Classic</SelectItem>
                      <SelectItem value="Party">Party</SelectItem>
                      <SelectItem value="Seasonal">Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">가격 (원)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    placeholder="70000"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">소요시간 (분)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    placeholder="60"
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-2">
                <Label>컬러 팔레트</Label>
                <div className="flex flex-wrap items-center space-x-2">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-1 mb-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="w-8 h-8 rounded border-2 border-purple-200 cursor-pointer"
                      />
                      {formData.colors.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeColor(index)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  {formData.colors.length < 5 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addColorToDesign}
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      + 색상
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="디자인에 대한 설명을 입력하세요..."
                  className="border-purple-200 focus:border-purple-400"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleAddDesign}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {editingDesign ? '수정 완료' : '디자인 추가'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    resetForm()
                  }}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  취소
                </Button>
              </div>
            </motion.div>
          )}

          {/* Design Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <motion.div
                key={design.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl border-2 border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Design Preview */}
                <div className="h-32 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
                  <div className="flex space-x-2">
                    {design.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {design.trending && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      트렌딩
                    </Badge>
                  )}
                </div>

                {/* Design Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-purple-700">{design.name}</h3>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {design.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{design.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-purple-600">₩{design.price.toLocaleString()}</span>
                    <span className="text-gray-500">{design.duration}분</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleTrending(design.id)}
                      className={`flex-1 ${design.trending ? 'border-orange-300 text-orange-700 bg-orange-50' : 'border-purple-300 text-purple-700 hover:bg-purple-50'}`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {design.trending ? '트렌딩 해제' : '트렌딩 설정'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {designs.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-purple-700 mb-2">아직 디자인이 없습니다</h3>
              <p className="text-purple-600 mb-4">첫 번째 네일 디자인을 추가해보세요</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                디자인 추가하기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}