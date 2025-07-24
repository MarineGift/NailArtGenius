import React from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import DeploymentStatus from "@/components/deployment-status";

export default function DeploymentStatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Deployment Status
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Monitor your application deployment and domain configuration
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
        </div>

        <div className="flex justify-center">
          <DeploymentStatus />
        </div>
      </main>

      <Footer />
    </div>
  );
}