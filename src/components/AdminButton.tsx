
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const AdminButton = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // نموذج بسيط للتحقق (في التطبيق الحقيقي سيتم التحقق من البيانات عبر API)
    if (username === 'admin' && password === 'admin123') {
      setIsOpen(false);
      window.location.href = '/admin';
    } else {
      toast({
        title: "فشل تسجيل الدخول",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive"
      });
    }
    
    // إعادة تعيين البيانات
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-horus-red">
          <Shield className="h-4 w-4 ml-1" />
          <span className="text-xs">الإدارة</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تسجيل الدخول للوحة الإدارة</DialogTitle>
          <DialogDescription>
            أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة الإدارة
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="username" className="text-right text-sm font-medium">
                اسم المستخدم
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
                autoComplete="off"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="text-right text-sm font-medium">
                كلمة المرور
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">تسجيل الدخول</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminButton;
