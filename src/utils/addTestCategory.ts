// ملف لإضافة فئة اختبار إذا لم تكن موجودة
import { supabase } from '../lib/supabase';

// دالة لإضافة فئة اختبار
export async function addTestCategory() {
  try {
    // التحقق من وجود فئات
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      console.error('خطأ في جلب الفئات:', categoriesError);
      return false;
    }

    // إذا لم تكن هناك فئات، أضف فئة اختبار
    if (!categories || categories.length === 0) {
      console.log('لا توجد فئات. إضافة فئة اختبار...');
      
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            name: 'نبض الخبر',
            slug: 'pulse',
            description: 'أحدث الأخبار العاجلة والتطورات اللحظية'
          },
          {
            name: 'سياسة',
            slug: 'politics',
            description: 'أخبار وتحليلات سياسية محلية وعالمية'
          },
          {
            name: 'اقتصاد',
            slug: 'economy',
            description: 'أخبار الاقتصاد والمال والأعمال'
          }
        ])
        .select();

      if (error) {
        console.error('خطأ في إضافة فئة اختبار:', error);
        return false;
      }

      console.log('تم إضافة فئات الاختبار بنجاح:', data);
      return data;
    }

    console.log('الفئات موجودة بالفعل:', categories);
    return categories;
  } catch (error) {
    console.error('خطأ غير متوقع:', error);
    return false;
  }
}

// تنفيذ الاختبار عند استيراد الملف
addTestCategory()
  .then(result => {
    console.log('نتيجة إضافة فئة الاختبار:', result ? 'ناجح' : 'فاشل');
  })
  .catch(error => {
    console.error('خطأ في تنفيذ الاختبار:', error);
  });
