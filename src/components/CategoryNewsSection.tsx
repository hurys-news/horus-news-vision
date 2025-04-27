import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { NewsItem } from '@/lib/types';
import { useApi } from '@/hooks/useApi';
import { getNewsByCategory } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryNewsSectionProps {
  title: string;
  slug: string;
  initialNews?: NewsItem[];
  limit?: number;
}

// مكون هيكل التحميل
const CategoryNewsSectionSkeleton = () => (
  <div className="space-y-6">
    {/* هيكل الخبر الرئيسي */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
      <Skeleton className="h-[250px] w-full rounded-md" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>

    {/* هيكل الأخبار الثانوية */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="flex items-start space-x-4 space-x-reverse">
          <Skeleton className="h-24 w-32 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CategoryNewsSection = ({ title, slug, initialNews, limit = 7 }: CategoryNewsSectionProps) => {
  // استخدام API لجلب أخبار الفئة إذا لم يتم تمريرها كخاصية
  const { data: apiResponse, isLoading, error } = useApi(
    () => getNewsByCategory(slug, 1, limit),
    {
      dependencies: [slug, limit],
      initialData: initialNews && initialNews.length > 0
        ? { data: initialNews, meta: { currentPage: 1, totalPages: 1, totalItems: initialNews.length, itemsPerPage: limit } }
        : undefined
    }
  );

  // استخدام الأخبار من الخاصية أو من API
  const news = initialNews || (apiResponse?.data || []);

  // الخبر الرئيسي (الأول) والأخبار الثانوية (الباقي)
  const mainNews = news.length > 0 ? news[0] : null;
  // نأخذ ستة أخبار ثانوية، وإذا كان هناك خبر واحد فقط، نعرضه في القسم الثانوي
  const secondaryNews = news.length > 1 ? news.slice(1, Math.min(7, news.length)) : [];

  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <div className="flex items-center">
          <h2 className="bg-horus-red text-white px-5 py-1.5 text-lg font-bold whitespace-nowrap rounded-sm text-right">{title}</h2>
          <Link to={`/category/${slug}`} className="text-gray-500 hover:text-horus-red text-sm whitespace-nowrap font-medium mr-4">
            المزيد
          </Link>
        </div>
        <div className="flex-1 border-b border-gray-200 mr-4"></div>
      </div>

      {isLoading && !initialNews ? (
        <CategoryNewsSectionSkeleton />
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          حدث خطأ أثناء تحميل الأخبار. يرجى المحاولة مرة أخرى.
        </div>
      ) : (
        <div className="space-y-4">
          {/* الخبر الرئيسي */}
          {mainNews && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
              <div className="relative overflow-hidden rounded-md group">
                <Link to={`/news/${mainNews.id}`}>
                  <img
                    src={mainNews.image}
                    alt={mainNews.title}
                    className="w-full h-[250px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-0 right-0 bg-horus-red text-white px-2 py-1 text-sm">
                    {mainNews.category}
                  </div>
                </Link>
              </div>
              <div>
                <Link to={`/news/${mainNews.id}`} className="block group">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-horus-red transition-colors line-clamp-2">
                    {mainNews.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {mainNews.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 ml-1" />
                      {mainNews.date}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* الأخبار الثانوية */}
          {secondaryNews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {secondaryNews.map((item) => (
                <div key={item.id} className="flex space-x-4 space-x-reverse group">
                  <Link to={`/news/${item.id}`} className="flex-shrink-0 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-32 h-24 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-0 right-0 bg-horus-red text-white px-1.5 py-0.5 text-xs">
                      {item.category}
                    </div>
                  </Link>
                  <div className="flex-1">
                    <Link to={`/news/${item.id}`} className="block">
                      <h3 className="font-bold text-sm mb-1 group-hover:text-horus-red transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 ml-1" />
                          {item.date}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryNewsSection;
