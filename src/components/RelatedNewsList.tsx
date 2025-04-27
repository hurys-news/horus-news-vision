
import { Link } from 'react-router-dom';
import { NewsItem } from '@/lib/types';
import NewsCard from './NewsCard';
import { ArrowLeft } from 'lucide-react';

interface RelatedNewsListProps {
  news: NewsItem[];
}

const RelatedNewsList = ({ news }: RelatedNewsListProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">الأخبار ذات الصلة</h2>
        <Link to="/category" className="text-horus-red hover:text-horus-blue flex items-center text-sm font-bold">
          المزيد من الأخبار
          <ArrowLeft className="mr-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((newsItem) => (
          <NewsCard key={newsItem.id} news={newsItem} size="medium" />
        ))}
      </div>
    </div>
  );
};

export default RelatedNewsList;
