
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 خطأ: محاولة الوصول إلى صفحة غير موجودة:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-16">
        <div className="text-center max-w-md px-4">
          <h1 className="text-6xl font-cairo font-bold text-horus-red mb-4">404</h1>
          <p className="text-xl text-gray-700 mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
          <p className="text-gray-500 mb-8">قد تكون الصفحة قد تم نقلها أو حذفها أو أن الرابط غير صحيح</p>
          <Link 
            to="/" 
            className="bg-horus-blue hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors inline-block"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
