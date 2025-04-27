import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const TestAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [envVars, setEnvVars] = useState<{
    supabaseUrl: string | null;
    supabaseAnonKey: string | null;
  }>({
    supabaseUrl: null,
    supabaseAnonKey: null
  });

  // التحقق من متغيرات البيئة
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    setEnvVars({
      supabaseUrl,
      supabaseAnonKey
    });

    // التحقق من حالة المصادقة
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    checkSession();

    // الاستماع لتغييرات حالة المصادقة
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`حدث المصادقة: ${event}`);
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // تسجيل الدخول
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      console.log('محاولة تسجيل الدخول باستخدام:', { email, password });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        toast({
          title: "فشل تسجيل الدخول",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('تم تسجيل الدخول بنجاح:', data);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا بك ${data.user?.email}`,
      });
    } catch (error) {
      console.error('خطأ غير متوقع:', error);
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const handleSignOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('خطأ في تسجيل الخروج:', error);
        toast({
          title: "فشل تسجيل الخروج",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
    } catch (error) {
      console.error('خطأ غير متوقع:', error);
      toast({
        title: "خطأ غير متوقع",
        description: "حدث خطأ أثناء محاولة تسجيل الخروج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">اختبار المصادقة</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* معلومات متغيرات البيئة */}
        <Card>
          <CardHeader>
            <CardTitle>متغيرات البيئة</CardTitle>
            <CardDescription>التحقق من متغيرات البيئة المطلوبة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">VITE_SUPABASE_URL:</p>
                <p className="text-sm break-all">
                  {envVars.supabaseUrl ? 
                    `${envVars.supabaseUrl.substring(0, 10)}...` : 
                    'غير موجود'}
                </p>
              </div>
              <div>
                <p className="font-semibold">VITE_SUPABASE_ANON_KEY:</p>
                <p className="text-sm">
                  {envVars.supabaseAnonKey ? 
                    `${envVars.supabaseAnonKey.substring(0, 10)}...` : 
                    'غير موجود'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* حالة المصادقة */}
        <Card>
          <CardHeader>
            <CardTitle>حالة المصادقة</CardTitle>
            <CardDescription>معلومات عن حالة المصادقة الحالية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">الحالة:</p>
                <p>{session ? 'مسجل الدخول' : 'غير مسجل الدخول'}</p>
              </div>
              {session && (
                <>
                  <div>
                    <p className="font-semibold">البريد الإلكتروني:</p>
                    <p>{session.user?.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">معرف المستخدم:</p>
                    <p className="text-sm break-all">{session.user?.id}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {session ? (
              <Button 
                onClick={handleSignOut} 
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                {loading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
              </Button>
            ) : (
              <p className="text-sm text-gray-500">لم يتم تسجيل الدخول</p>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* نموذج تسجيل الدخول */}
      {!session && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>تسجيل الدخول</CardTitle>
            <CardDescription>قم بتسجيل الدخول باستخدام بريدك الإلكتروني وكلمة المرور</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
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
                <label htmlFor="password" className="block text-sm font-medium mb-1">
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
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* معلومات التصحيح */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>معلومات التصحيح</CardTitle>
          <CardDescription>معلومات مفيدة لتصحيح المشاكل</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">عنوان URL للمشروع:</p>
              <p className="text-sm break-all">{window.location.origin}</p>
            </div>
            <div>
              <p className="font-semibold">المتصفح:</p>
              <p className="text-sm">{navigator.userAgent}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestAuth;
