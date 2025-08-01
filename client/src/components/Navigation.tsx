// Navigation component
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/booking', label: 'Book Now' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <h1 className="text-xl font-bold text-primary">
              Connie's Nail
            </h1>
          </Link>
          
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button 
                  variant={location === item.path ? "default" : "ghost"}
                  size="sm"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;