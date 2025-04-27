import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image, ChevronLeft } from 'lucide-react';

// نموذج بيانات الصور
interface PhotoItem {
  id: string;
  title: string;
  image: string;
  date: string;
  count: number;
}

// بيانات وهمية للمعارض
const dummyGalleries: PhotoItem[] = [
  {
    id: 'g1',
    title: 'معرض الفن العربي المعاصر يستقطب آلاف الزوار في العاصمة',
    image: 'https://images.unsplash.com/photo-1566054757965-8c4085344c96?q=80&w=2069&auto=format&fit=crop',
    date: 'منذ 4 أيام',
    count: 24
  },
  {
    id: 'g2',
    title: 'الأماكن السياحية الأكثر جمالاً في المنطقة العربية بالصور',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ أسبوع',
    count: 36
  },
  {
    id: 'g3',
    title: 'مهرجان التراث الشعبي السنوي يحتفي بالموروث الثقافي العربي',
    image: 'https://images.unsplash.com/photo-1604846887565-640d2c52d0e2?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 10 أيام',
    count: 18
  },
  {
    id: 'g4',
    title: 'المؤتمر الاقتصادي العربي في دبي يناقش تحديات المرحلة القادمة',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e4?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ أسبوعين',
    count: 42
  },
  {
    id: 'g5',
    title: 'احتفالات اليوم الوطني تزين سماء المدينة بالألعاب النارية',
    image: 'https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?q=80&w=2070&auto=format&fit=crop',
    date: 'منذ 3 أسابيع',
    count: 30
  }
];

const PhotoGallerySection = () => {
  // استخدام أول صورة كصورة رئيسية وصورتين فقط كصور ثانوية
  const [featuredGallery, secondGallery, thirdGallery] = dummyGalleries;
  const displayedGalleries = [secondGallery, thirdGallery];

  return (
    <section className="py-4">
      <div className="px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="bg-horus-gold text-white px-5 py-1.5 text-lg font-bold rounded-sm shadow-md">ألبوم الصور المميزة</h2>
            <Link to="/photos" className="text-horus-gold hover:text-horus-gold/80 text-xs font-medium hover:underline flex items-center bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
              عرض جميع الصور
              <ChevronLeft className="h-3 w-3 mr-1" />
            </Link>
          </div>
          <div className="w-full border-b-2 border-horus-gold/20"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* المعرض الرئيسي (تم تكبيره) */}
          <div className="md:w-7/12 relative group overflow-hidden rounded-lg">
            <Link to={`/gallery/${featuredGallery.id}`} className="block h-full">
              <div className="relative h-full overflow-hidden">
                <img
                  src={featuredGallery.image}
                  alt={featuredGallery.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ minHeight: '320px' }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                {/* تم نقل عدد الصور إلى أسفل العنوان */}
                <div className="absolute bottom-0 right-0 left-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{featuredGallery.title}</h3>
                  <div className="flex items-center text-white/90 text-xs">
                    <span className="flex items-center ml-3 bg-black/30 px-1.5 py-0.5 rounded">
                      <Image className="h-2.5 w-2.5 ml-0.5" />
                      {featuredGallery.count} صورة
                    </span>
                    <span className="ml-2">{featuredGallery.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* شبكة المعارض الأخرى (صورتين فقط) */}
          <div className="md:w-5/12">
            <div className="grid grid-cols-1 gap-8 h-full">
              {displayedGalleries.map(gallery => (
                <div key={gallery.id} className="relative group overflow-hidden rounded-md">
                  <Link to={`/gallery/${gallery.id}`} className="block h-full">
                    <div className="relative overflow-hidden h-36">
                      <img
                        src={gallery.image}
                        alt={gallery.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                      {/* تم نقل عدد الصور إلى أسفل العنوان */}
                      <div className="absolute bottom-0 right-0 left-0 p-2 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{gallery.title}</h3>
                        <div className="flex items-center text-white/90 text-xs">
                          <span className="flex items-center ml-2 bg-black/30 px-1 py-0.5 rounded text-[10px]">
                            <Image className="h-2 w-2 ml-0.5" />
                            {gallery.count}
                          </span>
                          <span className="text-[10px]">{gallery.date}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallerySection;
