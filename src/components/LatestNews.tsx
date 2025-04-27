import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronLeft } from 'lucide-react';
import { NewsItem } from '@/lib/types';
import { useApi } from '@/hooks/useApi';
import { getNews } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LatestNewsProps {
  initialNews?: NewsItem[];
  limit?: number;
}

// مكون هيكل التحميل
const LatestNewsSkeleton = () => (
  <div className="grid grid-cols-1 gap-3">
    {/* الأخبار الأربعة الأولى في شبكة 2×2 */}
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex flex-col rounded-md overflow-hidden">
          <Skeleton className="h-[85px] w-full flex-shrink-0" />
          <div className="p-2 bg-white space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* الخبر الخامس بعرض كامل */}
    <div className="flex flex-col rounded-md overflow-hidden">
      <Skeleton className="h-[85px] w-full flex-shrink-0" />
      <div className="p-2 bg-white space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
    </div>
  </div>
);

const LatestNews = ({ initialNews, limit = 5 }: LatestNewsProps) => {
  // استخدام API لجلب آخر الأخبار إذا لم يتم تمريرها كخاصية
  const { data: apiResponse, isLoading, error } = useApi(
    () => getNews(1, limit),
    {
      dependencies: [limit],
      initialData: initialNews && initialNews.length > 0
        ? { data: initialNews, meta: { currentPage: 1, totalPages: 1, totalItems: initialNews.length, itemsPerPage: limit } }
        : undefined
    }
  );

  // استخدام الأخبار من الخاصية أو من API
  const news = initialNews || (apiResponse?.data || []);

  // التأكد من أن لدينا 5 أخبار فقط
  const limitedNews = news.slice(0, 5);

  return (
    <div className="bg-white rounded-md overflow-hidden h-full flex flex-col">
      <div className="bg-horus-red text-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">آخر الأخبار</h2>
        <Link to="/news" className="flex items-center text-sm hover:underline">
          المزيد
          <ChevronLeft className="h-4 w-4 mr-1" />
        </Link>
      </div>

      <div className="p-4 flex-grow">
        {isLoading && !initialNews ? (
          <LatestNewsSkeleton />
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            حدث خطأ أثناء تحميل الأخبار. يرجى المحاولة مرة أخرى.
          </div>
        ) : (
          <div className="flex flex-col gap-3 h-full">
            {/* الأخبار الأربعة الأولى في شبكة 2×2 */}
            <div className="grid grid-cols-2 gap-3">
              {limitedNews.slice(0, 4).map((item) => (
                <div key={item.id} className="group flex flex-col">
                  <Link
                    to={`/news/${item.id}`}
                    className="flex flex-col h-full rounded-md overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-[85px] object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="text-xs px-1.5 py-0.5 bg-horus-red rounded text-white">
                          {item.category}
                        </span>
                      </div>
                      {/* طبقة التدرج السوداء */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50"></div>
                    </div>
                    <div className="p-2 flex-grow bg-white">
                      <h3 className="font-bold text-xs line-clamp-2 group-hover:text-horus-red transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 ml-1" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* الخبر الخامس بعرض كامل */}
            {limitedNews.length >= 5 && (
              <div className="group flex flex-col">
                <Link
                  to={`/news/${limitedNews[4].id}`}
                  className="flex flex-col h-full rounded-md overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={limitedNews[4].image}
                      alt={limitedNews[4].title}
                      className="w-full h-[85px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-xs px-1.5 py-0.5 bg-horus-red rounded text-white">
                        {limitedNews[4].category}
                      </span>
                    </div>
                    {/* طبقة التدرج السوداء */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50"></div>
                  </div>
                  <div className="p-2 flex-grow bg-white">
                    <h3 className="font-bold text-xs line-clamp-2 group-hover:text-horus-red transition-colors">
                      {limitedNews[4].title}
                    </h3>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 ml-1" />
                        {limitedNews[4].date}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestNews;
