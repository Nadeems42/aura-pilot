import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Heart, 
  CheckCircle, 
  Target, 
  TrendingUp, 
  Brain,
  Plus,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/dashboard-hero.jpg";
import { useUserData } from "@/hooks/useUserData";
import { useAIReminders } from "@/hooks/useAIReminders";

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState("");
  const { tasks, expenses, healthEntries, userSettings, aiInsights, loading } = useUserData();
  
  // Initialize AI reminders
  useAIReminders();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 17) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  const getGreeting = () => {
    const greetings = {
      morning: "Good morning! ☀️",
      afternoon: "Good afternoon! 🌤️", 
      evening: "Good evening! 🌙"
    };
    return greetings[timeOfDay as keyof typeof greetings] || "Hello! 👋";
  };

  // Calculate real stats from user data
  const today = new Date().toISOString().split('T')[0];
  const todaysHealthEntry = healthEntries.find(entry => entry.date === today);
  const todaysTasks = tasks.filter(task => 
    task.due_date === 'Today' || 
    (task.created_at && task.created_at.startsWith(today))
  );
  const completedTodayTasks = todaysTasks.filter(task => task.completed);
  const todaysExpenses = expenses.filter(expense => expense.date === today);
  const todayExpenseAmount = todaysExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  
  const todayStats = {
    expenses: { 
      spent: todayExpenseAmount, 
      budget: userSettings?.monthly_expense_budget ? userSettings.monthly_expense_budget / 30 : 75, 
      categories: [...new Set(todaysExpenses.map(e => e.category))].length 
    },
    health: { 
      steps: todaysHealthEntry?.steps || 0, 
      water: todaysHealthEntry?.water_glasses || 0, 
      sleep: todaysHealthEntry?.sleep_hours || 0, 
      exercise: todaysHealthEntry?.exercise_minutes || 0 
    },
    tasks: { 
      completed: completedTodayTasks.length, 
      total: todaysTasks.length || 1, 
      streak: 0 // Could be calculated based on task completion history
    }
  };

  const quickActions = [
    { 
      title: "Add Expense", 
      icon: DollarSign, 
      color: "bg-gradient-accent", 
      action: () => navigate("/expenses")
    },
    { 
      title: "Log Health", 
      icon: Heart, 
      color: "bg-gradient-secondary", 
      action: () => navigate("/health")
    },
    { 
      title: "New Task", 
      icon: CheckCircle, 
      color: "bg-gradient-primary", 
      action: () => navigate("/tasks")
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div 
        className="relative rounded-xl overflow-hidden bg-gradient-wellness text-white p-8 md:p-12"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(16, 185, 129, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-slide-up">
            {getGreeting()}
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Ready to track your wellness journey today?
          </p>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={action.title}
                onClick={action.action}
                className={`${action.color} hover:scale-105 transition-all duration-200 text-white border-none`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <action.icon className="w-4 h-4 mr-2" />
                {action.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Expenses Card */}
        <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent" />
                Expenses
              </span>
              <Badge variant="secondary">${todayStats.expenses.spent}</Badge>
            </CardTitle>
            <CardDescription>Today's spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Budget Progress</span>
                <span>${todayStats.expenses.spent} / ${todayStats.expenses.budget}</span>
              </div>
              <Progress 
                value={(todayStats.expenses.spent / todayStats.expenses.budget) * 100} 
                className="h-2"
              />
              <p className="text-sm text-muted-foreground">
                {todayStats.expenses.categories} categories tracked
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/expenses")}
                className="w-full mt-2 hover:bg-accent/10"
              >
                View Details <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Health Card */}
        <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                Health
              </span>
              <Badge variant="secondary">{todayStats.health.steps} steps</Badge>
            </CardTitle>
            <CardDescription>Today's wellness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>💧 Water: {todayStats.health.water}/8</div>
                <div>😴 Sleep: {todayStats.health.sleep}h</div>
                <div>🚶 Steps: {todayStats.health.steps.toLocaleString()}</div>
                <div>💪 Exercise: {todayStats.health.exercise}min</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/health")}
                className="w-full mt-2 hover:bg-secondary/10"
              >
                Update Health <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Card */}
        <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Tasks
              </span>
              <Badge variant="secondary">
                {todayStats.tasks.completed}/{todayStats.tasks.total}
              </Badge>
            </CardTitle>
            <CardDescription>Today's progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{Math.round((todayStats.tasks.completed / todayStats.tasks.total) * 100)}%</span>
              </div>
              <Progress 
                value={(todayStats.tasks.completed / todayStats.tasks.total) * 100} 
                className="h-2"
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  🔥 {todayStats.tasks.streak} day streak
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/tasks")}
                  className="hover:bg-primary/10"
                >
                  Manage Tasks <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card className="bg-gradient-wellness text-white shadow-wellness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Insights
          </CardTitle>
          <CardDescription className="text-white/80">
            Personalized suggestions based on your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.slice(0, 2).map((insight) => (
              <div key={insight.id} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="font-medium mb-2">{insight.title}</h4>
                <p className="text-sm opacity-90">
                  {insight.content}
                </p>
              </div>
            ))}
            {aiInsights.length === 0 && (
              <>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <h4 className="font-medium mb-2">🎯 Getting Started</h4>
                  <p className="text-sm opacity-90">
                    Welcome! Start by adding your first task or logging some health data to get personalized insights.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <h4 className="font-medium mb-2">📊 Track Progress</h4>
                  <p className="text-sm opacity-90">
                    I'll help you track your wellness journey and provide smart recommendations based on your data.
                  </p>
                </div>
              </>
            )}
          </div>
          <Button 
            variant="secondary" 
            className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={() => navigate("/insights")}
          >
            View All Insights <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card p-4 text-center hover:scale-105 transition-transform">
          <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-primary">{todayStats.tasks.streak || 0}</p>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </Card>
        <Card className="bg-gradient-card p-4 text-center hover:scale-105 transition-transform">
          <DollarSign className="w-6 h-6 text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold text-accent">
            ${expenses.reduce((sum, expense) => sum + Number(expense.amount), 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Spent</p>
        </Card>
        <Card className="bg-gradient-card p-4 text-center hover:scale-105 transition-transform">
          <Heart className="w-6 h-6 text-secondary mx-auto mb-2" />
          <p className="text-2xl font-bold text-secondary">
            {todaysHealthEntry ? Math.round((
              (todaysHealthEntry.water_glasses / 8) * 25 +
              (Math.min(todaysHealthEntry.steps, userSettings?.daily_step_goal || 8000) / (userSettings?.daily_step_goal || 8000)) * 25 +
              (Math.min(todaysHealthEntry.exercise_minutes, userSettings?.daily_exercise_goal || 30) / (userSettings?.daily_exercise_goal || 30)) * 25 +
              (Math.min(todaysHealthEntry.sleep_hours, userSettings?.daily_sleep_goal || 8) / (userSettings?.daily_sleep_goal || 8)) * 25
            )) : 0}%
          </p>
          <p className="text-sm text-muted-foreground">Health Score</p>
        </Card>
        <Card className="bg-gradient-card p-4 text-center hover:scale-105 transition-transform">
          <Target className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-primary">{tasks.filter(task => task.completed).length}</p>
          <p className="text-sm text-muted-foreground">Tasks Done</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;