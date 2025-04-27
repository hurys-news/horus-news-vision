
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NewsCard, { NewsItem } from '../components/NewsCard';
import AdBlock from '../components/AdBlock';
import { Filter, ArrowDown } from 'lucide-react';
import CategoryCardsSection from '@/components/CategoryCardsSection';

// البيانات التجريبية للأخبار في كل قسم
const categoryNewsData: Record<string, NewsItem[]> = {
  politics: [
    {
      id: '101',
      title: 'الرئيس المصري يزور البرلمان الأوروبي ويلقي كلمة حول التعاون المشترك',
      excerpt: 'في إطار جولته الأوروبية، ألقى الرئيس المصري كلمة أمام البرلمان الأوروبي في بروكسل حول آفاق التعاون المشترك.',
      category: 'سياسة',
      image: 'https://source.unsplash.com/random/800x600/?parliament',
      date: 'منذ 8 ساعات'
    },
    {
      id: '102',
      title: 'انتخابات برلمانية مبكرة في تونس وسط توترات سياسية',
      excerpt: 'دعت الرئاسة التونسية إلى انتخابات برلمانية مبكرة في ظل استمرار الأزمة السياسية في البلاد.',
      category: 'سياسة',
      image: 'https://source.unsplash.com/random/800x600/?voting',
      date: 'منذ 10 ساعات'
    },
    {
      id: '103',
      title: 'الاتحاد الأوروبي يقر حزمة مساعدات جديدة للأردن ولبنان',
      excerpt: 'وافق الاتحاد الأوروبي على حزمة مساعدات جديدة بقيمة 700 مليون يورو للأردن ولبنان لدعم التنمية الاقتصادية وإدارة أزمة اللاجئين.',
      category: 'سياسة',
      image: 'https://source.unsplash.com/random/800x600/?eu',
      date: 'منذ 12 ساعة'
    },
    {
      id: '104',
      title: 'اجتماع مجلس الأمن لمناقشة التطورات الإقليمية في الشرق الأوسط',
      excerpt: 'عقد مجلس الأمن الدولي اجتماعاً طارئاً لمناقشة التطورات الأخيرة في منطقة الشرق الأوسط وسبل تحقيق الاستقرار.',
      category: 'سياسة',
      image: 'https://source.unsplash.com/random/800x600/?un',
      date: 'منذ يومين'
    },
    {
      id: '105',
      title: 'قمة ثلاثية بين مصر والأردن والعراق لتعزيز التعاون المشترك',
      excerpt: 'عقدت قمة ثلاثية في العاصمة الأردنية عمان بين قادة مصر والأردن والعراق لبحث سبل تعزيز التعاون المشترك في مختلف المجالات.',
      category: 'سياسة',
      image: 'https://source.unsplash.com/random/800x600/?meeting',
      date: 'منذ 3 أيام'
    },
    {
      id: '106',
      title: 'مجلس التعاون الخليجي يؤكد دعمه للمبادرة العربية للسلام',
      excerpt: 'أكد مجلس التعاون الخليجي في بيان صدر عقب اجتماعه الدوري دعمه الكامل للمبادرة العربية للسلام كأساس لحل القضية الفلسطينية.',
      category: 'سياسة',
      image: 'https://source.unsplash.com/random/800x600/?gcc',
      date: 'منذ 4 أيام'
    }
  ],
  economy: [
    {
      id: '201',
      title: 'البنك المركزي المصري يخفض سعر الفائدة بمقدار 50 نقطة أساس',
      excerpt: 'قرر البنك المركزي المصري خفض سعر الفائدة الرئيسي بمقدار 50 نقطة أساس في اجتماعه الأخير، وسط توقعات بتراجع معدل التضخم.',
      category: 'اقتصاد',
      image: 'https://source.unsplash.com/random/800x600/?bank',
      date: 'منذ 6 ساعات'
    },
    {
      id: '202',
      title: 'إطلاق صندوق استثماري سعودي إماراتي بقيمة 10 مليارات دولار',
      excerpt: 'أعلنت السعودية والإمارات عن إطلاق صندوق استثماري مشترك بقيمة 10 مليارات دولار لتمويل مشاريع التكنولوجيا والطاقة المتجددة.',
      category: 'اقتصاد',
      image: 'https://source.unsplash.com/random/800x600/?investment',
      date: 'منذ 9 ساعات'
    },
    {
      id: '203',
      title: 'ارتفاع مؤشرات البورصات العربية مع تحسن أسعار النفط العالمية',
      excerpt: 'سجلت مؤشرات البورصات العربية الرئيسية ارتفاعاً ملحوظاً خلال تعاملات اليوم، مدعومة بتحسن أسعار النفط في الأسواق العالمية.',
      category: 'اقتصاد',
      image: 'https://source.unsplash.com/random/800x600/?stock-market',
      date: 'منذ 14 ساعة'
    },
    {
      id: '204',
      title: 'المغرب يطلق استراتيجية وطنية لتعزيز الصادرات الزراعية',
      excerpt: 'كشفت الحكومة المغربية عن استراتيجية وطنية جديدة تهدف إلى زيادة صادراتها الزراعية بنسبة 30% خلال السنوات الخمس المقبلة.',
      category: 'اقتصاد',
      image: 'https://source.unsplash.com/random/800x600/?agriculture',
      date: 'منذ يوم واحد'
    },
    {
      id: '205',
      title: 'قطر تعتزم استثمار 5 مليارات دولار في مشاريع الطاقة المتجددة',
      excerpt: 'أعلنت قطر عن خطط لاستثمار 5 مليارات دولار في مشاريع الطاقة المتجددة خلال السنوات الخمس المقبلة، في إطار استراتيجيتها لتنويع مصادر الطاقة.',
      category: 'اقتصاد',
      image: 'https://source.unsplash.com/random/800x600/?solar',
      date: 'منذ يومين'
    }
  ],
  tech: [
    {
      id: '301',
      title: 'إطلاق أول منصة عربية للذكاء الاصطناعي التوليدي بكفاءات محلية',
      excerpt: 'أعلنت شركة تقنية عربية ناشئة عن إطلاق أول منصة للذكاء الاصطناعي التوليدي باللغة العربية، مطورة بالكامل بكفاءات محلية.',
      category: 'تكنولوجيا',
      image: 'https://source.unsplash.com/random/800x600/?ai',
      date: 'منذ 4 ساعات'
    },
    {
      id: '302',
      title: 'دبي تفتتح أكبر مختبر للمدن الذكية في المنطقة العربية',
      excerpt: 'افتتحت إمارة دبي أكبر مختبر للمدن الذكية في المنطقة العربية، يهدف إلى اختبار وتطوير حلول تكنولوجية مبتكرة للمدن المستقبلية.',
      category: 'تكنولوجيا',
      image: 'https://source.unsplash.com/random/800x600/?smart-city',
      date: 'منذ 11 ساعة'
    },
    {
      id: '303',
      title: 'السعودية تستثمر 6 مليارات دولار في تقنيات الحوسبة السحابية',
      excerpt: 'أعلنت المملكة العربية السعودية عن خطة استثمارية بقيمة 6 مليارات دولار لتطوير بنية تحتية متطورة للحوسبة السحابية.',
      category: 'تكنولوجيا',
      image: 'https://source.unsplash.com/random/800x600/?cloud-computing',
      date: 'منذ 16 ساعة'
    },
    {
      id: '304',
      title: 'إطلاق أول مركز عربي متخصص في أمن الفضاء السيبراني',
      excerpt: 'أعلنت جامعة الملك عبد الله للعلوم والتقنية عن إطلاق أول مركز عربي متخصص في أمن الفضاء السيبراني، بالتعاون مع شركات عالمية.',
      category: 'تكنولوجيا',
      image: 'https://source.unsplash.com/random/800x600/?cybersecurity',
      date: 'منذ يومين'
    }
  ],
  sports: [
    {
      id: '401',
      title: 'الأهلي يحقق فوزاً مثيراً على الزمالك في قمة الدوري',
      excerpt: 'فاز النادي الأهلي على غريمه التقليدي الزمالك بنتيجة 3-2 في مباراة مثيرة أقيمت على استاد القاهرة',
      category: 'رياضة',
      image: 'https://source.unsplash.com/random/800x600/?soccer',
      date: 'منذ 3 ساعات'
    },
    {
      id: '402',
      title: 'ليفربول يعزز صدارته للدوري الإنجليزي بفوز جديد',
      excerpt: 'حقق فريق ليفربول فوزاً مهماً على مانشستر سيتي ليعزز موقعه في صدارة الدوري الإنجليزي الممتاز',
      category: 'رياضة',
      image: 'https://source.unsplash.com/random/800x600/?football',
      date: 'منذ 5 ساعات'
    },
    {
      id: '403',
      title: 'ميسي يقود باريس سان جيرمان لفوز كبير في دوري الأبطال',
      excerpt: 'سجل ليونيل ميسي هدفين رائعين ليقود فريقه لفوز كبير في منافسات دوري أبطال أوروبا',
      category: 'رياضة',
      image: 'https://source.unsplash.com/random/800x600/?messi',
      date: 'منذ 8 ساعات'
    }
  ]
};

// ترجمة مسارات الأقسام إلى العربية
const categoryNameMap: Record<string, string> = {
  politics: 'سياسة',
  economy: 'اقتصاد',
  tech: 'تكنولوجيا',
  sports: 'رياضة'
};

// قائمة التصفية للفرز
const sortOptions = [
  { id: 'newest', name: 'الأحدث أولاً' },
  { id: 'oldest', name: 'الأقدم أولاً' },
  { id: 'mostViewed', name: 'الأكثر مشاهدة' }
];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSort, setSelectedSort] = useState('newest');
  const [showFilter, setShowFilter] = useState(false);

  // الحصول على بيانات القسم
  const categorySlug = slug || 'politics';
  const categoryNews = categoryNewsData[categorySlug] || [];
  const categoryName = categoryNameMap[categorySlug] || 'غير معروف';

  // تصفية وفرز الأخبار
  const sortNews = (news: NewsItem[]) => {
    const newsCopy = [...news];
    switch (selectedSort) {
      case 'newest':
        return newsCopy.sort((a, b) => a.date.localeCompare(b.date));
      case 'oldest':
        return newsCopy.sort((a, b) => b.date.localeCompare(a.date));
      case 'mostViewed':
        // في التطبيق الفعلي، سيتم فرز الأخبار حسب المشاهدات
        return newsCopy;
      default:
        return newsCopy;
    }
  };

  const sortedNews = sortNews(categoryNews);

  return (
    <>
      <Header />

      <main className="min-h-screen py-6">
        <div className="container mx-auto">
          {/* رأس الصفحة مع اسم القسم */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold inline-block bg-horus-red/10 text-horus-red px-4 py-2 rounded-lg">
                {categoryName}
              </h1>
            </div>

            {/* زر الفلترة */}
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>فرز حسب</span>
              </button>

              {showFilter && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedSort(option.id);
                          setShowFilter(false);
                        }}
                        className={`block w-full text-right px-4 py-2 text-sm ${
                          selectedSort === option.id
                            ? 'bg-gray-100 text-horus-red'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* إعلان علوي */}
          <AdBlock adSlot={`category-${categorySlug}-top`} format="horizontal" className="mb-8" />

          {/* عرض الأخبار */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              {/* استخدام مكون CategoryCardsSection للأقسام ماعدا السياسة والاقتصاد */}
              {categorySlug !== 'politics' && categorySlug !== 'economy' ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {sortedNews.map((news) => (
                      <div key={news.id} className="group">
                        <a href={`/news/${news.id}`} className="block">
                          <div className="relative overflow-hidden rounded-md mb-3">
                            <img
                              src={news.image}
                              alt={news.title}
                              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-0 right-0 bg-horus-blue text-white px-2 py-1 text-sm">
                              {news.category}
                            </div>
                          </div>
                          <h3 className="font-bold text-base mb-2 group-hover:text-horus-blue transition-colors line-clamp-2">
                            {news.title}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="flex items-center">
                              <span className="ml-1">🕒</span>
                              {news.date}
                            </span>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* إعلان بين الأخبار */}
                  <div className="my-6">
                    <AdBlock adSlot={`category-${categorySlug}-middle`} format="horizontal" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedNews.map((news, index) => (
                    <div key={news.id}>
                      <NewsCard news={news} size={index === 0 ? 'large' : 'medium'} />

                      {/* إعلان بين الأخبار */}
                      {index === 2 && (
                        <div className="col-span-1 md:col-span-2 my-6">
                          <AdBlock adSlot={`category-${categorySlug}-middle`} format="horizontal" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* زر تحميل المزيد */}
              <div className="mt-8 text-center">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg flex items-center mx-auto transition-colors">
                  تحميل المزيد
                  <ArrowDown className="mr-2 h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="lg:w-1/4">
              {/* إعلان جانبي */}
              <AdBlock adSlot={`category-${categorySlug}-sidebar`} format="vertical" className="sticky top-24" />

              {/* أقسام أخرى */}
              <div className="bg-gray-50 p-4 rounded-lg mt-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">أقسام أخرى</h3>
                <div className="space-y-2">
                  {Object.entries(categoryNameMap).map(([key, value]) => (
                    <a
                      key={key}
                      href={`/category/${key}`}
                      className={`block p-2 rounded-md transition-colors ${
                        key === categorySlug
                          ? 'bg-horus-red/10 text-horus-red font-bold'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {value}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CategoryPage;
