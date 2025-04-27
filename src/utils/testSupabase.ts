// ملف اختبار للتحقق من الاتصال بـ Supabase
import { supabase } from '../lib/supabase';

// دالة للتحقق من الاتصال بـ Supabase
export async function testSupabaseConnection() {
  try {
    // محاولة جلب بيانات من جدول categories
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (error) {
      console.error('خطأ في الاتصال بـ Supabase:', error);
      return false;
    }

    console.log('تم الاتصال بـ Supabase بنجاح:', data);
    return true;
  } catch (error) {
    console.error('خطأ غير متوقع:', error);
    return false;
  }
}

// تنفيذ الاختبار عند استيراد الملف
testSupabaseConnection()
  .then(success => {
    console.log('نتيجة اختبار الاتصال:', success ? 'ناجح' : 'فاشل');
  })
  .catch(error => {
    console.error('خطأ في تنفيذ الاختبار:', error);
  });
