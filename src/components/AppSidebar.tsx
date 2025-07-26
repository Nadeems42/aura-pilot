import { 
  Home, 
  CreditCard, 
  Heart, 
  CheckSquare, 
  Calendar, 
  Brain, 
  Settings 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home,
    description: "Overview"
  },
  { 
    title: "Expenses", 
    url: "/expenses", 
    icon: CreditCard,
    description: "Track spending"
  },
  { 
    title: "Health", 
    url: "/health", 
    icon: Heart,
    description: "Wellness tracking"
  },
  { 
    title: "Tasks", 
    url: "/tasks", 
    icon: CheckSquare,
    description: "To-do management"
  },
  { 
    title: "Calendar", 
    url: "/calendar", 
    icon: Calendar,
    description: "All entries"
  },
  { 
    title: "AI Insights", 
    url: "/insights", 
    icon: Brain,
    description: "Smart suggestions"
  },
  { 
    title: "Settings", 
    url: "/settings", 
    icon: Settings,
    description: "Preferences"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-gradient-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-wellness rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-foreground">Life Tracker</h2>
                <p className="text-xs text-muted-foreground">Your wellness companion</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`
                      transition-all duration-200 hover:scale-105
                      ${isActive(item.url) 
                        ? "bg-gradient-primary text-white shadow-wellness" 
                        : "hover:bg-muted/80"
                      }
                    `}
                  >
                    <NavLink to={item.url}>
                      <item.icon className={`w-5 h-5 ${isCollapsed ? "mx-auto" : "mr-3"}`} />
                      {!isCollapsed && (
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}