import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  DollarSign, 
  TrendingDown, 
  TrendingUp,
  Calendar,
  Filter,
  PieChart,
  Receipt
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUserData } from "@/hooks/useUserData";

const Expenses = () => {
  const { expenses, userSettings, addExpense, loading } = useUserData();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate real spending data
  const monthlyBudget = userSettings?.monthly_expense_budget || 2000;
  const currentSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const today = new Date().toISOString().split('T')[0];
  const todaySpent = expenses
    .filter(expense => expense.date === today)
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  // Calculate category breakdown from real data
  const categoryNames = ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Healthcare", "Utilities"];
  const categoryIcons = {
    "Food & Dining": "🍽️",
    "Transportation": "🚗", 
    "Shopping": "🛒",
    "Entertainment": "🎬",
    "Healthcare": "⚕️",
    "Utilities": "⚡"
  };

  const categories = categoryNames.map(name => {
    const spent = expenses
      .filter(expense => expense.category === name)
      .reduce((sum, expense) => sum + Number(expense.amount), 0);
    
    return {
      name,
      spent,
      budget: monthlyBudget / 6, // Evenly distribute budget across categories
      color: "bg-primary",
      icon: categoryIcons[name as keyof typeof categoryIcons] || "💰"
    };
  });

  const recentTransactions = expenses.slice(0, 5).map(expense => ({
    id: expense.id,
    description: expense.description,
    amount: Number(expense.amount),
    category: expense.category,
    date: expense.date === today ? "Today" : new Date(expense.date).toLocaleDateString(),
    time: new Date(expense.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  const handleAddExpense = async () => {
    if (!amount || !selectedCategory || !description) return;

    const success = await addExpense({
      amount: parseFloat(amount),
      category: selectedCategory,
      description,
      date: today
    });

    if (success) {
      setAmount("");
      setSelectedCategory("");
      setDescription("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
          <p className="text-muted-foreground">Manage your daily spending and budgets</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-accent hover:scale-105 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-card">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>Record your spending for better tracking</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryNames.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {categoryIcons[cat as keyof typeof categoryIcons]} {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="What did you buy?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button onClick={handleAddExpense} className="w-full bg-gradient-accent">
                Add Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-primary text-white shadow-wellness">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Monthly Budget</span>
              <DollarSign className="w-5 h-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">${currentSpent.toLocaleString()}</p>
              <p className="text-sm opacity-80">of ${monthlyBudget.toLocaleString()}</p>
              <Progress 
                value={(currentSpent / monthlyBudget) * 100} 
                className="bg-white/20 [&>div]:bg-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover:scale-105 transition-transform">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Spending</span>
              <TrendingDown className="w-5 h-5 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">${todaySpent.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {expenses.filter(e => e.date === today).length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover:scale-105 transition-transform">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Remaining Budget</span>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-secondary">${(monthlyBudget - currentSpent).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{Math.round(((monthlyBudget - currentSpent) / monthlyBudget) * 100)}% left</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Categories
            </CardTitle>
            <CardDescription>Spending breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span>{category.icon}</span>
                      {category.name}
                    </span>
                    <Badge variant="secondary">
                      ${category.spent} / ${category.budget}
                    </Badge>
                  </div>
                  <Progress 
                    value={(category.spent / category.budget) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-accent" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Latest spending activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category} • {transaction.date} at {transaction.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    ${transaction.amount}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;