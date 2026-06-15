-- Demo Data Seed (Optional - for testing)
-- Run this after schema.sql to populate the database with sample data

-- Insert demo categories (already in schema.sql, but adding more)
insert into public.categories (name, icon) values
  ('Database', 'Database'),
  ('Mobile', 'Smartphone'),
  ('Cloud', 'Cloud'),
  ('Security', 'Shield')
on conflict (name) do nothing;

-- Note: To create demo freelancer profiles and jobs, 
-- you'll need actual users first. Sign up through the UI,
-- then use their user IDs to create freelancer profiles.

-- Example (replace with actual user IDs from auth.users):
/*
-- Create a freelancer profile
insert into public.freelancer_profiles (
  profile_id,
  display_name,
  title,
  bio,
  hourly_rate,
  skills,
  categories,
  experience_level,
  availability,
  verification_status
) values (
  'your-user-uuid-here',
  'John Doe',
  'Senior Full-Stack Developer',
  'Experienced developer specializing in React and Node.js',
  85.00,
  array['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
  array['Web Development', 'Frontend', 'Backend'],
  'senior',
  'available',
  'verified'
);

-- Create a demo job post
insert into public.job_posts (
  client_id,
  client_name,
  title,
  description,
  category_name,
  budget_amount,
  budget_type,
  skills,
  status
) values (
  'client-user-uuid-here',
  'Tech Startup Inc.',
  'Build a SaaS Dashboard',
  'Looking for a developer to build a modern analytics dashboard',
  'Web Development',
  5000.00,
  'fixed',
  array['React', 'Next.js', 'Tailwind CSS'],
  'open'
);
*/

-- For production, data should be created through the application UI
