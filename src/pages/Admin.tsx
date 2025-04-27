
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Header from '@/components/AdminHeader';
import AdminSidebar from '@/components/AdminSidebar';
import NewsEditor from '@/components/NewsEditor';
import Logo from '@/components/Logo';
import { toast } from '@/hooks/use-toast';
import { NewsItem } from '@/components/NewsCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/lib/types';

type ContentType = 'news' | 'article' | 'opinion';

// سيتم جلب التصنيفات من Supabase
const DEFAULT_CATEGORIES = [
  'سياسة',
  'اقتصاد',
  'رياضة',
  'تكنولوجيا',
  'ثقافة',
  'نبض الخبر',
  'عمق الحدث',
  'رؤى وتحليلات',
  'صوت الشارع',
  'ملفات خاصة',
  'منصة الرأي',
  'عاجل',
];

// مكون لعرض سجل التغييرات
const AuditLogItem = ({ action, user, date, content }: {
  action: string;
  user: string;
  date: string;
  content: string;
}) => (
  <div className="border-b pb-3 pt-3 first:pt-0">
    <div className="flex justify-between mb-2">
      <div className="font-bold text-horus-blue">{action}</div>
      <div className="text-sm text-gray-500">{date}</div>
    </div>
    <div className="text-sm mb-1">{content}</div>
    <div className="text-xs text-gray-500">بواسطة: {user}</div>
  </div>
);

const Admin = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<string>('dashboard');

  // بيانات المحتوى الجديد
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [contentType, setContentType] = useState<ContentType>('news');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');
  const [isTopStory, setIsTopStory] = useState<boolean>(false);
  const [isBreaking, setIsBreaking] = useState<boolean>(false);
  const [publishDate, setPublishDate] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  // بيانات للأخبار المخزنة
  const [savedNews, setSavedNews] = useState<NewsItem[]>([]);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // بيانات الفئات
  const [categories, setCategories] = useState<Category[]>([]);

  // حالة التحميل
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // إحصائيات
  const [stats, setStats] = useState({
    totalNews: 0,
    totalViews: 0,
    pendingReviews: 0
  });

  // سجل التغييرات (Audit Log)
  const [auditLog, setAuditLog] = useState<{
    id: number;
    action: string;
    user: string;
    date: string;
    content: string;
  }[]>([]);

  // جلب الفئات من Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      setCategories(data.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || undefined,
        image: cat.image || undefined
      })));
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الفئات",
        variant: "destructive"
      });
    }
  };

  // جلب الأخبار من Supabase
  const fetchNews = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          categories:category_id (id, name, slug)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedNews = data.map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content || '',
        category: item.categories?.name || 'بدون تصنيف',
        categoryId: item.category_id,
        image: item.image || 'https://source.unsplash.com/random/800x600/?news',
        date: new Date(item.created_at).toLocaleDateString('ar-EG'),
        source: item.source || '',
        isTopStory: item.is_top_story,
        isBreaking: item.is_breaking,
        viewCount: item.view_count,
        tags: item.tags ? item.tags.join(', ') : ''
      }));

      setSavedNews(formattedNews);

      // تحديث الإحصائيات
      setStats({
        totalNews: formattedNews.length,
        totalViews: formattedNews.reduce((sum, item) => sum + (item.viewCount || 0), 0),
        pendingReviews: 0 // يمكن تحديثه لاحقًا إذا كان هناك حالة للمراجعة
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الأخبار",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // جلب سجل التغييرات
  const fetchAuditLog = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select(`
          *,
          profiles:user_id (name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedLog = data.map((log, index) => ({
        id: index + 1,
        action: log.action,
        user: log.profiles?.name || 'مستخدم غير معروف',
        date: new Date(log.created_at).toLocaleDateString('ar-EG', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }),
        content: log.content
      }));

      setAuditLog(formattedLog);
    } catch (error) {
      console.error('Error fetching audit log:', error);
    }
  };

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchCategories();
    fetchNews();
    fetchAuditLog();
  }, []);

  // التعامل مع اختيار الصورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // التحقق من نوع الملف
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "خطأ في الصورة",
          description: "يرجى اختيار ملف صورة صالح (JPG, PNG, GIF, SVG, WEBP)",
          variant: "destructive"
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // نشر أو تحديث المحتوى
  const handlePublish = async () => {
    if (!title || !content || !categoryId) {
      toast({
        title: "لا يمكن النشر",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);

      // تحضير البيانات
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      // تحضير بيانات الخبر
      const newsData = {
        title,
        excerpt: content.substring(0, 150) + '...',
        content,
        category_id: categoryId,
        image: imagePreview,
        source,
        is_top_story: isTopStory,
        is_breaking: isBreaking,
        tags: tagsArray.length > 0 ? tagsArray : null
      };

      let result;

      if (editingNewsId) {
        // تحديث خبر موجود
        result = await supabase
          .from('news')
          .update({
            ...newsData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingNewsId);

        if (result.error) throw result.error;

        // إضافة سجل التعديل
        await supabase.from('audit_log').insert({
          action: 'تعديل محتوى',
          user_id: user?.id,
          content: `تعديل خبر: ${title}`,
          created_at: new Date().toISOString()
        });

        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث المحتوى ونشره على الموقع"
        });

        // إلغاء وضع التحرير
        setEditingNewsId(null);
      } else {
        // إضافة خبر جديد
        result = await supabase
          .from('news')
          .insert({
            ...newsData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            view_count: 0
          });

        if (result.error) throw result.error;

        // إضافة سجل النشر
        await supabase.from('audit_log').insert({
          action: 'إضافة محتوى',
          user_id: user?.id,
          content: `إضافة خبر جديد: ${title}`,
          created_at: new Date().toISOString()
        });

        toast({
          title: "تم النشر بنجاح",
          description: "تم حفظ المحتوى ونشره على الموقع"
        });
      }

      // إعادة تحميل الأخبار وسجل التغييرات
      fetchNews();
      fetchAuditLog();

      // إعادة تعيين النموذج
      resetForm();
    } catch (error) {
      console.error('Error publishing content:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المحتوى",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // وظيفة إعادة تعيين النموذج
  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setCategoryId('');
    setSource('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsTopStory(false);
    setIsBreaking(false);
    setPublishDate('');
    setTags('');
    setEditingNewsId(null);
  };

  // وظيفة تحرير خبر موجود
  const handleEdit = async (newsId: string) => {
    try {
      // جلب الخبر من Supabase للحصول على البيانات الكاملة
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          categories:category_id (id, name)
        `)
        .eq('id', newsId)
        .single();

      if (error) throw error;
      if (!data) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على الخبر",
          variant: "destructive"
        });
        return;
      }

      // تعبئة النموذج بالبيانات
      setTitle(data.title);
      setContent(data.content || '');
      setCategory(data.categories?.name || '');
      setCategoryId(data.category_id);
      setImagePreview(data.image || null);
      setSource(data.source || '');
      setIsTopStory(data.is_top_story);
      setIsBreaking(data.is_breaking);
      setTags(data.tags ? data.tags.join(', ') : '');
      setEditingNewsId(newsId);
      setSelectedTab('createContent');  // الانتقال إلى تبويب الإنشاء/التحرير
    } catch (error) {
      console.error('Error fetching news for edit:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل بيانات الخبر",
        variant: "destructive"
      });
    }
  };

  // وظيفة حذف خبر
  const handleDelete = async (newsId: string) => {
    try {
      // البحث عن الخبر المحدد لاستخدام عنوانه في سجل الحذف
      const newsToDelete = savedNews.find(news => news.id === newsId);

      if (!newsToDelete) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على الخبر",
          variant: "destructive"
        });
        return;
      }

      // حذف الخبر من Supabase
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsId);

      if (error) throw error;

      // إضافة سجل الحذف
      await supabase.from('audit_log').insert({
        action: 'حذف محتوى',
        user_id: user?.id,
        content: `حذف خبر: ${newsToDelete.title}`,
        created_at: new Date().toISOString()
      });

      // تحديث قائمة الأخبار
      setSavedNews(savedNews.filter(news => news.id !== newsId));

      toast({
        title: "تم الحذف",
        description: "تم حذف المحتوى بنجاح"
      });

      // إعادة تحميل البيانات
      fetchNews();
      fetchAuditLog();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المحتوى",
        variant: "destructive"
      });
    }
  };

  // تصفية الأخبار حسب البحث والتصنيف
  const filteredNews = savedNews.filter(news => {
    const matchesSearch = news.title.includes(searchTerm) ||
                         news.excerpt.includes(searchTerm) ||
                         (news.source && news.source.includes(searchTerm));
    const matchesCategory = categoryFilter === 'all' || news.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6 text-horus-blue">لوحة تحكم حورس نيوز</h1>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="mb-4 bg-gradient-to-r from-horus-blue/10 to-horus-red/10 p-1">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-white">الرئيسية</TabsTrigger>
              <TabsTrigger value="createContent" className="data-[state=active]:bg-white">إنشاء محتوى</TabsTrigger>
              <TabsTrigger value="manageContent" className="data-[state=active]:bg-white">إدارة المحتوى</TabsTrigger>
              <TabsTrigger value="auditLog" className="data-[state=active]:bg-white">سجل التغييرات</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-white">المستخدمون</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white">الإعدادات</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium mb-2">إجمالي المقالات</h3>
                  <p className="text-3xl font-bold text-horus-blue">{stats.totalNews}</p>
                </Card>

                <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium mb-2">إجمالي المشاهدات</h3>
                  <p className="text-3xl font-bold text-horus-red">{stats.totalViews}</p>
                </Card>

                <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium mb-2">عدد الفئات</h3>
                  <p className="text-3xl font-bold text-horus-gold">{categories.length}</p>
                </Card>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500">جاري تحميل البيانات...</p>
                </div>
              ) : (

              <Card className="mt-6 p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-4">المحتوى الأكثر قراءة</h3>
                <div className="space-y-4">
                  {savedNews.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-2 hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                      <p className="text-horus-blue font-bold">{item.viewCount || 0} مشاهدة</p>
                    </div>
                  ))}
                </div>
              </Card>
              )}
            </TabsContent>

            <TabsContent value="createContent">
              <Card className="p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-6 border-r-4 border-horus-blue pr-3">
                  {editingNewsId ? 'تعديل محتوى' : 'إنشاء محتوى جديد'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">نوع المحتوى</label>
                    <Select
                      value={contentType}
                      onValueChange={(value) => setContentType(value as ContentType)}
                    >
                      <SelectTrigger className="border-horus-blue/20 focus:border-horus-blue">
                        <SelectValue placeholder="اختر نوع المحتوى" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news">خبر</SelectItem>
                        <SelectItem value="article">مقال</SelectItem>
                        <SelectItem value="opinion">رأي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">العنوان</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="أدخل عنوان المحتوى"
                      className="border-horus-blue/20 focus:border-horus-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">التصنيف</label>
                    <Select
                      value={categoryId}
                      onValueChange={(value) => {
                        setCategoryId(value);
                        // تحديث اسم الفئة أيضًا للعرض
                        const selectedCategory = categories.find(cat => cat.id === value);
                        if (selectedCategory) {
                          setCategory(selectedCategory.name);
                        }
                      }}
                    >
                      <SelectTrigger className="border-horus-blue/20 focus:border-horus-blue">
                        <SelectValue placeholder="اختر تصنيف المحتوى" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.length > 0 ? (
                          categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))
                        ) : (
                          DEFAULT_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">المصدر</label>
                      <Input
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="أدخل مصدر الخبر"
                        className="border-horus-blue/20 focus:border-horus-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">تاريخ النشر (اختياري)</label>
                      <Input
                        type="datetime-local"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        className="border-horus-blue/20 focus:border-horus-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">الوسوم (مفصولة بفواصل)</label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="مثال: سياسة, اقتصاد, مصر"
                      className="border-horus-blue/20 focus:border-horus-blue"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      أدخل الوسوم مفصولة بفواصل لتسهيل البحث عن المحتوى
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="topStory"
                        checked={isTopStory}
                        onCheckedChange={(checked) => setIsTopStory(checked as boolean)}
                      />
                      <Label htmlFor="topStory">إضافة كخبر مميز (Top Story)</Label>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="breaking"
                        checked={isBreaking}
                        onCheckedChange={(checked) => setIsBreaking(checked as boolean)}
                      />
                      <Label htmlFor="breaking">وسم كخبر عاجل</Label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">الصورة الرئيسية</label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/jpeg,image/png,image/gif,image/svg+xml,image/webp"
                        className="border-horus-blue/20 focus:border-horus-blue"
                      />
                      {imagePreview && (
                        <div className="relative w-20 h-20 border rounded overflow-hidden">
                          <img src={imagePreview} alt="معاينة" className="w-full h-full object-cover" />
                          <button
                            className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview(null);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      صيغ الصور المدعومة: JPG, PNG, GIF, SVG, WEBP
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">المحتوى</label>
                    <div className="bg-white rounded-md overflow-hidden">
                      <NewsEditor value={content} onChange={setContent} />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handlePublish}
                      className="mt-4 bg-horus-blue hover:bg-horus-blue/90 text-white"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="animate-spin ml-2">⏳</span>
                          {editingNewsId ? 'جاري الحفظ...' : 'جاري النشر...'}
                        </>
                      ) : (
                        editingNewsId ? 'حفظ التعديلات' : 'نشر المحتوى'
                      )}
                    </Button>

                    {editingNewsId && (
                      <Button
                        onClick={resetForm}
                        className="mt-4"
                        variant="outline"
                        disabled={isSaving}
                      >
                        إلغاء
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="manageContent">
              <Card className="p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-6 border-r-4 border-horus-blue pr-3">إدارة المحتوى الحالي</h3>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    placeholder="البحث عن محتوى..."
                    className="max-w-sm border-horus-blue/20 focus:border-horus-blue"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-[180px] border-horus-blue/20 focus:border-horus-blue">
                      <SelectValue placeholder="جميع التصنيفات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التصنيفات</SelectItem>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))
                      ) : (
                        DEFAULT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500">جاري تحميل البيانات...</p>
                  </div>
                ) : (
                  <div className="border rounded-md shadow-sm">
                    <div className="bg-gradient-to-r from-horus-blue/10 to-horus-red/10 p-3 grid grid-cols-12 gap-2 font-medium">
                      <div className="col-span-5">العنوان</div>
                      <div className="col-span-2">التصنيف</div>
                      <div className="col-span-2">التاريخ</div>
                      <div className="col-span-1">الحالة</div>
                      <div className="col-span-2">الإجراءات</div>
                    </div>

                    {filteredNews.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        لا توجد نتائج للبحث
                      </div>
                    ) : (
                      filteredNews.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border-t hover:bg-gray-50 transition-colors">
                        <div className="col-span-5 flex items-center">
                          {item.isTopStory && (
                            <span className="ml-1 text-horus-gold text-xs">⭐</span>
                          )}
                          {item.isBreaking && (
                            <span className="ml-1 text-red-600 text-xs">⚡</span>
                          )}
                          <span>{item.title}</span>
                        </div>
                        <div className="col-span-2">
                          <span className={`bg-gradient-to-r text-white text-xs py-1 px-2 rounded-full ${
                            item.category === 'سياسة' ? 'from-horus-red/80 to-horus-red' :
                            item.category === 'اقتصاد' ? 'from-green-600 to-green-700' :
                            item.category === 'رياضة' ? 'from-orange-500 to-orange-600' :
                            item.category === 'تكنولوجيا' ? 'from-blue-500 to-blue-600' :
                            'from-gray-600 to-gray-700'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        <div className="col-span-2 text-gray-500 text-sm">{item.date}</div>
                        <div className="col-span-1">
                          <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                        </div>
                        <div className="col-span-2 flex space-x-2 space-x-reverse">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-horus-blue/20 text-horus-blue hover:bg-horus-blue/10"
                            onClick={() => handleEdit(item.id)}
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                )}
              </Card>
            </TabsContent>

            {/* تبويب سجل التغييرات (Audit Log) */}
            <TabsContent value="auditLog">
              <Card className="p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-6 border-r-4 border-horus-blue pr-3">سجل التغييرات</h3>

                <div className="space-y-0 divide-y">
                  {auditLog.map((log) => (
                    <AuditLogItem
                      key={log.id}
                      action={log.action}
                      user={log.user}
                      date={log.date}
                      content={log.content}
                    />
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-6 border-r-4 border-horus-blue pr-3">إدارة المستخدمين</h3>

                <div className="flex justify-between mb-6">
                  <Input
                    placeholder="البحث عن مستخدم..."
                    className="max-w-sm border-horus-blue/20 focus:border-horus-blue"
                  />
                  <Button
                    variant="outline"
                    className="border-horus-blue/20 text-horus-blue hover:bg-horus-blue hover:text-white"
                  >
                    إضافة مستخدم جديد
                  </Button>
                </div>

                <div className="border rounded-md shadow-sm">
                  <div className="bg-gradient-to-r from-horus-blue/10 to-horus-red/10 p-3 grid grid-cols-12 gap-2 font-medium">
                    <div className="col-span-3">اسم المستخدم</div>
                    <div className="col-span-4">البريد الإلكتروني</div>
                    <div className="col-span-2">الدور</div>
                    <div className="col-span-1">الحالة</div>
                    <div className="col-span-2">الإجراءات</div>
                  </div>

                  {[
                    { name: 'أحمد محمد', email: 'ahmed@horusnews.com', role: 'مدير', status: true },
                    { name: 'سارة خالد', email: 'sara@horusnews.com', role: 'محرر', status: true },
                    { name: 'محمود علي', email: 'mahmoud@horusnews.com', role: 'كاتب', status: false }
                  ].map((user, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 p-3 border-t hover:bg-gray-50 transition-colors">
                      <div className="col-span-3">{user.name}</div>
                      <div className="col-span-4">{user.email}</div>
                      <div className="col-span-2">{user.role}</div>
                      <div className="col-span-1">
                        <span className={`inline-block w-3 h-3 rounded-full ${user.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      </div>
                      <div className="col-span-2 flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm" className="border-horus-blue/20 text-horus-blue hover:bg-horus-blue/10">تعديل</Button>
                        <Button variant="destructive" size="sm">حذف</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="p-6 shadow-sm">
                <h3 className="text-xl font-medium mb-6 border-r-4 border-horus-blue pr-3">إعدادات الموقع</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">اسم الموقع</label>
                    <Input
                      defaultValue="حورس نيوز"
                      className="border-horus-blue/20 focus:border-horus-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">شعار الموقع</label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        className="border-horus-blue/20 focus:border-horus-blue"
                      />
                      <div className="w-16 h-16 border rounded overflow-hidden">
                        <Logo size="large" animated={false} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">وصف الموقع</label>
                    <Textarea
                      defaultValue="منصة حورس نيوز الإخبارية العربية الرائدة: تغطية شاملة للأخبار والتحليلات في السياسة والاقتصاد والتكنولوجيا والثقافة والرياضة"
                      className="border-horus-blue/20 focus:border-horus-blue min-h-24"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">البريد الإلكتروني للتواصل</label>
                      <Input
                        defaultValue="info@horusnews.com"
                        className="border-horus-blue/20 focus:border-horus-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                      <Input
                        defaultValue="+201234567890"
                        className="border-horus-blue/20 focus:border-horus-blue"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">عدد الأخبار المميزة في الصفحة الرئيسية</label>
                      <Input
                        type="number"
                        defaultValue="3"
                        min="1"
                        max="10"
                        className="border-horus-blue/20 focus:border-horus-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">عدد الأخبار في كل قسم</label>
                      <Input
                        type="number"
                        defaultValue="4"
                        min="1"
                        max="12"
                        className="border-horus-blue/20 focus:border-horus-blue"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch id="notifications" />
                    <Label htmlFor="notifications">تفعيل نظام الإشعارات</Label>
                  </div>

                  <Button className="bg-horus-blue hover:bg-horus-blue/90 text-white">حفظ الإعدادات</Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Admin;
