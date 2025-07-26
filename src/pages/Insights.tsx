import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Target,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BarChart3,
  Zap
} from "lucide-react";

const Insights = () => {
  // Mock AI insights data
  const insights = [
    {
      type: "spending",
      priority: "high",
      title: "Budget Alert",
      description: "You're 63% through your monthly budget with 12 days remaining. Consider reducing discretionary spending.",
      action: "Review recent expenses",
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      type: "health",
      priority: "medium",
      title: "Hydration Improvement",
      description: "Your water intake has improved 23% this week! Keep up the great work.",
      action: "Set water reminders",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      type: "productivity",
      priority: "low",
      title: "Task Completion Pattern",
      description: "You complete 85% more tasks in the morning. Consider scheduling important tasks before noon.",
      action: "Optimize schedule",
      icon: Lightbulb,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      type: "wellness",
      priority: "medium",
      title: "Sleep Quality",
      description: "Your sleep duration is consistent, but try going to bed 30 minutes earlier for better recovery.",
      action: "Adjust bedtime",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  const weeklyTrends = [
    { category: "Spending", trend: "down", value: "-12%", description: "Great job staying within budget" },
    { category: "Steps", trend: "up", value: "+18%", description: "Physical activity increased" },
    { category: "Sleep", trend: "up", value: "+8%", description: "Better sleep consistency" },
    { category: "Tasks", trend: "up", value: "+25%", description: "Productivity improvement" }
  ];

  const recommendations = [
    {
      title: "Optimize Morning Routine",
      description: "Based on your patterns, try completing 2-3 important tasks before 10 AM when your productivity peaks.",
      impact: "High",
      effort: "Low"
    },
    {
      title: "Meal Planning",
      description: "Food expenses spike on weekends. Planning meals could save you approximately $120/month.",
      impact: "Medium",
      effort: "Medium"
    },
    {
      title: "Exercise Consistency",
      description: "You're most active on Mondays and Tuesdays. Try spreading workouts more evenly throughout the week.",
      impact: "Medium",
      effort: "Low"
    },
    {
      title: "Digital Wellness",
      description: "Consider adding 'screen time limits' as a task to improve your evening wind-down routine.",
      impact: "Low",
      effort: "Low"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Low": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
        <p className="text-muted-foreground">Personalized recommendations based on your data</p>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className={`bg-gradient-card shadow-card hover:scale-105 transition-all ${insight.bgColor}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <insight.icon className={`w-5 h-5 ${insight.color}`} />
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                </div>
                <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                  {insight.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                {insight.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Trends */}
      <Card className="bg-gradient-wellness text-white shadow-wellness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Weekly Trends
          </CardTitle>
          <CardDescription className="text-white/80">
            How you're progressing compared to last week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyTrends.map((trend, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{trend.category}</h4>
                  <div className="flex items-center gap-1">
                    {trend.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-300" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-300" />
                    )}
                    <span className="font-bold">{trend.value}</span>
                  </div>
                </div>
                <p className="text-sm opacity-90">{trend.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered suggestions to improve your wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{rec.title}</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getImpactColor(rec.impact)}>
                      {rec.impact} Impact
                    </Badge>
                    <Badge variant="outline">
                      {rec.effort} Effort
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                <Button variant="ghost" size="sm">
                  Apply Suggestion
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-primary text-white shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">85%</p>
              <p className="text-sm opacity-80">Excellent progress!</p>
              <Progress value={85} className="mt-3 bg-white/20 [&>div]:bg-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary text-white shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">92%</p>
              <p className="text-sm opacity-80">Above average</p>
              <Progress value={92} className="mt-3 bg-white/20 [&>div]:bg-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent text-white shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Goal Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">78%</p>
              <p className="text-sm opacity-80">Keep pushing!</p>
              <Progress value={78} className="mt-3 bg-white/20 [&>div]:bg-white" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insights;