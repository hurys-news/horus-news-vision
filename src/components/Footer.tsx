
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo />
              <span className="mr-2 text-xl font-cairo font-bold">حورس نيوز</span>
            </div>
            <p className="text-gray-300">
              منصة إخبارية عربية رائدة تجمع بين سرعة نقل الخبر ودقة المعلومة وعمق التحليل.
            </p>
            <div className="flex items-center space-x-4 space-x-reverse">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-300 hover:text-horus-gold" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-300 hover:text-horus-gold" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-300 hover:text-horus-gold" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                <Youtube className="h-5 w-5 text-gray-300 hover:text-horus-gold" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-cairo text-lg font-bold mb-4 border-r-2 border-horus-gold pr-2">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-horus-gold">من نحن</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-horus-gold">اتصل بنا</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-horus-gold">سياسة الخصوصية</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-horus-gold">شروط الاستخدام</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-cairo text-lg font-bold mb-4 border-r-2 border-horus-gold pr-2">الأقسام</h3>
            <ul className="space-y-2">
              <li><Link to="/politics" className="text-gray-300 hover:text-horus-gold">سياسة</Link></li>
              <li><Link to="/economy" className="text-gray-300 hover:text-horus-gold">اقتصاد</Link></li>
              <li><Link to="/tech" className="text-gray-300 hover:text-horus-gold">تكنولوجيا</Link></li>
              <li><Link to="/sports" className="text-gray-300 hover:text-horus-gold">رياضة</Link></li>
              <li><Link to="/culture" className="text-gray-300 hover:text-horus-gold">ثقافة</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-cairo text-lg font-bold mb-4 border-r-2 border-horus-gold pr-2">النشرة البريدية</h3>
            <p className="text-gray-300 mb-4">اشترك في نشرتنا البريدية للحصول على آخر الأخبار والتحليلات</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-horus-gold"
              />
              <button 
                type="submit" 
                className="w-full bg-horus-red hover:bg-red-800 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                اشتراك
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {currentYear} حورس نيوز. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
