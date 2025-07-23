import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AdminTest() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel Access</h1>
          <p className="text-gray-600">Choose an admin panel to access</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-center">Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Main admin dashboard with statistics and overview</p>
              <Link href="/admin">
                <Button className="w-full">
                  Access Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-center">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Manage appointments and users</p>
              <Link href="/admin-panel">
                <Button className="w-full">
                  Access Panel
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-center">Enhanced Admin</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Enhanced admin panel with customer management</p>
              <Link href="/enhanced-admin">
                <Button className="w-full">
                  Access Enhanced
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}