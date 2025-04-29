// أداة تشخيص مشاكل الاتصال بقاعدة البيانات
import { supabase } from './supabase-client';

/**
 * وظيفة للتحقق من الاتصال بقاعدة البيانات وتشخيص المشاكل
 */
export async function diagnoseDatabaseConnection() {
  console.log('بدء تشخيص الاتصال بقاعدة البيانات...');
  const results = {
    connection: false,
    categories: false,
    news: false,
    permissions: false,
    rpc: false,
    errors: []
  };
  
  try {
    // 1. اختبار الاتصال الأساسي
    console.log('اختبار الاتصال الأساسي...');
    const { data: healthData, error: healthError } = await supabase.from('categories').select('count').limit(1);
    
    if (healthError) {
      console.error('فشل اختبار الاتصال الأساسي:', healthError);
      results.errors.push(`فشل الاتصال: ${healthError.message}`);
    } else {
      console.log('نجح اختبار الاتصال الأساسي');
      results.connection = true;
    }
    
    // 2. اختبار جدول الفئات
    if (results.connection) {
      console.log('اختبار جدول الفئات...');
      const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*').limit(5);
      
      if (categoriesError) {
        console.error('فشل اختبار جدول الفئات:', categoriesError);
        results.errors.push(`مشكلة في جدول الفئات: ${categoriesError.message}`);
      } else {
        console.log(`نجح اختبار جدول الفئات: تم العثور على ${categoriesData.length} فئات`);
        results.categories = true;
      }
    }
    
    // 3. اختبار جدول الأخبار
    if (results.connection) {
      console.log('اختبار جدول الأخبار...');
      const { data: newsData, error: newsError } = await supabase.from('news').select('*').limit(5);
      
      if (newsError) {
        console.error('فشل اختبار جدول الأخبار:', newsError);
        results.errors.push(`مشكلة في جدول الأخبار: ${newsError.message}`);
      } else {
        console.log(`نجح اختبار جدول الأخبار: تم العثور على ${newsData.length} أخبار`);
        results.news = true;
      }
    }
    
    // 4. اختبار صلاحيات الإدراج
    if (results.connection && results.categories) {
      console.log('اختبار صلاحيات الإدراج...');
      
      // محاولة إدراج خبر تجريبي
      const testNewsData = {
        title: 'خبر اختبار - سيتم حذفه',
        excerpt: 'هذا خبر اختبار لفحص صلاحيات الإدراج',
        content: 'محتوى اختباري للتحقق من صلاحيات الإدراج في قاعدة البيانات',
        category_id: (await supabase.from('categories').select('id').limit(1)).data[0]?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        view_count: 0
      };
      
      const { data: insertData, error: insertError } = await supabase.from('news').insert([testNewsData]);
      
      if (insertError) {
        console.error('فشل اختبار صلاحيات الإدراج:', insertError);
        results.errors.push(`مشكلة في صلاحيات الإدراج: ${insertError.message}`);
      } else {
        console.log('نجح اختبار صلاحيات الإدراج');
        results.permissions = true;
        
        // حذف الخبر التجريبي
        try {
          await supabase.from('news').delete().eq('title', 'خبر اختبار - سيتم حذفه');
        } catch (deleteError) {
          console.error('فشل حذف الخبر التجريبي:', deleteError);
        }
      }
    }
    
    // 5. اختبار دالة RPC
    if (results.connection) {
      console.log('اختبار دالة RPC...');
      
      // محاولة استخدام دالة RPC
      const { data: rpcData, error: rpcError } = await supabase.rpc('add_news_without_rls', {
        p_title: 'خبر اختبار RPC - سيتم حذفه',
        p_excerpt: 'هذا خبر اختبار لفحص دالة RPC',
        p_content: 'محتوى اختباري للتحقق من عمل دالة RPC',
        p_category_id: (await supabase.from('categories').select('id').limit(1)).data[0]?.id,
        p_image: null,
        p_is_top_story: false,
        p_is_breaking: false
      });
      
      if (rpcError) {
        console.error('فشل اختبار دالة RPC:', rpcError);
        results.errors.push(`مشكلة في دالة RPC: ${rpcError.message}`);
      } else {
        console.log('نجح اختبار دالة RPC');
        results.rpc = true;
        
        // حذف الخبر التجريبي
        try {
          await supabase.from('news').delete().eq('title', 'خبر اختبار RPC - سيتم حذفه');
        } catch (deleteError) {
          console.error('فشل حذف الخبر التجريبي من RPC:', deleteError);
        }
      }
    }
    
    // تلخيص النتائج
    console.log('\n--- ملخص نتائج التشخيص ---');
    console.log(`الاتصال الأساسي: ${results.connection ? '✅ ناجح' : '❌ فاشل'}`);
    console.log(`جدول الفئات: ${results.categories ? '✅ ناجح' : '❌ فاشل'}`);
    console.log(`جدول الأخبار: ${results.news ? '✅ ناجح' : '❌ فاشل'}`);
    console.log(`صلاحيات الإدراج: ${results.permissions ? '✅ ناجح' : '❌ فاشل'}`);
    console.log(`دالة RPC: ${results.rpc ? '✅ ناجح' : '❌ فاشل'}`);
    
    if (results.errors.length > 0) {
      console.log('\nالأخطاء المكتشفة:');
      results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    return results;
  } catch (error) {
    console.error('خطأ غير متوقع أثناء التشخيص:', error);
    results.errors.push(`خطأ غير متوقع: ${error.message}`);
    return results;
  }
}
