// خدمة API لجلب البيانات

import { API_BASE_URL, CACHE_CONFIG } from './config';
import { NewsItem, Category, ApiResponse, Comment, User } from './types';
import { mockNewsData } from './mockData'; // سنستخدم البيانات الوهمية مؤقتًا حتى يتم ربط API حقيقي

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

// دالة مساعدة لجلب البيانات مع التخزين المؤقت
async function fetchWithCache<T>(url: string, options?: RequestInit): Promise<T> {
  const cacheKey = url;

  // التحقق من وجود بيانات مخزنة مؤقتًا صالحة
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data as T;
  }

  try {
    // في الوضع الحالي، سنستخدم البيانات الوهمية
    // عندما يكون هناك API حقيقي، سنستخدم الكود التالي:
    /*
    const response = await fetch(`${API_BASE_URL}${url}`, options);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    */

    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 300));

    // استخدام البيانات الوهمية
    let data: any;

    if (url.includes('/news/')) {
      const id = url.split('/news/')[1];
      data = mockNewsData.find(item => item.id === id);
    } else if (url.includes('/categories/')) {
      const slug = url.split('/categories/')[1].split('?')[0];
      data = {
        data: mockNewsData.filter(item => item.categorySlug === slug),
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: mockNewsData.filter(item => item.categorySlug === slug).length,
          itemsPerPage: 10
        }
      };
    } else if (url === '/news') {
      data = {
        data: mockNewsData,
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: mockNewsData.length,
          itemsPerPage: 10
        }
      };
    } else if (url === '/categories') {
      data = {
        data: [
          { id: '1', name: 'نبض الخبر', slug: 'pulse' },
          { id: '2', name: 'سياسة', slug: 'politics' },
          { id: '3', name: 'اقتصاد', slug: 'economy' },
          { id: '4', name: 'رياضة', slug: 'sports' },
          { id: '5', name: 'تكنولوجيا', slug: 'tech' },
          { id: '6', name: 'عمق الحدث', slug: 'depth' },
          { id: '7', name: 'رؤى وتحليلات', slug: 'insights' },
          { id: '8', name: 'صوت الشارع', slug: 'street-voice' },
          { id: '9', name: 'ملفات خاصة', slug: 'special-files' },
          { id: '10', name: 'منصة الرأي', slug: 'opinion' },
        ],
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 10,
          itemsPerPage: 10
        }
      };
    } else if (url.includes('/search')) {
      const query = new URLSearchParams(url.split('?')[1]).get('q') || '';
      data = {
        data: mockNewsData.filter(item =>
          item.title.includes(query) ||
          item.excerpt.includes(query) ||
          item.content.includes(query)
        ),
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalItems: mockNewsData.filter(item =>
            item.title.includes(query) ||
            item.excerpt.includes(query) ||
            item.content.includes(query)
          ).length,
          itemsPerPage: 10
        }
      };
    }

    // تخزين البيانات في الذاكرة المؤقتة
    cache[cacheKey] = {
      data,
      timestamp: Date.now()
    };

    return data as T;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// دالة لجلب قائمة الأخبار
export async function getNews(page = 1, limit = 10): Promise<ApiResponse<NewsItem>> {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 300));

  // حساب البيانات الوصفية للصفحة
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNews = mockNewsData.slice(startIndex, endIndex);

  return {
    data: paginatedNews,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(mockNewsData.length / limit),
      totalItems: mockNewsData.length,
      itemsPerPage: limit
    }
  };
}

// دالة لجلب خبر محدد بواسطة المعرف
export async function getNewsById(id: string): Promise<NewsItem> {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 300));

  // البحث عن الخبر بواسطة المعرف
  const newsItem = mockNewsData.find(item => item.id === id);

  if (!newsItem) {
    throw new Error(`الخبر غير موجود: ${id}`);
  }

  return newsItem;
}

// دالة لجلب الأخبار حسب الفئة
export async function getNewsByCategory(slug: string, page = 1, limit = 10): Promise<ApiResponse<NewsItem>> {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 300));

  // استخدام البيانات الوهمية للأخبار حسب الفئة
  const filteredNews = mockNewsData.filter(item => item.categorySlug === slug);

  // حساب البيانات الوصفية للصفحة
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNews = filteredNews.slice(startIndex, endIndex);

  return {
    data: paginatedNews,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(filteredNews.length / limit),
      totalItems: filteredNews.length,
      itemsPerPage: limit
    }
  };
}

// دالة لجلب الأخبار المميزة
export async function getFeaturedNews(): Promise<NewsItem[]> {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 300));

  // استخدام البيانات الوهمية للأخبار المميزة
  return mockNewsData.filter(item => item.isTopStory).slice(0, 5);
}

// دالة لجلب الأخبار العاجلة
export async function getBreakingNews(): Promise<NewsItem[]> {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 300));

  // استخدام البيانات الوهمية للأخبار العاجلة
  return mockNewsData.filter(item => item.isBreaking).slice(0, 5);
}

// دالة لجلب قائمة الفئات
export async function getCategories(): Promise<Category[]> {
  const response = await fetchWithCache<ApiResponse<Category>>('/categories');
  return response.data;
}

// دالة للبحث في الأخبار
export async function searchNews(query: string, page = 1, limit = 10): Promise<ApiResponse<NewsItem>> {
  return fetchWithCache<ApiResponse<NewsItem>>(`/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
}

// دالة لجلب تعليقات خبر محدد
export async function getCommentsByNewsId(newsId: string): Promise<Comment[]> {
  const response = await fetchWithCache<ApiResponse<Comment>>(`/news/${newsId}/comments`);
  return response.data;
}

// دالة لإضافة تعليق (هذه ستحتاج إلى طلب POST حقيقي)
export async function addComment(newsId: string, comment: Omit<Comment, 'id' | 'date' | 'likes'>): Promise<Comment> {
  // هذه الدالة ستحتاج إلى تنفيذ حقيقي عند ربط API
  // حاليًا سنعيد بيانات وهمية
  return {
    id: Math.random().toString(36).substring(2, 9),
    newsId,
    userId: comment.userId,
    userName: comment.userName,
    userAvatar: comment.userAvatar,
    content: comment.content,
    date: new Date().toISOString(),
    likes: 0
  };
}
