import React from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CustomerManagement } from '@/components/customer-management';
import { DemoCustomerData } from '@/components/demo-customer-data';
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from '@tanstack/react-query';

export default function CustomerManagementPage() {
  const { t } = useLanguage();

  // 사용자 인증 확인
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            고객 관리 시스템
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            고객 정보, 구매내역, SMS 발송을 한 곳에서 관리하세요
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
        </div>

        {/* 인증된 사용자에게는 실제 고객 관리 시스템을 보여주고, 그렇지 않으면 데모 데이터 표시 */}
        {user ? <CustomerManagement /> : <DemoCustomerData />}
      </main>

      <Footer />
    </div>
  );
}