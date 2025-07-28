import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAIReminders = () => {
  const { user } = useAuth();

  const generateHealthReminder = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Check if user has logged health data today
    const { data: healthEntry } = await supabase
      .from('health_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (!healthEntry) {
      // Create AI reminder
      await supabase
        .from('ai_insights')
        .insert([{
          user_id: user.id,
          title: '💧 Time for your daily health check!',
          content: 'Don\'t forget to log your water intake, steps, and exercise today. Small consistent actions lead to big results!',
          insight_type: 'health',
          priority: 2
        }]);

      toast.info('💧 Remember to log your health data today!', {
        duration: 5000,
      });
    }
  };

  const generateTaskReminder = async () => {
    if (!user) return;

    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false);

    if (tasks && tasks.length > 0) {
      const highPriorityTasks = tasks.filter(task => task.priority === 'high');
      
      if (highPriorityTasks.length > 0) {
        await supabase
          .from('ai_insights')
          .insert([{
            user_id: user.id,
            title: '⚡ High priority tasks need attention!',
            content: `You have ${highPriorityTasks.length} high-priority task(s) pending. Tackle them first for maximum productivity!`,
            insight_type: 'productivity',
            priority: 2
          }]);

        toast.info(`⚡ You have ${highPriorityTasks.length} high-priority tasks!`, {
          duration: 5000,
        });
      }
    }
  };

  const generateExpenseReminder = async () => {
    if (!user) return;

    const { data: userSettings } = await supabase
      .from('user_settings')
      .select('monthly_expense_budget')
      .eq('user_id', user.id)
      .single();

    if (!userSettings) return;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', user.id)
      .gte('date', `${currentMonth}-01`)
      .lt('date', `${currentMonth}-32`);

    const totalSpent = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
    const budgetPercentage = (totalSpent / userSettings.monthly_expense_budget) * 100;

    if (budgetPercentage > 80) {
      await supabase
        .from('ai_insights')
        .insert([{
          user_id: user.id,
          title: '💰 Budget Alert!',
          content: `You've used ${budgetPercentage.toFixed(1)}% of your monthly budget. Consider reviewing your spending to stay on track.`,
          insight_type: 'finance',
          priority: budgetPercentage > 95 ? 1 : 2
        }]);

      toast.warning(`💰 Budget alert: ${budgetPercentage.toFixed(1)}% used!`, {
        duration: 5000,
      });
    }
  };

  const checkAndSendReminders = async () => {
    if (!user) return;

    const { data: userSettings } = await supabase
      .from('user_settings')
      .select('reminder_frequency')
      .eq('user_id', user.id)
      .single();

    if (userSettings?.reminder_frequency === 'none') return;

    // Check if we've already sent reminders today
    const today = new Date().toISOString().split('T')[0];
    const { data: todayInsights } = await supabase
      .from('ai_insights')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`);

    // Only send reminders if we haven't sent any today
    if (!todayInsights || todayInsights.length === 0) {
      await generateHealthReminder();
      await generateTaskReminder();
      await generateExpenseReminder();
    }
  };

  useEffect(() => {
    if (user) {
      // Check for reminders when component mounts
      setTimeout(checkAndSendReminders, 2000); // Delay to allow other data to load first

      // Set up periodic reminder checks (every hour)
      const interval = setInterval(checkAndSendReminders, 60 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    checkAndSendReminders
  };
};