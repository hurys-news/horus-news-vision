// ملف للتحقق من سياسات أمان الصفوف (RLS)
import { supabase } from '../lib/supabase';

// دالة للتحقق من حالة المستخدم الحالي
export async function checkCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('خطأ في جلب المستخدم الحالي:', error);
      return null;
    }

    if (!user) {
      console.log('لا يوجد مستخدم مسجل الدخول');
      return null;
    }

    console.log('المستخدم الحالي:', user);

    // جلب معلومات الملف الشخصي
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('خطأ في جلب الملف الشخصي:', profileError);
      return user;
    }

    console.log('الملف الشخصي:', profile);
    return { user, profile };
  } catch (error) {
    console.error('خطأ غير متوقع:', error);
    return null;
  }
}

// تنفيذ الاختبار عند استيراد الملف
checkCurrentUser()
  .then(result => {
    console.log('نتيجة التحقق من المستخدم الحالي:', result ? 'مسجل الدخول' : 'غير مسجل الدخول');
  })
  .catch(error => {
    console.error('خطأ في تنفيذ الاختبار:', error);
  });
