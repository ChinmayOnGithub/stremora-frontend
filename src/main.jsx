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
import UploadVideo from './pages/UploadVideo.jsx'
import Watch from './pages/Watch';
import Register from './pages/Register.jsx'
import Channel from './pages/Channel.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

import Lottie from "lottie-react";
import animationData from "./assets/Animation - 1740657938454.json";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='subscription/' element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path='user/' element={<ProtectedRoute><User /></ProtectedRoute>} />
      <Route path='user/:userId' element={<ProtectedRoute><User /></ProtectedRoute>} />
      <Route path='user/c/:channelName' element={<Channel />} />

      <Route path="login/" element={<Login />} />
      <Route path="forgot-password/" element={<ForgotPassword />} />
      <Route path="reset-password/" element={<ResetPassword />} />
      <Route path="register/" element={<Register />} />
      <Route path="upload/" element={<ProtectedRoute><UploadVideo /></ProtectedRoute>} />
      <Route path="/watch/:videoId" element={<Watch />} /> {/* ✅ Watch page */}
      <Route path='*'
        element={
          <div
            className='flex flex-col justify-center items-center h-full text-white font-bold text-3xl p-4'
          >
            {/* Lottie Animation */}
            <Lottie
              animationData={animationData}
              loop={true}
              className="w-auto h-50 sm:h-100"
            />
            <h1 className='m-2 text-3xl text-center font-bold text-black/80 dark:text-white/80 sm:text-2xl w-[250px] sm:w-fit'>
              NOT FOUND            </h1>
          </div>
        }
      />
    </Route>
  )
)




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
