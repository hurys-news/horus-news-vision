
import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { getBreakingNews } from '@/lib/api';
import { NewsItem } from '@/lib/types';

interface BreakingNewsProps {
  initialItems?: NewsItem[];
}

const BreakingNews = ({ initialItems }: BreakingNewsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // استخدام API لجلب الأخبار العاجلة
  const { data: breakingNewsItems, isLoading, error } = useApi<NewsItem[]>(
    getBreakingNews,
    { initialData: initialItems && initialItems.length > 0 ? initialItems : undefined, dependencies: [] }
  );

  // التأكد من وجود أخبار عاجلة
  const hasBreakingNews = breakingNewsItems && breakingNewsItems.length > 0;

  useEffect(() => {
    // إذا لم تكن هناك أخبار عاجلة، لا داعي لتشغيل المؤقت
    if (!hasBreakingNews) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % breakingNewsItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNewsItems, hasBreakingNews]);

  // إذا لم تكن هناك أخبار عاجلة، لا نعرض المكون
  if (!hasBreakingNews && !isLoading) return null;

  return (
    <div className="bg-horus-red text-white py-2">
      <div className="container mx-auto">
        <div className="flex items-center">
          <div className="flex items-center bg-white text-horus-red px-3 py-1 rounded-md ml-3">
            <AlertTriangle className="h-4 w-4 ml-1" />
            <span className="font-cairo font-bold text-sm">عاجل</span>
          </div>

          <div className="overflow-hidden flex-1 relative h-6">
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                <span className="text-sm">جاري تحميل الأخبار العاجلة...</span>
              </div>
            ) : error ? (
              <span className="text-sm">تعذر تحميل الأخبار العاجلة</span>
            ) : (
              breakingNewsItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className={`absolute top-0 right-0 w-full transition-all duration-500 ${
                    index === activeIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.title}
                  </span>
                </Link>
              ))
            )}
          </div>

          {hasBreakingNews && (
            <div className="flex items-center">
              {breakingNewsItems.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 cursor-pointer ${
                    index === activeIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
