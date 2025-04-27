import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Logo from '../components/Logo';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { signInWithEmailDirect } from '@/lib/auth';

// تعريف مخطط التحقق باستخدام zod
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'البريد الإلكتروني مطلوب' })
    .email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  password: z
    .string()
    .min(1, { message: 'كلمة المرور مطلوبة' }),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const LoginDirect = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // إعداد نموذج React Hook Form مع التحقق من Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // معالج إرسال النموذج
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      
      console.log('محاولة تسجيل الدخول المباشر باستخدام:', { 
        email: data.email,
        passwordLength: data.password.length,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'موجود' : 'غير موجود',
        supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'موجود' : 'غير موجود'
      });

      // تسجيل الدخول باستخدام الطريقة المباشرة
      const user = await signInWithEmailDirect(data.email, data.password);
      
      console.log('تم تسجيل الدخول المباشر بنجاح:', { 
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا بك ${user.name} في حورس نيوز`,
      });

      // الانتقال إلى الصفحة الرئيسية بعد تسجيل الدخول
      navigate('/');
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول المباشر:', error);
      console.error('تفاصيل الخطأ المباشر:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        stack: error.stack
      });

      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
      
      // إضافة رابط لصفحة اختبار المصادقة
      toast({
        title: "اختبار المصادقة",
        description: (
          <div>
            <p>يمكنك تجربة صفحة اختبار المصادقة للتشخيص</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => navigate('/test-auth')}
            >
              انتقل إلى صفحة الاختبار
            </Button>
          </div>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إظهار أخطاء النموذج في واجهة المستخدم
  const showFormErrors = () => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors).map(err => err.message);
      toast({
        title: "خطأ في النموذج",
        description: errorMessages.join('\n'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Logo size="large" />
          </div>
          <h1 className="text-2xl font-bold mb-2">تسجيل الدخول المباشر</h1>
          <p className="text-gray-600">مرحباً بعودتك، سجل دخولك بالطريقة المباشرة</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, showFormErrors)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-right block">البريد الإلكتروني</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="أدخل بريدك الإلكتروني"
                        className="pl-10 ltr:pl-10 rtl:pr-10"
                        {...field}
                      />
                    </FormControl>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 ltr:left-3 rtl:right-3" />
                  </div>
                  <FormMessage className="text-right text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Link to="/forgot-password" className="text-sm text-horus-blue hover:text-horus-red transition-colors">
                      نسيت كلمة المرور؟
                    </Link>
                    <FormLabel className="text-right">كلمة المرور</FormLabel>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="أدخل كلمة المرور"
                        className="pl-10 ltr:pl-10 rtl:pr-10"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ltr:left-3 rtl:right-3"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <Lock className="absolute left-10 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 ltr:left-10 rtl:right-10" />
                  </div>
                  <FormMessage className="text-right text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-gray-700 cursor-pointer">
                    تذكرني
                  </FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول المباشر'}
            </Button>

            <div className="flex items-center my-4">
              <Separator className="flex-1" />
              <span className="mx-4 text-sm text-gray-500">أو</span>
              <Separator className="flex-1" />
            </div>

            <Button 
              variant="outline" 
              type="button" 
              className="w-full"
              onClick={() => navigate('/login')}
            >
              العودة إلى تسجيل الدخول العادي
            </Button>
          </form>
        </Form>

        <p className="mt-8 text-center text-sm text-gray-600">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="font-medium text-horus-red hover:text-horus-blue transition-colors">
            إنشاء حساب
          </Link>
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} حورس نيوز. جميع الحقوق محفوظة
      </p>
    </div>
  );
};

export default LoginDirect;
