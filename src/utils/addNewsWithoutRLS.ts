// ملف لإضافة خبر بدون قيود RLS
import { supabase } from '../lib/supabase';

// دالة لإضافة خبر بدون قيود RLS
export async function addNewsWithoutRLS() {
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

    console.log('إضافة خبر بدون قيود RLS...');
    
    // استخدام الدالة rpc لتنفيذ استعلام SQL مباشر
    const { data, error } = await supabase.rpc('add_news_without_rls', {
      p_title: 'خبر اختبار بدون قيود RLS: تحديث هام',
      p_excerpt: 'هذا خبر اختبار تم إضافته بدون قيود RLS للتأكد من عمل النظام بشكل صحيح.',
      p_content: 'محتوى خبر الاختبار بدون قيود RLS. هذا اختبار للتأكد من عمل النظام بشكل صحيح.',
      p_category_id: categories[0].id,
      p_image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2069&auto=format&fit=crop',
      p_is_top_story: true,
      p_is_breaking: true
    });

    if (error) {
      console.error('خطأ في إضافة خبر بدون قيود RLS:', error);
      
      // محاولة إضافة الخبر بالطريقة العادية
      console.log('محاولة إضافة الخبر بالطريقة العادية...');
      
      const { data: normalData, error: normalError } = await supabase
        .from('news')
        .insert([
          {
            title: 'خبر اختبار: تحديث هام',
            excerpt: 'هذا خبر اختبار للتأكد من عمل النظام بشكل صحيح.',
            content: 'محتوى خبر الاختبار. هذا اختبار للتأكد من عمل النظام بشكل صحيح.',
            category_id: categories[0].id,
            image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2069&auto=format&fit=crop',
            is_top_story: true,
            is_breaking: true
          }
        ])
        .select();
        
      if (normalError) {
        console.error('خطأ في إضافة الخبر بالطريقة العادية:', normalError);
        return false;
      }
      
      console.log('تم إضافة الخبر بالطريقة العادية بنجاح:', normalData);
      return normalData;
    }

    console.log('تم إضافة الخبر بدون قيود RLS بنجاح:', data);
    return data;
  } catch (error) {
    console.error('خطأ غير متوقع:', error);
    return false;
  }
}

// تنفيذ الاختبار عند استيراد الملف
addNewsWithoutRLS()
  .then(result => {
    console.log('نتيجة إضافة خبر بدون قيود RLS:', result ? 'ناجح' : 'فاشل');
  })
  .catch(error => {
    console.error('خطأ في تنفيذ الاختبار:', error);
  });
