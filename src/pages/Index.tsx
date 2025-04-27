
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingNews from '@/components/BreakingNews';
import FeaturedNews from '@/components/FeaturedNews';
import CategorySection from '@/components/CategorySection';
import CategoryNewsSection from '@/components/CategoryNewsSection';
import CategoryCardsSection from '@/components/CategoryCardsSection';
import OpinionSection from '@/components/OpinionSection';
import SubscribeSection from '@/components/SubscribeSection';
import FooterAdmin from '@/components/FooterAdmin';
import MainSlider from '@/components/MainSlider';
import LatestNews from '@/components/LatestNews';
import CurrencyGoldPrices from '@/components/CurrencyGoldPrices';
import TodayMatches from '@/components/TodayMatches';
import PollWidget from '@/components/PollWidget';
import VideoSection from '@/components/VideoSection';
import PhotoGallerySection from '@/components/PhotoGallerySection';
import { NewsItem } from '@/lib/types';
import { useApi } from '@/hooks/useApi';
import { getNews } from '@/lib/api';

// بيانات وهمية للأخبار المميزة
const featuredNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'توقيع اتفاقية التعاون الاقتصادي بين مصر والإمارات بقيمة 20 مليار دولار',
    excerpt: 'تم توقيع اتفاقية تعاون اقتصادي بين مصر والإمارات بقيمة 20 مليار دولار، تشمل مشاريع في مجالات الطاقة المتجددة والتصنيع والتكنولوجيا والسياحة.',
    category: 'اقتصاد',
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 3 ساعات'
  },
  {
    id: '2',
    title: 'انطلاق فعاليات مؤتمر القمة العربية في الرياض بمشاركة 18 دولة',
    excerpt: 'بدأت اليوم فعاليات مؤتمر القمة العربية في العاصمة السعودية الرياض، بمشاركة قادة 18 دولة عربية لمناقشة التحديات الإقليمية الراهنة.',
    category: 'سياسة',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 5 ساعات'
  },
  {
    id: '3',
    title: 'إطلاق أول قمر صناعي عربي مشترك لرصد التغيرات المناخية في المنطقة',
    excerpt: 'أعلنت وكالات الفضاء في كل من الإمارات ومصر والسعودية عن إطلاق أول قمر صناعي عربي مشترك مخصص لرصد التغيرات المناخية في المنطقة العربية.',
    category: 'تكنولوجيا',
    image: 'https://images.unsplash.com/photo-1516849677043-ef67c9557e16?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ يوم واحد'
  },
  {
    id: '4',
    title: 'افتتاح أكبر متحف للفن العربي المعاصر في الدوحة',
    excerpt: 'افتتحت دولة قطر أكبر متحف للفن العربي المعاصر في الدوحة، يضم أكثر من 3000 قطعة فنية لفنانين من مختلف أنحاء العالم العربي.',
    category: 'ثقافة',
    image: 'https://images.unsplash.com/photo-1566054757965-8c4085344c96?q=80&w=2069&auto=format&fit=crop',
    date: 'منذ يومين'
  },
  {
    id: '5',
    title: 'إطلاق مبادرة عربية موحدة لمكافحة التصحر وحماية التنوع البيولوجي',
    excerpt: 'أعلنت جامعة الدول العربية عن إطلاق مبادرة موحدة لمكافحة التصحر وحماية التنوع البيولوجي في المنطقة العربية بتمويل قدره 500 مليون دولار.',
    category: 'بيئة',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format&fit=crop',
    date: 'منذ 3 أيام'
  },
  {
    id: '6',
    title: 'انطلاق فعاليات المنتدى الاقتصادي العربي في دبي بمشاركة 30 دولة',
    excerpt: 'بدأت اليوم فعاليات المنتدى الاقتصادي العربي في دبي بمشاركة ممثلين عن 30 دولة لمناقشة سبل تعزيز التعاون الاقتصادي العربي المشترك.',
    category: 'اقتصاد',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 4 ساعات'
  }
];

// بيانات وهمية للأخبار السياسية (تحديثها لتعكس التصنيفات الجديدة)
const politicsNewsData: NewsItem[] = [
  {
    id: '4',
    title: 'الرئيس المصري يزور البرلمان الأوروبي ويلقي كلمة حول التعاون المشترك',
    excerpt: 'في إطار جولته الأوروبية، ألقى الرئيس المصري كلمة أمام البرلمان الأوروبي في بروكسل حول آفاق التعاون المشترك.',
    category: 'سياسة',
    image: 'https://images.unsplash.com/photo-1616499452581-cc7f8e3dd3c9?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 8 ساعات',
    isTopStory: true
  },
  {
    id: '5',
    title: 'انتخابات برلمانية مبكرة في تونس وسط توترات سياسية',
    excerpt: 'دعت الرئاسة التونسية إلى انتخابات برلمانية مبكرة في ظل استمرار الأزمة السياسية في البلاد.',
    category: 'سياسة',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 10 ساعات'
  },
  {
    id: '6',
    title: 'الاتحاد الأوروبي يقر حزمة مساعدات جديدة للأردن ولبنان',
    excerpt: 'وافق الاتحاد الأوروبي على حزمة مساعدات جديدة بقيمة 700 مليون يورو للأردن ولبنان لدعم التنمية الاقتصادية وإدارة أزمة اللاجئين.',
    category: 'سياسة',
    image: 'https://images.unsplash.com/photo-1603826773128-fefac9bae57b?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 12 ساعة'
  },
  {
    id: '7',
    title: 'اجتماع مجلس الأمن لمناقشة التطورات الإقليمية في الشرق الأوسط',
    excerpt: 'عقد مجلس الأمن الدولي اجتماعاً طارئاً لمناقشة التطورات الأخيرة في منطقة الشرق الأوسط وسبل تحقيق الاستقرار.',
    category: 'سياسة',
    image: 'https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ يومين'
  }
];

// بيانات أخبار نبض الخبر (قسم جديد)
const pulseNewsData: NewsItem[] = [
  {
    id: '30',
    title: 'انطلاق مبادرة وطنية لتوظيف الشباب في القطاع التكنولوجي',
    excerpt: 'أعلنت وزارة التكنولوجيا عن إطلاق مبادرة وطنية لتدريب وتوظيف 10 آلاف شاب في مجالات التكنولوجيا المتقدمة خلال العام الحالي.',
    category: 'نبض الخبر',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ ساعتين',
    isBreaking: true
  },
  {
    id: '32',
    title: 'وزير الصحة يعلن عن حملة وطنية للتطعيم ضد الأمراض المستجدة',
    excerpt: 'أعلن وزير الصحة عن إطلاق حملة وطنية للتطعيم ضد الأمراض المستجدة، تستهدف تغطية أكثر من 5 ملايين مواطن خلال الشهرين القادمين.',
    category: 'نبض الخبر',
    image: 'https://images.unsplash.com/photo-1584118624012-df056829fbd0?q=80&w=2032&auto=format&fit=crop',
    date: 'منذ 8 ساعات'
  },
  {
    id: '33',
    title: 'وزارة التعليم تعتمد خطة لتطوير المناهج التعليمية في المراحل الأساسية',
    excerpt: 'اعتمدت وزارة التعليم خطة شاملة لتطوير المناهج التعليمية في المراحل الأساسية، بهدف مواكبة التطورات العالمية وتعزيز مهارات الطلاب.',
    category: 'نبض الخبر',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop',
    date: 'منذ 10 ساعات'
  },
  {
    id: '35',
    title: 'افتتاح أكبر مركز للابتكار في المنطقة العربية بالعاصمة',
    excerpt: 'تم افتتاح أكبر مركز للابتكار في المنطقة العربية بالعاصمة، يهدف إلى دعم الشركات الناشئة وتحفيز الإبداع في مختلف المجالات التكنولوجية.',
    category: 'نبض الخبر',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop',
    date: 'منذ 14 ساعة'
  }
];

// بيانات عمق الحدث (قسم جديد)
const depthNewsData: NewsItem[] = [
  {
    id: '36',
    title: 'تحقيق خاص: أزمة المياه في المنطقة العربية - تحديات وحلول',
    excerpt: 'تحقيق موسع يتناول أزمة المياه المتفاقمة في المنطقة العربية، ويستعرض التحديات الرئيسية والحلول المقترحة لمواجهة هذه الأزمة المستقبلية.',
    category: 'عمق الحدث',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2071&auto=format&fit=crop',
    date: 'منذ يوم واحد',
    isTopStory: true
  },
  {
    id: '37',
    title: 'داخل معامل الذكاء الاصطناعي العربية: الواقع والطموح',
    excerpt: 'جولة استقصائية في معامل ومراكز أبحاث الذكاء الاصطناعي في العالم العربي، والفجوة بين الطموحات الكبيرة والتحديات العملية.',
    category: 'عمق الحدث',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop',
    date: 'منذ 3 أيام'
  },
  {
    id: '38',
    title: 'النزوح السكاني والتغير المناخي: قصص من المناطق الأكثر تضرراً',
    excerpt: 'تقرير ميداني من المناطق الأكثر تضرراً بالتغير المناخي، وتأثيره على حركات النزوح السكاني والهجرة القسرية في المنطقة.',
    category: 'عمق الحدث',
    image: 'https://images.unsplash.com/photo-1469571486292-b53601010376?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 4 أيام'
  },
  {
    id: '39',
    title: 'الصناعات التقليدية العربية: كيف تواجه تحديات العولمة والاندثار؟',
    excerpt: 'استقصاء معمق حول مستقبل الصناعات التقليدية العربية في ظل تحديات العولمة والتكنولوجيا، وجهود الحفاظ على هذا الإرث الثقافي.',
    category: 'عمق الحدث',
    image: 'https://images.unsplash.com/photo-1590422749897-47036da0b0ff?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ أسبوع'
  },
  {
    id: '40',
    title: 'أزمة الطاقة في الدول النامية: تحديات الانتقال نحو مصادر الطاقة المتجددة',
    excerpt: 'تحقيق شامل حول تحديات الانتقال نحو مصادر الطاقة المتجددة في الدول النامية، والعقبات الاقتصادية والتقنية التي تواجهها.',
    category: 'عمق الحدث',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 10 أيام'
  },
  {
    id: '41',
    title: 'مستقبل التعليم العالي في العالم العربي: تحديات وفرص',
    excerpt: 'دراسة معمقة حول مستقبل التعليم العالي في العالم العربي، والتحديات التي تواجهه في ظل التطورات التكنولوجية والمتغيرات الاقتصادية.',
    category: 'عمق الحدث',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop',
    date: 'منذ أسبوعين'
  }
];

// بيانات صوت الشارع (قسم جديد)
const streetVoiceNewsData: NewsItem[] = [
  {
    id: '42',
    title: 'استطلاع: ارتفاع نسبة القلق من الأوضاع الاقتصادية بين الشباب',
    excerpt: 'كشف استطلاع حديث للرأي أجرته حورس نيوز ارتفاعاً ملحوظاً في نسبة القلق من الأوضاع الاقتصادية بين فئة الشباب، مع توقعات متباينة حول المستقبل.',
    category: 'صوت الشارع',
    image: 'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ يومين'
  },
  {
    id: '43',
    title: 'آراء المواطنين حول قرار رفع أسعار الوقود وتأثيره على المعيشة',
    excerpt: 'استطلاع ميداني لآراء المواطنين حول قرار رفع أسعار الوقود الأخير، وتأثيره على مستويات المعيشة والقدرة الشرائية في مختلف المناطق.',
    category: 'صوت الشارع',
    image: 'https://images.unsplash.com/photo-1602084977740-37b9d2bab858?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 4 أيام'
  },
  {
    id: '44',
    title: 'أهالي المناطق النائية يطالبون بتحسين الخدمات الصحية والتعليمية',
    excerpt: 'مطالبات متزايدة من سكان المناطق النائية بتحسين مستوى الخدمات الصحية والتعليمية، في ظل نقص البنية التحتية والموارد الأساسية.',
    category: 'صوت الشارع',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ أسبوع'
  },
  {
    id: '45',
    title: 'طموحات وتحديات: قصص نجاح لرواد أعمال شباب تحدوا الظروف',
    excerpt: 'مجموعة قصص ملهمة لرواد أعمال شباب استطاعوا تحدي الظروف الاقتصادية الصعبة وبناء مشاريع ناجحة في مختلف القطاعات.',
    category: 'صوت الشارع',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ أسبوعين'
  },
  {
    id: '46',
    title: 'استطلاع: 70% من المواطنين يؤيدون مشاريع التحول الرقمي الحكومية',
    excerpt: 'أظهر استطلاع للرأي أجرته حورس نيوز أن 70% من المواطنين يؤيدون مشاريع التحول الرقمي الحكومية، ويرون أنها ستسهم في تحسين جودة الخدمات.',
    category: 'صوت الشارع',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 3 أيام'
  },
  {
    id: '47',
    title: 'مبادرات شبابية تطوعية تنجح في تحسين البيئة المحلية في المدن الكبرى',
    excerpt: 'نجحت مجموعة من المبادرات الشبابية التطوعية في تحسين البيئة المحلية في المدن الكبرى من خلال حملات تنظيف وتشجير وتوعية بيئية.',
    category: 'صوت الشارع',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbafc3f4a?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 5 أيام'
  }
];

// بيانات وهمية للأخبار الاقتصادية
const economyNewsData: NewsItem[] = [
  {
    id: '8',
    title: 'البنك المركزي المصري يخفض سعر الفائدة بمقدار 50 نقطة أساس',
    excerpt: 'قرر البنك المركزي المصري خفض سعر الفائدة الرئيسي بمقدار 50 نقطة أساس في اجتماعه الأخير، وسط توقعات بتراجع معدل التضخم.',
    category: 'اقتصاد',
    image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 6 ساعات'
  },
  {
    id: '9',
    title: 'إطلاق صندوق استثماري سعودي إماراتي بقيمة 10 مليارات دولار',
    excerpt: 'أعلنت السعودية والإمارات عن إطلاق صندوق استثماري مشترك بقيمة 10 مليارات دولار لتمويل مشاريع التكنولوجيا والطاقة المتجددة.',
    category: 'اقتصاد',
    image: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 9 ساعات'
  },
  {
    id: '10',
    title: 'ارتفاع مؤشرات البورصات العربية مع تحسن أسعار النفط العالمية',
    excerpt: 'سجلت مؤشرات البورصات العربية الرئيسية ارتفاعاً ملحوظاً خلال تعاملات اليوم، مدعومة بتحسن أسعار النفط في الأسواق العالمية.',
    category: 'اقتصاد',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 14 ساعة'
  },
  {
    id: '11',
    title: 'المغرب يطلق استراتيجية وطنية لتعزيز الصادرات الزراعية',
    excerpt: 'كشفت الحكومة المغربية عن استراتيجية وطنية جديدة تهدف إلى زيادة صادراتها الزراعية بنسبة 30% خلال السنوات الخمس المقبلة.',
    category: 'اقتصاد',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ يوم واحد'
  },
  {
    id: '48',
    title: 'قطر تستثمر 5 مليارات دولار في مشاريع البنية التحتية الرقمية',
    excerpt: 'أعلنت دولة قطر عن خطة استثمارية بقيمة 5 مليارات دولار لتطوير البنية التحتية الرقمية وتعزيز التحول الرقمي في مختلف القطاعات.',
    category: 'اقتصاد',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ يومين'
  },
  {
    id: '49',
    title: 'تونس توقع اتفاقية تعاون اقتصادي مع الاتحاد الأوروبي بقيمة 900 مليون يورو',
    excerpt: 'وقعت تونس اتفاقية تعاون اقتصادي مع الاتحاد الأوروبي بقيمة 900 مليون يورو لدعم الإصلاحات الاقتصادية وتعزيز النمو المستدام.',
    category: 'اقتصاد',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 3 أيام'
  },
  {
    id: '58',
    title: 'الجزائر تطلق مشروعاً ضخماً للطاقة الشمسية بقيمة 3.6 مليار دولار',
    excerpt: 'أعلنت الجزائر عن إطلاق مشروع ضخم للطاقة الشمسية بقيمة 3.6 مليار دولار، يهدف إلى إنتاج 4 جيجاواط من الكهرباء وتوفير 6000 فرصة عمل.',
    category: 'اقتصاد',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop',
    date: 'منذ 4 أيام'
  },
  {
    id: '59',
    title: 'مصر تطلق منطقة اقتصادية جديدة في قناة السويس باستثمارات 7 مليارات دولار',
    excerpt: 'أعلنت مصر عن إطلاق منطقة اقتصادية جديدة في محور قناة السويس باستثمارات تبلغ 7 مليارات دولار، تستهدف جذب الصناعات التحويلية والخدمات اللوجستية.',
    category: 'اقتصاد',
    image: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 6 أيام'
  }
];

// بيانات وهمية لأخبار التكنولوجيا
const techNewsData: NewsItem[] = [
  {
    id: '12',
    title: 'إطلاق أول منصة عربية للذكاء الاصطناعي التوليدي بكفاءات محلية',
    excerpt: 'أعلنت شركة تقنية عربية ناشئة عن إطلاق أول منصة للذكاء الاصطناعي التوليدي باللغة العربية، مطورة بالكامل بكفاءات محلية.',
    category: 'تكنولوجيا',
    image: 'https://images.unsplash.com/photo-1677442135136-760c813dce9a?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 4 ساعات'
  },
  {
    id: '13',
    title: 'دبي تفتتح أكبر مختبر للمدن الذكية في المنطقة العربية',
    excerpt: 'افتتحت إمارة دبي أكبر مختبر للمدن الذكية في المنطقة العربية، يهدف إلى اختبار وتطوير حلول تكنولوجية مبتكرة للمدن المستقبلية.',
    category: 'تكنولوجيا',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2064&auto=format&fit=crop',
    date: 'منذ 11 ساعة'
  },
  {
    id: '14',
    title: 'السعودية تستثمر 6 مليارات دولار في تقنيات الحوسبة السحابية',
    excerpt: 'أعلنت المملكة العربية السعودية عن خطة استثمارية بقيمة 6 مليارات دولار لتطوير بنية تحتية متطورة للحوسبة السحابية.',
    category: 'تكنولوجيا',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 16 ساعة'
  },
  {
    id: '15',
    title: 'إطلاق أول مركز عربي متخصص في أمن الفضاء السيبراني',
    excerpt: 'أعلنت جامعة الملك عبد الله للعلوم والتقنية عن إطلاق أول مركز عربي متخصص في أمن الفضاء السيبراني، بالتعاون مع شركات عالمية.',
    category: 'تكنولوجيا',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ يومين'
  },
  {
    id: '50',
    title: 'مصر تطلق أول قمر صناعي مخصص للاتصالات بتقنية 5G',
    excerpt: 'أطلقت مصر أول قمر صناعي مخصص للاتصالات بتقنية الجيل الخامس 5G، بهدف تحسين خدمات الاتصالات وتغطية المناطق النائية.',
    category: 'تكنولوجيا',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
    date: 'منذ 3 أيام'
  },
  {
    id: '51',
    title: 'شركة عربية ناشئة تطور تقنية جديدة للترجمة الفورية باستخدام الذكاء الاصطناعي',
    excerpt: 'نجحت شركة عربية ناشئة في تطوير تقنية جديدة للترجمة الفورية باستخدام الذكاء الاصطناعي، تدعم 12 لهجة عربية مختلفة بدقة تصل إلى 95%.',
    category: 'تكنولوجيا',
    image: 'https://images.unsplash.com/photo-1546146830-2cca9512c68e?q=80&w=2080&auto=format&fit=crop',
    date: 'منذ 5 أيام'
  }
];

// بيانات وهمية لأخبار الرياضة
const sportsNewsData: NewsItem[] = [
  {
    id: '16',
    title: 'الأهلي المصري يتأهل إلى نهائي دوري أبطال أفريقيا للمرة العاشرة',
    excerpt: 'نجح النادي الأهلي المصري في التأهل إلى نهائي دوري أبطال أفريقيا للمرة العاشرة في تاريخه بعد فوزه في مجموع المباراتين.',
    category: 'رياضة',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2033&auto=format&fit=crop',
    date: 'منذ 5 ساعات'
  },
  {
    id: '17',
    title: 'السعودية تعلن استضافة بطولة كأس العالم لكرة القدم 2034',
    excerpt: 'أعلنت المملكة العربية السعودية رسمياً عن ترشحها لاستضافة بطولة كأس العالم لكرة القدم 2034 ضمن خطة رؤية 2030.',
    category: 'رياضة',
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=2069&auto=format&fit=crop',
    date: 'منذ 8 ساعات'
  },
  {
    id: '18',
    title: 'انطلاق بطولة الغولف العربية المفتوحة بمشاركة 120 لاعباً',
    excerpt: 'انطلقت اليوم فعاليات بطولة الغولف العربية المفتوحة بمشاركة 120 لاعباً من 15 دولة على ملاعب نادي الجولف الملكي.',
    category: 'رياضة',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 12 ساعة'
  },
  {
    id: '19',
    title: 'منتخب قطر لكرة اليد يتأهل لأولمبياد باريس 2024',
    excerpt: 'حقق منتخب قطر لكرة اليد إنجازاً تاريخياً بتأهله إلى دورة الألعاب الأولمبية باريس 2024 بعد فوزه في التصفيات الآسيوية.',
    category: 'رياضة',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ يوم واحد'
  },
  {
    id: '52',
    title: 'المنتخب المغربي يفوز بكأس أمم أفريقيا للاعبين المحليين للمرة الثالثة',
    excerpt: 'توج المنتخب المغربي بلقب كأس أمم أفريقيا للاعبين المحليين للمرة الثالثة في تاريخه بعد فوزه في المباراة النهائية.',
    category: 'رياضة',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2036&auto=format&fit=crop',
    date: 'منذ 3 أيام'
  },
  {
    id: '53',
    title: 'افتتاح أكبر أكاديمية رياضية متكاملة في الشرق الأوسط بالإمارات',
    excerpt: 'افتتحت دولة الإمارات أكبر أكاديمية رياضية متكاملة في الشرق الأوسط، تضم مرافق تدريبية متطورة لأكثر من 15 رياضة مختلفة.',
    category: 'رياضة',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 5 أيام'
  }
];

// بيانات ملفات خاصة (قسم جديد)
const specialFilesNewsData: NewsItem[] = [
  {
    id: '42',
    title: 'ملف خاص: مستقبل الأمن الغذائي في العالم العربي',
    excerpt: 'ملف شامل يتناول تحديات الأمن الغذائي في العالم العربي، والاستراتيجيات المطلوبة لتحقيق الاكتفاء الذاتي في ظل المتغيرات المناخية.',
    category: 'ملفات خاصة',
    image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ أسبوع',
    isTopStory: true
  },
  {
    id: '43',
    title: 'تحديات الذكاء الاصطناعي: الفرص والمخاوف في المجتمعات العربية',
    excerpt: 'ملف خاص يستعرض تطور تقنيات الذكاء الاصطناعي وتأثيرها المتوقع على سوق العمل والمجتمعات العربية خلال العقد القادم.',
    category: 'ملفات خاصة',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop',
    date: 'منذ أسبوعين'
  },
  {
    id: '44',
    title: 'التراث الثقافي العربي: جهود الحفاظ والتوثيق في العصر الرقمي',
    excerpt: 'ملف موسع حول مبادرات حماية وتوثيق التراث الثقافي العربي باستخدام التقنيات الرقمية، والتحديات التي تواجه هذه الجهود.',
    category: 'ملفات خاصة',
    image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=2074&auto=format&fit=crop',
    date: 'منذ 3 أسابيع'
  },
  {
    id: '45',
    title: 'مستقبل التعليم في عالم متغير: نماذج وتجارب عربية رائدة',
    excerpt: 'ملف خاص يرصد تجارب عربية رائدة في تطوير منظومة التعليم لمواكبة متطلبات المستقبل، والدروس المستفادة من هذه التجارب.',
    category: 'ملفات خاصة',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop',
    date: 'منذ شهر'
  },
  {
    id: '54',
    title: 'أزمة المياه في المنطقة العربية: تحديات وحلول مستقبلية',
    excerpt: 'ملف استقصائي شامل حول أزمة المياه المتفاقمة في المنطقة العربية، وسبل مواجهتها من خلال الحلول التكنولوجية والسياسات المائية المستدامة.',
    category: 'ملفات خاصة',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2071&auto=format&fit=crop',
    date: 'منذ 3 أيام'
  },
  {
    id: '55',
    title: 'الصناعات الإبداعية في العالم العربي: فرص النمو والتحديات',
    excerpt: 'ملف خاص يستعرض واقع الصناعات الإبداعية في العالم العربي، وإمكانات نموها كرافد اقتصادي مهم، والتحديات التي تواجهها.',
    category: 'ملفات خاصة',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop',
    date: 'منذ 10 أيام'
  }
];

// بيانات رؤى وتحليلات (قسم جديد)
const insightsNewsData: NewsItem[] = [
  {
    id: '46',
    title: 'تحليل: مستقبل العلاقات الاقتصادية بين دول الخليج وآسيا',
    excerpt: 'تحليل معمق للتحولات في العلاقات الاقتصادية بين دول الخليج العربي والقوى الآسيوية، وتأثيرها على موازين القوى الإقليمية.',
    category: 'رؤى وتحليلات',
    image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2071&auto=format&fit=crop',
    date: 'منذ 3 أيام',
    isTopStory: true
  },
  {
    id: '47',
    title: 'قراءة في مستقبل الطاقة المتجددة وتحولات سوق النفط العالمي',
    excerpt: 'تحليل استراتيجي لمستقبل الطاقة المتجددة وتأثيرها على أسواق النفط العالمية، وخيارات الدول المصدرة للنفط في المنطقة العربية.',
    category: 'رؤى وتحليلات',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 5 أيام'
  },
  {
    id: '48',
    title: 'اتجاهات التجارة الإلكترونية في المنطقة العربية: الفرص والتحديات',
    excerpt: 'تحليل شامل لنمو قطاع التجارة الإلكترونية في المنطقة العربية، والعوامل المؤثرة في تطوره والتحديات التي تواجه الشركات الناشئة.',
    category: 'رؤى وتحليلات',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ أسبوع'
  },
  {
    id: '49',
    title: 'تأثير التحولات الديموغرافية على سياسات التنمية في الدول العربية',
    excerpt: 'تحليل ديموغرافي واقتصادي لتأثير التغيرات السكانية على خطط التنمية المستدامة في الدول العربية، والسياسات المطلوبة للتكيف مع هذه المتغيرات.',
    category: 'رؤى وتحليلات',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 10 أيام'
  },
  {
    id: '56',
    title: 'مستقبل العلاقات العربية الأفريقية: آفاق التعاون الاقتصادي والأمني',
    excerpt: 'تحليل استراتيجي لمستقبل العلاقات العربية الأفريقية، وفرص تعزيز التعاون الاقتصادي والأمني بين الجانبين في ظل المتغيرات الإقليمية والدولية.',
    category: 'رؤى وتحليلات',
    image: 'https://images.unsplash.com/photo-1489493512598-d08130f49bea?q=80&w=2071&auto=format&fit=crop',
    date: 'منذ أسبوعين'
  },
  {
    id: '57',
    title: 'تحليل: تأثير الثورة الرقمية على أنماط الاستهلاك في المجتمعات العربية',
    excerpt: 'دراسة تحليلية لتأثير التحول الرقمي على أنماط الاستهلاك في المجتمعات العربية، والتغيرات السلوكية المصاحبة لانتشار التجارة الإلكترونية.',
    category: 'رؤى وتحليلات',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 3 أسابيع'
  }
];

// بيانات وهمية لمقالات الرأي (تحديث القسم الموجود)
const opinionArticles = [
  {
    id: '20',
    title: 'مستقبل العلاقات العربية الأوروبية في ضوء المتغيرات الإقليمية والعالمية',
    excerpt: 'تشهد العلاقات العربية الأوروبية تحولات عميقة في ظل المتغيرات الجيوسياسية العالمية. هذا المقال يستعرض آفاق هذه العلاقات وتحدياتها المستقبلية.',
    author: {
      name: 'د. محمد الحسيني',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&crop=faces&faceindex=1',
      title: 'أستاذ العلاقات الدولية - جامعة القاهرة'
    },
    category: 'منصة الرأي'
  },
  {
    id: '21',
    title: 'الاقتصاد الرقمي العربي: تحديات النمو وفرص الازدهار',
    excerpt: 'مع تسارع التحول الرقمي عالمياً، يواجه الاقتصاد الرقمي العربي فرصاً وتحديات متنوعة. كيف يمكن للدول العربية الاستفادة من هذه الموجة التكنولوجية؟',
    author: {
      name: 'د. سارة الشمري',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&crop=faces&faceindex=1',
      title: 'خبيرة الاقتصاد الرقمي - مركز المستقبل للدراسات الاستراتيجية'
    },
    category: 'منصة الرأي'
  },
  {
    id: '22',
    title: 'الهوية الثقافية العربية في عصر العولمة: بين الانفتاح والحفاظ على الخصوصية',
    excerpt: 'تواجه الهوية الثقافية العربية تحديات متزايدة في عصر العولمة والانفتاح العالمي. كيف يمكن تحقيق التوازن بين الانفتاح والحفاظ على الخصوصية الثقافية؟',
    author: {
      name: 'أ. فاطمة العلوي',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&crop=faces&faceindex=1',
      title: 'كاتبة وباحثة في الشؤون الثقافية'
    },
    category: 'منصة الرأي'
  }
];

const Index = () => {
  // استخدام API لجلب الأخبار الأكثر قراءة
  const { data: popularNewsResponse } = useApi(
    () => getNews(1, 5),
    { dependencies: [] }
  );

  // استخدام البيانات الوهمية كبيانات احتياطية
  const popularNews = popularNewsResponse?.data || featuredNewsData;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreakingNews />

      <main className="flex-grow">
        {/* السلايدر الرئيسي وآخر الأخبار */}
        <div className="py-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MainSlider initialSlides={featuredNewsData.slice(0, 5)} />
              </div>
              <div className="lg:col-span-1">
                <LatestNews initialNews={featuredNewsData.slice(0, 5)} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* استخدام مكون CategoryNewsSection لقسم نبض الخبر */}
                <CategoryNewsSection title="نبض الخبر" slug="pulse" initialNews={pulseNewsData} />

                {/* قسم السياسة بالتصميم الجديد */}
                <CategoryNewsSection title="سياسة" slug="politics" initialNews={politicsNewsData} />

                {/* قسم الاقتصاد بالتصميم الجديد */}
                <CategoryNewsSection title="اقتصاد" slug="economy" initialNews={economyNewsData} />

                {/* استخدام مكون CategoryCardsSection لجميع الأقسام ماعدا السياسة والاقتصاد */}
                <div className="py-6 bg-white rounded-lg mt-6">
                  <CategoryCardsSection title="عمق الحدث" slug="depth" initialNews={depthNewsData} />
                </div>

                <div className="py-6 bg-gray-50 rounded-lg mt-6">
                  <CategoryCardsSection title="رؤى وتحليلات" slug="insights" initialNews={insightsNewsData} />
                </div>

                <div className="py-6 bg-white rounded-lg mt-6">
                  <CategoryCardsSection title="رياضة" slug="sports" initialNews={sportsNewsData} />
                </div>

                <div className="py-6 bg-gray-50 rounded-lg mt-6">
                  <CategoryCardsSection title="صوت الشارع" slug="street-voice" initialNews={streetVoiceNewsData} />
                </div>

                <div className="py-6 bg-white rounded-lg mt-6">
                  <CategoryCardsSection title="تكنولوجيا وابتكار" slug="tech" initialNews={techNewsData} />
                </div>

                <div className="py-6 bg-gray-50 rounded-lg mt-6">
                  <CategoryCardsSection title="ملفات خاصة" slug="special-files" initialNews={specialFilesNewsData} />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  {/* أسعار العملات والذهب */}
                  <CurrencyGoldPrices />

                  {/* مباريات اليوم */}
                  <TodayMatches />

                  {/* استطلاع رأي */}
                  <PollWidget />

                  {/* الأكثر قراءة */}
                  <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <h3 className="font-cairo font-bold text-lg mb-4 border-r-4 border-horus-gold pr-3">الأكثر قراءة</h3>
                    <div className="space-y-4">
                      {popularNews.map((item, index) => (
                        <div key={item.id} className="flex items-center">
                          <div className="ml-3 w-6 h-6 rounded-full bg-horus-blue text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <h4 className="font-medium text-sm hover:text-horus-red transition-colors line-clamp-2">
                            <a href={`/news/${item.id}`}>{item.title}</a>
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* حورس بريميوم */}
                  <div className="bg-horus-gold/10 rounded-lg p-6 text-center">
                    <h3 className="font-cairo font-bold text-xl mb-3 text-horus-gold">حورس بريميوم</h3>
                    <p className="text-sm mb-4">اشترك الآن للوصول إلى محتوى حصري وتحليلات متعمقة</p>
                    <button className="bg-horus-gold hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
                      اشترك الآن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* استخدام البيانات الوهمية مؤقتًا حتى يتم ربط API لمقالات الرأي */}
        <OpinionSection articles={opinionArticles} />

        {/* قسم الفيديو والصور */}
        <div className="py-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-lg shadow-sm overflow-hidden border border-blue-100">
                <VideoSection />
              </div>
              <div className="bg-amber-50 rounded-lg shadow-sm overflow-hidden border border-amber-100">
                <PhotoGallerySection />
              </div>
            </div>
          </div>
        </div>

        <SubscribeSection />
      </main>

      <Footer />
      <FooterAdmin />
    </div>
  );
};

export default Index;

