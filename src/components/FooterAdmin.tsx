
import { useState, useEffect } from 'react';
import AdminButton from './AdminButton';

const FooterAdmin = () => {
  const [showTip, setShowTip] = useState(false);
  
  useEffect(() => {
    // عرض النصيحة بشكل متناوب
    const timer = setTimeout(() => {
      setShowTip(true);
      
      const hideTimer = setTimeout(() => {
        setShowTip(false);
      }, 5000);
      
      return () => clearTimeout(hideTimer);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="border-t mt-4 pt-4 flex justify-center items-center relative">
      <div className="flex flex-col items-center">
        <AdminButton />
        
        {showTip && (
          <div className="absolute bottom-full mb-2 bg-horus-blue text-white text-xs py-1 px-3 rounded-full animate-fade-in">
            اضغط هنا للوصول إلى لوحة الإدارة
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterAdmin;
