// ملف للتحقق من وجود فئات في قاعدة البيانات
import { supabase } from '../lib/supabase';

// دالة للتحقق من وجود فئات
export async function checkCategories() {
  try {
    // محاولة جلب بيانات من جدول categories
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.error('خطأ في جلب الفئات:', error);
      return false;
    }

    console.log('تم جلب الفئات بنجاح:', data);
    return data;
  } catch (error) {
    console.error('خطأ غير متوقع:', error);
    return false;
  }
}

// تنفيذ الاختبار عند استيراد الملف
checkCategories()
  .then(categories => {
    console.log('عدد الفئات:', Array.isArray(categories) ? categories.length : 0);
  })
  .catch(error => {
    console.error('خطأ في تنفيذ الاختبار:', error);
  });
