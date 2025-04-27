// ملف للتحقق من وجود أخبار في قاعدة البيانات
import { supabase } from '../lib/supabase';

// دالة للتحقق من وجود أخبار
export async function checkNews() {
  try {
    // محاولة جلب بيانات من جدول news
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        categories:category_id (id, name, slug)
      `);

    if (error) {
      console.error('خطأ في جلب الأخبار:', error);
      return false;
    }

    console.log('تم جلب الأخبار بنجاح:', data);
    return data;
  } catch (error) {
    console.error('خطأ غير متوقع:', error);
    return false;
  }
}

// تنفيذ الاختبار عند استيراد الملف
checkNews()
  .then(news => {
    console.log('عدد الأخبار:', Array.isArray(news) ? news.length : 0);
  })
  .catch(error => {
    console.error('خطأ في تنفيذ الاختبار:', error);
  });
