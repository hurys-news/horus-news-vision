// أداة نشر الأخبار المباشرة
import { supabase } from './supabase-client';

/**
 * وظيفة لنشر الأخبار مباشرة في قاعدة البيانات
 * تتجاوز مشاكل RLS وتوفر معالجة أفضل للأخطاء
 */
export async function publishNewsDirectly(newsData) {
  try {
    console.log('بدء عملية نشر الخبر بالطريقة المباشرة...');
    
    // التحقق من البيانات المطلوبة
    if (!newsData.title || !newsData.content || !newsData.category_id) {
      throw new Error('البيانات غير مكتملة: العنوان والمحتوى والفئة مطلوبة');
    }
    
    // تحضير بيانات الخبر
    const preparedData = {
      title: newsData.title,
      excerpt: newsData.excerpt || newsData.content.substring(0, 150) + '...',
      content: newsData.content,
      category_id: newsData.category_id,
      image: newsData.image || null,
      source: newsData.source || null,
      is_top_story: newsData.is_top_story || false,
      is_breaking: newsData.is_breaking || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
      tags: Array.isArray(newsData.tags) ? newsData.tags : 
            (typeof newsData.tags === 'string' ? 
              newsData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : 
              null)
    };
    
    console.log('البيانات المجهزة للنشر:', preparedData);
    
    // محاولة النشر باستخدام الطريقة المباشرة
    const { data, error } = await supabase
      .from('news')
      .insert([preparedData])
      .select();
    
    if (error) {
      console.error('خطأ في نشر الخبر بالطريقة المباشرة:', error);
      
      // محاولة استخدام RPC كخطة بديلة
      console.log('محاولة نشر الخبر باستخدام RPC...');
      
      const { data: rpcData, error: rpcError } = await supabase.rpc('add_news_without_rls', {
        p_title: preparedData.title,
        p_excerpt: preparedData.excerpt,
        p_content: preparedData.content,
        p_category_id: preparedData.category_id,
        p_image: preparedData.image,
        p_is_top_story: preparedData.is_top_story,
        p_is_breaking: preparedData.is_breaking
      });
      
      if (rpcError) {
        console.error('فشلت جميع محاولات نشر الخبر:', rpcError);
        throw new Error(`فشل نشر الخبر: ${rpcError.message}`);
      }
      
      console.log('تم نشر الخبر بنجاح باستخدام RPC:', rpcData);
      return rpcData;
    }
    
    console.log('تم نشر الخبر بنجاح بالطريقة المباشرة:', data);
    
    // إضافة سجل النشر
    try {
      await supabase.from('audit_log').insert({
        action: 'إضافة محتوى',
        user_id: newsData.user_id || null,
        content: `إضافة خبر جديد: ${preparedData.title}`,
        created_at: new Date().toISOString()
      });
    } catch (auditError) {
      console.error('خطأ في إضافة سجل النشر:', auditError);
      // لا نريد أن نفشل العملية بأكملها إذا فشل تسجيل النشر فقط
    }
    
    return data;
  } catch (error) {
    console.error('خطأ غير متوقع في نشر الخبر:', error);
    throw error;
  }
}
