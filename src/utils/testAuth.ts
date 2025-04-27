// ملف اختبار للتحقق من المصادقة في Supabase
import { supabase } from '../lib/supabase';

// دالة للتحقق من متغيرات البيئة
export async function checkEnvironmentVariables() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'موجود' : 'غير موجود');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'موجود' : 'غير موجود');

  return {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey
  };
}

// دالة للتحقق من حالة المصادقة
export async function checkAuthState() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('خطأ في جلب جلسة المصادقة:', error);
      return { success: false, error };
    }

    console.log('حالة المصادقة:', data.session ? 'مسجل الدخول' : 'غير مسجل الدخول');
    return { success: true, session: data.session };
  } catch (error) {
    console.error('خطأ غير متوقع في التحقق من حالة المصادقة:', error);
    return { success: false, error };
  }
}

// تنفيذ الاختبارات
checkEnvironmentVariables()
  .then(result => {
    console.log('نتيجة التحقق من متغيرات البيئة:', result);
    
    if (result.supabaseUrl && result.supabaseAnonKey) {
      return checkAuthState();
    } else {
      console.error('متغيرات البيئة غير مكتملة. لا يمكن التحقق من حالة المصادقة.');
      return { success: false, error: 'متغيرات البيئة غير مكتملة' };
    }
  })
  .then(result => {
    console.log('نتيجة التحقق من حالة المصادقة:', result);
  })
  .catch(error => {
    console.error('خطأ في تنفيذ الاختبارات:', error);
  });
