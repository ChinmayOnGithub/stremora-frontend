import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import User from './pages/User.jsx'
import Subscription from './pages/Subscription.jsx'
import ProtectedRoute from './components/ProtectedRoutes.jsx'
import Login from './pages/Login.jsx'
// import { ProtectedRoute } from './components/index.js'
import UploadVideo from './pages/UploadVideo.jsx'
import Watch from './pages/Watch';
import Register from './pages/Register.jsx'
import Channel from './pages/Channel.jsx'
import Logout from './components/Logout.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='subscription/' element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path='user/' element={<ProtectedRoute><User /></ProtectedRoute>} />
      <Route path='user/:userId' element={<ProtectedRoute><User /></ProtectedRoute>} />
      <Route path='user/c/:channelName' element={<Channel />} />

      <Route path="login/" element={<Login />} />
      {/* <Route path="logout/" element={<Logout />} /> */}
      <Route path="register/" element={<Register />} />
      <Route path="upload/" element={<ProtectedRoute><UploadVideo /></ProtectedRoute>} />
      <Route path="/watch/:videoId" element={<Watch />} /> {/* ✅ Watch page */}
      <Route path='*' element={<div className='bg-red-600 text-white font-bold text-3xl p-4'>Not Found</div>} />
    </Route>
  )
)




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
