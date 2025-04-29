// تكوين محسن لعميل Supabase
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// استخدام متغيرات البيئة للحجول على عنوان URL ومفتاح API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// التحقق من وجود متغيرات البيئة
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('خطأ: متغيرات البيئة غير مكتملة!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'موجود' : 'غير موجود');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'موجود' : 'غير موجود');
  
  // إظهار رسالة خطأ للمستخدم في وضع التطوير
  if (import.meta.env.DEV && typeof document !== 'undefined') {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.padding = '20px';
    errorDiv.style.backgroundColor = '#f44336';
    errorDiv.style.color = 'white';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.zIndex = '9999';
    errorDiv.innerHTML = `
      <strong>خـطأ في تكوين التطبيق:</strong> متغيرات البيئة غير مكتملة. 
      يرجى التأكد من وجود ملف .env مع متغيرات VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY.
    `;
    document.body.appendChild(errorDiv);
  }
}

// إنشاء عميل Supabase مع معالجة أفضل للأخطاء
const createSupabaseClient = () => {
  try {
    // استخدام قيم افتراضية آمنة في حالة عدم وجود متغيرات البيئة
    const url = supabaseUrl || 'https://placeholder-url.supabase.co';
    const key = supabaseAnonKey || 'placeholder-key';
    
    return createClient<Database>(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.error('خطأ في إنشاء عميل Supabase:', error);
    throw new Error('فشل في إنشاء عميل Supabase. يرجى التحقق من متغيرات البيئة.');
  }
};

// إنشاء وتصدير عميل Supabase
export const supabase = createSupabaseClient();

// دالة للتحقق من الاتصال ب– Supabase
export async function testSupabaseConnection() {
  try {
    // محاولة جلب بيانات من جدول categories
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (error) {
      console.error('خطأ في الاتصال ب– Supabase:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('خطأ غير متوقع في الاتصال ب– Supabase:', error);
    return { success: false, error };
  }
}