import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const SimpleAdmin = () => {
  // حالة النموذج
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isTopStory, setIsTopStory] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);

  // جلب الفئات عند تحميل الصفحة
  useState(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');
        
        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error('خطأ في جلب الفئات:', error);
        toast({
          title: "خطأ في جلب الفئات",
          description: "حدث خطأ أثناء محاولة جلب الفئات",
          variant: "destructive"
        });
      }
    };
    
    fetchCategories();
  }, []);

  // إضافة خبر جديد
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setResult(null);
      
      // التحقق من البيانات
      if (!title || !excerpt || !content || !categoryId) {
        toast({
          title: "بيانات غير مكتملة",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive"
        });
        return;
      }
      
      console.log('محاولة إضافة خبر جديد:', {
        title,
        excerpt,
        content: content.substring(0, 20) + '...',
        categoryId,
        image,
        isTopStory,
        isBreaking
      });
      
      // إضافة الخبر مباشرة إلى قاعدة البيانات
      const { data, error } = await supabase
        .from('news')
        .insert([
          {
            title,
            excerpt,
            content,
            category_id: categoryId,
            image,
            is_top_story: isTopStory,
            is_breaking: isBreaking,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            view_count: 0
          }
        ])
        .select();
      
      if (error) {
        console.error('خطأ في إضافة الخبر:', error);
        setResult({
          success: false,
          error: error
        });
        throw error;
      }
      
      console.log('تم إضافة الخبر بنجاح:', data);
      setResult({
        success: true,
        data: data
      });
      
      toast({
        title: "تم إضافة الخبر بنجاح",
        description: "تم إضافة الخبر الجديد بنجاح إلى قاعدة البيانات",
      });
      
      // إعادة تعيين النموذج
      setTitle('');
      setExcerpt('');
      setContent('');
      setImage('');
      setCategoryId('');
      setIsTopStory(false);
      setIsBreaking(false);
    } catch (error: any) {
      console.error('خطأ غير متوقع في إضافة الخبر:', error);
      
      toast({
        title: "خطأ في إضافة الخبر",
        description: error.message || "حدث خطأ أثناء محاولة إضافة الخبر",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">لوحة التحكم المبسطة</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* نموذج إضافة خبر */}
        <Card>
          <CardHeader>
            <CardTitle>إضافة خبر جديد</CardTitle>
            <CardDescription>أدخل بيانات الخبر الجديد</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNews} className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الخبر</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="أدخل عنوان الخبر"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt">ملخص الخبر</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="أدخل ملخص الخبر"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="content">محتوى الخبر</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="أدخل محتوى الخبر"
                  className="min-h-[150px]"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="image">رابط الصورة</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="أدخل رابط الصورة"
                />
              </div>
              
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select
                  value={categoryId}
                  onValueChange={(value) => setCategoryId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="isTopStory"
                  checked={isTopStory}
                  onCheckedChange={(checked) => setIsTopStory(checked as boolean)}
                />
                <Label htmlFor="isTopStory">خبر رئيسي</Label>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="isBreaking"
                  checked={isBreaking}
                  onCheckedChange={(checked) => setIsBreaking(checked as boolean)}
                />
                <Label htmlFor="isBreaking">خبر عاجل</Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'جاري إضافة الخبر...' : 'إضافة الخبر'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* نتيجة العملية */}
        <Card>
          <CardHeader>
            <CardTitle>نتيجة العملية</CardTitle>
            <CardDescription>معلومات عن نتيجة إضافة الخبر</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">الحالة:</p>
                  <p className={result.success ? "text-green-600" : "text-red-600"}>
                    {result.success ? 'تم بنجاح' : 'فشل'}
                  </p>
                </div>
                
                {result.success ? (
                  <div>
                    <p className="font-semibold">معرف الخبر:</p>
                    <p>{result.data[0]?.id}</p>
                    
                    <p className="font-semibold mt-2">عنوان الخبر:</p>
                    <p>{result.data[0]?.title}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold">رسالة الخطأ:</p>
                    <p className="text-red-600">{result.error?.message || 'خطأ غير معروف'}</p>
                    
                    <p className="font-semibold mt-2">كود الخطأ:</p>
                    <p className="text-red-600">{result.error?.code || 'غير متوفر'}</p>
                    
                    <p className="font-semibold mt-2">تفاصيل الخطأ:</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(result.error, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center">لم يتم إجراء أي عملية بعد</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* معلومات التصحيح */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>معلومات التصحيح</CardTitle>
          <CardDescription>معلومات مفيدة لتصحيح المشاكل</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">عنوان URL للمشروع:</p>
              <p className="text-sm break-all">{window.location.origin}</p>
            </div>
            <div>
              <p className="font-semibold">متغيرات البيئة:</p>
              <p className="text-sm">
                VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? 'موجود' : 'غير موجود'}
              </p>
              <p className="text-sm">
                VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'موجود' : 'غير موجود'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAdmin;
