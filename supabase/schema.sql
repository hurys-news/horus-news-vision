-- إنشاء جداول Supabase لمشروع حورس نيوز

-- تمكين امتداد uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- جدول الفئات
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الكتّاب
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar TEXT,
  title TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الأخبار
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  category_id UUID NOT NULL REFERENCES categories(id),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT,
  author_id UUID REFERENCES authors(id),
  is_top_story BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}'::TEXT[]
);

-- جدول الملفات الشخصية (يرتبط بجدول المستخدمين المدمج في Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'user',
  saved_news UUID[] DEFAULT '{}'::UUID[],
  followed_categories UUID[] DEFAULT '{}'::UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول التعليقات
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  parent_id UUID REFERENCES comments(id)
);

-- إنشاء سياسات أمان الصفوف (Row Level Security)

-- تمكين RLS على جميع الجداول
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- سياسات الفئات
CREATE POLICY "الفئات متاحة للقراءة للجميع"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "الفئات متاحة للتعديل للمسؤولين فقط"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "الفئات متاحة للتحديث للمسؤولين فقط"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "الفئات متاحة للحذف للمسؤولين فقط"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- سياسات الكتّاب
CREATE POLICY "الكتّاب متاحون للقراءة للجميع"
  ON authors FOR SELECT
  USING (true);

CREATE POLICY "الكتّاب متاحون للتعديل للمسؤولين فقط"
  ON authors FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "الكتّاب متاحون للتحديث للمسؤولين فقط"
  ON authors FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "الكتّاب متاحون للحذف للمسؤولين فقط"
  ON authors FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- سياسات الأخبار
CREATE POLICY "الأخبار متاحة للقراءة للجميع"
  ON news FOR SELECT
  USING (true);

CREATE POLICY "الأخبار متاحة للتعديل للمسؤولين والمحررين"
  ON news FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'editor'));

CREATE POLICY "الأخبار متاحة للتحديث للمسؤولين والمحررين"
  ON news FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'editor'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'editor'));

CREATE POLICY "الأخبار متاحة للحذف للمسؤولين فقط"
  ON news FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- سياسات الملفات الشخصية
CREATE POLICY "الملفات الشخصية متاحة للقراءة للجميع"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "المستخدمون يمكنهم إنشاء ملفاتهم الشخصية"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم تحديث ملفاتهم الشخصية"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "المسؤولون يمكنهم تحديث أي ملف شخصي"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- سياسات التعليقات
CREATE POLICY "التعليقات متاحة للقراءة للجميع"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "المستخدمون المسجلون يمكنهم إضافة تعليقات"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم تحديث تعليقاتهم"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم حذف تعليقاتهم"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "المسؤولون يمكنهم حذف أي تعليق"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- إنشاء دالة لتحديث حقل updated_at تلقائيًا
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء محفزات لتحديث حقل updated_at تلقائيًا
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authors_updated_at
BEFORE UPDATE ON authors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- إنشاء دالة لإنشاء ملف شخصي تلقائيًا عند إنشاء مستخدم جديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء محفز لإنشاء ملف شخصي تلقائيًا عند إنشاء مستخدم جديد
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- إضافة بيانات أولية للفئات
INSERT INTO categories (name, slug, description)
VALUES
  ('نبض الخبر', 'pulse', 'أحدث الأخبار العاجلة والتطورات اللحظية'),
  ('سياسة', 'politics', 'أخبار وتحليلات سياسية محلية وعالمية'),
  ('اقتصاد', 'economy', 'أخبار الاقتصاد والمال والأعمال'),
  ('رياضة', 'sports', 'أخبار الرياضة المحلية والعالمية'),
  ('تكنولوجيا', 'tech', 'أحدث أخبار التكنولوجيا والابتكارات'),
  ('عمق الحدث', 'depth', 'تحليلات معمقة للأحداث الجارية'),
  ('رؤى وتحليلات', 'insights', 'آراء وتحليلات من خبراء ومحللين'),
  ('صوت الشارع', 'street-voice', 'استطلاعات رأي وقضايا تهم المواطن'),
  ('ملفات خاصة', 'special-files', 'تحقيقات وملفات خاصة'),
  ('منصة الرأي', 'opinion', 'مقالات رأي ومساهمات من الكتاب')
ON CONFLICT (slug) DO NOTHING;
