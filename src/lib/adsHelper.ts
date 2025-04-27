
// مساعد لإدارة إعلانات جوجل

export type AdSize = 'auto' | 'rectangle' | 'horizontal' | 'vertical';

export interface AdConfig {
  adUnit: string;
  size: AdSize;
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'infeed';
}

// تخطيط أماكن الإعلانات في الموقع
export const siteAdConfig = {
  home: [
    { adUnit: 'home-top', size: 'horizontal', position: 'top' },
    { adUnit: 'home-middle', size: 'rectangle', position: 'middle' },
    { adUnit: 'home-sidebar', size: 'vertical', position: 'sidebar' },
    { adUnit: 'home-infeed', size: 'auto', position: 'infeed' },
  ],
  article: [
    { adUnit: 'article-top', size: 'horizontal', position: 'top' },
    { adUnit: 'article-middle', size: 'rectangle', position: 'middle' },
    { adUnit: 'article-bottom', size: 'horizontal', position: 'bottom' },
    { adUnit: 'article-sidebar', size: 'vertical', position: 'sidebar' },
  ],
  category: [
    { adUnit: 'category-top', size: 'horizontal', position: 'top' },
    { adUnit: 'category-infeed', size: 'auto', position: 'infeed' },
    { adUnit: 'category-sidebar', size: 'vertical', position: 'sidebar' },
  ],
  sports: [
    { adUnit: 'sports-top', size: 'horizontal', position: 'top' },
    { adUnit: 'sports-infeed', size: 'auto', position: 'infeed' },
    { adUnit: 'sports-sidebar', size: 'vertical', position: 'sidebar' },
  ],
};

// وظيفة وهمية لتهيئة إعلانات جوجل (في الإنتاج سيتم استبدالها بالشيفرة الفعلية)
export const initAds = () => {
  console.log('تهيئة إعلانات جوجل');
  
  // في الإنتاج، سيتم استبدال هذا بكود إعلانات جوجل الفعلي
  // (window.adsbygoogle = window.adsbygoogle || []).push({});
};

// وظيفة لإعادة تحميل الإعلانات (مفيدة عند تغيير المحتوى)
export const refreshAds = () => {
  console.log('إعادة تحميل الإعلانات');
  
  // في الإنتاج، سيتم استبدال هذا بكود إعلانات جوجل الفعلي
  // if (window.adsbygoogle) {
  //   window.adsbygoogle.push({});
  // }
};

export default {
  siteAdConfig,
  initAds,
  refreshAds
};
