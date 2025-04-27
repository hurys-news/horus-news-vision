// هذا الملف يقوم بتعطيل أي Service Worker مسجل سابقًا

// التحقق من وجود Service Worker في المتصفح
if ('serviceWorker' in navigator) {
  // إلغاء تسجيل جميع Service Workers
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
      console.log('تم إلغاء تسجيل Service Worker');
    }
  });
}

// منع تسجيل Service Workers جديدة
window.addEventListener('beforeinstallprompt', (e) => {
  // منع ظهور نافذة التثبيت
  e.preventDefault();
  return false;
});
