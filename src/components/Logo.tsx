
import { useEffect, useState } from 'react';

const Logo = ({ size = 'medium', animated = true }: { size?: 'small' | 'medium' | 'large', animated?: boolean }) => {
  const [isGlowing, setIsGlowing] = useState(false);
  
  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setIsGlowing(prev => !prev);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [animated]);
  
  const sizes = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-16',
  };

  return (
    <div className={`${sizes[size]} relative`}>
      <img 
        src="/lovable-uploads/bf5d9695-8dfb-4bda-a6e3-b0d0bdca0147.png" 
        alt="حورس نيوز" 
        className={`h-full w-auto transition-all duration-1000 ${isGlowing ? 'filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]' : ''}`}
      />
      {isGlowing && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-[shine_1.5s_ease-in-out]" 
             style={{ 
               animation: 'shine 1.5s ease-in-out',
               backgroundSize: '200% 100%',
             }}
        />
      )}
      <style>
        {`
          @keyframes shine {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
};

export default Logo;
