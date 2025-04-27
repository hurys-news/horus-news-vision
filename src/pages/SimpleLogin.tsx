import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const SimpleLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // طباعة معلومات التصحيح
      console.log('محاولة تسجيل الدخول البسيط:', {
        email,
        passwordLength: password.length,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'موجود' : 'غير موجود',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'موجود' : 'غير موجود'
      });

      // إنشاء عميل Supabase جديد
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('متغيرات البيئة غير مكتملة');
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // تسجيل الدخول
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        setError(error.message);
        throw error;
      }

      console.log('تم تسجيل الدخول بنجاح:', data);

      // تخزين معلومات المستخدم في التخزين المحلي
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('session', JSON.stringify(data.session));

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا بك ${data.user.email}`,
      });

      // الانتقال إلى لوحة الإدارة
      navigate('/admin');
    } catch (err: any) {
      console.error('خطأ غير متوقع:', err);
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
      
      toast({
        title: "فشل تسجيل الدخول",
        description: err.message || "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">تسجيل الدخول البسيط</h1>
        <p className="text-gray-600 text-center mb-6">
          أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة الإدارة
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/login')}
          >
            العودة إلى صفحة تسجيل الدخول العادية
          </Button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            هذه صفحة تسجيل دخول مبسطة تستخدم Supabase مباشرة بدون أي طبقات إضافية
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h2 className="font-semibold mb-2">معلومات التصحيح:</h2>
          <p className="text-sm">
            VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? 'موجود' : 'غير موجود'}
          </p>
          <p className="text-sm">
            VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'موجود' : 'غير موجود'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
