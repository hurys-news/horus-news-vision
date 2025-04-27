import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem } from '@/lib/types';
import { useApi } from '@/hooks/useApi';
import { getFeaturedNews } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface MainSliderProps {
  initialSlides?: NewsItem[];
}

// مكون هيكل التحميل
const MainSliderSkeleton = () => (
  <div className="relative h-[400px] md:h-[500px] bg-gray-200 animate-pulse rounded-md overflow-hidden">
    <div className="absolute bottom-0 right-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4 bg-gray-300" />
        <Skeleton className="h-4 w-full bg-gray-300" />
        <div className="flex items-center mt-2">
          <Skeleton className="h-4 w-24 bg-gray-300 ml-4" />
          <Skeleton className="h-4 w-24 bg-gray-300" />
        </div>
      </div>
    </div>
  </div>
);

const MainSlider = ({ initialSlides }: MainSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // استخدام API لجلب الأخبار المميزة إذا لم يتم تمريرها كخاصية
  const { data: apiSlides, isLoading, error } = useApi<NewsItem[]>(
    getFeaturedNews,
    { initialData: initialSlides && initialSlides.length > 0 ? initialSlides : undefined, dependencies: [] }
  );
  
  // استخدام الشرائح من الخاصية أو من API
  const slides = initialSlides || apiSlides || [];
  
  // التأكد من وجود شرائح
  const hasSlides = slides && slides.length > 0;
  
  // التنقل بين الشرائح
  const nextSlide = () => {
    if (!hasSlides) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    if (!hasSlides) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  // تغيير الشريحة تلقائيًا كل 5 ثوانٍ
  useEffect(() => {
    if (!hasSlides) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides, currentSlide]);
  
  // إذا كان هناك تحميل ولا توجد شرائح أولية
  if (isLoading && !initialSlides) {
    return <MainSliderSkeleton />;
  }
  
  // إذا كان هناك خطأ
  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-md text-center">
        حدث خطأ أثناء تحميل الشرائح. يرجى المحاولة مرة أخرى.
      </div>
    );
  }
  
  // إذا لم تكن هناك شرائح
  if (!hasSlides) {
    return null;
  }
  
  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-md">
      {/* الشرائح */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          
          {/* طبقة التدرج السوداء */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          {/* محتوى الشريحة */}
          <div className="absolute bottom-0 right-0 w-full p-6 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
              {slide.title}
            </h2>
            <p className="text-sm md:text-base mb-3 line-clamp-2 text-gray-200">
              {slide.excerpt}
            </p>
            <div className="flex items-center text-sm text-gray-300">
              <span className="flex items-center ml-4">
                <Clock className="h-4 w-4 ml-1" />
                {slide.date}
              </span>
              <span className="bg-horus-red px-2 py-0.5 rounded-sm text-white text-xs">
                {slide.category}
              </span>
            </div>
            
            <Link
              to={`/news/${slide.id}`}
              className="absolute inset-0 z-20"
              aria-label={`قراءة المزيد عن ${slide.title}`}
            />
          </div>
        </div>
      ))}
      
      {/* أزرار التنقل */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        aria-label="الشريحة السابقة"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        aria-label="الشريحة التالية"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* مؤشرات الشرائح */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2 space-x-reverse">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`الانتقال إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MainSlider;
