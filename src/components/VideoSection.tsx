import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft } from 'lucide-react';

// نموذج بيانات الفيديو
interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
  views?: number;
}

// بيانات وهمية للفيديوهات
const dummyVideos: VideoItem[] = [
  {
    id: 'v1',
    title: 'تقرير خاص: أزمة الأمن المائي تهدد مستقبل المنطقة العربية',
    thumbnail: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2071&auto=format&fit=crop',
    duration: '12:45',
    date: 'منذ 3 أيام',
    views: 1250
  },
  {
    id: 'v2',
    title: 'وزير الاقتصاد يكشف في حوار حصري عن خطط التنمية المستدامة للعقد القادم',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop',
    duration: '18:30',
    date: 'منذ 5 أيام',
    views: 2340
  },
  {
    id: 'v3',
    title: 'جولة حصرية داخل أكبر مشروع للطاقة الشمسية في الشرق الأوسط',
    thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop',
    duration: '08:15',
    date: 'منذ أسبوع',
    views: 1870
  },
  {
    id: 'v4',
    title: 'تقرير شامل: التحول الرقمي في القطاع الحكومي - إنجازات غير مسبوقة وتحديات مستقبلية',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2074&auto=format&fit=crop',
    duration: '14:20',
    date: 'منذ 10 أيام',
    views: 1560
  }
];

const VideoSection = () => {
  // استخدام أول فيديو كفيديو رئيسي وفيديوهين فقط كفيديوهات ثانوية
  const [featuredVideo, secondVideo, thirdVideo] = dummyVideos;
  const displayedVideos = [secondVideo, thirdVideo];

  return (
    <section className="py-4">
      <div className="px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="bg-horus-blue text-white px-5 py-1.5 text-lg font-bold rounded-sm shadow-md">فيديوهات الأخبار المصورة</h2>
            <Link to="/videos" className="text-horus-blue hover:text-horus-blue/80 text-xs font-medium hover:underline flex items-center bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
              عرض جميع الفيديوهات
              <ChevronLeft className="h-3 w-3 mr-1" />
            </Link>
          </div>
          <div className="w-full border-b-2 border-horus-blue/20"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* الفيديو الرئيسي (تم تكبيره) */}
          <div className="md:w-7/12 relative group overflow-hidden rounded-lg">
            <Link to={`/video/${featuredVideo.id}`} className="block h-full">
              <div className="relative h-full overflow-hidden">
                <img
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ minHeight: '320px' }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-horus-blue bg-opacity-80 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-10 w-10 text-white fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 left-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{featuredVideo.title}</h3>
                  <div className="flex items-center text-white/90 text-xs">
                    <span className="flex items-center ml-3 bg-black/30 px-1.5 py-0.5 rounded">
                      <Play className="h-2.5 w-2.5 ml-0.5 fill-current" />
                      {featuredVideo.duration}
                    </span>
                    <span className="ml-3">{featuredVideo.date}</span>
                    {featuredVideo.views && (
                      <span className="flex items-center">
                        <span className="mx-1 text-white/50">•</span>
                        {featuredVideo.views} مشاهدة
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* قائمة الفيديوهات الأخرى (فيديوهين فقط) */}
          <div className="md:w-5/12">
            <div className="grid grid-cols-1 gap-8 h-full">
              {displayedVideos.map(video => (
              <div key={video.id} className="relative group overflow-hidden rounded-md">
                <Link to={`/video/${video.id}`} className="block h-full">
                  <div className="relative overflow-hidden h-36">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-horus-blue bg-opacity-80 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white fill-current" />
                      </div>
                    </div>
                    {/* تم نقل مدة الفيديو إلى أسفل العنوان */}
                  </div>
                  <div className="relative w-full">
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="absolute bottom-0 right-0 left-0 p-2 bg-gradient-to-t from-black to-transparent">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{video.title}</h3>
                      <div className="flex items-center text-white/90 text-xs">
                        <span className="flex items-center ml-2 bg-black/30 px-1 py-0.5 rounded text-[10px]">
                          <Play className="h-2 w-2 ml-0.5 fill-current" />
                          {video.duration}
                        </span>
                        <span className="text-[10px]">{video.date}</span>
                        {video.views && (
                          <span className="flex items-center mr-1 text-[10px]">
                            <span className="mx-1 text-white/50">•</span>
                            {video.views} مشاهدة
                          </span>
                        )}
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

export default VideoSection;
