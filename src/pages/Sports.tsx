
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trophy, Dumbbell, Medal } from 'lucide-react'; // استخدام أيقونات متوفرة بديلة
import AdBlock from '../components/AdBlock';

// نماذج أخبار رياضية
const sportsNews = {
  football: [
    {
      id: 1,
      title: 'الأهلي يحقق فوزاً مثيراً على الزمالك في قمة الدوري',
      excerpt: 'فاز النادي الأهلي على غريمه التقليدي الزمالك بنتيجة 3-2 في مباراة مثيرة أقيمت على استاد القاهرة',
      date: 'منذ 3 ساعات',
      category: 'كرة القدم',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'ليفربول يعزز صدارته للدوري الإنجليزي بفوز جديد',
      excerpt: 'حقق فريق ليفربول فوزاً مهماً على مانشستر سيتي ليعزز موقعه في صدارة الدوري الإنجليزي الممتاز',
      date: 'منذ 5 ساعات',
      category: 'كرة القدم',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'ميسي يقود باريس سان جيرمان لفوز كبير في دوري الأبطال',
      excerpt: 'سجل ليونيل ميسي هدفين رائعين ليقود فريقه لفوز كبير في منافسات دوري أبطال أوروبا',
      date: 'منذ 8 ساعات',
      category: 'كرة القدم',
      image: '/placeholder.svg'
    },
  ],
  basketball: [
    {
      id: 4,
      title: 'الأهلي يتوج بلقب الدوري المصري لكرة السلة',
      excerpt: 'توج فريق الأهلي بلقب الدوري المصري لكرة السلة بعد الفوز في المباراة النهائية',
      date: 'منذ يومين',
      category: 'كرة السلة',
      image: '/placeholder.svg'
    },
    {
      id: 5,
      title: 'ليكرز يحقق فوزاً صعباً في دوري NBA',
      excerpt: 'حقق فريق لوس أنجلوس ليكرز فوزاً صعباً على بوسطن سيلتيكس في دوري كرة السلة الأمريكي',
      date: 'منذ 3 أيام',
      category: 'كرة السلة',
      image: '/placeholder.svg'
    },
  ],
  tennis: [
    {
      id: 6,
      title: 'جابر تصل إلى نهائي بطولة ويمبلدون وتكتب التاريخ',
      excerpt: 'أصبحت أنس جابر أول لاعبة عربية تصل إلى نهائي بطولة ويمبلدون للتنس',
      date: 'منذ 4 أيام',
      category: 'تنس',
      image: '/placeholder.svg'
    },
    {
      id: 7,
      title: 'نادال ينسحب من بطولة أستراليا المفتوحة بسبب الإصابة',
      excerpt: 'أعلن النجم الإسباني رافائيل نادال انسحابه من بطولة أستراليا المفتوحة للتنس بسبب الإصابة',
      date: 'منذ أسبوع',
      category: 'تنس',
      image: '/placeholder.svg'
    },
  ],
  olympics: [
    {
      id: 8,
      title: 'مصر تحصد 5 ميداليات متنوعة في أولمبياد باريس',
      excerpt: 'حققت مصر إنجازاً تاريخياً بالحصول على 5 ميداليات متنوعة في منافسات أولمبياد باريس',
      date: 'منذ أسبوعين',
      category: 'الألعاب الأولمبية',
      image: '/placeholder.svg'
    },
  ]
};

// مكون لعرض قطعة خبر رياضي
const SportNewsCard = ({ news }) => {
  return (
    <div className="news-card bg-white">
      <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="category-badge bg-horus-red/10 text-horus-red">{news.category}</span>
        <h3 className="news-title mt-2">{news.title}</h3>
        <p className="news-excerpt mt-2">{news.excerpt}</p>
        <div className="news-meta mt-3">{news.date}</div>
      </div>
    </div>
  );
};

const Sports = () => {
  const [categories] = useState({
    'كرة القدم': sportsNews.football,
    'كرة السلة': sportsNews.basketball,
    'تنس': sportsNews.tennis,
    'الألعاب الأولمبية': sportsNews.olympics,
  });

  // إضافة أيقونات للفئات الرياضية
  const categoryIcons = {
    'كرة القدم': <Trophy className="ml-2 inline-block" size={18} />,
    'كرة السلة': <Dumbbell className="ml-2 inline-block" size={18} />,
    'تنس': <Medal className="ml-2 inline-block" size={18} />,
    'الألعاب الأولمبية': <Trophy className="ml-2 inline-block" size={18} />,
  };

  return (
    <>
      <Header />

      <main className="min-h-screen py-6">
        <div className="container mx-auto">
          <h1 className="section-title text-2xl md:text-3xl mb-8">قسم الرياضة</h1>

          {/* إعلان أفقي علوي باستخدام مكون AdBlock */}
          <AdBlock adSlot="sports-top-banner" format="horizontal" className="mb-8" />

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              <Tab.Group>
                <Tab.List className="flex space-x-1 space-x-reverse rounded-xl bg-horus-blue/10 p-1 mb-6">
                  {Object.keys(categories).map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                         ${selected
                          ? 'bg-white shadow text-horus-red'
                          : 'text-horus-blue hover:bg-white/[0.12] hover:text-horus-red'
                        }`
                      }
                    >
                      {categoryIcons[category]} {category}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                  {Object.values(categories).map((posts, idx) => (
                    <Tab.Panel
                      key={idx}
                      className="rounded-xl bg-white p-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.map((post) => (
                          <SportNewsCard key={post.id} news={post} />
                        ))}
                      </div>
                      
                      {/* إعلان أفقي وسط المحتوى باستخدام مكون AdBlock */}
                      {idx === 0 && <AdBlock adSlot="sports-middle-banner" format="horizontal" className="my-8" />}
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </div>
            
            <div className="md:w-1/4">
              {/* إعلان عمودي في الشريط الجانبي باستخدام مكون AdBlock */}
              <AdBlock adSlot="sports-sidebar" format="vertical" className="mb-6" />
              
              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <h3 className="font-bold text-lg mb-4">أحدث النتائج</h3>
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="text-sm font-bold">الأهلي 3 - 2 الزمالك</p>
                    <p className="text-xs text-gray-500">الدوري المصري</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="text-sm font-bold">ريال مدريد 2 - 1 برشلونة</p>
                    <p className="text-xs text-gray-500">الدوري الإسباني</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="text-sm font-bold">مانشستر سيتي 0 - 1 ليفربول</p>
                    <p className="text-xs text-gray-500">الدوري الإنجليزي</p>
                  </div>
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

export default Sports;
