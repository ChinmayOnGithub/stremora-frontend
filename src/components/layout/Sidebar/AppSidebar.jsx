import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  Users,
  Upload,
  Video,
  History,
  Heart,
  Shield,
  LogIn,
  UserPlus,
} from 'lucide-react';
import './sidebar.css';

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const navSections = useMemo(() => {
    const mainNav = [{ label: 'Home', icon: Home, path: '/' }];
    
    const libraryNav = user ? [
      { label: 'Subscriptions', icon: Users, path: '/subscription' },
      { label: 'My Videos', icon: Video, path: '/my-videos' },
      { label: 'History', icon: History, path: '/history' },
      { label: 'Liked Videos', icon: Heart, path: '/liked-videos' },
    ] : [];
    
    const guestNav = !user ? [
      { label: 'Login', icon: LogIn, path: '/login' },
      { label: 'Register', icon: UserPlus, path: '/register' },
    ] : [];
    
    const adminNav = user?.role === 'admin' ? [
      { label: 'Admin Panel', icon: Shield, path: '/admin' }
    ] : [];
    
    return { mainNav, libraryNav, guestNav, adminNav };
  }, [user]);

  const ownerInitial = user?.username?.charAt(0).toUpperCase() || 'U';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 px-2 py-3 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Video className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold truncate group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0">
            STREMORA
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSections.mainNav.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.label}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/upload'}
                    tooltip="Upload Video"
                  >
                    <Link to="/upload">
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Library Section */}
        {navSections.libraryNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Library</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navSections.libraryNav.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      tooltip={item.label}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Guest Section */}
        {navSections.guestNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navSections.guestNav.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      tooltip={item.label}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Section */}
        {navSections.adminNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navSections.adminNav.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      tooltip={item.label}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer - User Profile */}
      {user && (
        <SidebarFooter className="border-t border-sidebar-border p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={`${user.fullname} (@${user.username})`}
                className="w-full"
              >
                <Link to="/user" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{ownerInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium truncate">{user.fullname}</span>
                    <span className="text-xs text-muted-foreground truncate">@{user.username}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
      
      <SidebarRail />
    </Sidebar>
  );
}
