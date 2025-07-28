-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT NOT NULL DEFAULT 'Personal',
  due_date TEXT DEFAULT 'Today',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table  
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_logs table
CREATE TABLE public.health_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  steps INTEGER DEFAULT 0,
  water_glasses INTEGER DEFAULT 0,
  sleep_hours DECIMAL(3,1) DEFAULT 0,
  exercise_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create user_settings table for personalization
CREATE TABLE public.user_settings (
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

-- Create ai_insights table for storing AI recommendations
CREATE TABLE public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('health', 'finance', 'productivity', 'general')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for expenses
CREATE POLICY "Users can view their own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for health_logs
CREATE POLICY "Users can view their own health logs" ON public.health_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own health logs" ON public.health_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health logs" ON public.health_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own health logs" ON public.health_logs FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for ai_insights
CREATE POLICY "Users can view their own insights" ON public.ai_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own insights" ON public.ai_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own insights" ON public.ai_insights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own insights" ON public.ai_insights FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_logs_updated_at BEFORE UPDATE ON public.health_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON public.ai_insights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to initialize user data when they first sign up
CREATE OR REPLACE FUNCTION public.initialize_user_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Create default user settings
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  
  -- Create initial AI insight to welcome the user
  INSERT INTO public.ai_insights (user_id, title, description, category, priority)
  VALUES (
    NEW.id, 
    'Welcome to Personal Tracker! 🎉', 
    'Ready to start your wellness journey? I''ll help you track health, expenses, and tasks. Begin by logging your first health data or creating a task!',
    'general',
    'high'
  );
  
  RETURN NEW;
END;
$$;

-- Update the existing trigger to include user data initialization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Initialize user data
  PERFORM public.initialize_user_data();
  
  RETURN NEW;
END;
$$;