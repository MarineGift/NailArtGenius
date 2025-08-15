import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, DollarSign, MessageSquare } from 'lucide-react';

export function DemoCustomerData() {
  const demoCustomers = [
    {
      id: 1,
      name: "김민지",
      phoneNumber: "010-1234-5678",
      email: "minji@example.com",
      category: "VIP",
      totalVisits: 12,
      totalSpent: "450000",
      lastVisit: "2025-01-15"
    },
    {
      id: 2,
      name: "이서연",
      phoneNumber: "010-2345-6789", 
      email: "seoyeon@example.com",
      category: "Regular",
      totalVisits: 6,
      totalSpent: "180000",
      lastVisit: "2025-01-10"
    },
    {
      id: 3,
      name: "박지혜",
      phoneNumber: "010-3456-7890",
      email: null,
      category: "New",
      totalVisits: 2,
      totalSpent: "85000", 
      lastVisit: "2025-01-08"
    }
  ];

  const demoStats = {
    totalCustomers: demoCustomers.length,
    vipCustomers: demoCustomers.filter(c => c.category === "VIP").length,
    regularCustomers: demoCustomers.filter(c => c.category === "Regular").length,
    newCustomers: demoCustomers.filter(c => c.category === "New").length,
    totalRevenue: demoCustomers.reduce((sum, c) => sum + parseInt(c.totalSpent), 0),
    averageVisits: Math.round(demoCustomers.reduce((sum, c) => sum + c.totalVisits, 0) / demoCustomers.length)
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 고객 수</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              VIP {demoStats.vipCustomers}명 • 일반 {demoStats.regularCustomers}명 • 신규 {demoStats.newCustomers}명
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{demoStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              고객당 평균 ₩{Math.round(demoStats.totalRevenue / demoStats.totalCustomers).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 방문 횟수</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStats.averageVisits}회</div>
            <p className="text-xs text-muted-foreground">
              고객 충성도 지수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS 발송</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              이번 달 자동 리마인더
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 고객 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            고객 목록 (데모)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{customer.name}</h3>
                    <Badge 
                      variant={customer.category === 'VIP' ? 'default' : customer.category === 'Regular' ? 'secondary' : 'outline'}
                    >
                      {customer.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    📞 {customer.phoneNumber}
                    {customer.email && <span className="ml-4">📧 {customer.email}</span>}
                  </div>
                </div>
                
                <div className="text-right text-sm">
                  <div className="font-medium">₩{parseInt(customer.totalSpent).toLocaleString()}</div>
                  <div className="text-gray-500">방문 {customer.totalVisits}회</div>
                  <div className="text-gray-400">{customer.lastVisit}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 고객 관리 시스템 기능</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 고객별 구매내역 추적 및 관리</li>
          <li>• 자동 SMS 리마인더 시스템</li>
          <li>• VIP/일반/신규 고객 분류</li>
          <li>• 방문 패턴 및 매출 분석</li>
          <li>• 맞춤형 마케팅 메시지 발송</li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">
          실제 사용을 위해서는 로그인이 필요합니다.
        </p>
      </div>
    </div>
  );
}