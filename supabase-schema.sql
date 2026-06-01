-- =============================================
-- Portfolio Admin - Supabase Schema
-- Jalankan di Supabase SQL Editor
-- =============================================

-- =============================================
-- Game Leaderboard (Dev Runner)
-- =============================================
create table if not exists game_scores (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  score int not null,
  created_at timestamptz default now()
);

alter table game_scores enable row level security;

-- Siapa pun boleh baca leaderboard
create policy "public read scores" on game_scores
  for select using (true);

-- Siapa pun boleh submit skor (dengan validasi dasar anti-spam)
create policy "public insert scores" on game_scores
  for insert with check (
    char_length(name) between 1 and 20
    and score >= 0
    and score < 1000000
  );

-- Index untuk query top scores
create index if not exists idx_game_scores_score on game_scores (score desc);

-- Projects
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  tags text[] default '{}',
  type text,
  github text,
  live text,
  image text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- Skill Categories
create table if not exists skill_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  display_order int default 0
);

-- Skills
create table if not exists skills (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references skill_categories(id) on delete cascade,
  name text not null,
  display_order int default 0
);

-- Blog Posts
create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  summary text,
  content text,
  tag text,
  published boolean default false,
  created_at timestamptz default now()
);

-- About Content (single row)
create table if not exists about_content (
  id uuid default gen_random_uuid() primary key,
  bio_1 text,
  bio_2 text,
  location text,
  available boolean default true,
  updated_at timestamptz default now()
);

-- Contact Links
create table if not exists contact_links (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  value text,
  href text,
  icon text,
  display_order int default 0
);

-- =============================================
-- RLS (Row Level Security)
-- =============================================

alter table projects enable row level security;
alter table skill_categories enable row level security;
alter table skills enable row level security;
alter table blog_posts enable row level security;
alter table about_content enable row level security;
alter table contact_links enable row level security;

-- Public: read access for portfolio pages
create policy "Public read projects" on projects for select using (true);
create policy "Public read categories" on skill_categories for select using (true);
create policy "Public read skills" on skills for select using (true);
create policy "Public read blog" on blog_posts for select using (published = true);
create policy "Public read about" on about_content for select using (true);
create policy "Public read contact" on contact_links for select using (true);

-- Authenticated: full access for admin panel
create policy "Auth manage projects" on projects for all using (auth.role() = 'authenticated');
create policy "Auth manage categories" on skill_categories for all using (auth.role() = 'authenticated');
create policy "Auth manage skills" on skills for all using (auth.role() = 'authenticated');
create policy "Auth manage blog" on blog_posts for all using (auth.role() = 'authenticated');
create policy "Auth manage about" on about_content for all using (auth.role() = 'authenticated');
create policy "Auth manage contact" on contact_links for all using (auth.role() = 'authenticated');

-- =============================================
-- Seed Data (data awal dari portfolio)
-- =============================================

-- Projects
insert into projects (title, description, tags, type, github, live, display_order) values
('POS Cashier', 'Web-based point-of-sale system with Midtrans payment integration, inventory management, and real-time sales reporting.', array['Next.js','TypeScript','Prisma','PostgreSQL','Midtrans'], 'Web App', 'https://github.com/alifsastro2/pos-cashier', null, 0),
('Digital bNb Invitation', 'SaaS digital wedding invitation platform with multi-client admin panel, Xendit payment gateway, and production deployment.', array['Next.js','TypeScript','Supabase','Xendit','GSAP'], 'SaaS', null, 'https://invite.digitalbnb.my.id', 1),
('Water Therapy Management App', 'Multi-role Android app for water therapy management with automated revenue sharing and dynamic PDF reports.', array['Flutter','Dart','Supabase'], 'Mobile App', 'https://github.com/alifsastro2/tsas', null, 2),
('Home Catering App', 'Home catering Android app with real-time order tracking, AI assistant, Google Maps delivery, and Firebase FCM.', array['Flutter','Dart','Firebase','Google Maps SDK','Claude AI'], 'Mobile App', 'https://github.com/alifsastro2/warung-gemoy', null, 3),
('Company Profile Website', 'Dynamic company profile website with custom PHP CMS and Google Analytics for a facilities company operating in Indonesia & Malaysia.', array['PHP','Bootstrap','Google Analytics API'], 'Web App', 'https://github.com/alifsastro2/cacsfm-website', 'https://cacsfm.id', 4);

-- Skill Categories & Skills
insert into skill_categories (name, display_order) values
('Mobile', 0), ('Web & Backend', 1), ('Database', 2),
('Payment', 3), ('AI & Automation', 4), ('API Integration', 5), ('Tools', 6);

-- (Skills are inserted per category — run after getting category IDs)
-- Or use admin panel to add skills manually after setup.

-- About
insert into about_content (bio_1, bio_2, location, available) values
(
  'I''m a final-year Information Systems student at Universitas Gunadarma with hands-on experience shipping real products — from Android apps to fullstack SaaS platforms.',
  'I specialize in Flutter for mobile and Next.js for web, and I leverage AI-assisted workflows (Claude Code) to move fast without breaking things. I''ve worked as a Project Manager, Fullstack Developer, and Application Tester across multiple industries.',
  'Kota Bekasi, Jawa Barat',
  true
);

-- Contact Links
insert into contact_links (label, value, href, icon, display_order) values
('Email', 'alif@cybergl.co.id', 'mailto:alif@cybergl.co.id', '✉', 0),
('LinkedIn', 'alif-ardezir-zidane', 'https://www.linkedin.com/in/alif-ardezir-zidane-5a1b062b8', 'in', 1),
('GitHub', 'alifsastro2', 'https://github.com/alifsastro2', '⌥', 2),
('WhatsApp', '0813-8761-4254', 'https://wa.me/6281387614254', '↗', 3);
