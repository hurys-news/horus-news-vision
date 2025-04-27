import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const CurrencyGoldPrices = () => {
  const [activeTab, setActiveTab] = useState<'currencies' | 'gold'>('currencies');

  // بيانات وهمية لأسعار العملات
  const currencyData = [
    { name: 'دولار أمريكي', buy: 49.63, sell: 49.77, change: 0.11, up: false },
    { name: 'يورو', buy: 57.56, sell: 57.86, change: 0.28, up: true },
    { name: 'جنيه إسترليني', buy: 66.43, sell: 66.83, change: 0.57, up: true },
    { name: 'ريال سعودي', buy: 13.51, sell: 13.61, change: 0.13, up: false },
  ];

  // بيانات وهمية لأسعار الذهب
  const goldData = [
    { name: 'عيار 24', buy: 3559, sell: 3579, change: 5, up: false },
    { name: 'عيار 21', buy: 3146, sell: 3176, change: 16, up: true },
    { name: 'عيار 18', buy: 3048, sell: 3068, change: 21, up: true },
    { name: 'جنيه ذهب', buy: 26145, sell: 26345, change: 9, up: false },
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* العنوان */}
      <div className="flex justify-between items-center">
        <h3 className="bg-horus-red text-white px-4 py-1.5 text-sm font-bold">أسعار العملات والذهب</h3>
        <button className="text-gray-400 hover:text-gray-600 p-2">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* التبويبات */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'currencies' ? 'text-horus-red border-b-2 border-horus-red' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('currencies')}
        >
          أسعار العملات
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'gold' ? 'text-horus-red border-b-2 border-horus-red' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('gold')}
        >
          أسعار الذهب
        </button>
      </div>

      {/* جدول الأسعار */}
      <div className="p-3">
        <div className="grid grid-cols-4 text-xs text-gray-500 mb-2">
          <div className="text-right font-medium">العملة</div>
          <div className="text-center">شراء</div>
          <div className="text-center">بيع</div>
          <div className="text-center">تغير</div>
        </div>

        {activeTab === 'currencies' ? (
          // عرض أسعار العملات
          <div className="space-y-2">
            {currencyData.map((currency, index) => (
              <div key={index} className="grid grid-cols-4 text-sm py-1 border-b border-gray-100 last:border-0">
                <div className="text-right font-medium">{currency.name}</div>
                <div className="text-center">{currency.buy}</div>
                <div className="text-center">{currency.sell}</div>
                <div className={`text-center flex items-center justify-center ${currency.up ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="ml-1">{currency.change}</span>
                  <span>{currency.up ? '↑' : '↓'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // عرض أسعار الذهب
          <div className="space-y-2">
            {goldData.map((gold, index) => (
              <div key={index} className="grid grid-cols-4 text-sm py-1 border-b border-gray-100 last:border-0">
                <div className="text-right font-medium">{gold.name}</div>
                <div className="text-center">{gold.buy}</div>
                <div className="text-center">{gold.sell}</div>
                <div className={`text-center flex items-center justify-center ${gold.up ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="ml-1">{gold.change}</span>
                  <span>{gold.up ? '↑' : '↓'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-400 mt-3 text-center">
          مصدر البيانات: البنك المركزي • آخر تحديث: 04:45
        </div>
      </div>
    </div>
  );
};

export default CurrencyGoldPrices;
