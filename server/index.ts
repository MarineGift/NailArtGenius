import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// 메인 HTML 페이지 제공
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connie's Nail - 프리미엄 네일 살롱</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState } = React;
        const { createRoot } = ReactDOM;

        // 네비게이션 컴포넌트
        const Navigation = ({ currentPage, setCurrentPage }) => (
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-purple-600 cursor-pointer" 
                            onClick={() => setCurrentPage('home')}>
                            Connie's Nail
                        </h1>
                        <nav className="flex space-x-6">
                            <button onClick={() => setCurrentPage('services')} 
                                    className="text-gray-600 hover:text-purple-600">서비스</button>
                            <button onClick={() => setCurrentPage('gallery')} 
                                    className="text-gray-600 hover:text-purple-600">갤러리</button>
                            <button onClick={() => setCurrentPage('booking')} 
                                    className="text-gray-600 hover:text-purple-600">예약</button>
                            <button onClick={() => setCurrentPage('admin')} 
                                    className="text-gray-600 hover:text-purple-600">관리자</button>
                        </nav>
                    </div>
                </div>
            </header>
        );

        // 홈페이지 컴포넌트
        const HomePage = ({ setCurrentPage }) => (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
                <main className="max-w-7xl mx-auto px-4 py-16">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">
                            코니네일에 오신 것을 환영합니다
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            전문적인 네일 케어와 AI 기반 네일 아트 디자인 서비스를 제공합니다
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={() => setCurrentPage('booking')} 
                                    className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                                지금 예약하기
                            </button>
                            <button onClick={() => setCurrentPage('gallery')} 
                                    className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors">
                                갤러리 보기
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-purple-600 mb-4">클래식 매니큐어</h3>
                            <p className="text-gray-600 mb-4">전통적인 프렌치 매니큐어와 클래식 네일 케어</p>
                            <p className="font-semibold text-2xl text-purple-600">₩45,000</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-purple-600 mb-4">AI 네일 아트</h3>
                            <p className="text-gray-600 mb-4">AI 기술을 활용한 맞춤형 네일 아트 디자인</p>
                            <p className="font-semibold text-2xl text-purple-600">₩80,000</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-purple-600 mb-4">프리미엄 서비스</h3>
                            <p className="text-gray-600 mb-4">고급 스파 트리트먼트와 프리미엄 네일 케어</p>
                            <p className="font-semibold text-2xl text-purple-600">₩120,000</p>
                        </div>
                    </div>
                </main>

                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Connie's Nail</h3>
                                <p className="text-gray-400">전문적인 네일 케어 서비스를 제공합니다</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">연락처</h4>
                                <p className="text-gray-400">📞 010-1234-5678</p>
                                <p className="text-gray-400">📧 info@connienail.com</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">운영시간</h4>
                                <p className="text-gray-400">평일: 10:00 - 19:00</p>
                                <p className="text-gray-400">토요일: 10:00 - 18:00</p>
                                <p className="text-gray-400">일요일: 휴무</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );

        // 서비스 페이지
        const ServicesPage = () => (
            <div className="min-h-screen bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-16">우리의 서비스</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-2xl font-semibold mb-4">클래식 매니큐어</h3>
                            <p className="text-gray-600 mb-4">₩45,000</p>
                            <p className="text-gray-700">전통적인 프렌치 매니큐어 스타일</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-2xl font-semibold mb-4">플로럴 디자인</h3>
                            <p className="text-gray-600 mb-4">₩65,000</p>
                            <p className="text-gray-700">섬세한 꽃무늬 네일 아트</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-2xl font-semibold mb-4">AI 네일 아트</h3>
                            <p className="text-gray-600 mb-4">₩80,000</p>
                            <p className="text-gray-700">AI 기술로 생성된 맞춤 디자인</p>
                        </div>
                    </div>
                </div>
            </div>
        );

        // 갤러리 페이지
        const GalleryPage = () => (
            <div className="min-h-screen bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-16">갤러리</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow">
                                <div className="bg-gradient-to-br from-purple-100 to-pink-100 h-48 rounded mb-4 flex items-center justify-center">
                                    <span className="text-purple-600 font-semibold">네일 아트 {i}</span>
                                </div>
                                <h3 className="font-semibold">작품 {i}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

        // 예약 페이지
        const BookingPage = () => {
            const [formData, setFormData] = useState({
                name: '',
                phone: '',
                service: '클래식 매니큐어'
            });

            const handleSubmit = (e) => {
                e.preventDefault();
                alert('예약이 완료되었습니다!');
            };

            return (
                <div className="min-h-screen bg-gray-50 py-16">
                    <div className="max-w-2xl mx-auto px-4">
                        <h1 className="text-4xl font-bold text-center mb-16">예약하기</h1>
                        <div className="bg-white p-8 rounded-lg shadow">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                                    <input 
                                        type="tel" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">서비스 선택</label>
                                    <select 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        value={formData.service}
                                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                                    >
                                        <option>클래식 매니큐어</option>
                                        <option>AI 네일 아트</option>
                                        <option>프리미엄 서비스</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    예약 완료
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        };

        // 관리자 페이지
        const AdminPage = () => (
            <div className="min-h-screen bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center mb-16">관리자 대시보드</h1>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <h3 className="text-lg font-semibold text-gray-600">총 고객수</h3>
                            <p className="text-3xl font-bold text-purple-600">26</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <h3 className="text-lg font-semibold text-gray-600">오늘 예약</h3>
                            <p className="text-3xl font-bold text-green-600">5</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <h3 className="text-lg font-semibold text-gray-600">이번 달 매출</h3>
                            <p className="text-3xl font-bold text-blue-600">₩2,500,000</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow text-center">
                            <h3 className="text-lg font-semibold text-gray-600">갤러리 아이템</h3>
                            <p className="text-3xl font-bold text-orange-600">24</p>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">최근 예약</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>김민지 - 클래식 매니큐어</span>
                                <span className="text-green-600">완료</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>이수진 - AI 네일 아트</span>
                                <span className="text-blue-600">진행중</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span>박유리 - 프리미엄 서비스</span>
                                <span className="text-yellow-600">대기중</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        // 메인 앱 컴포넌트
        const App = () => {
            const [currentPage, setCurrentPage] = useState('home');
            
            return (
                <div>
                    <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
                    {currentPage === 'services' && <ServicesPage />}
                    {currentPage === 'gallery' && <GalleryPage />}
                    {currentPage === 'booking' && <BookingPage />}
                    {currentPage === 'admin' && <AdminPage />}
                </div>
            );
        };

        // 앱 렌더링
        const root = createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
  `);
});

// API 라우트들
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Connie\'s Nail Server running' });
});

app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Connie\'s Nail - 단일 HTML 페이지로 실행 중',
    features: [
      '✅ React 18 + Babel 변환',
      '✅ Tailwind CSS 스타일링',
      '✅ 5개 페이지: 홈, 서비스, 갤러리, 예약, 관리자',
      '✅ 실시간 페이지 전환',
      '✅ 예약 폼 기능'
    ],
    nextjs_deployment: 'nextjs-structure/ 폴더에서 배포 가능'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Connie's Nail Server running on port ${PORT}`);
  console.log(`🎨 Single HTML page with React + Tailwind`);
  console.log(`📱 5 pages: 홈, 서비스, 갤러리, 예약, 관리자`);
  console.log(`🌐 Access: http://localhost:${PORT}`);
});