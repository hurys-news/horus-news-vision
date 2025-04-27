// تعريف أنواع البيانات المستخدمة في التطبيق

// نموذج العنصر الإخباري
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // محتوى المقال الكامل
  category: string;
  categorySlug?: string; // معرف الفئة للروابط
  image: string;
  date: string;
  publishedAt?: string; // تاريخ النشر بتنسيق ISO
  source?: string;
  author?: Author | string;
  tags?: string[];
  isTopStory?: boolean;
  isBreaking?: boolean;
  viewCount?: number; // عدد المشاهدات
  relatedNews?: string[]; // معرفات الأخبار ذات الصلة
}

// نموذج الكاتب
export interface Author {
  id: string;
  name: string;
  avatar: string;
  title?: string;
  bio?: string;
}

// نموذج فئة الأخبار
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string; // للفئات الفرعية
}

// نموذج التعليق
export interface Comment {
  id: string;
  newsId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

// نموذج المستخدم
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'editor' | 'admin';
  savedNews?: string[]; // معرفات الأخبار المحفوظة
  followedCategories?: string[]; // معرفات الفئات المتابعة
}

// نموذج استجابة API للقوائم
export interface ApiResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
