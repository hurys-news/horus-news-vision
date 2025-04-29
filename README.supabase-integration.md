# دليل ربط موقع حورس نيوز بقاعدة بيانات Supabase

هذا الدليل يشرح كيفية ربط موقع حورس نيوز ولوحة التحكم بقاعدة بيانات Supabase لعرض الأخبار المنشورة.

## المتطلبات

- حساب على [Supabase](https://supabase.com)
- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn

## خطوات الإعداد

### 1. إنشاء مشروع Supabase

1. قم بزيارة [supabase.com](https://supabase.com/) وقم بتسجيل الدخول أو إنشاء حساب جديد.
2. انقر على "New Project" لإنشاء مشروع جديد.
3. أدخل اسم المشروع (مثل "horus-news") واختر كلمة مرور قوية لقاعدة البيانات.
4. اختر المنطقة الأقرب إليك لاستضافة المشروع.
5. انقر على "Create new project" وانتظر حتى يتم إنشاء المشروع (قد يستغرق ذلك بضع دقائق).

### 2. إعداد قاعدة البيانات

1. بعد إنشاء المشروع، انتقل إلى قسم "SQL Editor" في لوحة التحكم.
2. انسخ محتوى ملف `supabase/schema.sql` الموجود في هذا المشروع والصقه في محرر SQL.
3. انقر على "Run" لتنفيذ الأوامر وإنشاء الجداول وسياسات الأمان.
4. انسخ محتوى ملف `supabase/audit_log.sql` والصقه في محرر SQL وقم بتنفيذه.

### 3. الحصول على بيانات الاتصال

1. انتقل إلى قسم "Settings" > "API" في لوحة التحكم.
2. ستجد هناك:
   - عنوان URL للمشروع (Project URL)
   - مفتاح API العام (anon key)

### 4. إعداد متغيرات البيئة

1. قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع.
2. أضف المتغيرات التالية:
   ```
   VITE_SUPABASE_URL=https://your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   استبدل القيم بالقيم الخاصة بمشروعك.

### 5. تثبيت التبعيات

قم بتثبيت التبعيات اللازمة:

```bash
npm install
```

### 6. تشغيل المشروع

قم بتشغيل المشروع في وضع التطوير:

```bash
npm run dev
```

## اختبار الاتصال

بعد إعداد المشروع، يمكنك اختبار الاتصال بقاعدة البيانات من خلال:

1. فتح المتصفح والانتقال إلى `http://localhost:8081/supabase-test`
2. ستظهر صفحة اختبار الاتصال بـ Supabase.
3. يمكنك التحقق من:
   - حالة الاتصال بقاعدة البيانات
   - وجود الجداول المطلوبة
   - جلب الأخبار والفئات
   - جلب الأخبار العاجلة والمميزة

## هيكل الملفات

تم إضافة الملفات التالية لدعم الاتصال بـ Supabase:

- `src/lib/supabaseClient.ts`: عميل Supabase المحسن
- `src/utils/supabaseTest.ts`: أدوات اختبار الاتصال بـ Supabase
- `src/services/newsService.ts`: خدمة الأخبار للتفاعل مع Supabase
- `src/services/categoryService.ts`: خدمة الفئات للتفاعل مع Supabase
- `src/components/SupabaseStatus.tsx`: مكون لعرض حالة الاتصال بـ Supabase
- `src/pages/SupabaseTest.tsx`: صفحة لاختبار الاتصال بـ Supabase

## استخدام خدمات Supabase

### جلب الأخبار

```typescript
import { getNews, getNewsById, getNewsByCategory } from '@/services/newsService';

// جلب قائمة الأخبار
const newsResponse = await getNews(1, 10); // الصفحة 1، 10 أخبار في الصفحة
const newsList = newsResponse.data;

// جلب خبر محدد
const newsItem = await getNewsById('news-id');

// جلب الأخبار حسب الفئة
const categoryNewsResponse = await getNewsByCategory('politics', 1, 10);
const categoryNewsList = categoryNewsResponse.data;
```

### جلب الفئات

```typescript
import { getAllCategories, getCategoryBySlug } from '@/services/categoryService';

// جلب جميع الفئات
const categories = await getAllCategories();

// جلب فئة محددة
const category = await getCategoryBySlug('politics');
```

### إضافة وتحديث الأخبار

```typescript
import { addNews, updateNews, deleteNews } from '@/services/newsService';

// إضافة خبر جديد
const newNews = await addNews({
  title: 'عنوان الخبر',
  excerpt: 'ملخص الخبر',
  content: 'محتوى الخبر',
  category_id: 'category-id',
  image: 'https://example.com/image.jpg',
  is_top_story: false,
  is_breaking: true
});

// تحديث خبر
const updatedNews = await updateNews('news-id', {
  title: 'عنوان الخبر المحدث',
  excerpt: 'ملخص الخبر المحدث'
});

// حذف خبر
await deleteNews('news-id');
```

## الملاحظات

- تأكد من وجود ملف `.env` مع متغيرات البيئة الصحيحة.
- تأكد من تنفيذ ملفات SQL لإنشاء الجداول وسياسات الأمان.
- استخدم صفحة اختبار الاتصال للتحقق من صحة الإعداد.
- إذا واجهت مشاكل، تحقق من سجلات وحدة تحكم المتصفح للحصول على تفاصيل الأخطاء.

## المساعدة والدعم

إذا واجهت أي مشاكل أو كان لديك أي استفسارات، يرجى التواصل مع فريق الدعم.
