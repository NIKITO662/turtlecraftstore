
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  minecraft_username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Ranks catalog
CREATE TABLE public.ranks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  color TEXT NOT NULL DEFAULT '#facc15',
  perks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_lifetime BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rank_id UUID REFERENCES public.ranks(id) ON DELETE SET NULL,
  minecraft_username TEXT NOT NULL,
  email TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forums
CREATE TABLE public.forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN NOT NULL DEFAULT false,
  locked BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER threads_set_updated_at BEFORE UPDATE ON public.forum_threads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER posts_set_updated_at BEFORE UPDATE ON public.forum_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile + default user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, username, minecraft_username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'minecraft_username'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles admin all" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "roles self read" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles admin manage" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Ranks: public read, admin manage
CREATE POLICY "ranks public read" ON public.ranks FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "ranks admin manage" ON public.ranks FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders: user own, admin all
CREATE POLICY "orders self read" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "orders self insert" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "orders admin manage" ON public.orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Forum categories: public read, admin manage
CREATE POLICY "cats public read" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "cats admin manage" ON public.forum_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Threads
CREATE POLICY "threads public read" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "threads auth insert" ON public.forum_threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "threads self update" ON public.forum_threads FOR UPDATE USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "threads self delete" ON public.forum_threads FOR DELETE USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- Posts
CREATE POLICY "posts public read" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "posts auth insert" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts self update" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "posts self delete" ON public.forum_posts FOR DELETE USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- Seed ranks
INSERT INTO public.ranks (slug, name, short_name, description, price_cents, color, perks, is_lifetime, sort_order) VALUES
('vip', 'VIP', 'VIP', 'Stand out from the crowd with the entry-level rank.', 499, '#22c55e',
  '["Colored chat name","/hat command","2 extra homes","VIP join message"]'::jsonb, false, 1),
('vip-plus', 'VIP+', 'VIP+', 'Everything in VIP, with extra perks and prefixes.', 999, '#10b981',
  '["All VIP perks","/nick command","4 extra homes","Particle trails","Priority queue"]'::jsonb, false, 2),
('mtp', 'MegaTurtlePlayer', 'MTP', 'For dedicated turtles. Unlock advanced gameplay tools.', 1999, '#06b6d4',
  '["All VIP+ perks","/fly in lobby","8 extra homes","Custom prefix color","Pet system access","Exclusive cosmetics"]'::jsonb, false, 3),
('sponsor-1', 'Sponsor Tier 1', 'Sponsor I', 'Support the server while gaining exclusive sponsor perks.', 2999, '#a855f7',
  '["All MTP perks","Sponsor chat tag","12 extra homes","Early access to events","Monthly key crate"]'::jsonb, false, 4),
('sponsor-2', 'Sponsor Tier 2', 'Sponsor II', 'Premium sponsor tier with the best monthly perks.', 4999, '#f43f5e',
  '["All Sponsor I perks","Animated chat tag","20 extra homes","Private sponsor channel","Weekly key crate","Custom particle effect"]'::jsonb, false, 5),
('special-lifetime', 'Special (Lifetime)', 'Special', 'The ultimate rank. Lifetime access to every perk on TurtleCraft.', 9999, '#facc15',
  '["Everything from all ranks","LIFETIME access — never expires","Custom title & prefix","Unlimited homes","Direct line to staff","Founder badge","All future rank perks included"]'::jsonb, true, 6);

-- Seed forum categories
INSERT INTO public.forum_categories (slug, name, description, sort_order) VALUES
('announcements', 'Announcements', 'Official news and updates from the TurtleCraft team.', 1),
('general', 'General Discussion', 'Talk about anything related to TurtleCraft.', 2),
('help', 'Help & Support', 'Need a hand? Ask questions and get help from the community.', 3),
('suggestions', 'Suggestions', 'Share your ideas to make TurtleCraft even better.', 4),
('off-topic', 'Off Topic', 'Anything goes — chat about non-server stuff here.', 5);
