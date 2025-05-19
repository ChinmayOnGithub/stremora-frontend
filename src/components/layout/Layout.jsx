import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const toggleSidebar = () => {
    if (isDesktop) {
      setIsSidebarCollapsed(prev => !prev);
    } else {
      setIsSidebarOpen(prev => !prev);
    }
  };

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        className={`
          absolute top-0 bottom-0 z-40 overflow-y-auto
          lg:static
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        collapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
      />

      {/* Main Content */}
      <div className={`flex-1 h-full overflow-hidden`}>
        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
