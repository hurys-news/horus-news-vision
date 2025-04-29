// أداة تشخيص مشاكل تسجيل الدخول
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('بدء تشخيص مشاكل تسجيل الدخول...');

// التحقق من وجود ملف .env
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ تم العثور على ملف .env');
  
  // قراءة محتوى الملف
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // التحقق من وجود متغيرات البيئة المطلوبة
  const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL=');
  const hasSupabaseAnonKey = envContent.includes('VITE_SUPABASE_ANON_KEY=');
  
  console.log(`${hasSupabaseUrl ? '✅' : '❌'} VITE_SUPABASE_URL`);
  console.log(`${hasSupabaseAnonKey ? '✅' : '❌'} VITE_SUPABASE_ANON_KEY`);
  
  if (!hasSupabaseUrl || !hasSupabaseAnonKey) {
    console.log('\n⚠️ تحذير: بعض متغيرات البيئة المطلوبة غير موجودة في ملف .env');
    console.log('يرجى التأكد من إضافة المتغيرات التالية:');
    console.log('VITE_SUPABASE_URL=https://your-project-url.supabase.co');
    console.log('VITE_SUPABASE_ANON_KEY=your-anon-key');
  }
} else {
  console.log('❌ لم يتم العثور على ملف .env');
  console.log('\nيرجى إنشاء ملف .env في المجلد الرئيسي للمشروع وإضافة المتغيرات التالية:');
  console.log('VITE_SUPABASE_URL=https://your-project-url.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=your-anon-key');
}

// التحقق من وجود ملف package.json
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('\n✅ تم العثور على ملف package.json');
  
  // التحقق من وجود التبعيات المطلوبة
  const packageJson = require(packagePath);
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const hasSupabase = deps['@supabase/supabase-js'];
  console.log(`${hasSupabase ? '✅' : '❌'} @supabase/supabase-js`);
  
  if (!hasSupabase) {
    console.log('\n⚠️ تحذير: مكتبة Supabase غير مثبتة');
    console.log('يرجى تثبيت المكتبة باستخدام الأمر:');
    console.log('npm install @supabase/supabase-js');
  }
} else {
  console.log('\n❌ لم يتم العثور على ملف package.json');
  console.log('يرجى التأكد من أنك في المجلد الصحيح للمشروع');
}

console.log('\nاكتمل التشخيص. يرجى مراجعة النتائج أعلاه وإصلاح المشاكل المحددة.');
