-- دالة لإضافة خبر بدون قيود RLS
CREATE OR REPLACE FUNCTION add_news_without_rls(
  p_title TEXT,
  p_excerpt TEXT,
  p_content TEXT,
  p_category_id UUID,
  p_image TEXT,
  p_is_top_story BOOLEAN DEFAULT FALSE,
  p_is_breaking BOOLEAN DEFAULT FALSE
)
RETURNS SETOF news
LANGUAGE plpgsql
SECURITY DEFINER -- تنفيذ الدالة بصلاحيات المالك
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO news (
    title,
    excerpt,
    content,
    category_id,
    image,
    is_top_story,
    is_breaking,
    created_at,
    updated_at,
    view_count
  )
  VALUES (
    p_title,
    p_excerpt,
    p_content,
    p_category_id,
    p_image,
    p_is_top_story,
    p_is_breaking,
    NOW(),
    NOW(),
    0
  )
  RETURNING *;
END;
$$;

-- منح صلاحية تنفيذ الدالة للمستخدمين المصادقين
GRANT EXECUTE ON FUNCTION add_news_without_rls TO authenticated;
