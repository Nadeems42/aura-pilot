import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Mock data for calendar entries
  const calendarEntries = [
    { date: new Date(2024, 0, 15), type: "expense", title: "Lunch at Subway", amount: "$12.99", category: "Food" },
    { date: new Date(2024, 0, 15), type: "health", title: "Morning Run", amount: "5km", category: "Exercise" },
    { date: new Date(2024, 0, 15), type: "task", title: "Project Review", amount: "Completed", category: "Work" },
    { date: new Date(2024, 0, 16), type: "expense", title: "Gas Station", amount: "$45.00", category: "Transport" },
    { date: new Date(2024, 0, 16), type: "health", title: "8 glasses water", amount: "Goal met", category: "Hydration" },
    { date: new Date(2024, 0, 17), type: "task", title: "Dentist Appointment", amount: "Scheduled", category: "Health" },
    { date: new Date(2024, 0, 18), type: "expense", title: "Grocery Shopping", amount: "$67.50", category: "Food" },
    { date: new Date(2024, 0, 18), type: "health", title: "Yoga Session", amount: "45 min", category: "Exercise" },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEntriesForDate = (date: Date) => {
    return calendarEntries.filter(entry => 
      entry.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'expense': return 'bg-accent';
      case 'health': return 'bg-secondary';
      case 'task': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expense': return '💰';
      case 'health': return '💚';
      case 'task': return '✅';
      default: return '📅';
    }
  };

  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar View</h1>
          <p className="text-muted-foreground">All your entries in one place</p>
        </div>
        
        <Button className="bg-gradient-wellness hover:scale-105 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Quick Add
        </Button>
      </div>

      {/* Calendar */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {monthName}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: firstDay }, (_, index) => (
              <div key={`empty-${index}`} className="p-2 h-20 md:h-24" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const entries = getEntriesForDate(currentDateObj);
              const isTodayDate = isToday(currentDateObj);

              return (
                <div
                  key={day}
                  className={`
                    p-2 h-20 md:h-24 border border-border rounded-lg
                    ${isTodayDate ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}
                    transition-colors cursor-pointer
                  `}
                >
                  <div className={`text-sm font-medium mb-1 ${isTodayDate ? 'text-primary' : ''}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {entries.slice(0, 2).map((entry, entryIndex) => (
                      <div
                        key={entryIndex}
                        className={`
                          text-xs px-1 py-0.5 rounded truncate
                          ${getTypeColor(entry.type)} text-white
                        `}
                        title={`${entry.title} - ${entry.amount}`}
                      >
                        {getTypeIcon(entry.type)} {entry.title}
                      </div>
                    ))}
                    {entries.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{entries.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-accent text-white shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>💰 Expenses</span>
                <span className="font-bold">$1,247.50</span>
              </div>
              <div className="flex justify-between">
                <span>💚 Health Logs</span>
                <span className="font-bold">28 entries</span>
              </div>
              <div className="flex justify-between">
                <span>✅ Tasks Done</span>
                <span className="font-bold">47 completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary text-white shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>💰 Spending</span>
                <span className="font-bold">$186.50</span>
              </div>
              <div className="flex justify-between">
                <span>💚 Workouts</span>
                <span className="font-bold">4 sessions</span>
              </div>
              <div className="flex justify-between">
                <span>✅ Productivity</span>
                <span className="font-bold">85% rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-primary text-white shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>💰 Spent</span>
                <span className="font-bold">$47.50</span>
              </div>
              <div className="flex justify-between">
                <span>💚 Health Score</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="flex justify-between">
                <span>✅ Tasks</span>
                <span className="font-bold">5/8 done</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Entry Types</CardTitle>
          <CardDescription>Understanding your calendar entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent"></div>
              <span className="text-sm">💰 Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-secondary"></div>
              <span className="text-sm">💚 Health</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary"></div>
              <span className="text-sm">✅ Tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;