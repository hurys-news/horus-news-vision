import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// استيراد ملفات اختبار الاتصال بـ Supabase
import './utils/testAuth'; // ملف اختبار المصادقة الجديد
import './utils/testSupabase';
import './utils/checkCategories';
import './utils/checkNews';
import './utils/addTestCategory';
import './utils/addTestNews';
import './utils/checkRLS';
import './utils/addNewsWithoutRLS';

createRoot(document.getElementById("root")!).render(<App />);
