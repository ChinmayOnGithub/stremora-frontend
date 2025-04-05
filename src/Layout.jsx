// import React from 'react'
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom'
import {
  Header,
  Footer,
  // Sidebar
} from './components';

import { AuthProvider, UserProvider, VideoProvider } from './contexts';
import { Toaster } from "sonner";

function Layout() {

  return (
    <AuthProvider >
      <VideoProvider>
        <UserProvider>
          <div className="flex min-h-screen bg-white dark:bg-black transition-colors duration-500">
            {/* Sidebar */}

            {/* Main Content (Header + Page Content) */}
            <div className="flex flex-col flex-grow">
              <Toaster richColors position="bottom-right" />

              <Header />
              <div className="flex-grow p-0 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
                <Outlet />
              </div>
              {/* <Footer /> */}
            </div>
          </div>
        </UserProvider>
      </VideoProvider>
    </AuthProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout
