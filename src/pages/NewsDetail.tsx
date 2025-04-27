
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, ThumbsUp, MessageSquare, Bookmark, Eye, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBlock from '@/components/AdBlock';
import { NewsItem } from '@/lib/types';
import NewsCard from '@/components/NewsCard';
import { Separator } from '@/components/ui/separator';
import RelatedNewsList from '@/components/RelatedNewsList';
import NewsComments from '@/components/NewsComments';
import { useApi } from '@/hooks/useApi';
import { getNewsById, getNewsByCategory } from '@/lib/api';

// بيانات تجريبية للخبر التفصيلي
const newsData = {
  '1': {
    id: '1',
    title: 'توقيع اتفاقية التعاون الاقتصادي بين مصر والإمارات بقيمة 20 مليار دولار',
    fullContent: `
      <p>في خطوة تاريخية لتعزيز العلاقات الاقتصادية بين البلدين، وقعت مصر والإمارات اليوم اتفاقية تعاون اقتصادي شاملة بقيمة 20 مليار دولار أمريكي. وقد حضر مراسم التوقيع كبار المسؤولين من الجانبين في العاصمة المصرية القاهرة.</p>

      <p>تهدف هذه الاتفاقية إلى تمويل مشاريع استراتيجية في مجالات حيوية تشمل الطاقة المتجددة والتصنيع والتكنولوجيا والسياحة، مما سيساهم في دفع عجلة التنمية الاقتصادية وخلق آلاف فرص العمل للشباب المصري.</p>

      <p>وصرح وزير الاقتصاد المصري في مؤتمر صحفي عقب التوقيع: "تمثل هذه الاتفاقية نقلة نوعية في مسيرة التعاون الاقتصادي بين مصر والإمارات، وتؤكد عمق العلاقات التاريخية التي تربط بين البلدين الشقيقين. نتطلع إلى البدء الفوري في تنفيذ المشاريع المتفق عليها لتحقيق المنفعة المتبادلة وتعزيز التنمية المستدامة في المنطقة."</p>

      <p>من جانبه، أكد وزير الاقتصاد الإماراتي أن هذه الاتفاقية تأتي في إطار استراتيجية دولة الإمارات لتعزيز الشراكات الاقتصادية مع الدول العربية الشقيقة، مشيراً إلى أن المشاريع المزمع تنفيذها ستكون ذات عائد استثماري مجزٍ للجانبين، وستسهم في تعزيز التكامل الاقتصادي العربي.</p>

      <p>وتتضمن الاتفاقية إنشاء صندوق استثماري مشترك بقيمة 10 مليارات دولار لتمويل مشاريع البنية التحتية والطاقة، وتخصيص 5 مليارات دولار لمشاريع التكنولوجيا والابتكار، إضافة إلى 3 مليارات دولار لتطوير قطاع السياحة، و2 مليار دولار لمشاريع التصنيع والزراعة.</p>

      <p>ومن المتوقع أن تسهم هذه الاتفاقية في زيادة حجم التبادل التجاري بين البلدين بنسبة 30% خلال السنوات الثلاث المقبلة، وجذب استثمارات إضافية من القطاع الخاص في كلا البلدين.</p>

      <p>يذكر أن هذه الاتفاقية تأتي ضمن سلسلة من الاتفاقيات الاقتصادية التي وقعتها مصر مؤخراً مع عدد من الدول العربية والأجنبية، في إطار خطة الإصلاح الاقتصادي الشامل التي تنفذها الحكومة المصرية.</p>
    `,
    excerpt: 'تم توقيع اتفاقية تعاون اقتصادي بين مصر والإمارات بقيمة 20 مليار دولار، تشمل مشاريع في مجالات الطاقة المتجددة والتصنيع والتكنولوجيا والسياحة.',
    category: 'اقتصاد',
    image: 'https://source.unsplash.com/random/800x600/?business',
    date: '15 أبريل 2023',
    author: 'محمد علي',
    views: 1250,
    likes: 340,
    comments: 52,
    tags: ['اقتصاد', 'استثمار', 'مصر', 'الإمارات']
  },
  '2': {
    id: '2',
    title: 'انطلاق فعاليات مؤتمر القمة العربية في الرياض بمشاركة 18 دولة',
    fullContent: `
      <p>انطلقت اليوم فعاليات مؤتمر القمة العربية في العاصمة السعودية الرياض، بمشاركة قادة 18 دولة عربية، لمناقشة التحديات الإقليمية الراهنة وسبل تعزيز التعاون العربي المشترك.</p>

      <p>وافتتح خادم الحرمين الشريفين المؤتمر بكلمة رحب فيها بالقادة العرب، مؤكداً أهمية تضافر الجهود العربية لمواجهة التحديات المشتركة والحفاظ على أمن واستقرار المنطقة.</p>

      <p>وتتضمن أجندة المؤتمر مناقشة عدة ملفات هامة، أبرزها الأزمات السياسية في المنطقة، ومكافحة الإرهاب، وتعزيز التعاون الاقتصادي والتجاري بين الدول العربية، إضافة إلى مناقشة التطورات الأخيرة في القضية الفلسطينية.</p>
    `,
    excerpt: 'بدأت اليوم فعاليات مؤتمر القمة العربية في العاصمة السعودية الرياض، بمشاركة قادة 18 دولة عربية لمناقشة التحديات الإقليمية الراهنة.',
    category: 'سياسة',
    image: 'https://source.unsplash.com/random/800x600/?conference',
    date: '10 أبريل 2023',
    author: 'أحمد خالد',
    views: 980,
    likes: 230,
    comments: 38,
    tags: ['سياسة', 'القمة العربية', 'الرياض', 'التعاون العربي']
  }
};

// دالة للحصول على أخبار ذات صلة (تجريبية)
const getRelatedNews = (currentId: string, category: string): NewsItem[] => {
  // في التطبيق الحقيقي، سيتم جلب البيانات من API
  return [
    {
      id: '5',
      title: 'الإمارات تطلق استراتيجية جديدة للطاقة المتجددة بأهداف طموحة',
      excerpt: 'أعلنت دولة الإمارات عن إطلاق استراتيجية جديدة للطاقة المتجددة تهدف إلى زيادة الاعتماد على مصادر الطاقة النظيفة بنسبة 50% بحلول عام 2030.',
      category,
      image: 'https://source.unsplash.com/random/800x600/?renewable',
      date: 'منذ 3 أيام'
    },
    {
      id: '6',
      title: 'مصر تخطط لإقامة 7 مدن صناعية جديدة بتمويل أجنبي',
      excerpt: 'كشفت الحكومة المصرية عن خطط طموحة لإقامة 7 مدن صناعية جديدة في مختلف المحافظات بتمويل أجنبي يصل إلى 15 مليار دولار.',
      category,
      image: 'https://source.unsplash.com/random/800x600/?industry',
      date: 'منذ 5 أيام'
    },
    {
      id: '7',
      title: 'البنك الدولي: الاقتصاد العربي سيشهد نمواً بنسبة 4.5% خلال العام الجاري',
      excerpt: 'توقع البنك الدولي في تقريره الأخير أن يشهد الاقتصاد العربي نمواً بنسبة 4.5% خلال العام الجاري، مدفوعاً بارتفاع أسعار النفط والإصلاحات الاقتصادية.',
      category,
      image: 'https://source.unsplash.com/random/800x600/?economy',
      date: 'منذ أسبوع'
    },
  ];
};

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();

  // استخدام API لجلب تفاصيل الخبر
  const { data: news, isLoading: isNewsLoading, error: newsError } = useApi<NewsItem>(
    () => getNewsById(id || '1'),
    { dependencies: [id] }
  );

  // استخدام API لجلب الأخبار ذات الصلة
  const { data: relatedNewsResponse, isLoading: isRelatedLoading } = useApi(
    () => news ? getNewsByCategory(news.categorySlug, 1, 3) : Promise.resolve({ data: [], meta: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 3 } }),
    { dependencies: [news] }
  );

  // استخراج الأخبار ذات الصلة من الاستجابة
  const relatedNews = relatedNewsResponse?.data || [];

  // حالة التحميل الإجمالية
  const isLoading = isNewsLoading || isRelatedLoading;

  useEffect(() => {
    // إعادة التمرير إلى أعلى الصفحة عند تغيير المقال
    window.scrollTo(0, 0);

    // عنوان الصفحة للـ SEO
    if (news) {
      document.title = `${news.title} | حورس نيوز`;
    }
  }, [news, id]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-6">
          <div className="container mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (newsError || !news) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-6">
          <div className="container mx-auto text-center py-12">
            <h2 className="text-2xl font-bold mb-4">الخبر غير موجود</h2>
            <p className="mb-6">عذراً، لم نتمكن من العثور على الخبر المطلوب.</p>
            <Link to="/" className="bg-horus-red text-white px-6 py-2 rounded-md hover:bg-horus-red/90 transition-colors">
              العودة للرئيسية
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen py-6">
        <div className="container mx-auto">
          {/* التنقل وفئة المقال */}
          <div className="mb-4 flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-2 space-x-reverse mb-2 md:mb-0">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-horus-red transition-colors text-sm"
              >
                <ArrowLeft className="ml-1 h-4 w-4" />
                العودة للرئيسية
              </Link>
              <span className="text-gray-400 mx-2">/</span>
              <Link
                to={`/${news.categorySlug || news.category.toLowerCase()}`}
                className="text-gray-600 hover:text-horus-red transition-colors text-sm"
              >
                {news.category}
              </Link>
            </div>

            <span className={`category-badge bg-horus-red/10 text-horus-red px-3 py-1 rounded-full`}>
              {news.category}
            </span>
          </div>

          {/* عنوان المقال */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            {news.title}
          </h1>

          {/* معلومات المقال والمشاركة */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex items-center space-x-4 space-x-reverse mb-2 md:mb-0">
              <span className="flex items-center text-gray-600 text-sm">
                <Calendar className="ml-1 h-4 w-4" />
                {news.date}
              </span>
              {news.author && (
                <span className="text-gray-600 text-sm">
                  بواسطة: {typeof news.author === 'string' ? news.author : news.author.name}
                </span>
              )}
              {news.source && (
                <span className="text-gray-600 text-sm">
                  المصدر: {news.source}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 space-x-reverse">
              <button className="flex items-center text-gray-600 hover:text-horus-red transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="flex items-center text-gray-600 hover:text-horus-red transition-colors">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* إعلان علوي */}
          <AdBlock adSlot="news-top-banner" format="horizontal" className="mb-6" />

          {/* صورة المقال */}
          <div className="relative aspect-video w-full mb-6 overflow-hidden rounded-lg">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* محتوى المقال */}
          <div className="prose prose-lg max-w-none mb-8">
            {news.content ? (
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            ) : (
              <p>{news.excerpt}</p>
            )}
          </div>

          {/* وسوم المقال */}
          {news.tags && news.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">الوسوم:</h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    to={`/tag/${tag}`}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* إحصائيات المقال */}
          <div className="flex items-center space-x-6 space-x-reverse py-4 mb-6">
            {news.viewCount !== undefined && (
              <div className="flex items-center space-x-1 space-x-reverse">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 text-sm">{news.viewCount} مشاهدة</span>
              </div>
            )}
            <div className="flex items-center space-x-1 space-x-reverse">
              <ThumbsUp className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 text-sm">0 إعجاب</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 text-sm">0 تعليق</span>
            </div>
          </div>

          {/* إعلان وسط المحتوى */}
          <AdBlock adSlot="news-middle-banner" format="horizontal" className="my-8" />

          {/* الأخبار ذات الصلة */}
          {relatedNews.length > 0 && (
            <>
              <Separator className="my-8" />
              <RelatedNewsList news={relatedNews} />
            </>
          )}

          {/* قسم التعليقات */}
          <Separator className="my-8" />
          <NewsComments newsId={news.id} commentsCount={0} />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default NewsDetail;
