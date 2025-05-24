
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Plus, 
  BarChart3, 
  Calendar, 
  Filter, 
  Settings, 
  Bell, 
  TrendingUp,
  Target,
  Clock,
  AlertCircle,
  Brain,
  Timer,
  LineChart
} from 'lucide-react';

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  stats: any;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ activeView, onViewChange, stats }) => {
  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      id: "dashboard",
      badge: null,
    },
    {
      title: "Add Task",
      icon: Plus,
      id: "add-task",
      badge: null,
    },
    {
      title: "All Tasks",
      icon: BarChart3,
      id: "all-tasks",
      badge: stats.total > 0 ? stats.total : null,
    },
    {
      title: "Analytics",
      icon: LineChart,
      id: "analytics",
      badge: "New",
      badgeVariant: "secondary" as const,
    },
    {
      title: "Calendar View",
      icon: Calendar,
      id: "calendar",
      badge: null,
    },
    {
      title: "Overdue",
      icon: AlertCircle,
      id: "overdue",
      badge: stats.overdue > 0 ? stats.overdue : null,
      badgeVariant: "destructive" as const,
    },
    {
      title: "In Progress",
      icon: Clock,
      id: "in-progress",
      badge: stats.inProgress > 0 ? stats.inProgress : null,
      badgeVariant: "secondary" as const,
    },
  ];

  const productivityFeatures = [
    {
      title: "Focus Mode",
      icon: Brain,
      id: "focus-mode",
      badge: "Pomodoro",
      badgeVariant: "outline" as const,
    },
    {
      title: "AI Priority",
      icon: TrendingUp,
      id: "ai-priority",
      badge: "AI",
      badgeVariant: "secondary" as const,
    },
    {
      title: "Smart Goals",
      icon: Target,
      id: "smart-goals",
      badge: "Beta",
      badgeVariant: "outline" as const,
    },
  ];

  const utilityItems = [
    {
      title: "Notifications",
      icon: Bell,
      id: "notifications",
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings",
    },
  ];

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-gradient-from to-gradient-to rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">TaskMaster</h1>
            <p className="text-xs text-muted-foreground">Pro Edition</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    isActive={activeView === item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <item.icon className="w-4 h-4 mr-3" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge 
                        variant={item.badgeVariant || "default"} 
                        className="ml-auto"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Productivity Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {productivityFeatures.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    isActive={activeView === item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <item.icon className="w-4 h-4 mr-3" />
                      <span>{item.title}</span>
                    </div>
                    <Badge variant={item.badgeVariant} className="ml-auto">
                      {item.badge}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Utilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    isActive={activeView === item.id}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-center text-muted-foreground">
          <p className="mb-1">Made with ❤️ by</p>
          <p className="font-semibold gradient-text">Gali Vamsee Krishna</p>
          <p className="mt-2">© 2024 TaskMaster Pro</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
