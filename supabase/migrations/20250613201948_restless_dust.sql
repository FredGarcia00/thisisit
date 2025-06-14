/*
  # ViralReel Studio Core Schema

  1. New Tables
    - `profiles` - User profiles with creator settings
    - `videos` - Generated videos and their metadata
    - `templates` - Video templates for different use cases
    - `avatars` - AI-generated avatars
    - `subscriptions` - User subscription management
    - `analytics` - Video performance analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Separate admin and creator access levels

  3. Storage Buckets
    - avatars bucket for avatar assets
    - videos bucket for generated videos
    - templates bucket for template assets
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('creator', 'admin');
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE video_status AS ENUM ('draft', 'generating', 'completed', 'failed');
CREATE TYPE avatar_style AS ENUM ('professional', 'casual', 'fitness', 'teacher', 'business');
CREATE TYPE voice_type AS ENUM ('male-professional', 'female-friendly', 'male-spanish', 'female-spanish');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'creator',
  subscription_plan subscription_plan DEFAULT 'free',
  subscription_id text,
  videos_created_this_month integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  thumbnail_url text,
  config jsonb NOT NULL,
  is_premium boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Avatars table
CREATE TABLE IF NOT EXISTS avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  style avatar_style NOT NULL,
  heygen_avatar_id text,
  thumbnail_url text,
  config jsonb,
  created_at timestamptz DEFAULT now()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  prompt text NOT NULL,
  template_id uuid REFERENCES templates(id),
  avatar_id uuid REFERENCES avatars(id),
  voice_type voice_type NOT NULL,
  duration integer DEFAULT 30,
  status video_status DEFAULT 'draft',
  video_url text,
  thumbnail_url text,
  script_content text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  shares integer DEFAULT 0,
  comments integer DEFAULT 0,
  engagement_rate decimal(5,2) DEFAULT 0,
  platform text,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Templates policies
CREATE POLICY "Anyone can view templates"
  ON templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create templates"
  ON templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates"
  ON templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Avatars policies
CREATE POLICY "Users can view own avatars"
  ON avatars FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own avatars"
  ON avatars FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own avatars"
  ON avatars FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Videos policies
CREATE POLICY "Users can view own videos"
  ON videos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all videos"
  ON videos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Analytics policies
CREATE POLICY "Users can view own video analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos 
      WHERE id = analytics.video_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert analytics"
  ON analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default templates
INSERT INTO templates (name, description, category, thumbnail_url, config, is_premium) VALUES
(
  'Motivational Quote',
  'Inspiring quotes with dynamic backgrounds',
  'motivational',
  'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=300&h=533',
  '{"background_style": "gradient", "text_animation": "fade_in", "music_type": "uplifting"}',
  false
),
(
  'Product Showcase',
  'Professional product demonstrations',
  'business',
  'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=300&h=533',
  '{"background_style": "clean", "text_animation": "slide_up", "music_type": "corporate"}',
  false
),
(
  'Quick Tutorial',
  'Educational content with clear instructions',
  'education',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=533',
  '{"background_style": "whiteboard", "text_animation": "typewriter", "music_type": "neutral"}',
  false
),
(
  'News Update',
  'Breaking news and updates format',
  'news',
  'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=300&h=533',
  '{"background_style": "newsroom", "text_animation": "instant", "music_type": "news"}',
  true
),
(
  'Fitness Motivation',
  'High-energy fitness and workout content',
  'fitness',
  'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=300&h=533',
  '{"background_style": "gym", "text_animation": "bounce", "music_type": "energetic"}',
  true
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('videos', 'videos', true),
  ('templates', 'templates', true);

-- Create storage policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Video files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Users can upload their own videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();