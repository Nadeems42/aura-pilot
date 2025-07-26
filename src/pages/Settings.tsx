import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Bell, 
  Moon, 
  Sun,
  Download,
  Upload,
  Trash2,
  Shield,
  Database,
  Palette
} from "lucide-react";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    bio: "Wellness enthusiast and productivity lover"
  });

  const [notifications, setNotifications] = useState({
    taskReminders: true,
    healthGoals: true,
    budgetAlerts: true,
    weeklyReports: false
  });

  const [preferences, setPreferences] = useState({
    startOfWeek: "monday",
    currency: "USD",
    timeFormat: "12h",
    dataRetention: "1year"
  });

  const handleProfileUpdate = () => {
    // Handle profile update logic
    console.log("Profile updated:", profileData);
  };

  const handleExportData = () => {
    // Handle data export logic
    console.log("Exporting data...");
  };

  const handleImportData = () => {
    // Handle data import logic
    console.log("Importing data...");
  };

  const handleResetData = () => {
    // Handle data reset logic
    console.log("Resetting data...");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
              />
            </div>
            <Button onClick={handleProfileUpdate} className="w-full bg-gradient-primary">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-secondary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="w-4 h-4" />
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Separator />

            <div>
              <Label htmlFor="startweek">Start of Week</Label>
              <Select value={preferences.startOfWeek} onValueChange={(value) => 
                setPreferences({ ...preferences, startOfWeek: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={preferences.currency} onValueChange={(value) => 
                setPreferences({ ...preferences, currency: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                  <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                  <SelectItem value="CAD">CAD (C$) - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD (A$) - Australian Dollar</SelectItem>
                  <SelectItem value="CHF">CHF (Fr) - Swiss Franc</SelectItem>
                  <SelectItem value="CNY">CNY (¥) - Chinese Yuan</SelectItem>
                  <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                  <SelectItem value="KRW">KRW (₩) - South Korean Won</SelectItem>
                  <SelectItem value="BRL">BRL (R$) - Brazilian Real</SelectItem>
                  <SelectItem value="RUB">RUB (₽) - Russian Ruble</SelectItem>
                  <SelectItem value="MXN">MXN ($) - Mexican Peso</SelectItem>
                  <SelectItem value="SGD">SGD (S$) - Singapore Dollar</SelectItem>
                  <SelectItem value="ZAR">ZAR (R) - South African Rand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeformat">Time Format</Label>
              <Select value={preferences.timeFormat} onValueChange={(value) => 
                setPreferences({ ...preferences, timeFormat: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </CardTitle>
            <CardDescription>Control what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Task Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified about upcoming tasks</p>
              </div>
              <Switch
                checked={notifications.taskReminders}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, taskReminders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Health Goals</Label>
                <p className="text-sm text-muted-foreground">Reminders for health tracking</p>
              </div>
              <Switch
                checked={notifications.healthGoals}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, healthGoals: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Budget Alerts</Label>
                <p className="text-sm text-muted-foreground">Warnings when approaching budget limits</p>
              </div>
              <Switch
                checked={notifications.budgetAlerts}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, budgetAlerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Get weekly progress summaries</p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, weeklyReports: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-secondary" />
              Data Management
            </CardTitle>
            <CardDescription>Control your data and privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="retention">Data Retention</Label>
              <Select value={preferences.dataRetention} onValueChange={(value) => 
                setPreferences({ ...preferences, dataRetention: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                How long to keep your data before automatic deletion
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data (CSV)
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleImportData}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium text-destructive">Danger Zone</p>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleResetData}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Data
              </Button>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Information */}
      <Card className="bg-gradient-wellness text-white shadow-wellness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            About Life Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm opacity-80">Version</p>
              <p className="font-bold">1.0.0</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Data Entries</p>
              <p className="font-bold">1,247 total</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Days Active</p>
              <p className="font-bold">42 days</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm opacity-80">
              Thank you for using Life Tracker! Your wellness journey matters, and we're here to support your progress every step of the way.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;