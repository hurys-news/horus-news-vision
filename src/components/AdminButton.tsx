
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { signInWithEmail } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

const AdminButton = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  // التحقق مما إذا كان المستخدم مسجل الدخول ولديه صلاحيات إدارية
  const isAdmin = user && (user.role === 'admin' || user.role === 'editor');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // تسجيل الدخول باستخدام Supabase
      const user = await signInWithEmail(email, password);

      // التحقق من صلاحيات المستخدم
      if (user.role === 'admin' || user.role === 'editor') {
        setIsOpen(false);
        navigate('/admin');

        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحبًا بك ${user.name} في لوحة الإدارة`,
        });
      } else {
        toast({
          title: "غير مصرح",
          description: "ليس لديك صلاحيات للوصول إلى لوحة الإدارة",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);

      toast({
        title: "فشل تسجيل الدخول",
        description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  // إذا كان المستخدم مسجل الدخول ولديه صلاحيات إدارية، نعرض زر الانتقال مباشرة إلى لوحة الإدارة
  if (isAdmin) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-horus-red"
        onClick={() => navigate('/admin')}
      >
        <Shield className="h-4 w-4 ml-1" />
        <span className="text-xs">الإدارة</span>
      </Button>
    );
  }

  // إذا لم يكن المستخدم مسجل الدخول أو ليس لديه صلاحيات إدارية، نعرض نافذة تسجيل الدخول
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
              <label htmlFor="email" className="text-right text-sm font-medium">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                autoComplete="email"
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminButton;
