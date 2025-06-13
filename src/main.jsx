import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

// import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import User from './pages/User.jsx'
import Subscription from './pages/Subscription.jsx'
import { ProtectedRoutes } from './components/index.js'
import Login from './pages/Login.jsx'
import UploadVideo from './pages/UploadVideo.jsx'
import Watch from './pages/Watch';
import Register from './pages/Register.jsx'
import Channel from './pages/Channel.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import UpdateUserInfo from './pages/UpdateProfilePage.jsx'

import Lottie from "lottie-react";
import animationData from "./assets/Animation - 1740657938454.json";
import { Loading } from './components/index.js';
import App from './App.jsx';
import History from './pages/History.jsx'
import MyVideos from './pages/MyVideos.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='subscription/' element={<ProtectedRoutes><Subscription /></ProtectedRoutes>} />
      <Route path='user/' element={<ProtectedRoutes><User /></ProtectedRoutes>} />
      <Route path='user/:userId' element={<ProtectedRoutes><User /></ProtectedRoutes>} />
      <Route path='user/c/:channelName' element={<Channel />} />
      <Route path='user/update-account' element={<ProtectedRoutes><UpdateUserInfo /></ProtectedRoutes>} /> {/* current */}

      <Route path="upload/" element={<ProtectedRoutes><UploadVideo /></ProtectedRoutes>} />
      <Route path="history/" element={<ProtectedRoutes><History /></ProtectedRoutes>} />
      <Route path="my-videos/" element={<ProtectedRoutes><MyVideos /></ProtectedRoutes>} />
      <Route path="/watch/:videoId" element={<Watch />} />


      <Route path="login/" element={<Login />} />
      <Route path="forgot-password/" element={<ForgotPassword />} />
      <Route path="reset-password/" element={<ResetPassword />} />
      <Route path="register/" element={<Register />} />
      <Route path="/loading" element={<Loading />} /> {/* For testing */}
      <Route path='*'
        element={
          <div
            className='flex flex-col justify-center items-center h-full text-white font-bold text-3xl p-4'
          >
            {/* Lottie NOT FOUND Animation */}
            <Lottie
              animationData={animationData}
              loop={true}
              className="w-auto h-50 sm:h-100"
            />
            <h1 className='m-2 text-3xl text-center font-bold text-black/80 dark:text-white/80 sm:text-2xl w-[250px] sm:w-fit'>
              NOT FOUND
            </h1>
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
