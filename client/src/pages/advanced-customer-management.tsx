import React from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AdvancedCustomerManagement } from '@/components/advanced-customer-management';
import { useLanguage } from "@/hooks/useLanguage";

export default function AdvancedCustomerManagementPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Advanced Customer Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Comprehensive customer relationship management with VIP levels, loyalty program, and analytics
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
        </div>

        <AdvancedCustomerManagement />
      </main>

      <Footer />
    </div>
  );
}