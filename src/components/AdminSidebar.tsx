
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PenSquare, 
  Files, 
  Users, 
  Settings, 
  ChevronRight, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

interface AdminSidebarProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const AdminSidebar = ({ selectedTab, setSelectedTab }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'createContent', label: 'إنشاء محتوى', icon: PenSquare },
    { id: 'manageContent', label: 'إدارة المحتوى', icon: Files },
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* زر التبديل للشاشات الصغيرة */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 lg:hidden"
      >
        {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>

      {/* الشريط الجانبي */}
      <aside className={`
        bg-white border-l shadow-sm flex flex-col
        fixed top-0 bottom-0 right-0 z-40 w-64 lg:w-60
        transition-all duration-300 
        ${collapsed ? 'translate-x-full' : 'translate-x-0'}
        lg:translate-x-0 lg:relative
      `}>
        {/* الرأس */}
        <div className="p-4 border-b flex items-center">
          <Logo size="small" />
          <span className="font-cairo font-bold text-lg mr-2">لوحة التحكم</span>
        </div>

        {/* القائمة */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              className={`
                w-full flex items-center text-right py-2 px-3 rounded-md text-sm
                transition-colors hover:bg-gray-100
                ${selectedTab === item.id ? 'bg-gray-100 text-horus-blue' : 'text-gray-700'}
              `}
            >
              <span className="ml-3">
                <item.icon className="h-5 w-5" />
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* التذييل */}
        <div className="p-4 border-t">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start">
              <ChevronRight className="ml-2 h-4 w-4" />
              العودة للموقع
            </Button>
          </Link>

          <Button variant="ghost" className="w-full justify-start mt-2 text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="ml-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
