
import { useState, useEffect } from 'react';
import { NewsItem } from './NewsCard';
import NewsCard from './NewsCard';
import { useApi } from '@/hooks/useApi';
import { getFeaturedNews } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

// مكون الإعلان البارز
const FeaturedAd = () => (
  <div className="bg-gradient-to-r from-gray-100 to-white border border-dashed border-gray-300 p-3 text-center h-full flex flex-col justify-center rounded-md shadow-sm">
    <span className="text-xs text-gray-500 mb-1">إعلان</span>
    <div className="flex-1 flex items-center justify-center">
      <span className="text-gray-500">إعلان بارز</span>
    </div>
  </div>
);

// مكون هيكل التحميل
const FeaturedNewsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
    <div className="md:col-span-2">
      <div className="flex flex-col">
        <Skeleton className="h-64 md:h-80 w-full rounded-md" />
        <div className="p-4">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex flex-col">
        <Skeleton className="h-40 w-full rounded-md" />
        <div className="p-3">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <div className="flex flex-col">
        <Skeleton className="h-40 w-full rounded-md" />
        <div className="p-3">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  </div>
);

interface FeaturedNewsProps {
  featuredNews?: NewsItem[];
}

const FeaturedNews = ({ featuredNews: propsFeaturedNews }: FeaturedNewsProps) => {
  // استخدام API لجلب الأخبار المميزة إذا لم يتم تمريرها كخاصية
  const { data: apiFeaturedNews, isLoading, error } = useApi<NewsItem[]>(
    getFeaturedNews,
    { initialData: propsFeaturedNews && propsFeaturedNews.length > 0 ? propsFeaturedNews : undefined, dependencies: [] }
  );

  // استخدام الأخبار المميزة من الخاصية أو من API
  const featuredNews = propsFeaturedNews || apiFeaturedNews;

  // Get the main featured news (first item)
  const mainFeature = featuredNews && featuredNews.length > 0 ? featuredNews[0] : null;

  // Get the secondary featured news (next 2 items)
  const secondaryFeatures = featuredNews && featuredNews.length > 1 ? featuredNews.slice(1, 3) : [];

  return (
    <section className="py-4">
      <div className="container mx-auto">
        <h2 className="section-title border-r-4 border-horus-gold pr-3 text-horus-darkGray">أبرز الأخبار</h2>

        {isLoading && !featuredNews ? (
          <FeaturedNewsSkeleton />
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            حدث خطأ أثناء تحميل الأخبار المميزة. يرجى المحاولة مرة أخرى.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
            {/* Main featured news */}
            <div className="md:col-span-2">
              {mainFeature && <NewsCard news={mainFeature} size="featured" />}
            </div>

            {/* Secondary featured news - stacked vertically */}
            <div className="space-y-4">
              {secondaryFeatures.map((news) => (
                <NewsCard key={news.id} news={news} size="medium" />
              ))}
            </div>
          </div>
        )}

        {/* إعلان بعد الأخبار البارزة */}
        <div className="mt-4">
          <FeaturedAd />
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;
