import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Download, 
  Bell,
  CheckCircle,
  AlertCircle,
  Share
} from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWATestGuide: React.FC = () => {
  const { 
    isInstalled, 
    isOnline, 
    canInstall, 
    installApp, 
    requestNotifications,
    hasNotificationPermission 
  } = usePWA();
  
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});

  const markTestComplete = (testId: string) => {
    setTestResults(prev => ({ ...prev, [testId]: true }));
  };

  const testItems = [
    {
      id: 'manifest',
      title: 'PWA Manifest 확인',
      description: 'F12 → Application → Manifest에서 설정 확인',
      status: 'ready'
    },
    {
      id: 'install',
      title: '앱 설치 테스트',
      description: canInstall ? '설치 가능' : isInstalled ? '이미 설치됨' : '설치 불가',
      status: isInstalled ? 'installed' : canInstall ? 'ready' : 'unavailable'
    },
    {
      id: 'offline',
      title: '오프라인 모드',
      description: isOnline ? '온라인 상태' : '오프라인 상태',
      status: isOnline ? 'online' : 'offline'
    },
    {
      id: 'notifications',
      title: '푸시 알림',
      description: hasNotificationPermission ? '알림 허용됨' : '알림 허용 필요',
      status: hasNotificationPermission ? 'granted' : 'pending'
    },
    {
      id: 'shortcuts',
      title: '앱 바로가기',
      description: '예약, 서비스, 관리자 바로가기 확인',
      status: 'ready'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-green-600" />
            PWA 모바일 앱 테스트 가이드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Android 테스트 */}
            <Card className="border border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Smartphone className="h-5 w-5" />
                  Android 설치 방법
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">1</Badge>
                    <span className="text-sm">Chrome에서 웹사이트 접속</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">2</Badge>
                    <span className="text-sm">주소창 오른쪽 "⋮" 메뉴 클릭</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">3</Badge>
                    <span className="text-sm">"홈 화면에 추가" 선택</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">4</Badge>
                    <span className="text-sm">설치 배너에서 "설치" 클릭</span>
                  </div>
                </div>
                
                {canInstall && (
                  <Button 
                    onClick={installApp}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    지금 설치하기
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* iOS 테스트 */}
            <Card className="border border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Monitor className="h-5 w-5" />
                  iOS 설치 방법
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">1</Badge>
                    <span className="text-sm">Safari에서 웹사이트 접속</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">2</Badge>
                    <span className="text-sm">하단 공유 버튼 클릭</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">3</Badge>
                    <span className="text-sm">"홈 화면에 추가" 선택</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">4</Badge>
                    <span className="text-sm">"추가" 버튼 클릭</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Connie's Nail",
                        url: window.location.href
                      });
                    }
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Share className="h-4 w-4 mr-2" />
                  공유하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 테스트 체크리스트 */}
      <Card>
        <CardHeader>
          <CardTitle>PWA 기능 테스트 체크리스트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {testResults[item.id] ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      item.status === 'installed' || item.status === 'granted' || item.status === 'online' 
                        ? 'default' 
                        : item.status === 'ready' 
                        ? 'secondary' 
                        : 'destructive'
                    }
                  >
                    {item.status === 'installed' && '설치완료'}
                    {item.status === 'ready' && '준비됨'}
                    {item.status === 'online' && '온라인'}
                    {item.status === 'offline' && '오프라인'}
                    {item.status === 'granted' && '허용됨'}
                    {item.status === 'pending' && '대기중'}
                    {item.status === 'unavailable' && '불가'}
                  </Badge>
                  
                  {!testResults[item.id] && (
                    <Button
                      onClick={() => markTestComplete(item.id)}
                      size="sm"
                      variant="outline"
                    >
                      확인완료
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 기능 테스트 */}
      <Card>
        <CardHeader>
          <CardTitle>추가 기능 테스트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={requestNotifications}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              푸시 알림 권한 요청
            </Button>
            
            <Button
              onClick={() => {
                navigator.vibrate && navigator.vibrate([100, 50, 100]);
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              📳 진동 테스트
            </Button>
            
            <Button
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(registrations => {
                    console.log('Service Workers:', registrations);
                    alert(`Service Worker: ${registrations.length}개 등록됨`);
                  });
                }
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              🔧 Service Worker 확인
            </Button>
            
            <Button
              onClick={() => {
                window.location.href = '/booking';
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              📅 예약 바로가기 테스트
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 상태 표시 */}
      <Card>
        <CardHeader>
          <CardTitle>현재 PWA 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              {isInstalled ? (
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              ) : (
                <Download className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-sm font-medium">
                {isInstalled ? '설치됨' : '미설치'}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              {isOnline ? (
                <Wifi className="h-8 w-8 text-green-600 mx-auto mb-2" />
              ) : (
                <WifiOff className="h-8 w-8 text-red-600 mx-auto mb-2" />
              )}
              <p className="text-sm font-medium">
                {isOnline ? '온라인' : '오프라인'}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              {hasNotificationPermission ? (
                <Bell className="h-8 w-8 text-green-600 mx-auto mb-2" />
              ) : (
                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-sm font-medium">
                {hasNotificationPermission ? '알림허용' : '알림대기'}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              {canInstall ? (
                <Download className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              ) : (
                <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              )}
              <p className="text-sm font-medium">
                {canInstall ? '설치가능' : '설치불가'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWATestGuide;