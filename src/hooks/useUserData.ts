import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  category: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
}

export interface HealthEntry {
  id: string;
  date: string;
  steps: number;
  water_glasses: number;
  sleep_hours: number;
  exercise_minutes: number;
}

export interface UserSettings {
  id: string;
  daily_water_goal: number;
  daily_step_goal: number;
  daily_exercise_goal: number;
  daily_sleep_goal: number;
  monthly_expense_budget: number;
  reminder_frequency: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface AIInsight {
  id: string;
  title: string;
  content: string;
  insight_type: string;
  priority: number;
  is_read: boolean;
  created_at: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [healthEntries, setHealthEntries] = useState<HealthEntry[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all user data
  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch health entries
      const { data: healthData } = await supabase
        .from('health_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      // Fetch user settings
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch AI insights
      const { data: insightsData } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setTasks(tasksData || []);
      setExpenses(expensesData || []);
      setHealthEntries(healthData || []);
      setUserSettings(settingsData);
      setAiInsights(insightsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [data, ...prev]);
      toast.success('Task added successfully!');
      return data;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  // Update task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => task.id === id ? data : task));
      toast.success('Task updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  // Add expense
  const addExpense = async (expense: Omit<Expense, 'id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => [data, ...prev]);
      toast.success('Expense added successfully!');
      return data;
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  // Add or update health entry
  const saveHealthEntry = async (entry: Omit<HealthEntry, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('health_entries')
        .upsert([{ ...entry, user_id: user.id }], {
          onConflict: 'user_id,date'
        })
        .select()
        .single();

      if (error) throw error;

      setHealthEntries(prev => {
        const filtered = prev.filter(h => h.date !== entry.date);
        return [data, ...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
      toast.success('Health data saved successfully!');
      return data;
    } catch (error) {
      console.error('Error saving health entry:', error);
      toast.error('Failed to save health data');
    }
  };

  // Mark AI insight as read
  const markInsightAsRead = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ai_insights')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAiInsights(prev => prev.map(insight => 
        insight.id === id ? { ...insight, is_read: true } : insight
      ));
    } catch (error) {
      console.error('Error marking insight as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  return {
    tasks,
    expenses,
    healthEntries,
    userSettings,
    aiInsights,
    loading,
    addTask,
    updateTask,
    deleteTask,
    addExpense,
    saveHealthEntry,
    markInsightAsRead,
    refetch: fetchUserData
  };
};