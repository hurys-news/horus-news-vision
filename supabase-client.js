// تكوين محسن لعميل Supabase
import { createClient } from '@supabase/supabase-js';

// استخدام متغيرات البيئة للحصول على عنوان URL ومفتاح API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// التحقق من وجود متغيرات البيئة
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('خطأ: متغيرات البيئة غير مكتملة!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'موجود' : 'غير موجود');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'موجود' : 'غير موجود');
  
  // إظهار رسالة خطأ للمستخدم
  if (typeof document !== 'undefined') {
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
      <strong>خطأ في تكوين التطبيق:</strong> متغيرات البيئة غير مكتملة. 
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
    
    return createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.error('خطأ في إنشاء عميل Supabase:', error);
    
    // إرجاع عميل وهمي لتجنب الأخطاء
    return {
      auth: {
        signInWithPassword: async () => ({ data: null, error: new Error('فشل تكوين Supabase') }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => ({ data: null, error: new Error('فشل تكوين Supabase') }),
        insert: () => ({ data: null, error: new Error('فشل تكوين Supabase') }),
        update: () => ({ data: null, error: new Error('فشل تكوين Supabase') }),
        delete: () => ({ data: null, error: new Error('فشل تكوين Supabase') }),
        eq: () => ({ data: null, error: new Error('فشل تكوين Supabase') })
      }),
      rpc: () => ({ data: null, error: new Error('فشل تكوين Supabase') })
    };
  }
};

export const supabase = createSupabaseClient();
