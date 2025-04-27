
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Textarea } from "@/components/ui/textarea";

// تعريف مخطط التحقق باستخدام zod
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'البريد الإلكتروني مطلوب' })
    .email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  password: z
    .string()
    .min(8, { message: 'كلمة المرور يجب أن تكون على الأقل 8 أحرف' })
    .regex(/[A-Z]/, { message: 'يجب أن تحتوي على حرف كبير واحد على الأقل' })
    .regex(/[a-z]/, { message: 'يجب أن تحتوي على حرف صغير واحد على الأقل' })
    .regex(/[0-9]/, { message: 'يجب أن تحتوي على رقم واحد على الأقل' }),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  
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
  const onSubmit = (data: FormValues) => {
    console.log('تم إرسال بيانات تسجيل الدخول:', data);
    
    // محاكاة عملية تسجيل الدخول الناجحة
    toast({
      title: "تم تسجيل الدخول بنجاح",
      description: "مرحبًا بك في حورس نيوز",
    });
    
    // في التطبيق الحقيقي، سيتم إرسال البيانات إلى API وربطها بقاعدة البيانات
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
          <h1 className="text-2xl font-bold mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600">مرحباً بعودتك، سجل دخولك للمتابعة</p>
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
            
            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
            
            <div className="flex items-center my-4">
              <Separator className="flex-1" />
              <span className="mx-4 text-sm text-gray-500">أو</span>
              <Separator className="flex-1" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="w-full">
                <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                جوجل
              </Button>
              <Button variant="outline" type="button" className="w-full">
                <svg className="ml-2 h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
                فيسبوك
              </Button>
            </div>
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

export default Login;
