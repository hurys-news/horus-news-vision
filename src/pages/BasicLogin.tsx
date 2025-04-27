import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const BasicLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // تسجيل الدخول بالطريقة الأساسية المباشرة
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // طباعة معلومات التصحيح
      console.log('محاولة تسجيل الدخول الأساسي:', {
        email,
        passwordLength: password.length,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'موجود' : 'غير موجود',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'موجود' : 'غير موجود'
      });
      
      // استخدام Supabase مباشرة بأبسط طريقة ممكنة
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('خطأ في تسجيل الدخول الأساسي:', error);
        throw error;
      }
      
      console.log('تم تسجيل الدخول الأساسي بنجاح:', {
        user: data.user,
        session: data.session
      });
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا بك ${data.user.email}`,
      });
      
      // الانتقال إلى الصفحة الرئيسية
      navigate('/');
    } catch (error: any) {
      console.error('خطأ غير متوقع في تسجيل الدخول الأساسي:', error);
      
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">تسجيل الدخول الأساسي</h1>
        <p className="text-gray-600 text-center mb-6">
          صفحة تسجيل دخول مبسطة تستخدم Supabase مباشرة
        </p>
        
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
      </div>
    </div>
  );
};

export default BasicLogin;
