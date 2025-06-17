// App.jsx
// import { BrowserRouter } from 'react-router-dom';

import { Outlet } from 'react-router-dom'
// import {
//   Header
// } from './components';
import { Toaster } from "sonner";
import Layout from './components/layout/Layout';

function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App; 