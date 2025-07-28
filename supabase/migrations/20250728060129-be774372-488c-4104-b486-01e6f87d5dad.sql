-- Fix the initialization function to handle existing users properly
CREATE OR REPLACE FUNCTION public.initialize_user_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Create default user settings (if not exists)
  INSERT INTO public.user_settings (user_id) 
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create initial AI insight to welcome the user
  INSERT INTO public.ai_insights (user_id, title, content, insight_type, priority)
  VALUES (
    NEW.id, 
    'Welcome to Personal Tracker! 🎉', 
    'Ready to start your wellness journey? I''ll help you track health, expenses, and tasks. Begin by logging your first health data or creating a task!',
    'general',
    1
  );
  
  RETURN NEW;
END;
$$;

-- Create user_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  daily_water_goal INTEGER DEFAULT 8,
  daily_step_goal INTEGER DEFAULT 8000,
  daily_exercise_goal INTEGER DEFAULT 30,
  daily_sleep_goal DECIMAL(3,1) DEFAULT 8.0,
  monthly_expense_budget DECIMAL(10,2) DEFAULT 2000,
  reminder_frequency TEXT DEFAULT 'daily' CHECK (reminder_frequency IN ('daily', 'weekly', 'none')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for user_settings timestamps
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();