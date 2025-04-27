
import React, { useEffect, useRef } from 'react';

interface GoogleAdUnitProps {
  adSlot: string;
  adFormat: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

const AdSizes = {
  auto: { width: 'auto', height: 'auto' },
  rectangle: { width: '336', height: '280' },
  horizontal: { width: '728', height: '90' },
  vertical: { width: '300', height: '600' }
};

const GoogleAdUnit: React.FC<GoogleAdUnitProps> = ({ adSlot, adFormat, className = '' }) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // محاكاة تحميل إعلانات جوجل (في بيئة الإنتاج سيتم استبدال هذا بالكود الفعلي)
    if (adRef.current) {
      const size = AdSizes[adFormat];
      
      // في بيئة الإنتاج، هذا هو المكان الذي سيتم فيه تحميل إعلان AdSense
      console.log(`تم تحميل إعلان جوجل: ${adSlot} بحجم ${JSON.stringify(size)}`);
      
      // هنا محاكاة للإعلان في بيئة التطوير
      const adElement = adRef.current;
      adElement.style.display = 'flex';
      adElement.style.alignItems = 'center';
      adElement.style.justifyContent = 'center';
      adElement.style.backgroundColor = '#f5f5f5';
      adElement.style.border = '1px dashed #ccc';
      adElement.style.borderRadius = '4px';
      adElement.style.padding = '8px';
      adElement.style.margin = '8px 0';
      adElement.style.width = size.width === 'auto' ? '100%' : `${size.width}px`;
      adElement.style.height = size.height === 'auto' ? '100px' : `${size.height}px`;
      
      adElement.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 10px; color: #888; margin-bottom: 4px;">إعلان</div>
          <div style="color: #555;">وحدة إعلان جوجل ${adFormat}</div>
          <div style="font-size: 12px; color: #888; margin-top: 4px;">Ad Slot: ${adSlot}</div>
        </div>
      `;
    }
    
    // في الإنتاج، سيكون الكود كما يلي:
    // if (window.adsbygoogle && adRef.current) {
    //   (window.adsbygoogle = window.adsbygoogle || []).push({});
    // }
    
  }, [adSlot, adFormat]);

  return (
    <div className={className}>
      <div ref={adRef} className="google-ad-unit">
        {/* هنا سيتم تحميل الإعلان من جوجل */}
      </div>
    </div>
  );
};

export default GoogleAdUnit;
