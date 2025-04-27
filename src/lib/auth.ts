// خدمة المصادقة باستخدام Supabase
import { supabase } from './supabase';
import { User } from './types';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// دالة تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    console.log('بدء محاولة تسجيل الدخول لـ:', email);
    console.log('متغيرات البيئة:', {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'موجود' : 'غير موجود',
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'موجود' : 'غير موجود'
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      console.error('تفاصيل الخطأ:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      throw error;
    }

    console.log('تم تسجيل الدخول بنجاح:', {
      userId: data.user.id,
      email: data.user.email,
      sessionExpires: data.session?.expires_at
    });

    // جلب معلومات الملف الشخصي
    console.log('جلب معلومات الملف الشخصي للمستخدم:', data.user.id);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError) {
      console.error('خطأ في جلب الملف الشخصي:', profileError);
      if (profileError.code !== 'PGRST116') throw profileError;
    }

    console.log('معلومات الملف الشخصي:', profile || 'لم يتم العثور على ملف شخصي');

    const user = {
      id: data.user.id,
      name: profile?.name || data.user.email?.split('@')[0] || 'مستخدم',
      email: data.user.email || '',
      avatar: profile?.avatar || undefined,
      role: profile?.role || 'user',
      savedNews: profile?.saved_news || [],
      followedCategories: profile?.followed_categories || []
    };

    console.log('تم إنشاء كائن المستخدم:', user);

    return user;
  } catch (error: any) {
    console.error('خطأ في تسجيل الدخول:', error);
    console.error('تفاصيل الخطأ:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      stack: error.stack
    });
    throw error;
  }
}

// دالة تسجيل مستخدم جديد
export async function signUp(email: string, password: string, name: string): Promise<void> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) throw error;

    // إنشاء ملف شخصي للمستخدم الجديد
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          name,
          role: 'user'
        });

      if (profileError) throw profileError;
    }
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

// دالة تسجيل الخروج
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// دالة إرسال رابط إعادة تعيين كلمة المرور
export async function resetPassword(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

// دالة تحديث كلمة المرور
export async function updatePassword(password: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      password
    });
    if (error) throw error;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

// دالة للتحقق من حالة المصادقة
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;
    if (!session) return null;

    // جلب معلومات الملف الشخصي
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') throw profileError;

    return {
      id: session.user.id,
      name: profile?.name || session.user.email?.split('@')[0] || 'مستخدم',
      email: session.user.email || '',
      avatar: profile?.avatar || undefined,
      role: profile?.role || 'user',
      savedNews: profile?.saved_news || [],
      followedCategories: profile?.followed_categories || []
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// دالة تحديث معلومات المستخدم
export async function updateUserProfile(userId: string, data: Partial<Omit<User, 'id' | 'email'>>): Promise<User> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        avatar: data.avatar,
        saved_news: data.savedNews,
        followed_categories: data.followedCategories
      })
      .eq('user_id', userId);

    if (error) throw error;

    // إعادة جلب معلومات المستخدم المحدثة
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('لم يتم العثور على المستخدم');

    return currentUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// دالة تسجيل الدخول البديلة باستخدام عميل Supabase جديد
export async function signInWithEmailDirect(email: string, password: string): Promise<User> {
  try {
    console.log('بدء محاولة تسجيل الدخول المباشر لـ:', email);

    // إنشاء عميل Supabase جديد
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    console.log('متغيرات البيئة للتسجيل المباشر:', {
      supabaseUrl: supabaseUrl ? 'موجود' : 'غير موجود',
      supabaseAnonKey: supabaseAnonKey ? 'موجود' : 'غير موجود'
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('متغيرات البيئة غير مكتملة');
    }

    // إنشاء عميل جديد
    const directClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
    console.log('تم إنشاء عميل Supabase جديد');

    // محاولة تسجيل الدخول
    const { data, error } = await directClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('خطأ في تسجيل الدخول المباشر:', error);
      console.error('تفاصيل الخطأ المباشر:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      throw error;
    }

    console.log('تم تسجيل الدخول المباشر بنجاح:', {
      userId: data.user.id,
      email: data.user.email,
      sessionExpires: data.session?.expires_at
    });

    // جلب معلومات الملف الشخصي
    console.log('جلب معلومات الملف الشخصي للمستخدم (مباشر):', data.user.id);
    const { data: profile, error: profileError } = await directClient
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError) {
      console.error('خطأ في جلب الملف الشخصي (مباشر):', profileError);
      // لا نريد إيقاف العملية إذا لم يتم العثور على ملف شخصي
      if (profileError.code !== 'PGRST116') {
        console.warn('تجاهل خطأ الملف الشخصي والمتابعة');
      }
    }

    console.log('معلومات الملف الشخصي (مباشر):', profile || 'لم يتم العثور على ملف شخصي');

    // إنشاء كائن المستخدم حتى لو لم يكن هناك ملف شخصي
    const user = {
      id: data.user.id,
      name: profile?.name || data.user.email?.split('@')[0] || 'مستخدم',
      email: data.user.email || '',
      avatar: profile?.avatar || undefined,
      role: profile?.role || 'user',
      savedNews: profile?.saved_news || [],
      followedCategories: profile?.followed_categories || []
    };

    console.log('تم إنشاء كائن المستخدم (مباشر):', user);

    // تحديث الجلسة في العميل الرئيسي
    await supabase.auth.setSession({
      access_token: data.session?.access_token || '',
      refresh_token: data.session?.refresh_token || ''
    });

    console.log('تم تحديث الجلسة في العميل الرئيسي');

    return user;
  } catch (error: any) {
    console.error('خطأ في تسجيل الدخول المباشر:', error);
    console.error('تفاصيل الخطأ المباشر:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      stack: error.stack
    });
    throw error;
  }
}