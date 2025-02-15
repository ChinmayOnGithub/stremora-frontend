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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='subscription/' element={<Subscription />} />
      <Route path='user/' element={<User />} >
        <Route path=':userId' element={<User />} />
      </Route>
      <Route path="login/" element={<Login />} />
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
