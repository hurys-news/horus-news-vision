-- إنشاء جدول سجل التغييرات (Audit Log)
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تمكين RLS على جدول سجل التغييرات
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- سياسات سجل التغييرات
CREATE POLICY "سجل التغييرات متاح للقراءة للمسؤولين والمحررين"
  ON audit_log FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'editor'));

CREATE POLICY "سجل التغييرات متاح للإضافة للمستخدمين المسجلين"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "سجل التغييرات متاح للحذف للمسؤولين فقط"
  ON audit_log FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
