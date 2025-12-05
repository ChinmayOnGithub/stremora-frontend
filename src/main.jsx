import './index.css'
import './styles/toast.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Outlet, Navigate } from 'react-router-dom'

import Home from './pages/Home.jsx'
import User from './pages/User.jsx'
import Subscription from './pages/Subscription.jsx'
import { AdminRoute } from './components/auth/AdminRoute.jsx';
import ProtectedRoutes from './components/auth/ProtectedRoutes.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'
import UploadVideo from './pages/UploadVideo.jsx'
import Watch from './pages/Watch.jsx';
import Register from './pages/Register.jsx'
import Channel from './pages/Channel.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import SearchResults from './pages/SearchResults.jsx'
import UpdateUserInfo from './pages/UpdateProfilePage.jsx'
import Landing from './pages/Landing.jsx'
import LikedVideos from './pages/LikedVideos.jsx'

import Lottie from "lottie-react";
import animationData from "./assets/Animation - 1740657938454.json";
import { Loading } from './components/index.js';
import App from './App.jsx';
import History from './pages/History.jsx'
import MyVideos from './pages/MyVideos.jsx'
import { AuthProvider, UserProvider, VideoProvider } from './contexts/index.js';
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme/theme-provider.jsx";
import { UsersTable } from './components/admin/UsersTable.jsx'
import { VideosTable } from './components/admin/VideosTable.jsx'
import { PlaylistsTable } from './components/admin/PlaylistsTable.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <AuthProvider>
            <VideoProvider>
              <UserProvider>
                <Toaster position="bottom-right" />
                <Outlet />
              </UserProvider>
            </VideoProvider>
          </AuthProvider>
        </ThemeProvider>
      }
    >
      {/* Dedicated Landing Page Route (no layout) */}
      <Route path="/landing" element={<Landing />} />

      {/* Auth Routes (without layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Standalone, Secure Admin Section */}
      <Route
        path="/admin"
        element={
          <ProtectedRoutes>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoutes>
        }
      >
        {/* Nested Admin Routes */}
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<UsersTable />} />
        <Route path="videos" element={<VideosTable />} />
        <Route path="playlists" element={<PlaylistsTable />} />
        {/* Add other admin table routes here */}
      </Route>

      {/* Main App Routes (with layout) */}
      <Route path="/" element={<App />}>
        <Route path="" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="subscription/" element={<ProtectedRoutes><Subscription /></ProtectedRoutes>} />
        <Route path="user/" element={<ProtectedRoutes><User /></ProtectedRoutes>} />
        <Route path="user/:userId" element={<ProtectedRoutes><User /></ProtectedRoutes>} />
        <Route path="user/c/:channelName" element={<Channel />} />
        <Route path="user/update-account" element={<ProtectedRoutes><UpdateUserInfo /></ProtectedRoutes>} />
        <Route path="upload/" element={<ProtectedRoutes><UploadVideo /></ProtectedRoutes>} />
        <Route path="history/" element={<ProtectedRoutes><History /></ProtectedRoutes>} />
        <Route path="my-videos/" element={<ProtectedRoutes><MyVideos /></ProtectedRoutes>} />
        <Route path="liked-videos/" element={<ProtectedRoutes><LikedVideos /></ProtectedRoutes>} />
        <Route path="/watch/:videoId" element={<Watch />} />
        <Route path="/loading" element={<Loading />} />
        <Route path='*' element={
          <div className='flex flex-col justify-center items-center h-full text-white font-bold text-3xl p-4'>
            <Lottie
              animationData={animationData}
              loop={true}
              className="w-auto h-50 sm:h-100"
            />
            <h1 className='m-2 text-3xl text-center font-bold text-black/80 dark:text-white/80 sm:text-2xl w-[250px] sm:w-fit'>
              NOT FOUND
            </h1>
          </div>
        } />
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
