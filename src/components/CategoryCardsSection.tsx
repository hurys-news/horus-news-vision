import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { NewsItem } from '@/lib/types';
import { useApi } from '@/hooks/useApi';
import { getNewsByCategory } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryCardsSectionProps {
  title: string;
  slug: string;
  initialNews?: NewsItem[];
  limit?: number;
}

// مكون هيكل التحميل
const CategoryCardsSectionSkeleton = () => (
  <div className="flex flex-col gap-6">
    {/* الصف الأول: 3 أخبار في الأعلى */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>

    {/* الصف الثاني: 3 أخبار في الأسفل */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[4, 5, 6].map((item) => (
        <div key={item} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  </div>
);

const CategoryCardsSection = ({ title, slug, initialNews, limit = 6 }: CategoryCardsSectionProps) => {
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

  // اختيار الأخبار المراد عرضها (بحد أقصى 6)
  const displayNews = news.slice(0, Math.min(6, news.length));

  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <div className="flex items-center">
          <h2 className="bg-horus-blue text-white px-5 py-1.5 text-lg font-bold whitespace-nowrap text-right">{title}</h2>
          <Link to={`/category/${slug}`} className="text-gray-500 hover:text-horus-blue text-sm whitespace-nowrap font-medium mr-4">
            المزيد
          </Link>
        </div>
        <div className="flex-1 border-b border-gray-200 mr-4"></div>
      </div>

      {isLoading && !initialNews ? (
        <CategoryCardsSectionSkeleton />
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          حدث خطأ أثناء تحميل الأخبار. يرجى المحاولة مرة أخرى.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* الصف الأول: 3 أخبار في الأعلى */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayNews.slice(0, 3).map((item) => (
              <div key={item.id} className="group">
                <Link to={`/news/${item.id}`} className="block">
                  <div className="relative overflow-hidden rounded-md mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-0 right-0 bg-horus-blue text-white px-2 py-1 text-sm">
                      {item.category}
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-2 group-hover:text-horus-blue transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 ml-1" />
                      {item.date}
                    </span>
                    {item.viewCount && (
                      <span className="mr-3 flex items-center">
                        <span className="ml-1">👁️</span>
                        {item.viewCount}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* الصف الثاني: 3 أخبار في الأسفل */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayNews.slice(3, 6).map((item) => (
              <div key={item.id} className="group">
                <Link to={`/news/${item.id}`} className="block">
                  <div className="relative overflow-hidden rounded-md mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-0 right-0 bg-horus-blue text-white px-2 py-1 text-sm">
                      {item.category}
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-2 group-hover:text-horus-blue transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 ml-1" />
                      {item.date}
                    </span>
                    {item.viewCount && (
                      <span className="mr-3 flex items-center">
                        <span className="ml-1">👁️</span>
                        {item.viewCount}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCardsSection;
