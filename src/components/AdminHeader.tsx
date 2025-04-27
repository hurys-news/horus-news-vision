
import { useState } from 'react';
import { Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminHeader = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'تم نشر مقال جديد بواسطة أحمد محمد',
      time: 'منذ 10 دقائق',
      read: false
    },
    {
      id: 2,
      message: 'تم تعديل الإعدادات العامة',
      time: 'منذ ساعتين',
      read: false
    },
    {
      id: 3,
      message: 'طلب انضمام جديد من سارة خالد',
      time: 'منذ يوم واحد',
      read: true
    }
  ]);

  // وضع علامة "مقروء" على الإشعار
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // عدد الإشعارات غير المقروءة
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <header className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        {showSearch ? (
          <div className="relative">
            <Input
              type="search"
              placeholder="بحث..."
              className="w-64 pl-8"
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label="بحث"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2 space-x-reverse">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 left-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-2 px-4 text-center text-gray-500">لا توجد إشعارات</div>
            ) : (
              notifications.map(notification => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`py-2 ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>أحمد محمد</DropdownMenuLabel>
            <DropdownMenuItem>حسابي</DropdownMenuItem>
            <DropdownMenuItem>تغيير كلمة المرور</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">تسجيل الخروج</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
