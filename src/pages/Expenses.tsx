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

const Expenses = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Mock data
  const monthlyBudget = 2000;
  const currentSpent = 1247.50;
  const todaySpent = 47.50;

  const categories = [
    { name: "Food & Dining", spent: 420, budget: 600, color: "bg-red-500", icon: "🍽️" },
    { name: "Transportation", spent: 180, budget: 300, color: "bg-blue-500", icon: "🚗" },
    { name: "Shopping", spent: 320, budget: 400, color: "bg-purple-500", icon: "🛒" },
    { name: "Entertainment", spent: 150, budget: 200, color: "bg-green-500", icon: "🎬" },
    { name: "Healthcare", spent: 90, budget: 150, color: "bg-yellow-500", icon: "⚕️" },
    { name: "Utilities", spent: 87.50, budget: 350, color: "bg-orange-500", icon: "⚡" }
  ];

  const recentTransactions = [
    { id: 1, description: "Starbucks Coffee", amount: 5.50, category: "Food & Dining", date: "Today", time: "2:30 PM" },
    { id: 2, description: "Uber Ride", amount: 12.00, category: "Transportation", date: "Today", time: "1:15 PM" },
    { id: 3, description: "Lunch at Subway", amount: 8.99, category: "Food & Dining", date: "Today", time: "12:45 PM" },
    { id: 4, description: "Amazon Purchase", amount: 45.99, category: "Shopping", date: "Yesterday", time: "6:20 PM" },
    { id: 5, description: "Netflix Subscription", amount: 15.99, category: "Entertainment", date: "Yesterday", time: "3:10 PM" }
  ];

  const handleAddExpense = () => {
    // Handle expense addition logic here
    console.log({ amount, category: selectedCategory, description });
    setAmount("");
    setSelectedCategory("");
    setDescription("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
          <p className="text-muted-foreground">Manage your daily spending and budgets</p>
        </div>
        
        <Dialog>
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
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
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
            <p className="text-2xl font-bold text-accent">${todaySpent}</p>
            <p className="text-sm text-muted-foreground">3 transactions</p>
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