'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, CameraOff, RotateCcw, Sparkles, Palette, Download, Share2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NailDesign {
  id: string
  name: string
  category: string
  colors: string[]
  pattern: string
  thumbnail: string
  price: number
}

export function ARNailTryOn() {
  const [isARActive, setIsARActive] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<NailDesign | null>(null)
  const [isHandDetected, setIsHandDetected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const handsRef = useRef<any>(null)
  const { toast } = useToast()

  // Sample nail designs with 2024 trends
  const [nailDesigns, setNailDesigns] = useState<NailDesign[]>([])

  // Fetch nail designs from API
  useEffect(() => {
    fetch('/api/nail-designs')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNailDesigns(data.designs)
        }
      })
      .catch(error => {
        console.error('Failed to fetch nail designs:', error)
        toast({
          title: "디자인 로드 실패",
          description: "네일 디자인을 불러올 수 없습니다.",
          variant: "destructive"
        })
      })
  }, [toast])

  const initializeMediaPipe = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Dynamic import for MediaPipe Hands
      const { Hands } = await import('@mediapipe/hands')
      const { Camera } = await import('@mediapipe/camera_utils')

      if (!videoRef.current) return

      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      })

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })

      hands.onResults(onHandsResults)
      handsRef.current = hands

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && handsRef.current) {
            await handsRef.current.send({ image: videoRef.current })
          }
        },
        width: 640,
        height: 480
      })

      await camera.start()
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to initialize MediaPipe:', error)
      setIsLoading(false)
      toast({
        title: "AR 초기화 실패",
        description: "카메라 및 AR 기능을 초기화할 수 없습니다.",
        variant: "destructive"
      })
    }
  }, [toast])

  const onHandsResults = useCallback((results: any) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 640
    canvas.height = 480

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw camera feed
    if (videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    }

    if (results.multiHandLandmarks && selectedDesign) {
      setIsHandDetected(true)
      
      for (const landmarks of results.multiHandLandmarks) {
        // Draw nail designs on fingertips
        drawNailDesigns(ctx, landmarks, selectedDesign)
      }
    } else {
      setIsHandDetected(false)
    }
  }, [selectedDesign])

  const drawNailDesigns = (ctx: CanvasRenderingContext2D, landmarks: any[], design: NailDesign) => {
    // Fingertip landmark indices (MediaPipe Hand model)
    const fingertipIndices = [4, 8, 12, 16, 20] // Thumb, Index, Middle, Ring, Pinky

    fingertipIndices.forEach((index) => {
      const landmark = landmarks[index]
      if (landmark) {
        const x = landmark.x * 640
        const y = landmark.y * 480

        // Create gradient based on design
        const gradient = ctx.createRadialGradient(x, y, 5, x, y, 15)
        
        design.colors.forEach((color, i) => {
          gradient.addColorStop(i / (design.colors.length - 1), color)
        })

        // Draw nail
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.ellipse(x, y, 12, 16, 0, 0, 2 * Math.PI)
        ctx.fill()

        // Add pattern effects
        if (design.pattern === 'chrome-mirror') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
          ctx.beginPath()
          ctx.ellipse(x - 3, y - 4, 4, 6, -0.3, 0, 2 * Math.PI)
          ctx.fill()
        } else if (design.pattern === 'holographic') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.beginPath()
          ctx.ellipse(x, y, 8, 10, 0, 0, 2 * Math.PI)
          ctx.fill()
        }

        // Add sparkle effect
        if (Math.random() > 0.7) {
          ctx.fillStyle = 'white'
          ctx.beginPath()
          ctx.arc(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, 1, 0, 2 * Math.PI)
          ctx.fill()
        }
      }
    })
  }

  const startAR = async () => {
    try {
      setIsLoading(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        await initializeMediaPipe()
        setIsARActive(true)
      }
    } catch (error) {
      console.error('Camera access failed:', error)
      setIsLoading(false)
      toast({
        title: "카메라 접근 실패",
        description: "카메라 권한을 허용해주세요.",
        variant: "destructive"
      })
    }
  }

  const stopAR = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsARActive(false)
    setIsHandDetected(false)
  }

  const capturePhoto = () => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL('image/png')
    
    // Create download link
    const link = document.createElement('a')
    link.download = `connienail-ar-${selectedDesign?.name}-${Date.now()}.png`
    link.href = dataURL
    link.click()

    toast({
      title: "사진 저장 완료",
      description: "AR 네일 시착 사진이 저장되었습니다.",
    })
  }

  const sharePhoto = async () => {
    if (!canvasRef.current) return

    try {
      const canvas = canvasRef.current
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share) {
          const file = new File([blob], 'connienail-ar-tryon.png', { type: 'image/png' })
          await navigator.share({
            title: 'ConnieNail AR 시착',
            text: `${selectedDesign?.name} 네일 디자인을 AR로 체험했어요!`,
            files: [file]
          })
        }
      })
    } catch (error) {
      console.error('Share failed:', error)
      toast({
        title: "공유 실패",
        description: "사진 공유 기능을 사용할 수 없습니다.",
        variant: "destructive"
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
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-700">AR 가상 네일 체험</CardTitle>
                <p className="text-sm text-purple-600">실시간으로 네일 디자인을 미리 체험해보세요</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
              2024 트렌드
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Design Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-700">디자인 선택</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {nailDesigns.map((design) => (
                <motion.div
                  key={design.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedDesign?.id === design.id
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-purple-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedDesign(design)}
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
                    <div className="flex space-x-1">
                      {design.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-4 rounded-full border shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    {design.pattern === 'chrome-mirror' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                    )}
                    {design.pattern === 'holographic' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 via-purple-200/40 to-blue-200/40" />
                    )}
                  </div>
                  <h4 className="font-medium text-sm text-purple-700">{design.name}</h4>
                  <p className="text-xs text-purple-500">{design.category}</p>
                  <p className="text-xs font-medium text-purple-600">₩{design.price.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AR Camera */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-700">AR 카메라</h3>
              <div className="flex space-x-2">
                {isARActive && (
                  <>
                    <Button
                      onClick={capturePhoto}
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      disabled={!isHandDetected}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                    <Button
                      onClick={sharePhoto}
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      disabled={!isHandDetected}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      공유
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden">
              {!isARActive ? (
                <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
                  <Camera className="h-16 w-16 text-purple-400 mb-4" />
                  <h4 className="text-lg font-medium text-purple-700 mb-2">AR 체험 시작하기</h4>
                  <p className="text-purple-600 mb-6">
                    {selectedDesign 
                      ? `${selectedDesign.name} 디자인을 손에 직접 체험해보세요`
                      : '먼저 네일 디자인을 선택해주세요'
                    }
                  </p>
                  <Button
                    onClick={startAR}
                    disabled={!selectedDesign || isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        AR 초기화 중...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        AR 시작
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full aspect-video object-cover"
                    style={{ display: 'none' }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="w-full aspect-video object-cover"
                  />
                  
                  {/* AR Status Indicators */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <Badge 
                      variant={isHandDetected ? "default" : "secondary"}
                      className={isHandDetected ? "bg-green-500" : "bg-yellow-500"}
                    >
                      {isHandDetected ? "손 인식됨" : "손을 카메라에 보여주세요"}
                    </Badge>
                    {selectedDesign && (
                      <Badge className="bg-purple-500">
                        {selectedDesign.name}
                      </Badge>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <Button
                      onClick={stopAR}
                      size="sm"
                      variant="destructive"
                    >
                      <CameraOff className="h-4 w-4 mr-2" />
                      종료
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <h4 className="font-medium text-purple-700 mb-2">사용 방법</h4>
            <ul className="text-sm text-purple-600 space-y-1">
              <li>• 원하는 네일 디자인을 선택하세요</li>
              <li>• AR 시작 버튼을 클릭하여 카메라를 활성화하세요</li>
              <li>• 손을 카메라 앞에 자연스럽게 펼쳐주세요</li>
              <li>• 손톱에 실시간으로 적용되는 디자인을 확인하세요</li>
              <li>• 마음에 드는 모습을 사진으로 저장하거나 공유하세요</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}