-- =============================================
-- SỔ Ý TƯỞNG - Database Schema for Supabase
-- =============================================
-- Chạy file này trong Supabase SQL Editor

-- 1. Bảng Categories (phân loại cho cả Ideas và Apps)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('idea', 'app')),
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng Ideas (Ý tưởng)
CREATE TYPE idea_status AS ENUM ('seed', 'active', 'archived');

CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status idea_status DEFAULT 'seed',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng WebApps (Kho ứng dụng web)
CREATE TABLE IF NOT EXISTS web_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT NOT NULL,
  icon_url TEXT DEFAULT '',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Triggers tự động cập nhật updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON ideas
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_web_apps_updated_at
  BEFORE UPDATE ON web_apps
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- =============================================
-- Row Level Security (RLS) - Optional
-- Bỏ qua nếu app dùng cho cá nhân không cần auth
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_apps ENABLE ROW LEVEL SECURITY;

-- Policy: Cho phép tất cả thao tác (phù hợp app cá nhân)
CREATE POLICY "Allow all operations on categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on ideas" ON ideas FOR ALL USING (true);
CREATE POLICY "Allow all operations on web_apps" ON web_apps FOR ALL USING (true);

-- =============================================
-- Dữ liệu mẫu (Seed Data)
-- =============================================

-- Categories mẫu
INSERT INTO categories (name, type, color) VALUES
  ('Công nghệ', 'idea', '#6366f1'),
  ('Kinh doanh', 'idea', '#f59e0b'),
  ('Sáng tạo', 'idea', '#10b981'),
  ('Năng suất', 'app', '#3b82f6'),
  ('Thiết kế', 'app', '#ec4899'),
  ('Lập trình', 'app', '#8b5cf6');

-- Ideas mẫu
INSERT INTO ideas (title, content, status, tags) VALUES
  ('Ứng dụng quản lý thói quen', 
   '## Ý tưởng\n\nXây dựng app theo dõi thói quen hàng ngày với gamification.\n\n### Tính năng chính\n- Streak tracking\n- Reminder thông minh\n- Báo cáo tiến độ',
   'active',
   ARRAY['app', 'productivity', 'mobile']),
  ('Blog kỹ thuật cá nhân',
   '## Mục tiêu\n\nViết blog chia sẻ kiến thức lập trình và kinh nghiệm thực tế.\n\n### Chủ đề\n- Next.js tips\n- System design\n- Career advice',
   'seed',
   ARRAY['blog', 'writing', 'dev']),
  ('CLI tool tự động hoá git',
   '## Vấn đề\n\nCommit message thường không nhất quán và tốn thời gian.\n\n## Giải pháp\nTạo CLI tự động generate commit message từ diff.',
   'archived',
   ARRAY['cli', 'git', 'automation']);

-- Web Apps mẫu
INSERT INTO web_apps (title, description, url, icon_url) VALUES
  ('Linear', 'Quản lý task và dự án cho team', 'https://linear.app', 'https://www.google.com/s2/favicons?domain=linear.app&sz=64'),
  ('Figma', 'Thiết kế UI/UX và prototype', 'https://figma.com', 'https://www.google.com/s2/favicons?domain=figma.com&sz=64'),
  ('Notion', 'All-in-one workspace và notes', 'https://notion.so', 'https://www.google.com/s2/favicons?domain=notion.so&sz=64'),
  ('GitHub', 'Code hosting và version control', 'https://github.com', 'https://www.google.com/s2/favicons?domain=github.com&sz=64'),
  ('Vercel', 'Deploy và hosting Next.js apps', 'https://vercel.com', 'https://www.google.com/s2/favicons?domain=vercel.com&sz=64'),
  ('Supabase', 'Backend as a Service - PostgreSQL', 'https://supabase.com', 'https://www.google.com/s2/favicons?domain=supabase.com&sz=64');
