// ملف لإضافة خبر اختبار
import { supabase } from '../lib/supabase';

// دالة لإضافة خبر اختبار
export async function addTestNews() {
  try {
    // التحقق من وجود فئات
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      console.error('خطأ في جلب الفئات:', categoriesError);
      return false;
    }

    if (!categories || categories.length === 0) {
      console.error('لا توجد فئات لإضافة خبر اختبار');
      return false;
    }

    // التحقق من وجود أخبار
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('*');

    if (newsError) {
      console.error('خطأ في جلب الأخبار:', newsError);
      return false;
    }

    // إذا لم تكن هناك أخبار، أضف خبر اختبار
    if (!news || news.length === 0) {
      console.log('لا توجد أخبار. إضافة خبر اختبار...');
      
      const { data, error } = await supabase
        .from('news')
        .insert([
          {
            title: 'خبر اختبار: إطلاق منصة حورس نيوز الإخبارية',
            excerpt: 'تم إطلاق منصة حورس نيوز الإخبارية لتقديم تغطية شاملة للأخبار والتحليلات في مختلف المجالات.',
            content: `
# إطلاق منصة حورس نيوز الإخبارية

تم اليوم إطلاق منصة حورس نيوز الإخبارية، وهي منصة إخبارية عربية رائدة تهدف إلى تقديم تغطية شاملة للأخبار والتحليلات في مختلف المجالات.

## مميزات المنصة

- تغطية شاملة للأخبار المحلية والعالمية
- تحليلات معمقة للأحداث الجارية
- فريق تحرير محترف
- تصميم عصري وسهل الاستخدام
- دعم كامل للغة العربية

## الأقسام الرئيسية

تضم المنصة العديد من الأقسام المتخصصة، منها:

1. نبض الخبر
2. سياسة
3. اقتصاد
4. رياضة
5. تكنولوجيا
6. عمق الحدث
7. رؤى وتحليلات

نتمنى لكم تجربة مميزة مع منصة حورس نيوز الإخبارية.
            `,
            category_id: categories[0].id,
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop',
            source: 'حورس نيوز',
            is_top_story: true,
            is_breaking: true,
            tags: ['حورس نيوز', 'إطلاق', 'منصة إخبارية']
          }
        ])
        .select();

      if (error) {
        console.error('خطأ في إضافة خبر اختبار:', error);
        return false;
      }

      console.log('تم إضافة خبر الاختبار بنجاح:', data);
      return data;
    }

    console.log('الأخبار موجودة بالفعل:', news);
    return news;
  } catch (error) {
    console.error('خطأ غير متوقع:', error);
    return false;
  }
}

// تنفيذ الاختبار عند استيراد الملف
addTestNews()
  .then(result => {
    console.log('نتيجة إضافة خبر الاختبار:', result ? 'ناجح' : 'فاشل');
  })
  .catch(error => {
    console.error('خطأ في تنفيذ الاختبار:', error);
  });
