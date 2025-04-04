import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, UserProvider, VideoProvider } from './contexts';
import Layout from './Layout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VideoProvider>
          <UserProvider>
            <Layout />
          </UserProvider>
        </VideoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 