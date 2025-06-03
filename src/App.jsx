// App.jsx
// import { BrowserRouter } from 'react-router-dom';

import { AuthProvider, UserProvider, VideoProvider } from './contexts';
import { Outlet } from 'react-router-dom'
// import {
//   Header
// } from './components';
import { Toaster } from "sonner";
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <VideoProvider>
        <UserProvider>

          <Toaster richColors position="bottom-right" />
          <Layout>
            <Outlet />
          </Layout>

        </UserProvider>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App; 