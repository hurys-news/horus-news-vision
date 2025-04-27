
import { Info, Zap, BarChart4, Target } from 'lucide-react';

const AdServices = () => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-cairo font-bold text-2xl text-horus-darkGray mb-2">خدمات إعلانية متميزة</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">نقدم مجموعة متكاملة من الحلول الإعلانية المبتكرة التي تضمن وصول رسالتك بفعالية إلى جمهورك المستهدف</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-horus hover:shadow-horus-hover transition-shadow">
            <div className="mb-4 text-horus-red bg-horus-red/10 w-12 h-12 flex items-center justify-center rounded-full">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-cairo font-bold text-lg mb-2">إعلانات مستهدفة</h3>
            <p className="text-gray-600 text-sm">استهداف دقيق للجمهور بناءً على الاهتمامات والموقع الجغرافي والبيانات الديموغرافية</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-horus hover:shadow-horus-hover transition-shadow">
            <div className="mb-4 text-horus-blue bg-horus-blue/10 w-12 h-12 flex items-center justify-center rounded-full">
              <BarChart4 className="w-6 h-6" />
            </div>
            <h3 className="font-cairo font-bold text-lg mb-2">تقارير تحليلية</h3>
            <p className="text-gray-600 text-sm">تقارير مفصلة حول أداء حملاتك الإعلانية ومعدلات التفاعل والتحويل</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-horus hover:shadow-horus-hover transition-shadow">
            <div className="mb-4 text-horus-gold bg-horus-gold/10 w-12 h-12 flex items-center justify-center rounded-full">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-cairo font-bold text-lg mb-2">تصميم إبداعي</h3>
            <p className="text-gray-600 text-sm">تصميم إعلانات جذابة ومبتكرة تتوافق مع هوية علامتك التجارية وتحقق أهدافك</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-horus hover:shadow-horus-hover transition-shadow">
            <div className="mb-4 text-horus-darkBlue bg-horus-darkBlue/10 w-12 h-12 flex items-center justify-center rounded-full">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-cairo font-bold text-lg mb-2">استشارات تسويقية</h3>
            <p className="text-gray-600 text-sm">فريق من الخبراء لمساعدتك في تطوير استراتيجية إعلانية فعالة تناسب ميزانيتك وأهدافك</p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <button className="bg-horus-red hover:bg-horus-darkBlue text-white px-6 py-3 rounded-lg font-bold transition-colors">
            تواصل معنا للإعلان
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdServices;
