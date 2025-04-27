import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * الحصول على لون الفئة
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'سياسة': 'bg-gradient-to-r from-horus-red/80 to-horus-red text-white',
    'اقتصاد': 'bg-gradient-to-r from-green-600 to-green-700 text-white',
    'تكنولوجيا': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    'رياضة': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
    'ثقافة': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    'عاجل': 'bg-gradient-to-r from-red-600 to-red-700 text-white',
    'رأي': 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
    'نبض الخبر': 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
    'عمق الحدث': 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
    'رؤى وتحليلات': 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white',
    'صوت الشارع': 'bg-gradient-to-r from-teal-500 to-teal-600 text-white',
    'ملفات خاصة': 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white',
    'منصة الرأي': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
  };

  return colors[category] || 'bg-gradient-to-r from-gray-600 to-gray-700 text-white';
}

/**
 * تنسيق التاريخ بالعربية
 */
export function formatDate(dateString: string): string {
  // إذا كان التاريخ بتنسيق ISO
  if (dateString.includes('T')) {
    const date = new Date(dateString);

    // استخدام API Intl لتنسيق التاريخ بالعربية
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  // إذا كان التاريخ بتنسيق نسبي (مثل "منذ 3 ساعات")
  return dateString;
}

/**
 * اختصار النص إلى طول محدد
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
