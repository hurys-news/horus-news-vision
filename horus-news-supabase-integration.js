// هذا ملف مرجعي يوضح كيفية دمج Supabase مع موقع حورس نيوز

// إنشاء عميل Supabase
import { createClient } from '@supabase/supabase-js';

// استبدل هذه القيم بقيم مشروعك
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

// إنشاء عميل Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// دوال لجلب البيانات من Supabase

// جلب جميع الأخبار
export async function getAllNews() {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      categories(name)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// جلب الأخبار حسب الفئة
export async function getNewsByCategory(categoryId) {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      categories(name)
    `)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// جلب الأخبار العاجلة
export async function getBreakingNews() {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      categories(name)
    `)
    .eq('is_breaking', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// جلب الأخبار المهمة
export async function getTopStories() {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      categories(name)
    `)
    .eq('is_top_story', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// جلب خبر واحد حسب المعرف
export async function getNewsById(id) {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      categories(name)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// جلب جميع الفئات
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data;
}

// زيادة عدد المشاهدات
export async function incrementViewCount(id) {
  const { error } = await supabase.rpc('increment_view_count', { news_id: id });
  if (error) throw error;
}

// مثال على استخدام هذه الدوال في مكون React

/*
import React, { useEffect, useState } from 'react';
import { getAllNews, getBreakingNews, getTopStories } from './supabaseService';

function HomePage() {
  const [news, setNews] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [topStories, setTopStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // جلب جميع الأخبار
        const newsData = await getAllNews();
        setNews(newsData);
        
        // جلب الأخبار العاجلة
        const breakingNewsData = await getBreakingNews();
        setBreakingNews(breakingNewsData);
        
        // جلب الأخبار المهمة
        const topStoriesData = await getTopStories();
        setTopStories(topStoriesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('حدث خطأ أثناء جلب البيانات');
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div>
      {breakingNews.length > 0 && (
        <div className="breaking-news">
          <div className="breaking-news-container">
            <div className="breaking-news-label">عاجل</div>
            <div className="breaking-news-slider">
              {breakingNews.map(item => (
                <div key={item.id} className="breaking-news-item">
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {topStories.length > 0 && (
        <section className="top-stories">
          <div className="container">
            <h2 className="section-title">أهم الأخبار</h2>
            <div className="top-story-grid">
              {topStories.slice(0, 3).map((item, index) => (
                <div key={item.id} className={index === 0 ? "top-story-main" : ""}>
                  <div className="news-card">
                    <img src={item.image} alt={item.title} className="news-card-image" />
                    <div className="news-card-content">
                      <div className="news-card-category">{item.categories.name}</div>
                      <h3 className="news-card-title">{item.title}</h3>
                      <p className="news-card-excerpt">{item.excerpt}</p>
                      <div className="news-card-meta">
                        <span>{new Date(item.created_at).toLocaleDateString('ar-EG')}</span>
                        <span>{item.source}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      <section className="latest-news">
        <div className="container">
          <h2 className="section-title">أحدث الأخبار</h2>
          <div className="news-grid">
            {news.map(item => (
              <div key={item.id} className="news-card">
                <img src={item.image} alt={item.title} className="news-card-image" />
                <div className="news-card-content">
                  <div className="news-card-category">{item.categories.name}</div>
                  <h3 className="news-card-title">{item.title}</h3>
                  <p className="news-card-excerpt">{item.excerpt}</p>
                  <div className="news-card-meta">
                    <span>{new Date(item.created_at).toLocaleDateString('ar-EG')}</span>
                    <span>{item.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
*/
