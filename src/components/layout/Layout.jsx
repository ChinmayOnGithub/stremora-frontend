// import { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts';
// import Sidebar from './Sidebar';
// import Header from './Header/Header';
// import PropTypes from 'prop-types';

// const Layout = ({ children }) => {
//   const { user } = useAuth();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

//   const toggleSidebar = () => {
//     if (isDesktop) {
//       setIsSidebarCollapsed(prev => !prev);
//     } else {
//       setIsSidebarOpen(prev => !prev);
//     }
//   };

//   // Detect screen size changes
//   useEffect(() => {
//     const handleResize = () => {
//       setIsDesktop(window.innerWidth >= 1024);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div className="flex flex-col h-screen text-gray-900 dark:text-white">

//       {/* Header */}
//       <Header toggleSidebar={toggleSidebar} />

//       <div className="flex flex-1">

//         {/* Sidebar Overlay (Mobile) */}
//         {isSidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
//             onClick={() => setIsSidebarOpen(false)}
//           />
//         )}

//         {/* Sidebar */}
//         <Sidebar
//           className={`
//             absolute top-0 bottom-0 z-40 overflow-y-auto
//             lg:static
//             transition-transform duration-300 ease-in-out
//             ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//             lg:translate-x-0
//           `}
//           collapsed={isSidebarCollapsed}
//           onClose={() => setIsSidebarOpen(false)}
//           user={user}
//         />

//         {/* Main Content */}
//         <main className="flex-1 overflow-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// Layout.propTypes = {
//   children: PropTypes.node.isRequired
// };

// export default Layout;


// // Layout.jsx
// import { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts';
// import Sidebar from './Sidebar/Sidebar';
// import Header from './Header/Header';
// import PropTypes from 'prop-types';

// const Layout = ({ children }) => {
//   const { user } = useAuth();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

//   const toggleSidebar = () => {
//     if (isDesktop) {
//       setIsSidebarCollapsed(prev => !prev);
//     } else {
//       setIsSidebarOpen(prev => !prev);
//     }
//   };

//   // Detect screen size changes
//   useEffect(() => {
//     const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
//       {/* Sidebar */}
//       <Sidebar
//         className={`hidden md:flex z-40 transition-transform duration-300 ease-in-out
//           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//           lg:translate-x-0
//         `}
//         collapsed={isSidebarCollapsed}
//         onClose={() => setIsSidebarOpen(false)}
//         user={user}
//       />

//       {/* Right content column */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         {/* Slim sticky header */}
//         <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
//           <Header toggleSidebar={toggleSidebar} />
//         </div>

//         {/* Scrollable main content */}
//         <main className="flex-1 overflow-y-auto">
//           {/* <div className="mx-auto"> */}
//           <div className="min-h-screen w-full flex-col md:flex-row">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// Layout.propTypes = { children: PropTypes.node.isRequired };
// export default Layout;



// src/components/layout/Layout.jsx

// import { useState, useEffect, useCallback } from 'react';
// import Sidebar from './Sidebar/Sidebar';
// import Header from './Header/Header';
// import PropTypes from 'prop-types';
// import { cn } from '@/lib/utils';

// const Layout = ({ children }) => {
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen w-full bg-background">
//       {/* Mobile Sidebar Overlay */}
//       {isMobileSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 z-30 md:hidden"
//           onClick={() => setIsMobileSidebarOpen(false)}
//         />
//       )}

//       {/* Persistent Sidebar for Desktop, Sliding for Mobile */}
//       <Sidebar
//         className={cn(
//           "fixed inset-y-0 left-0 z-40 h-full transition-transform duration-300 ease-in-out",
//           isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
//           "md:relative md:translate-x-0" // On desktop, it's part of the layout flow
//         )}
//         onClose={() => setIsMobileSidebarOpen(false)}
//       />

//       {/* Main Content Area */}
//       <div className="flex flex-col flex-1">
//         <Header onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />
//         <main className="flex-1 p-4 sm:px-6 sm:py-4 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// Layout.propTypes = {
//   children: PropTypes.node.isRequired
// };

// export default Layout;




// src/components/layout/Layout.jsx

import { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import EmailVerificationBanner from '../EmailVerificationBanner';

const Layout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isDesktopCollapsed));
  }, [isDesktopCollapsed]);

  const handleToggleDesktopSidebar = useCallback(() => {
    setIsDesktopCollapsed(prev => !prev);
  }, []);

  const handleToggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Persistent Sidebar for Desktop, Sliding for Mobile */}
      <Sidebar
        className={cn(
          "fixed inset-y-0 left-0 z-40 h-full transition-transform duration-300 ease-in-out",
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          "md:relative md:translate-x-0"
        )}
        collapsed={isDesktopCollapsed}
        onToggle={handleToggleDesktopSidebar}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <Header onToggleSidebar={handleToggleMobileSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            <EmailVerificationBanner />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;