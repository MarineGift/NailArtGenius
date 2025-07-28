import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// 홈페이지 컴포넌트
const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-600">Connie's Nail</h1>
          <nav className="flex space-x-6">
            <Link to="/services" className="text-gray-600 hover:text-purple-600">서비스</Link>
            <Link to="/gallery" className="text-gray-600 hover:text-purple-600">갤러리</Link>
            <Link to="/booking" className="text-gray-600 hover:text-purple-600">예약</Link>
            <Link to="/admin" className="text-gray-600 hover:text-purple-600">관리자</Link>
          </nav>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          코니네일에 오신 것을 환영합니다
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          전문적인 네일 케어와 AI 기반 네일 아트 디자인 서비스를 제공합니다
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/booking" className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            지금 예약하기
          </Link>
          <Link to="/gallery" className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors">
            갤러리 보기
          </Link>
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
        {/* 서비스 카드들 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-4">클래식 매니큐어</h3>
          <p className="text-gray-600 mb-4">₩45,000</p>
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
        {/* 갤러리 이미지들 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="bg-purple-100 h-48 rounded mb-4"></div>
          <h3 className="font-semibold">네일 아트 1</h3>
        </div>
      </div>
    </div>
  </div>
);

// 예약 페이지
const BookingPage = () => (
  <div className="min-h-screen bg-gray-50 py-16">
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-16">예약하기</h1>
      <div className="bg-white p-8 rounded-lg shadow">
        <form>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
            <input type="tel" className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">서비스 선택</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg">
              <option>클래식 매니큐어</option>
              <option>AI 네일 아트</option>
              <option>프리미엄 서비스</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
            예약 완료
          </button>
        </form>
      </div>
    </div>
  </div>
);

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
    </div>
  </div>
);

// 메인 App 컴포넌트
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;