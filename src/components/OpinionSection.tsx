
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { NewsItem, Author } from '@/lib/types';

interface OpinionArticle {
  id: string;
  title: string;
  excerpt: string;
  author: Author;
}

interface OpinionSectionProps {
  articles: OpinionArticle[];
}

const OpinionSection = ({ articles }: OpinionSectionProps) => {
  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">منصة الرأي</h2>
          <Link
            to="/opinion"
            className="flex items-center text-horus-red hover:text-horus-blue transition-colors text-sm font-bold"
          >
            المزيد
            <ArrowLeft className="mr-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/opinion/${article.id}`}>
                <h3 className="font-cairo font-bold text-lg mb-2 line-clamp-2 hover:text-horus-red transition-colors">
                  {article.title}
                </h3>
              </Link>
              <p className="text-gray-600 line-clamp-3 mb-4">
                {article.excerpt}
              </p>
              <div className="flex items-center">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover ml-3"
                />
                <div>
                  <Link to={`/author/${article.author.name}`} className="font-bold text-sm hover:text-horus-red transition-colors">
                    {article.author.name}
                  </Link>
                  <p className="text-xs text-gray-500">{article.author.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpinionSection;
