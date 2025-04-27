
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '../components/Logo';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

// تعريف مخطط التحقق باستخدام zod
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'البريد الإلكتروني مطلوب' })
    .email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // إعداد نموذج React Hook Form مع التحقق من Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // معالج إرسال النموذج
  const onSubmit = (data: FormValues) => {
    console.log('تم إرسال طلب استعادة كلمة المرور:', data);
    
    // محاكاة إرسال رابط إعادة تعيين كلمة المرور
    setIsSubmitted(true);
    
    toast({
      title: "تم إرسال طلب استعادة كلمة المرور",
      description: "يرجى التحقق من بريدك الإلكتروني للحصول على تعليمات إعادة تعيين كلمة المرور",
    });
    
    // في التطبيق الحقيقي، سيتم إرسال البيانات إلى API وربطها بقاعدة البيانات
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Logo size="large" />
          </div>
          <h1 className="text-2xl font-bold mb-2">استعادة كلمة المرور</h1>
          <p className="text-gray-600">أدخل بريدك الإلكتروني لاستعادة كلمة المرور</p>
        </div>
        
        {isSubmitted ? (
          <div className="text-center space-y-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg">
              <p className="font-bold mb-2">تم إرسال رابط إعادة تعيين كلمة المرور</p>
              <p>تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك واتباع التعليمات.</p>
            </div>
            <Button asChild className="w-full">
              <Link to="/login" className="flex items-center justify-center">
                العودة إلى تسجيل الدخول
                <ArrowRight className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              
              <Button type="submit" className="w-full">
                استعادة كلمة المرور
              </Button>
              
              <p className="text-center">
                <Link to="/login" className="text-sm text-horus-blue hover:text-horus-red transition-colors">
                  العودة إلى تسجيل الدخول
                </Link>
              </p>
            </form>
          </Form>
        )}
      </div>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} حورس نيوز. جميع الحقوق محفوظة
      </p>
    </div>
  );
};

export default ForgotPassword;
