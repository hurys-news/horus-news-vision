// خدمة المصادقة باستخدام Supabase
import { supabase } from './supabase';
import { User } from './types';

// دالة تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // جلب معلومات الملف الشخصي
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') throw profileError;

    return {
      id: data.user.id,
      name: profile?.name || data.user.email?.split('@')[0] || 'مستخدم',
      email: data.user.email || '',
      avatar: profile?.avatar || undefined,
      role: profile?.role || 'user',
      savedNews: profile?.saved_news || [],
      followedCategories: profile?.followed_categories || []
    };
  } catch (error) {
    console.error('Error signing in:', error);
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
