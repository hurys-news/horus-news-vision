// ملف الإعدادات والثوابت

// عنوان API الأساسي
// في بيئة التطوير، سنستخدم API وهمي محلي
// في بيئة الإنتاج، سيتم استبداله بعنوان API حقيقي
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.horusnews.com/v1';

// عدد العناصر في الصفحة الواحدة
export const ITEMS_PER_PAGE = 10;

// تكوين التخزين المؤقت
export const CACHE_CONFIG = {
  // مدة صلاحية التخزين المؤقت بالدقائق
  ttl: 5, // 5 دقائق
  // الحد الأقصى لعدد العناصر المخزنة
  maxItems: 100,
};

// تكوين الصور
export const IMAGE_CONFIG = {
  // الصورة الافتراضية في حالة عدم وجود صورة
  defaultImage: 'https://source.unsplash.com/random/800x600/?news',
  // أحجام الصور المختلفة
  sizes: {
    thumbnail: '100x100',
    small: '300x200',
    medium: '600x400',
    large: '900x600',
  },
};

// فئات الأخبار
export const CATEGORIES = [
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
];
