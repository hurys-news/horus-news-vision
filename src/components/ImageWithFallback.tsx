import { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * مكون صورة مع معالجة الأخطاء
 * يعرض صورة بديلة في حالة فشل تحميل الصورة الأصلية
 */
const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  className = '',
  width,
  height
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // إعادة تعيين الحالة عند تغيير مصدر الصورة
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      console.warn(`فشل تحميل الصورة: ${src}، استخدام الصورة البديلة`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
