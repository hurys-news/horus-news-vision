
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from './Logo';
import NavLinks from './NavLinks';

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="bg-gradient-to-b from-white to-gray-50 shadow-md sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="القائمة">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="py-8">
                <div className="flex flex-col space-y-4 text-right">
                  <NavLinks className="flex flex-col space-y-4" />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo size="medium" animated={true} />
              <span className="mr-2 text-xl font-cairo font-bold text-horus-darkGray">حورس نيوز</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center rounded-full bg-gradient-to-l from-horus-blue/5 to-horus-red/5 px-4 py-1">
            <NavLinks className="flex items-center space-x-2 space-x-reverse" />
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {showSearch ? (
              <div className="relative">
                <Input
                  type="search"
                  placeholder="بحث..."
                  className="w-40 md:w-64 pl-8 border-horus-blue/20 focus:border-horus-blue rounded-full"
                  autoFocus
                  onBlur={() => setShowSearch(false)}
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-horus-blue" />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                aria-label="بحث"
                onClick={() => setShowSearch(true)}
                className="text-horus-blue hover:text-horus-red transition-colors"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="إشعارات"
              className="text-horus-blue hover:text-horus-red transition-colors"
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            <Link to="/login">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-horus-blue/20 text-horus-blue hover:bg-horus-blue hover:text-white transition-colors"
              >
                <User className="h-4 w-4 ml-1" />
                <span>تسجيل الدخول</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
