// تكوين Supabase
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// استخدام متغيرات البيئة للحصول على عنوان URL ومفتاح API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// التحقق من وجود متغيرات البيئة
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('خطأ: متغيرات البيئة غير مكتملة!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'موجود' : 'غير موجود');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'موجود' : 'غير موجود');
}

// إنشاء عميل Supabase
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
