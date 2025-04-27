// خدمة API لجلب البيانات باستخدام Supabase

import { CACHE_CONFIG } from './config';
import { NewsItem, Category, ApiResponse, Comment, User } from './types';
import { supabase } from './supabase';
import { Tables } from '../types/supabase';

// كائن للتخزين المؤقت
const cache: Record<string, { data: any; timestamp: number }> = {};

// دالة مساعدة للتحقق من صلاحية التخزين المؤقت
const isCacheValid = (key: string): boolean => {
  if (!cache[key]) return false;

  const now = Date.now();
  const cacheTime = cache[key].timestamp;
  const ttl = CACHE_CONFIG.ttl * 60 * 1000; // تحويل الدقائق إلى مللي ثانية

  return now - cacheTime < ttl;
};

// دالة مساعدة لتحويل بيانات Supabase إلى نموذج NewsItem
const mapNewsItem = (item: Tables<'news'>): NewsItem => {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content || undefined,
    category: '', // سيتم ملؤها لاحقًا
    categorySlug: '', // سيتم ملؤها لاحقًا
    image: item.image || '',
    date: new Date(item.created_at).toLocaleDateString('ar-EG'),
    publishedAt: item.created_at,
    source: item.source || undefined,
    author: item.author_id || undefined,
    isTopStory: item.is_top_story,
    isBreaking: item.is_breaking,
    viewCount: item.view_count,
    tags: item.tags || undefined
  };
};

// دالة لجلب قائمة الأخبار
export async function getNews(page = 1, limit = 10): Promise<ApiResponse<NewsItem>> {
  const cacheKey = `news_${page}_${limit}`;

  // التحقق من وجود بيانات مخزنة مؤقتًا صالحة
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data as ApiResponse<NewsItem>;
  }

  try {
    // حساب التخطي للصفحات
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // جلب الأخبار من Supabase
    const { data: newsData, count, error } = await supabase
      .from('news')
      .select('*, categories(name, slug)', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // تحويل البيانات إلى النموذج المطلوب
    const news = newsData.map(item => {
      const newsItem = mapNewsItem(item);
      // إضافة معلومات الفئة
      if (item.categories) {
        newsItem.category = item.categories.name;
        newsItem.categorySlug = item.categories.slug;
      }
      return newsItem;
    });

    const response: ApiResponse<NewsItem> = {
      data: news,
      meta: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit
      }
    };

    // تخزين البيانات في الذاكرة المؤقتة
    cache[cacheKey] = {
      data: response,
      timestamp: Date.now()
    };

    return response;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

// دالة لجلب خبر محدد بواسطة المعرف
export async function getNewsById(id: string): Promise<NewsItem> {
  const cacheKey = `news_${id}`;

  // التحقق من وجود بيانات مخزنة مؤقتًا صالحة
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data as NewsItem;
  }

  try {
    // جلب الخبر من Supabase
    const { data: newsItem, error } = await supabase
      .from('news')
      .select('*, categories(name, slug), authors(name, avatar, title)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!newsItem) throw new Error(`الخبر غير موجود: ${id}`);

    // تحويل البيانات إلى النموذج المطلوب
    const news = mapNewsItem(newsItem);

    // إضافة معلومات الفئة
    if (newsItem.categories) {
      news.category = newsItem.categories.name;
      news.categorySlug = newsItem.categories.slug;
    }

    // إضافة معلومات الكاتب
    if (newsItem.authors) {
      news.author = {
        id: newsItem.author_id || '',
        name: newsItem.authors.name,
        avatar: newsItem.authors.avatar || '',
        title: newsItem.authors.title || undefined
      };
    }

    // تحديث عدد المشاهدات
    await supabase
      .from('news')
      .update({ view_count: (newsItem.view_count || 0) + 1 })
      .eq('id', id);

    // تخزين البيانات في الذاكرة المؤقتة
    cache[cacheKey] = {
      data: news,
      timestamp: Date.now()
    };

    return news;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    throw error;
  }
}

// دالة لجلب الأخبار حسب الفئة
export async function getNewsByCategory(slug: string, page = 1, limit = 10): Promise<ApiResponse<NewsItem>> {
  const cacheKey = `news_category_${slug}_${page}_${limit}`;

  // التحقق من وجود بيانات مخزنة مؤقتًا صالحة
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data as ApiResponse<NewsItem>;
  }

  try {
    // أولاً، نحصل على معرف الفئة من الـ slug
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (categoryError) throw categoryError;
    if (!categoryData) throw new Error(`الفئة غير موجودة: ${slug}`);

    // حساب التخطي للصفحات
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // جلب الأخبار من Supabase
    const { data: newsData, count, error } = await supabase
      .from('news')
      .select('*, categories(name, slug)', { count: 'exact' })
      .eq('category_id', categoryData.id)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // تحويل البيانات إلى النموذج المطلوب
    const news = newsData.map(item => {
      const newsItem = mapNewsItem(item);
      // إضافة معلومات الفئة
      if (item.categories) {
        newsItem.category = item.categories.name;
        newsItem.categorySlug = item.categories.slug;
      }
      return newsItem;
    });

    const response: ApiResponse<NewsItem> = {
      data: news,
      meta: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit
      }
    };

    // تخزين البيانات في الذاكرة المؤقتة
    cache[cacheKey] = {
      data: response,
      timestamp: Date.now()
    };

    return response;
  } catch (error) {
    console.error('Error fetching news by category:', error);
    throw error;
  }
}

// دالة لجلب الأخبار المميزة
export async function getFeaturedNews(): Promise<NewsItem[]> {
  const cacheKey = 'featured_news';

  // التحقق من وجود بيانات مخزنة مؤقتًا صالحة
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data as NewsItem[];
  }

  try {
    // جلب الأخبار المميزة من Supabase
    const { data: newsData, error } = await supabase
      .from('news')
      .select('*, categories(name, slug)')
      .eq('is_top_story', true)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    // تحويل البيانات إلى النموذج المطلوب
    const news = newsData.map(item => {
      const newsItem = mapNewsItem(item);
      // إضافة معلومات الفئة
      if (item.categories) {
        newsItem.category = item.categories.name;
        newsItem.categorySlug = item.categories.slug;
      }
      return newsItem;
    });

    // تخزين البيانات في الذاكرة المؤقتة
    cache[cacheKey] = {
      data: news,
      timestamp: Date.now()
    };

    return news;
  } catch (error) {
    console.error('Error fetching featured news:', error);
    throw error;
  }
}

// دالة لجلب الأخبار العاجلة
export async function getBreakingNews(): Promise<NewsItem[]> {
  const cacheKey = 'breaking_news';

  // التحقق من وجود بيانات مخزنة مؤقتًا صالحة
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data as NewsItem[];
  }

  try {
    // جلب الأخبار العاجلة من Supabase
    const { data: newsData, error } = await supabase
      .from('news')
      .select('*, categories(name, slug)')
      .eq('is_breaking', true)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    // تحويل البيانات إلى النموذج المطلوب
    const news = newsData.map(item => {
      const newsItem = mapNewsItem(item);
      // إضافة معلومات الفئة
      if (item.categories) {
        newsItem.category = item.categories.name;
        newsItem.categorySlug = item.categories.slug;
      }
      return newsItem;
    });

    // تخزين البيانات في الذاكرة المؤقتة
    cache[cacheKey] = {
      data: news,
      timestamp: Date.now()
    };

    return news;
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    throw error;
  }
}

// دالة لجلب قائمة الفئات
export async function getCategories(): Promise<Category[]> {
  const cacheKey = 'categories';

  // التحقق من وجود بيانات مخزنة مؤقتًا صالحة
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data as Category[];
  }

  try {
    // جلب الفئات من Supabase
    const { data: categoriesData, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    // تحويل البيانات إلى النموذج المطلوب
    const categories = categoriesData.map(item => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description || undefined,
      image: item.image || undefined,
      parentId: item.parent_id || undefined
    }));

    // تخزين البيانات في الذاكرة المؤقتة
    cache[cacheKey] = {
      data: categories,
      timestamp: Date.now()
    };

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// دالة للبحث في الأخبار
export async function searchNews(query: string, page = 1, limit = 10): Promise<ApiResponse<NewsItem>> {
  const cacheKey = `search_${query}_${page}_${limit}`;

  // التحقق من وجود بيانات مخزنة مؤقتًا صالحة
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data as ApiResponse<NewsItem>;
  }

  try {
    // حساب التخطي للصفحات
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // البحث في الأخبار باستخدام Supabase
    const { data: newsData, count, error } = await supabase
      .from('news')
      .select('*, categories(name, slug)', { count: 'exact' })
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // تحويل البيانات إلى النموذج المطلوب
    const news = newsData.map(item => {
      const newsItem = mapNewsItem(item);
      // إضافة معلومات الفئة
      if (item.categories) {
        newsItem.category = item.categories.name;
        newsItem.categorySlug = item.categories.slug;
      }
      return newsItem;
    });

    const response: ApiResponse<NewsItem> = {
      data: news,
      meta: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit
      }
    };

    // تخزين البيانات في الذاكرة المؤقتة
    cache[cacheKey] = {
      data: response,
      timestamp: Date.now()
    };

    return response;
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
}

// دالة لجلب تعليقات خبر محدد
export async function getCommentsByNewsId(newsId: string): Promise<Comment[]> {
  const cacheKey = `comments_${newsId}`;

  // التحقق من وجود بيانات مخزنة مؤقتًا صالحة
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data as Comment[];
  }

  try {
    // جلب التعليقات من Supabase
    const { data: commentsData, error } = await supabase
      .from('comments')
      .select('*, profiles(name, avatar)')
      .eq('news_id', newsId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // تحويل البيانات إلى النموذج المطلوب
    const comments = commentsData.map(item => ({
      id: item.id,
      newsId: item.news_id,
      userId: item.user_id,
      userName: item.profiles?.name || 'مستخدم مجهول',
      userAvatar: item.profiles?.avatar || undefined,
      content: item.content,
      date: new Date(item.created_at).toLocaleDateString('ar-EG'),
      likes: item.likes || 0,
      replies: [] // سيتم ملؤها لاحقًا إذا كان هناك ردود
    }));

    // تخزين البيانات في الذاكرة المؤقتة
    cache[cacheKey] = {
      data: comments,
      timestamp: Date.now()
    };

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

// دالة لإضافة تعليق
export async function addComment(newsId: string, comment: Omit<Comment, 'id' | 'date' | 'likes'>): Promise<Comment> {
  try {
    // إضافة التعليق إلى Supabase
    const { data, error } = await supabase
      .from('comments')
      .insert({
        news_id: newsId,
        user_id: comment.userId,
        content: comment.content,
        created_at: new Date().toISOString(),
        likes: 0
      })
      .select('*, profiles(name, avatar)')
      .single();

    if (error) throw error;

    // تحويل البيانات إلى النموذج المطلوب
    return {
      id: data.id,
      newsId: data.news_id,
      userId: data.user_id,
      userName: data.profiles?.name || comment.userName,
      userAvatar: data.profiles?.avatar || comment.userAvatar,
      content: data.content,
      date: new Date(data.created_at).toLocaleDateString('ar-EG'),
      likes: data.likes || 0
    };
  } catch (error) {
    console.error('Error adding comment:', error);
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
