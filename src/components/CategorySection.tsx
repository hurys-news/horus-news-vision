
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import NewsCard from './NewsCard';
import { NewsItem } from '@/lib/types';
import { useApi } from '@/hooks/useApi';
import { getNewsByCategory } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface CategorySectionProps {
  title: string;
  slug: string;
  news?: NewsItem[];
  showAd?: boolean;
  hideCardTitle?: boolean;
  limit?: number;
}

// مكون للإعلانات
const AdUnit = ({ type }: { type: 'inFeed' | 'sidebar' }) => {
  const height = type === 'inFeed' ? 'h-24' : 'h-64';
  return (
    <div className={`bg-gradient-to-r from-gray-100 to-white border border-dashed border-gray-300 p-2 text-center text-gray-500 ${height} flex flex-col justify-center rounded-md shadow-sm`}>
      <span className="text-xs mb-1">إعلان</span>
      <div className="flex-1 flex items-center justify-center text-sm">
        {type === 'inFeed' ? 'إعلان متوافق مع المحتوى' : 'إعلان جانبي'}
      </div>
    </div>
  );
};

// مكون هيكل التحميل
const CategorySectionSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((item) => (
      <div key={item} className="flex flex-col">
        <Skeleton className="h-40 w-full rounded-md" />
        <div className="p-3">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    ))}
  </div>
);

const CategorySection = ({
  title,
  slug,
  news: initialNews,
  showAd = false,
  hideCardTitle = false,
  limit = 4
}: CategorySectionProps) => {
  // استخدام API لجلب الأخبار حسب الفئة إذا لم يتم تمريرها كخاصية
  const { data: apiResponse, isLoading, error } = useApi(
    () => getNewsByCategory(slug, 1, limit),
    {
      dependencies: [slug, limit],
      // تجاهل استدعاء API إذا تم تمرير الأخبار كخاصية
      initialData: initialNews && initialNews.length > 0 ? { data: initialNews, meta: { currentPage: 1, totalPages: 1, totalItems: initialNews.length, itemsPerPage: limit } } : undefined
    }
  );

  // استخدام الأخبار من الخاصية أو من API
  const news = initialNews || (apiResponse?.data || []);

  // إذا لم تكن هناك أخبار ولا تحميل، لا نعرض المكون
  if ((!news || news.length === 0) && !isLoading) return null;

  return (
    <section className="py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title border-r-4 border-horus-red pr-3 text-horus-darkGray">{title}</h2>
          <Link
            to={`/${slug}`}
            className="flex items-center text-horus-red hover:text-horus-blue transition-colors text-sm font-bold hover:underline"
          >
            المزيد
            <ArrowLeft className="mr-1 h-4 w-4" />
          </Link>
        </div>

        {isLoading && !initialNews ? (
          <CategorySectionSkeleton />
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            حدث خطأ أثناء تحميل الأخبار. يرجى المحاولة مرة أخرى.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {news.map((item, index) => (
              <React.Fragment key={item.id}>
                <NewsCard news={item} size="medium" showExcerpt={true} hideTitle={hideCardTitle} />
                {showAd && index === 1 && (
                  <div className="sm:col-span-2 md:col-span-1">
                    <AdUnit type="inFeed" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
