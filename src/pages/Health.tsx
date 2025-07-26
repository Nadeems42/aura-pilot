import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Heart, 
  Activity, 
  Moon,
  Droplets,
  Target,
  TrendingUp,
  Calendar
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Health = () => {
  const [waterIntake, setWaterIntake] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [steps, setSteps] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");

  // Mock data for today
  const todayStats = {
    water: { current: 6, target: 8, unit: "glasses" },
    sleep: { current: 7.5, target: 8, unit: "hours" },
    steps: { current: 6842, target: 10000, unit: "steps" },
    exercise: { current: 45, target: 60, unit: "minutes" }
  };

  const healthMetrics = [
    {
      title: "Water Intake",
      icon: Droplets,
      current: todayStats.water.current,
      target: todayStats.water.target,
      unit: todayStats.water.unit,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      emoji: "💧"
    },
    {
      title: "Sleep",
      icon: Moon,
      current: todayStats.sleep.current,
      target: todayStats.sleep.target,
      unit: todayStats.sleep.unit,
      color: "text-purple-500",
      bgColor: "bg-purple-500",
      emoji: "😴"
    },
    {
      title: "Steps",
      icon: Activity,
      current: todayStats.steps.current,
      target: todayStats.steps.target,
      unit: todayStats.steps.unit,
      color: "text-green-500",
      bgColor: "bg-green-500",
      emoji: "🚶"
    },
    {
      title: "Exercise",
      icon: Target,
      current: todayStats.exercise.current,
      target: todayStats.exercise.target,
      unit: todayStats.exercise.unit,
      color: "text-orange-500",
      bgColor: "bg-orange-500",
      emoji: "💪"
    }
  ];

  const weeklyData = [
    { day: "Mon", water: 8, sleep: 7.5, steps: 8500, exercise: 30 },
    { day: "Tue", water: 6, sleep: 8.0, steps: 9200, exercise: 45 },
    { day: "Wed", water: 7, sleep: 7.0, steps: 7800, exercise: 60 },
    { day: "Thu", water: 8, sleep: 7.5, steps: 10500, exercise: 30 },
    { day: "Fri", water: 5, sleep: 6.5, steps: 6200, exercise: 0 },
    { day: "Sat", water: 9, sleep: 9.0, steps: 12000, exercise: 90 },
    { day: "Sun", water: 6, sleep: 7.5, steps: 6842, exercise: 45 }
  ];

  const handleLogHealth = () => {
    console.log({ waterIntake, sleepHours, steps, exerciseMinutes });
    // Reset form
    setWaterIntake("");
    setSleepHours("");
    setSteps("");
    setExerciseMinutes("");
  };

  const calculateHealthScore = () => {
    const waterScore = (todayStats.water.current / todayStats.water.target) * 100;
    const sleepScore = (todayStats.sleep.current / todayStats.sleep.target) * 100;
    const stepsScore = (todayStats.steps.current / todayStats.steps.target) * 100;
    const exerciseScore = (todayStats.exercise.current / todayStats.exercise.target) * 100;
    
    return Math.round((waterScore + sleepScore + stepsScore + exerciseScore) / 4);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Tracker</h1>
          <p className="text-muted-foreground">Monitor your wellness journey</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-secondary hover:scale-105 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Log Health Data
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-card">
            <DialogHeader>
              <DialogTitle>Update Health Metrics</DialogTitle>
              <DialogDescription>Record your daily health data</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="water">Water (glasses)</Label>
                  <Input 
                    id="water" 
                    type="number" 
                    placeholder="8"
                    value={waterIntake}
                    onChange={(e) => setWaterIntake(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sleep">Sleep (hours)</Label>
                  <Input 
                    id="sleep" 
                    type="number" 
                    placeholder="8"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="steps">Steps</Label>
                  <Input 
                    id="steps" 
                    type="number" 
                    placeholder="10000"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="exercise">Exercise (minutes)</Label>
                  <Input 
                    id="exercise" 
                    type="number" 
                    placeholder="60"
                    value={exerciseMinutes}
                    onChange={(e) => setExerciseMinutes(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleLogHealth} className="w-full bg-gradient-secondary">
                Update Health Data
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Health Score Overview */}
      <Card className="bg-gradient-secondary text-white shadow-wellness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Health Score
          </CardTitle>
          <CardDescription className="text-white/80">
            Today's overall wellness rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{calculateHealthScore()}%</p>
              <p className="text-white/80">Great progress today!</p>
            </div>
            <div className="text-6xl">
              {calculateHealthScore() >= 80 ? "🌟" : calculateHealthScore() >= 60 ? "😊" : "💪"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthMetrics.map((metric) => (
          <Card key={metric.title} className="bg-gradient-card shadow-card hover:scale-105 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  <span className="text-sm">{metric.title}</span>
                </span>
                <span className="text-2xl">{metric.emoji}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{metric.current}</span>
                  <Badge variant="secondary">
                    /{metric.target} {metric.unit}
                  </Badge>
                </div>
                <Progress 
                  value={(metric.current / metric.target) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round((metric.current / metric.target) * 100)}% of daily goal
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Progress */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Weekly Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                7-Day Progress
              </CardTitle>
              <CardDescription>Your health metrics over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="grid grid-cols-5 gap-4 items-center p-3 rounded-lg bg-muted/30">
                    <div className="font-medium">{day.day}</div>
                    <div className="text-center">
                      <p className="text-sm font-medium">💧 {day.water}</p>
                      <p className="text-xs text-muted-foreground">glasses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">😴 {day.sleep}h</p>
                      <p className="text-xs text-muted-foreground">sleep</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">🚶 {day.steps.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">steps</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">💪 {day.exercise}min</p>
                      <p className="text-xs text-muted-foreground">exercise</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Weekly Averages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>💧 Water Intake</span>
                    <span className="font-bold">7.0 glasses/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>😴 Sleep</span>
                    <span className="font-bold">7.6 hours/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🚶 Steps</span>
                    <span className="font-bold">8,735 steps/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💪 Exercise</span>
                    <span className="font-bold">43 minutes/day</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Sleep improved by 15% this week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Exercise consistency up 20%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">5 days met water intake goal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Health;