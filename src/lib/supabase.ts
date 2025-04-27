// تكوين Supabase
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// استخدام متغيرات البيئة للحصول على عنوان URL ومفتاح API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// إنشاء عميل Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
