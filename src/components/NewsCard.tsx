
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { NewsItem } from '@/lib/types';
import { getCategoryColor } from '@/lib/utils';

interface NewsCardProps {
  news: NewsItem;
  size?: 'small' | 'medium' | 'large' | 'featured';
  showExcerpt?: boolean;
  hideTitle?: boolean; // إضافة خيار لإخفاء العنوان
}

const NewsCard = ({ news, size = 'medium', showExcerpt = true, hideTitle = false }: NewsCardProps) => {

  // Configure size variants
  const sizeConfig = {
    small: {
      container: 'flex flex-row h-24',
      imageWrapper: 'w-24 h-24',
      contentWrapper: 'p-2',
      title: 'text-sm font-bold line-clamp-2',
      excerpt: 'hidden',
    },
    medium: {
      container: 'flex flex-col',
      imageWrapper: 'h-40',
      contentWrapper: 'p-3',
      title: 'text-base font-bold line-clamp-2',
      excerpt: showExcerpt ? 'text-sm line-clamp-2 mt-1' : 'hidden',
    },
    large: {
      container: 'flex flex-col',
      imageWrapper: 'h-48 md:h-56',
      contentWrapper: 'p-4',
      title: 'text-lg font-bold line-clamp-2',
      excerpt: showExcerpt ? 'text-base line-clamp-3 mt-2' : 'hidden',
    },
    featured: {
      container: 'flex flex-col',
      imageWrapper: 'h-64 md:h-80',
      contentWrapper: 'p-4',
      title: 'text-xl md:text-2xl font-bold line-clamp-2',
      excerpt: showExcerpt ? 'text-base line-clamp-3 mt-2' : 'hidden',
    },
  };

  const variant = sizeConfig[size];

  // إضافة فئة للإشارة إلى الأخبار المميزة
  const topStoryClass = news.isTopStory ? 'ring-2 ring-horus-gold shadow-lg' : '';
  const breakingClass = news.isBreaking ? 'ring-2 ring-red-500 shadow-lg animate-pulse' : '';

  return (
    <Link to={`/news/${news.id}`} className={`news-card bg-white ${variant.container} hover:shadow-horus ${topStoryClass} ${breakingClass}`}>
      <div className={`relative ${variant.imageWrapper} overflow-hidden`}>
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            // صورة بديلة في حالة فشل تحميل الصورة الأصلية
            (e.target as HTMLImageElement).src = "https://source.unsplash.com/random/800x600/?news";
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`category-badge rounded-full px-2.5 py-1 text-xs font-semibold ${getCategoryColor(news.category)}`}>
            {news.category}
          </span>
        </div>

        {news.isTopStory && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-horus-gold text-white text-xs px-2 py-1 rounded-md font-semibold flex items-center">
              <span className="mr-1">⭐</span> قصة مميزة
            </span>
          </div>
        )}

        {news.isBreaking && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md font-semibold flex items-center">
              <span className="mr-1">⚡</span> عاجل
            </span>
          </div>
        )}
      </div>

      <div className={`${variant.contentWrapper} bg-gradient-to-b from-white to-gray-50`}>
        {!hideTitle && (
          <h3 className={`font-cairo ${variant.title}`}>{news.title}</h3>
        )}
        <p className={`text-gray-600 ${variant.excerpt} relative z-10`}>
          {news.excerpt}
        </p>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="h-3 w-3 ml-1" />
            <span>{news.date}</span>
          </div>
          {news.source && (
            <div className="text-xs italic text-horus-blue">
              المصدر: {news.source}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
