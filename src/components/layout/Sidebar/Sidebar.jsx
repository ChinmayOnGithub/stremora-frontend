// // src/components/layout/Sidebar.jsx

// import React, { useMemo, useCallback, useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { twMerge } from 'tailwind-merge';
// import PropTypes from 'prop-types';
// import {
//   FiChevronLeft,
//   FiChevronRight,
//   FiHome,
//   FiClock,
//   FiVideo,
//   FiUpload,
//   FiHash,
//   FiHeart,
//   FiUser,
//   FiShield
// } from 'react-icons/fi';
// import { useAuth } from '../../../contexts';
// import { Logo } from '../../index';

// const Sidebar = ({
//   className = '',
//   onClose,
// }) => {
//   const location = useLocation();
//   const { user, logout } = useAuth();
//   const [collapsed, setCollapsed] = useState(() => {
//     const saved = localStorage.getItem('sidebarCollapsed');
//     return saved ? JSON.parse(saved) : false;
//   });

//   useEffect(() => {
//     localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
//   }, [collapsed]);

//   const toggleCollapsed = useCallback(() => {
//     setCollapsed(prev => !prev);
//   }, []);

//   const isActive = useCallback(
//     (path) => location.pathname === path || location.pathname.startsWith(path + '/'),
//     [location.pathname]
//   );

//   const allNavItems = useMemo(() => {
//     const baseItems = [
//       { label: 'Home', icon: <FiHome size={20} />, path: '/' },
//     ];

//     if (user) {
//       const userItems = [
//         { label: 'Subscription', icon: <FiHash size={20} />, path: '/subscription' },
//         { label: 'Upload', icon: <FiUpload size={20} />, path: '/upload' },
//         { label: 'My Videos', icon: <FiVideo size={20} />, path: '/my-videos' },
//         { label: 'History', icon: <FiClock size={20} />, path: '/history' },
//         { label: 'Liked Videos', icon: <FiHeart size={20} />, path: '/liked-videos' },
//       ];
//       baseItems.push(...userItems);
//     } else {
//       const guestItems = [
//         { label: 'Register', icon: <FiUser size={20} />, path: '/register' },
//         { label: 'Login', icon: <FiUser size={20} />, path: '/login' },
//       ];
//       baseItems.push(...guestItems);
//     }

//     // Here is the new logic to add the Admin link conditionally
//     if (user && user.role === 'admin') {
//       baseItems.push({
//         label: 'Admin Panel',
//         icon: <FiShield size={20} />, // Using the new icon
//         path: '/admin', // Pointing directly to the videos table
//       });
//     }

//     return baseItems;
//   }, [user]);

//   const renderedNav = useMemo(
//     () => allNavItems.map((item) => (
//       <Link
//         key={item.path}
//         to={item.path}
//         className={twMerge(
//           'group flex items-center rounded-lg transition-all duration-200 ease-in-out',
//           'hover:bg-amber-900/30',
//           collapsed ? 'justify-center px-2 py-2.5 gap-0' : 'px-4 py-2.5 gap-3',
//           isActive(item.path)
//             ? 'bg-amber-600 text-white hover:bg-amber-700'
//             : 'text-gray-300'
//         )}
//         title={collapsed ? item.label : undefined}
//         aria-label={item.label}
//         onClick={() => { if (onClose) onClose(); }}
//       >
//         <div className={twMerge(
//           'flex-shrink-0 transition-transform duration-200',
//           isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-amber-500'
//         )}>
//           {item.icon}
//         </div>
//         <span className={twMerge(
//           'truncate whitespace-nowrap transition-all duration-200 ease-in-out',
//           collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
//         )}>
//           {item.label}
//         </span>
//       </Link>
//     )),
//     [allNavItems, collapsed, isActive, onClose]
//   );

//   return (
//     <aside
//       className={twMerge(
//         'flex flex-col bg-gray-900 border-r border-gray-800 shadow-lg text-md',
//         'h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700',
//         'transition-all duration-200 ease-in-out',
//         collapsed ? 'w-16' : 'w-64',
//         className
//       )}
//       role="navigation"
//       aria-label="Main navigation"
//     >
//       {/* Sidebar Header */}
//       <div className={twMerge(
//         'sticky top-0 bg-gray-900 z-10',
//         collapsed
//           ? 'flex justify-center items-center h-[64px] p-0 lg:flex-col'
//           : 'flex items-center justify-between p-4'
//       )}>
//         {!collapsed && (
//           <span className="block lg:hidden"><Logo /></span>
//         )}
//         {!collapsed && (
//           <div className="hidden lg:flex items-center gap-2 text-amber-400 font-semibold animate-bounce-slow">
//             <span role="img" aria-label="party">🎈</span>
//             <span className="text-sm">Let's go!</span>
//           </div>
//         )}
//         <button
//           onClick={toggleCollapsed}
//           className={twMerge(
//             'p-2 rounded-full border border-gray-700 bg-gray-800 shadow-sm',
//             'hover:bg-amber-600 hover:text-white hover:shadow-lg',
//             'focus:outline-none',
//             'text-amber-500 transition-all duration-200',
//             'hidden lg:inline-flex items-center justify-center',
//             'select-none'
//           )}
//           aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//           aria-expanded={!collapsed}
//         >
//           {collapsed ? <FiChevronRight size={22} /> : <FiChevronLeft size={22} />}
//         </button>
//       </div>

//       <nav className="flex-1 px-2 space-y-1 py-2">
//         {renderedNav}
//       </nav>

//       {!collapsed && (
//         <div className="p-4 border-t border-gray-800 text-xs text-gray-500 sticky bottom-0 bg-gray-900">

//           <div className="mt-2">© 2025 Stremora</div>
//         </div>
//       )}
//     </aside>
//   );
// };

// Sidebar.propTypes = {
//   className: PropTypes.string,
//   // The navItems prop is no longer needed as it's generated internally
//   // navItems: PropTypes.arrayOf(
//   //   PropTypes.shape({
//   //     label: PropTypes.string.isRequired,
//   //     icon: PropTypes.node.isRequired,
//   //     path: PropTypes.string.isRequired
//   //   })
//   // ),
//   onClose: PropTypes.func,
// };

// export default React.memo(Sidebar);




// // neww code ================================================
// import React, { useMemo, useCallback, useState } from 'react';
// import { NavLink, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../../contexts';
// import { cn } from '@/lib/utils';
// import PropTypes from 'prop-types';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Home,
//   Users,
//   Upload,
//   Video,
//   History,
//   Heart,
//   Shield,
//   LogIn,
//   UserPlus,
//   PanelLeftClose,
//   PanelLeftOpen
// } from 'lucide-react';
// import './sidebar.css'; // This import is crucial for the animations

// // Helper component for navigation links
// const NavItem = ({ item, collapsed, onClick }) => {
//   const location = useLocation();
//   const isActive = location.pathname === item.path;

//   const linkContent = (
//     <>
//       <div className="relative">
//         <span className="swing-target inline-block">
//           <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-teal-400" : "text-slate-400 group-hover:text-teal-400")} />
//         </span>
//         {isActive && !collapsed && (
//           <div className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-teal-400"></div>
//         )}
//       </div>
//       <span className={cn("label truncate", collapsed && "hidden")}>{item.label}</span>
//     </>
//   );

//   return (
//     <TooltipProvider delayDuration={0}>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <NavLink
//             to={item.path}
//             onClick={onClick}
//             className={cn(
//               "group flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium transition-colors",
//               isActive ? "bg-slate-800/50 text-white" : "text-slate-300 hover:bg-slate-800/50 hover:text-white",
//               collapsed && "justify-center"
//             )}
//           >
//             {linkContent}
//           </NavLink>
//         </TooltipTrigger>
//         {collapsed && (
//           <TooltipContent side="right" sideOffset={5}>
//             {item.label}
//           </TooltipContent>
//         )}
//       </Tooltip>
//     </TooltipProvider>
//   );
// };
// NavItem.propTypes = { item: PropTypes.object.isRequired, collapsed: PropTypes.bool, onClick: PropTypes.func };


// function Sidebar({ className, onClose }) {
//   const { user } = useAuth();
//   const [collapsed, setCollapsed] = useState(() => {
//     return localStorage.getItem('sidebarCollapsed') === 'true';
//   });

//   const toggleCollapsed = useCallback(() => {
//     setCollapsed(prev => {
//       const newState = !prev;
//       localStorage.setItem('sidebarCollapsed', newState);
//       return newState;
//     });
//   }, []);

//   // Your original logic for determining nav items is preserved
//   const navSections = useMemo(() => {
//     const mainNav = [{ label: 'Home', icon: Home, path: '/' }];
//     const libraryNav = user ? [
//       { label: 'Subscriptions', icon: Users, path: '/subscription' },
//       { label: 'My Videos', icon: Video, path: '/my-videos' },
//       { label: 'History', icon: History, path: '/history' },
//       { label: 'Liked Videos', icon: Heart, path: '/liked-videos' },
//     ] : [];
//     const guestNav = !user ? [
//       { label: 'Login', icon: LogIn, path: '/login' },
//       { label: 'Register', icon: UserPlus, path: '/register' },
//     ] : [];
//     const adminNav = user?.role === 'admin' ? [
//       { label: 'Admin Panel', icon: Shield, path: '/admin' }
//     ] : [];
//     return { mainNav, libraryNav, guestNav, adminNav };
//   }, [user]);

//   const ownerInitial = user?.username?.charAt(0).toUpperCase() || 'U';

//   return (
//     <aside
//       className={cn(
//         // These classes control the collapse animation via CSS
//         "app-sidebar flex flex-col h-full bg-slate-900/95 border-r border-slate-800 backdrop-blur-lg",
//         collapsed ? "collapsed" : "expanded",
//         className
//       )}
//     >
//       {/* Header */}
//       <div className={cn("flex items-center p-4 h-16 shrink-0 border-b border-slate-800", collapsed ? "justify-center" : "justify-between")}>
//         {!collapsed && <Link to="/" className="font-bold text-lg text-white">STREMORA</Link>}
//         <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="hidden lg:flex text-slate-400 hover:text-white hover:bg-slate-800/50">
//           {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
//         </Button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-4 px-2 py-4 overflow-y-auto">
//         <div className="space-y-1">
//           {navSections.mainNav.map(item => <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />)}
//           {user && (
//             <TooltipProvider delayDuration={0}>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <NavLink to="/upload" onClick={onClose} className={cn("group flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium transition-colors bg-teal-600 text-white hover:bg-teal-700", collapsed && "justify-center")}>
//                     <span className="swing-target inline-block"><Upload className="h-5 w-5" /></span>
//                     <span className={cn("label", collapsed && "hidden")}>Upload</span>
//                   </NavLink>
//                 </TooltipTrigger>
//                 {collapsed && (
//                   <TooltipContent side="right" sideOffset={5}>Upload Video</TooltipContent>
//                 )}
//               </Tooltip>
//             </TooltipProvider>
//           )}
//         </div>

//         {navSections.libraryNav.length > 0 && (
//           <div className="space-y-1">
//             {!collapsed && <h2 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Library</h2>}
//             {navSections.libraryNav.map(item => <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />)}
//           </div>
//         )}

//         {navSections.guestNav.length > 0 && (
//           <div className="space-y-1">
//             {!collapsed && <h2 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</h2>}
//             {navSections.guestNav.map(item => <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />)}
//           </div>
//         )}
//       </nav>

//       {/* Footer / User Profile Section */}
//       <div className="mt-auto border-t border-slate-800 p-2">
//         {user ? (
//           <Link to="/user">
//             <div className={cn("flex items-center gap-3 rounded-md p-2 hover:bg-slate-800/50", collapsed && "justify-center")}>
//               <Avatar className="h-9 w-9">
//                 <AvatarImage src={user.avatar} alt={user.username} className="object-cover" />
//                 <AvatarFallback>{ownerInitial}</AvatarFallback>
//               </Avatar>
//               <div className={cn("label flex-1 truncate", collapsed && "hidden")}>
//                 <p className="text-sm font-semibold text-white truncate">{user.fullname}</p>
//                 <p className="text-xs text-slate-400 truncate">@{user.username}</p>
//               </div>
//             </div>
//           </Link>
//         ) : null}
//         {navSections.adminNav.length > 0 && (
//           <div className="mt-2">
//             {navSections.adminNav.map(item => <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />)}
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

// Sidebar.propTypes = {
//   className: PropTypes.string,
//   onClose: PropTypes.func,
// };

// export default React.memo(Sidebar);

// ---------------------------------------------------------------



// import React, { useMemo, useCallback, useState } from 'react';
// import { NavLink, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../../contexts';
// import { cn } from '@/lib/utils';
// import PropTypes from 'prop-types';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Home,
//   Users,
//   Upload,
//   Video,
//   History,
//   Heart,
//   Shield,
//   LogIn,
//   UserPlus,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';
// import './sidebar.css';

// const NavItem = ({ item, collapsed, onClick }) => {
//   const location = useLocation();
//   const isActive = location.pathname === item.path;

//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <NavLink
//             to={item.path}
//             onClick={onClick}
//             className={cn(
//               "nav-item group relative flex items-center h-11 rounded-lg transition-all duration-200 ease-in-out",
//               collapsed ? "px-3 justify-center" : "px-3 gap-3",
//               isActive
//                 ? "bg-gray-700/80 text-white shadow-sm"
//                 : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
//             )}
//           >
//             {/* Active indicator */}
//             {isActive && (
//               <div className="absolute left-0 top-1/2 w-1 h-6 bg-gray-300 rounded-r-full transform -translate-y-1/2" />
//             )}

//             {/* Icon */}
//             <item.icon
//               className={cn(
//                 "w-5 h-5 flex-shrink-0 transition-colors duration-200",
//                 isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
//               )}
//             />

//             {/* Label */}
//             <span className={cn(
//               "font-medium truncate transition-all duration-200",
//               collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
//             )}>
//               {item.label}
//             </span>
//           </NavLink>
//         </TooltipTrigger>

//         {collapsed && (
//           <TooltipContent side="right" sideOffset={12} className="bg-gray-700 border-gray-600 text-white">
//             {item.label}
//           </TooltipContent>
//         )}
//       </Tooltip>
//     </TooltipProvider>
//   );
// };

// NavItem.propTypes = {
//   item: PropTypes.object.isRequired,
//   collapsed: PropTypes.bool,
//   onClick: PropTypes.func
// };

// function Sidebar({ className, onClose }) {
//   const { user } = useAuth();
//   const [collapsed, setCollapsed] = useState(() => {
//     return localStorage.getItem('sidebarCollapsed') === 'true';
//   });

//   const toggleCollapsed = useCallback(() => {
//     setCollapsed(prev => {
//       const newState = !prev;
//       localStorage.setItem('sidebarCollapsed', newState);
//       return newState;
//     });
//   }, []);

//   const navSections = useMemo(() => {
//     const mainNav = [{ label: 'Home', icon: Home, path: '/' }];
//     const libraryNav = user ? [
//       { label: 'Subscriptions', icon: Users, path: '/subscription' },
//       { label: 'My Videos', icon: Video, path: '/my-videos' },
//       { label: 'History', icon: History, path: '/history' },
//       // { label: 'Liked Videos', icon: Heart, path: '/liked-videos' },
//     ] : [];
//     const guestNav = !user ? [
//       { label: 'Login', icon: LogIn, path: '/login' },
//       { label: 'Register', icon: UserPlus, path: '/register' },
//     ] : [];
//     const adminNav = user?.role === 'admin' ? [
//       { label: 'Admin Panel', icon: Shield, path: '/admin' }
//     ] : [];
//     return { mainNav, libraryNav, guestNav, adminNav };
//   }, [user]);

//   const ownerInitial = user?.username?.charAt(0).toUpperCase() || 'U';

//   return (
//     <aside
//       className={cn(
//         "sidebar-container flex flex-col h-full bg-gray-900 border-r border-gray-800",
//         collapsed ? "collapsed" : "expanded",
//         className
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
//         {!collapsed && (
//           <Link to="/" className="text-lg font-semibold text-white tracking-wide">
//             STREMORA
//           </Link>
//         )}

//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={toggleCollapsed}
//           className={cn(
//             "h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800 border-0",
//             collapsed && "mx-auto"
//           )}
//         >
//           {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//         </Button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
//         {/* Main Navigation */}
//         <div className="space-y-1">
//           {navSections.mainNav.map(item =>
//             <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//           )}

//           {/* Upload Button */}
//           {user && (
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <NavLink
//                     to="/upload"
//                     onClick={onClose}
//                     className={cn(
//                       "nav-item flex items-center h-11 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-all duration-200",
//                       collapsed ? "px-3 justify-center" : "px-3 gap-3"
//                     )}
//                   >
//                     <Upload className="w-5 h-5 flex-shrink-0" />
//                     <span className={cn(
//                       "font-medium truncate transition-all duration-200",
//                       collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
//                     )}>
//                       Upload
//                     </span>
//                   </NavLink>
//                 </TooltipTrigger>
//                 {collapsed && (
//                   <TooltipContent side="right" sideOffset={12} className="bg-gray-700 border-gray-600 text-white">
//                     Upload Video
//                   </TooltipContent>
//                 )}
//               </Tooltip>
//             </TooltipProvider>
//           )}
//         </div>

//         {/* Library Section */}
//         {navSections.libraryNav.length > 0 && (
//           <div className="space-y-1">
//             {!collapsed && (
//               <h2 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Library
//               </h2>
//             )}
//             {navSections.libraryNav.map(item =>
//               <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//             )}
//           </div>
//         )}

//         {/* Guest Section */}
//         {navSections.guestNav.length > 0 && (
//           <div className="space-y-1">
//             {!collapsed && (
//               <h2 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Account
//               </h2>
//             )}
//             {navSections.guestNav.map(item =>
//               <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//             )}
//           </div>
//         )}
//       </nav>

//       {/* Footer - User Profile */}
//       <div className="border-t border-gray-800 p-3">
//         {user && (
//           <Link to="/user">
//             <div className={cn(
//               "flex items-center h-11 rounded-lg p-2 hover:bg-gray-800 transition-colors duration-200",
//               collapsed ? "justify-center" : "gap-3"
//             )}>
//               <Avatar className="h-7 w-7 flex-shrink-0">
//                 <AvatarImage src={user.avatar} alt={user.username} />
//                 <AvatarFallback className="bg-gray-700 text-white text-sm">
//                   {ownerInitial}
//                 </AvatarFallback>
//               </Avatar>

//               <div className={cn(
//                 "min-w-0 transition-all duration-200",
//                 collapsed ? "w-0 opacity-0 overflow-hidden" : "flex-1 opacity-100"
//               )}>
//                 <p className="text-sm font-medium text-white truncate">{user.fullname}</p>
//                 <p className="text-xs text-gray-400 truncate">@{user.username}</p>
//               </div>
//             </div>
//           </Link>
//         )}

//         {/* Admin Panel */}
//         {navSections.adminNav.map(item =>
//           <div key={item.path} className="mt-2">
//             <NavItem item={item} collapsed={collapsed} onClick={onClose} />
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

// Sidebar.propTypes = {
//   className: PropTypes.string,
//   onClose: PropTypes.func,
// };

// export default React.memo(Sidebar);



// // src/components/layout/Sidebar/Sidebar.jsx

// import React, { useMemo, useCallback, useState } from 'react';
// import { NavLink, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../../contexts';
// import { cn } from '@/lib/utils';
// import PropTypes from 'prop-types';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Home,
//   Users,
//   Upload,
//   Video,
//   History,
//   Heart,
//   Shield,
//   LogIn,
//   UserPlus,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';
// import './sidebar.css'; // This import is crucial for the animations

// const NavItem = ({ item, collapsed, onClick }) => {
//   const location = useLocation();
//   const isActive = location.pathname === item.path;

//   return (
//     <TooltipProvider delayDuration={0}>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <NavLink
//             to={item.path}
//             onClick={onClick}
//             className={cn(
//               "group relative flex items-center h-11 rounded-lg transition-colors duration-200 ease-in-out",
//               collapsed ? "px-3 justify-center" : "px-3 gap-3",
//               isActive
//                 ? "bg-gray-700/80 text-white shadow-sm"
//                 : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
//             )}
//           >
//             {isActive && (
//               <div className="absolute left-0 top-1/2 w-1 h-6 bg-gray-300 rounded-r-full transform -translate-y-1/2" />
//             )}
//             <item.icon
//               className={cn(
//                 "w-5 h-5 flex-shrink-0 transition-colors duration-200",
//                 isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
//               )}
//             />
//             <span className={cn(
//               "font-medium truncate transition-all duration-200",
//               collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
//             )}>
//               {item.label}
//             </span>
//           </NavLink>
//         </TooltipTrigger>
//         {collapsed && (
//           <TooltipContent side="right" sideOffset={12} className="bg-gray-700 border-gray-600 text-white">
//             {item.label}
//           </TooltipContent>
//         )}
//       </Tooltip>
//     </TooltipProvider>
//   );
// };

// NavItem.propTypes = {
//   item: PropTypes.object.isRequired,
//   collapsed: PropTypes.bool,
//   onClick: PropTypes.func
// };

// function Sidebar({ className, onClose }) {
//   const { user } = useAuth();
//   const [collapsed, setCollapsed] = useState(() => {
//     return localStorage.getItem('sidebarCollapsed') === 'true';
//   });

//   const toggleCollapsed = useCallback(() => {
//     setCollapsed(prev => {
//       const newState = !prev;
//       localStorage.setItem('sidebarCollapsed', String(newState));
//       return newState;
//     });
//   }, []);

//   const navSections = useMemo(() => {
//     const mainNav = [{ label: 'Home', icon: Home, path: '/' }];
//     const libraryNav = user ? [
//       { label: 'Subscriptions', icon: Users, path: '/subscription' },
//       { label: 'My Videos', icon: Video, path: '/my-videos' },
//       { label: 'History', icon: History, path: '/history' },
//       { label: 'Liked Videos', icon: Heart, path: '/liked-videos' },
//     ] : [];
//     const guestNav = !user ? [
//       { label: 'Login', icon: LogIn, path: '/login' },
//       { label: 'Register', icon: UserPlus, path: '/register' },
//     ] : [];
//     const adminNav = user?.role === 'admin' ? [
//       { label: 'Admin Panel', icon: Shield, path: '/admin' }
//     ] : [];
//     return { mainNav, libraryNav, guestNav, adminNav };
//   }, [user]);

//   const ownerInitial = user?.username?.charAt(0).toUpperCase() || 'U';

//   return (
//     <aside
//       className={cn(
//         "sidebar-container flex flex-col h-full bg-gray-900 border-r border-gray-800",
//         collapsed ? "collapsed" : "expanded",
//         className
//       )}
//     >
//       <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800 shrink-0">
//         {!collapsed && (
//           <Link to="/" className="text-lg font-semibold text-white tracking-wide">
//             STREMORA
//           </Link>
//         )}
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={toggleCollapsed}
//           className={cn(
//             "h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800 border-0",
//             collapsed && "mx-auto"
//           )}
//         >
//           {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//         </Button>
//       </div>

//       <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
//         <div className="space-y-1">
//           {navSections.mainNav.map(item =>
//             <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//           )}
//           {/* Upload Button */}
//           {user && (
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <NavLink
//                     to="/upload"
//                     onClick={onClose}
//                     className={cn(
//                       "nav-item flex items-center h-11 rounded-lg bg-gray-500/10 hover:bg-gray-500/30 text-gray-300 hover:text-white transition-all duration-200", // Corrected classes
//                       collapsed ? "px-3 justify-center" : "px-3 gap-3"
//                     )}
//                   >
//                     <Upload className="w-5 h-5 flex-shrink-0" />
//                     <span className={cn(
//                       "font-medium truncate transition-all duration-200",
//                       collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
//                     )}>
//                       Upload
//                     </span>
//                   </NavLink>
//                 </TooltipTrigger>
//                 {collapsed && (
//                   <TooltipContent side="right" sideOffset={12} className="bg-gray-700 border-gray-600 text-white">
//                     Upload Video
//                   </TooltipContent>
//                 )}
//               </Tooltip>
//             </TooltipProvider>
//           )}
//         </div>

//         {navSections.libraryNav.length > 0 && (
//           <div className="space-y-1">
//             {!collapsed && (
//               <h2 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Library
//               </h2>
//             )}
//             {navSections.libraryNav.map(item =>
//               <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//             )}
//           </div>
//         )}

//         {navSections.guestNav.length > 0 && (
//           <div className="space-y-1">
//             {!collapsed && (
//               <h2 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Account
//               </h2>
//             )}
//             {navSections.guestNav.map(item =>
//               <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//             )}
//           </div>
//         )}
//       </nav>

//       <div className="border-t border-gray-800 p-3">
//         {user && (
//           <Link to="/user">
//             <div className={cn(
//               "flex items-center h-11 rounded-lg p-2 hover:bg-gray-800 transition-colors duration-200",
//               collapsed ? "justify-center" : "gap-3"
//             )}>
//               <Avatar className="h-7 w-7 flex-shrink-0">
//                 <AvatarImage src={user.avatar} alt={user.username} className="object-cover" />
//                 <AvatarFallback className="bg-gray-700 text-white text-sm">
//                   {ownerInitial}
//                 </AvatarFallback>
//               </Avatar>
//               <div className={cn(
//                 "min-w-0 transition-all duration-200",
//                 collapsed ? "w-0 opacity-0 overflow-hidden" : "flex-1 opacity-100"
//               )}>
//                 <p className="text-sm font-medium text-white truncate">{user.fullname}</p>
//                 <p className="text-xs text-gray-400 truncate">@{user.username}</p>
//               </div>
//             </div>
//           </Link>
//         )}

//         {navSections.adminNav.length > 0 && (
//           <div className="mt-2">
//             <NavItem item={navSections.adminNav[0]} collapsed={collapsed} onClick={onClose} />
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

// Sidebar.propTypes = {
//   className: PropTypes.string,
//   onClose: PropTypes.func,
// };

// export default React.memo(Sidebar);

// -------------------------------- new better but color bad ------------------------------
// src/components/layout/Sidebar/Sidebar.jsx
// import React, { useMemo, useCallback, useState } from 'react';
// import { NavLink, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../../contexts';
// import { cn } from '@/lib/utils';
// import PropTypes from 'prop-types';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Home,
//   Users,
//   Upload,
//   Video,
//   History,
//   Heart, // <-- This was the missing import
//   Shield,
//   LogIn,
//   UserPlus,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';
// import './sidebar.css';

// const NavItem = ({ item, collapsed, onClick }) => {
//   const location = useLocation();
//   const isActive = location.pathname === item.path;

//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <NavLink
//             to={item.path}
//             onClick={onClick}
//             className={cn(
//               "nav-item group relative flex items-center h-11 rounded-lg transition-all duration-200 ease-in-out",
//               collapsed ? "px-3 justify-center" : "px-3 gap-3",
//               isActive
//                 ? "bg-gray-700/80 text-white shadow-sm"
//                 : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
//             )}
//           >
//             {/* Active indicator */}
//             {isActive && (
//               <div className="absolute left-0 top-1/2 w-1 h-6 bg-gray-300 rounded-r-full transform -translate-y-1/2" />
//             )}

//             {/* Icon */}
//             <item.icon
//               className={cn(
//                 "w-5 h-5 flex-shrink-0 transition-colors duration-200",
//                 isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
//               )}
//             />

//             {/* Label */}
//             <span className={cn(
//               "font-medium truncate transition-all duration-200",
//               collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
//             )}>
//               {item.label}
//             </span>
//           </NavLink>
//         </TooltipTrigger>

//         {collapsed && (
//           <TooltipContent side="right" sideOffset={12} className="bg-gray-700 border-gray-600 text-white">
//             {item.label}
//           </TooltipContent>
//         )}
//       </Tooltip>
//     </TooltipProvider>
//   );
// };

// NavItem.propTypes = {
//   item: PropTypes.object.isRequired,
//   collapsed: PropTypes.bool,
//   onClick: PropTypes.func
// };

// function Sidebar({ className, onClose }) {
//   const { user } = useAuth();
//   const [collapsed, setCollapsed] = useState(() => {
//     return localStorage.getItem('sidebarCollapsed') === 'true';
//   });

//   const toggleCollapsed = useCallback(() => {
//     setCollapsed(prev => {
//       const newState = !prev;
//       localStorage.setItem('sidebarCollapsed', String(newState));
//       return newState;
//     });
//   }, []);

//   const navSections = useMemo(() => {
//     const mainNav = [{ label: 'Home', icon: Home, path: '/' }];
//     const libraryNav = user ? [
//       { label: 'Subscriptions', icon: Users, path: '/subscription' },
//       { label: 'My Videos', icon: Video, path: '/my-videos' },
//       { label: 'History', icon: History, path: '/history' },
//       { label: 'Liked Videos', icon: Heart, path: '/liked-videos' },
//     ] : [];
//     const guestNav = !user ? [
//       { label: 'Login', icon: LogIn, path: '/login' },
//       { label: 'Register', icon: UserPlus, path: '/register' },
//     ] : [];
//     const adminNav = user?.role === 'admin' ? [
//       { label: 'Admin Panel', icon: Shield, path: '/admin' }
//     ] : [];
//     return { mainNav, libraryNav, guestNav, adminNav };
//   }, [user]);

//   const ownerInitial = user?.username?.charAt(0).toUpperCase() || 'U';

//   return (
//     <aside
//       className={cn(
//         "sidebar-container flex flex-col h-full bg-gray-900 border-r border-gray-800",
//         collapsed ? "collapsed" : "expanded",
//         className
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800 shrink-0">
//         {!collapsed && (
//           <Link to="/" className="text-lg font-semibold text-white tracking-wide">
//             STREMORA
//           </Link>
//         )}

//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={toggleCollapsed}
//           className={cn(
//             "h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800 border-0",
//             collapsed && "mx-auto"
//           )}
//         >
//           {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//         </Button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
//         {/* Main Navigation */}
//         <div className="space-y-1">
//           {navSections.mainNav.map(item =>
//             <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//           )}

//           {/* Upload Button */}
//           {user && (
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <NavLink
//                     to="/upload"
//                     onClick={onClose}
//                     className={cn(
//                       "group relative flex items-center h-11 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 hover:text-white transition-all duration-200",
//                       collapsed ? "px-3 justify-center" : "px-3 gap-3"
//                     )}
//                   >
//                     <Upload className="w-5 h-5 flex-shrink-0" />
//                     <span className={cn(
//                       "font-medium truncate transition-all duration-200",
//                       collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
//                     )}>
//                       Upload
//                     </span>
//                   </NavLink>
//                 </TooltipTrigger>
//                 {collapsed && (
//                   <TooltipContent side="right" sideOffset={12} className="bg-gray-700 border-gray-600 text-white">
//                     Upload Video
//                   </TooltipContent>
//                 )}
//               </Tooltip>
//             </TooltipProvider>
//           )}
//         </div>

//         {/* Library Section */}
//         {navSections.libraryNav.length > 0 && (
//           <div className="space-y-1">
//             {!collapsed && (
//               <h2 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Library
//               </h2>
//             )}
//             {navSections.libraryNav.map(item =>
//               <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//             )}
//           </div>
//         )}

//         {/* Guest Section */}
//         {navSections.guestNav.length > 0 && (
//           <div className="space-y-1">
//             {!collapsed && (
//               <h2 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Account
//               </h2>
//             )}
//             {navSections.guestNav.map(item =>
//               <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//             )}
//           </div>
//         )}
//       </nav>

//       {/* Footer - User Profile */}
//       <div className="border-t border-gray-800 p-3">
//         {user && (
//           <Link to="/user">
//             <div className={cn(
//               "flex items-center h-11 rounded-lg p-2 hover:bg-gray-800 transition-colors duration-200",
//               collapsed ? "justify-center" : "gap-3"
//             )}>
//               <Avatar className="h-7 w-7 flex-shrink-0">
//                 <AvatarImage src={user.avatar} alt={user.username} className="object-cover" />
//                 <AvatarFallback className="bg-gray-700 text-white text-sm">
//                   {ownerInitial}
//                 </AvatarFallback>
//               </Avatar>
//               <div className={cn(
//                 "min-w-0 transition-all duration-200",
//                 collapsed ? "w-0 opacity-0 overflow-hidden" : "flex-1 opacity-100"
//               )}>
//                 <p className="text-sm font-medium text-white truncate">{user.fullname}</p>
//                 <p className="text-xs text-gray-400 truncate">@{user.username}</p>
//               </div>
//             </div>
//           </Link>
//         )}

//         {/* Admin Panel */}
//         {navSections.adminNav.length > 0 && (
//           <div className="mt-2">
//             <NavItem item={navSections.adminNav[0]} collapsed={collapsed} onClick={onClose} />
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

// Sidebar.propTypes = {
//   className: PropTypes.string,
//   onClose: PropTypes.func,
// };

// export default React.memo(Sidebar);


// src/components/layout/Sidebar/Sidebar.jsx

// import React, { useMemo, useCallback, useState } from 'react';
// import { NavLink, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../../contexts';
// import { cn } from '@/lib/utils';
// import PropTypes from 'prop-types';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Home,
//   Users,
//   Upload,
//   Video,
//   History,
//   Heart,
//   Shield,
//   LogIn,
//   UserPlus,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react';
// import './sidebar.css';

// const NavItem = ({ item, collapsed, onClick }) => {
//   const location = useLocation();
//   const isActive = location.pathname === item.path;

//   return (
//     <TooltipProvider delayDuration={0}>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <NavLink
//             to={item.path}
//             onClick={onClick}
//             className={cn(
//               "group relative flex items-center h-11 rounded-lg transition-colors duration-200 ease-in-out",
//               collapsed ? "px-3 justify-center" : "px-3 gap-3",
//               isActive
//                 ? "bg-zinc-800 text-white shadow-sm" // Active state color
//                 : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50" // Inactive and hover states
//             )}
//           >
//             {/* Active indicator */}
//             {isActive && (
//               <div className="absolute left-0 top-1/2 w-1 h-6 bg-primary rounded-r-full transform -translate-y-1/2" />
//             )}

//             {/* Icon */}
//             <item.icon
//               className={cn(
//                 "w-5 h-5 flex-shrink-0 transition-colors duration-200",
//                 isActive ? "text-primary" : "text-zinc-400 group-hover:text-zinc-200"
//               )}
//             />

//             {/* Label */}
//             <span className={cn(
//               "font-medium truncate transition-all duration-200",
//               collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
//             )}>
//               {item.label}
//             </span>
//           </NavLink>
//         </TooltipTrigger>

//         {collapsed && (
//           <TooltipContent side="right" sideOffset={12} className="bg-zinc-800 border-zinc-700 text-white">
//             {item.label}
//           </TooltipContent>
//         )}
//       </Tooltip>
//     </TooltipProvider>
//   );
// };

// NavItem.propTypes = {
//   item: PropTypes.object.isRequired,
//   collapsed: PropTypes.bool,
//   onClick: PropTypes.func
// };

// function Sidebar({ className, onClose, collapsed, onToggle }) {
//   const { user } = useAuth();

//   const navSections = useMemo(() => {
//     const mainNav = [{ label: 'Home', icon: Home, path: '/' }];
//     const libraryNav = user ? [
//       { label: 'Subscriptions', icon: Users, path: '/subscription' },
//       { label: 'My Videos', icon: Video, path: '/my-videos' },
//       { label: 'History', icon: History, path: '/history' },
//       { label: 'Liked Videos', icon: Heart, path: '/liked-videos' },
//     ] : [];
//     const guestNav = !user ? [
//       { label: 'Login', icon: LogIn, path: '/login' },
//       { label: 'Register', icon: UserPlus, path: '/register' },
//     ] : [];
//     const adminNav = user?.role === 'admin' ? [
//       { label: 'Admin Panel', icon: Shield, path: '/admin' }
//     ] : [];
//     return { mainNav, libraryNav, guestNav, adminNav };
//   }, [user]);

//   const ownerInitial = user?.username?.charAt(0).toUpperCase() || 'U';

//   return (
//     <aside
//       className={cn(
//         "sidebar-container flex flex-col h-full bg-zinc-900 border-r border-zinc-800", // Darker background
//         collapsed ? "collapsed" : "expanded",
//         className
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800 shrink-0">
//         {!collapsed && (
//           <Link to="/" className="text-lg font-semibold text-white tracking-wide">
//             STREMORA
//           </Link>
//         )}

//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={onToggle}
//           className={cn(
//             "h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 border-0",
//             collapsed && "mx-auto"
//           )}
//         >
//           {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//         </Button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
//         {/* Main Navigation */}
//         <div className="space-y-1">
//           {navSections.mainNav.map(item =>
//             <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//           )}

//           {/* Upload Button */}
//           {user && (
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <NavLink
//                     to="/upload"
//                     onClick={onClose}
//                     className={cn(
//                       "group relative flex items-center h-11 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200",
//                       collapsed ? "px-3 justify-center" : "px-3 gap-3"
//                     )}
//                   >
//                     <Upload className="w-5 h-5 flex-shrink-0" />
//                     <span className={cn(
//                       "font-medium truncate transition-all duration-200",
//                       collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
//                     )}>
//                       Upload
//                     </span>
//                   </NavLink>
//                 </TooltipTrigger>
//                 {collapsed && (
//                   <TooltipContent side="right" sideOffset={12} className="bg-zinc-800 border-zinc-700 text-white">
//                     Upload Video
//                   </TooltipContent>
//                 )}
//               </Tooltip>
//             </TooltipProvider>
//           )}
//         </div>

//         {/* Library Section */}
//         {navSections.libraryNav.length > 0 && (
//           <div className="space-y-1">
//             {!collapsed && (
//               <h2 className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
//                 Library
//               </h2>
//             )}
//             {navSections.libraryNav.map(item =>
//               <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//             )}
//           </div>
//         )}

//         {/* Guest Section */}
//         {navSections.guestNav.length > 0 && (
//           <div className="space-y-1">
//             {!collapsed && (
//               <h2 className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
//                 Account
//               </h2>
//             )}
//             {navSections.guestNav.map(item =>
//               <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
//             )}
//           </div>
//         )}
//       </nav>

//       {/* Footer - User Profile */}
//       <div className="border-t border-zinc-800 p-3">
//         {user && (
//           <Link to="/user">
//             <div className={cn(
//               "flex items-center h-11 rounded-lg p-2 hover:bg-zinc-800 transition-colors duration-200",
//               collapsed ? "justify-center" : "gap-3"
//             )}>
//               <Avatar className="h-7 w-7 flex-shrink-0">
//                 <AvatarImage src={user.avatar} alt={user.username} className="object-cover" />
//                 <AvatarFallback className="bg-zinc-700 text-white text-sm">
//                   {ownerInitial}
//                 </AvatarFallback>
//               </Avatar>
//               <div className={cn(
//                 "min-w-0 transition-all duration-200",
//                 collapsed ? "w-0 opacity-0 overflow-hidden" : "flex-1 opacity-100"
//               )}>
//                 <p className="text-sm font-medium text-white truncate">{user.fullname}</p>
//                 <p className="text-xs text-zinc-400 truncate">@{user.username}</p>
//               </div>
//             </div>
//           </Link>
//         )}

//         {/* Admin Panel */}
//         {navSections.adminNav.length > 0 && (
//           <div className="mt-2">
//             <NavItem item={navSections.adminNav[0]} collapsed={collapsed} onClick={onClose} />
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

// Sidebar.propTypes = {
//   className: PropTypes.string,
//   onClose: PropTypes.func,
//   collapsed: PropTypes.bool.isRequired,
//   onToggle: PropTypes.func.isRequired,
// };

// export default React.memo(Sidebar);


import React, { useMemo } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../../../contexts';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import './sidebar.css';

// Helper for nav items
const NavItem = ({ item, collapsed, onClick, activeColor = "bg-zinc-800" }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={item.path}
            onClick={onClick}
            className={[
              "group relative flex items-center h-11 rounded-lg transition-colors duration-200",
              collapsed ? "px-3 justify-center" : "px-3 gap-3",
              isActive
                ? `${activeColor} text-white shadow-sm`
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
            ].join(" ")}
            tabIndex={0}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 w-1 h-6 bg-white rounded-r-full transform -translate-y-1/2" />
            )}
            <item.icon className={[
              "w-5 h-5 flex-shrink-0 transition-colors duration-200",
              isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
            ].join(" ")} />
            <span className={[
              "font-medium truncate transition-all duration-200",
              collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            ].join(" ")}>{item.label}</span>
          </NavLink>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" sideOffset={12} className="bg-zinc-800 border-zinc-700 text-white">
            {item.label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  collapsed: PropTypes.bool,
  onClick: PropTypes.func,
  activeColor: PropTypes.string,
};

function Sidebar({ className, onClose, collapsed, onToggle }) {
  const { user } = useAuth();

  // Prepare all nav sections. Only include items for the appropriate login state.
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
    <aside
      className={[
        "sidebar-container flex flex-col h-full bg-zinc-900 border-r border-zinc-800",
        collapsed ? "collapsed" : "expanded",
        className || ""
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800 shrink-0">
        {!collapsed && (
          <Link to="/" className="text-lg font-semibold text-white tracking-wide">
            STREMORA
          </Link>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`
    sidebar-collapse-btn
    h-9 w-9
    rounded-full
    flex items-center justify-center
    bg-zinc-800 hover:bg-zinc-700
    text-zinc-200 hover:text-white
    ring-0 outline-none
    transition-all
    shadow-md
    active:scale-95
    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
    focus-visible:ring-offset-zinc-900
    ${collapsed ? "mx-auto" : ""}
  `}
        >
          {collapsed ? (
            <ChevronRight
              className="h-[1.3rem] w-[1.3rem] transition-transform duration-150"
              aria-hidden="true"
            />
          ) : (
            <ChevronLeft
              className="h-[1.3rem] w-[1.3rem] transition-transform duration-150"
              aria-hidden="true"
            />
          )}
        </Button>

      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navSections.mainNav.map(item =>
            <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
          )}

          {/* Upload Button */}
          {user && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/upload"
                    onClick={onClose}
                    className={[
                      "group relative flex items-center h-11 rounded-lg transition-all duration-200",
                      "bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold shadow-sm",
                      collapsed ? "px-3 justify-center" : "px-3 gap-3"
                    ].join(" ")}
                  >
                    <Upload className="w-5 h-5 flex-shrink-0" />
                    <span className={[
                      "font-medium truncate transition-all duration-200",
                      collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
                    ].join(" ")}>Upload</span>
                  </NavLink>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={12} className="bg-zinc-800 border-zinc-700 text-white">
                    Upload Video
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Library Section */}
        {navSections.libraryNav.length > 0 && (
          <div className="space-y-1">
            {!collapsed && (
              <h2 className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Library
              </h2>
            )}
            {navSections.libraryNav.map(item =>
              <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
            )}
          </div>
        )}

        {/* Guest Section */}
        {navSections.guestNav.length > 0 && (
          <div className="space-y-1">
            {!collapsed && (
              <h2 className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Account
              </h2>
            )}
            {navSections.guestNav.map(item =>
              <NavItem key={item.path} item={item} collapsed={collapsed} onClick={onClose} />
            )}
          </div>
        )}
      </nav>

      {/* Footer - User Profile */}
      <div className="border-t border-zinc-800 p-3">
        {user && (
          <Link to="/user">
            <div className={[
              "flex items-center h-11 rounded-lg p-2 hover:bg-zinc-800 transition-colors duration-200",
              collapsed ? "justify-center" : "gap-3"
            ].join(" ")}>
              <Avatar className="h-7 w-7 flex-shrink-0">
                <AvatarImage src={user.avatar} alt={user.username} className="object-cover" />
                <AvatarFallback className="bg-zinc-700 text-white text-sm">
                  {ownerInitial}
                </AvatarFallback>
              </Avatar>
              <div className={[
                "min-w-0 transition-all duration-200",
                collapsed ? "w-0 opacity-0 overflow-hidden" : "flex-1 opacity-100"
              ].join(" ")}>
                <p className="text-sm font-medium text-white truncate">{user.fullname}</p>
                <p className="text-xs text-zinc-400 truncate">@{user.username}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Admin Panel */}
        {navSections.adminNav.length > 0 && (
          <div className="mt-2">
            <NavItem item={navSections.adminNav[0]} collapsed={collapsed} onClick={onClose} />
          </div>
        )}
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  collapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default React.memo(Sidebar);
