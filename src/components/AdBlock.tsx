
import React from 'react';
import { AdSize } from '@/lib/adsHelper';
import GoogleAdUnit from './GoogleAdUnit';

interface AdBlockProps {
  adSlot: string;
  format: AdSize;
  showPlaceholder?: boolean;
  className?: string;
}

const AdBlock: React.FC<AdBlockProps> = ({ 
  adSlot, 
  format, 
  showPlaceholder = true, 
  className = '' 
}) => {
  // في بيئة الإنتاج، سيتم استخدام GoogleAdUnit فقط
  if (!showPlaceholder) {
    return <GoogleAdUnit adSlot={adSlot} adFormat={format} className={className} />;
  }

  // أحجام مختلفة للإعلانات
  const heights = {
    auto: 'h-28',
    rectangle: 'h-64',
    horizontal: 'h-24',
    vertical: 'h-96'
  };
  
  return (
    <div className={`${className} my-4`}>
      <div className={`bg-gray-100 border border-dashed border-gray-300 p-2 text-center ${heights[format]} flex flex-col justify-center rounded`}>
        <span className="text-xs text-gray-500 mb-1">إعلان</span>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-500 text-sm">مساحة إعلانية ({format})</span>
        </div>
        <span className="text-xs text-gray-400">Ad Slot: {adSlot}</span>
      </div>
    </div>
  );
};

export default AdBlock;
