import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { useAuth } from '../contexts';
import { Button, Container } from '../components';
import { FaUserEdit, FaCamera, FaImage } from 'react-icons/fa';

const UpdateProfilePage = () => {
  const { user, token } = useAuth();

  const [fullname, setFullname] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [accountLoading, setAccountLoading] = useState(false);

  // Avatar states
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const fileInputAvatar = useRef(null);

  // Cover states
  const [coverFile, setCoverFile] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [coverLoading, setCoverLoading] = useState(false);
  const [showCoverDropdown, setShowCoverDropdown] = useState(false);
  const fileInputCover = useRef(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS (unchanged)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setAccountLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/users/update-account`,
        { fullname, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || 'Account details updated successfully!');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Error updating account details';
      toast.error(errorMsg);
    } finally {
      setAccountLoading(false);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error('Please select an avatar file');
      return;
    }
    setAvatarLoading(true);
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/users/update-avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || 'Avatar updated successfully!');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Error updating avatar';
      toast.error(errorMsg);
    } finally {
      setAvatarLoading(false);
      setAvatarFile(null);
      setPreviewAvatar(null);
    }
  };

  const handleCoverUpload = async () => {
    if (!coverFile) {
      toast.error('Please select a cover image file');
      return;
    }
    setCoverLoading(true);
    const formData = new FormData();
    formData.append('cover-image', coverFile);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URI}/users/update-cover-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || 'Cover image updated successfully!');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Error updating cover image';
      toast.error(errorMsg);
    } finally {
      setCoverLoading(false);
      setCoverFile(null);
      setPreviewCover(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // UI RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-gradient-to-br 
                 from-amber-100 via-pink-50 to-pink-100 
                 dark:from-gray-900 dark:to-gray-800 
                 transition-colors duration-500"
    >
      <Toaster position="top-center" />
      <Container className="py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-gray-50 drop-shadow-sm">
          Account Settings
        </h1>

        {/* Account Details Card */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 
                        rounded-2xl shadow-xl p-6 mb-10 transition-colors duration-500">
          <div className="flex items-center gap-3 mb-5 border-b pb-4 border-gray-200 dark:border-gray-700">
            <FaUserEdit className="text-amber-500 dark:text-amber-400 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Personal Information
            </h2>
          </div>
          <form onSubmit={handleUpdateDetails} className="space-y-5">
            <div>
              <label
                htmlFor="fullname"
                className="block text-gray-600 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 
                           px-3 py-2 bg-gray-50 dark:bg-gray-700 
                           text-gray-800 dark:text-gray-100 
                           focus:outline-none focus:ring-2 focus:ring-amber-400 
                           transition-colors duration-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-600 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 
                           px-3 py-2 bg-gray-50 dark:bg-gray-700 
                           text-gray-800 dark:text-gray-100 
                           focus:outline-none focus:ring-2 focus:ring-amber-400 
                           transition-colors duration-500"
              />
            </div>
            <Button
              type="submit"
              disabled={accountLoading}
              variant="amber"
              className="w-full font-semibold py-2 transition-colors duration-500"
            >
              {accountLoading ? 'Updating...' : 'Save Changes'}
            </Button>
          </form>
        </div>

        {/* Two-column layout for Avatar & Cover */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Avatar Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors duration-500">
            <div className="flex items-center gap-3 mb-5 border-b pb-4 border-gray-200 dark:border-gray-700">
              <FaCamera className="text-amber-500 dark:text-amber-400 w-6 h-6" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Profile Photo
              </h2>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative inline-block mb-3">
                <img
                  src={previewAvatar || user.avatar || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover cursor-pointer 
                             shadow hover:shadow-lg transition-shadow duration-300"
                  onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
                />
                {/* Avatar Dropdown */}
                {showAvatarDropdown && (
                  <div
                    className="absolute top-full left-0 mt-2 w-44 bg-white dark:bg-gray-700 
                               shadow-lg rounded-lg z-10 transition-all duration-300 
                               ring-1 ring-gray-200 dark:ring-gray-600"
                  >
                    <button
                      onClick={() => {
                        fileInputAvatar.current.click();
                        setShowAvatarDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 
                                 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 
                                 rounded-t-lg"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={() => setShowAvatarDropdown(false)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 
                                 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 
                                 rounded-b-lg"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputAvatar}
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>
              {previewAvatar && (
                <div className="flex space-x-3">
                  <Button
                    onClick={handleAvatarUpload}
                    disabled={avatarLoading}
                    variant="amber"
                    className="transition-colors duration-500"
                  >
                    {avatarLoading ? 'Uploading...' : 'Update Avatar'}
                  </Button>
                  <Button
                    onClick={() => {
                      setPreviewAvatar(null);
                      setAvatarFile(null);
                    }}
                    variant="secondary"
                    className="transition-colors duration-500"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Cover Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors duration-500">
            <div className="flex items-center gap-3 mb-5 border-b pb-4 border-gray-200 dark:border-gray-700">
              <FaImage className="text-amber-500 dark:text-amber-400 w-6 h-6" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Cover Image
              </h2>
            </div>
            <div className="relative">
              <img
                src={previewCover || user.coverImage || '/default-cover.jpg'}
                alt="Cover"
                className="w-full h-44 object-cover rounded-lg cursor-pointer shadow 
                           hover:shadow-lg transition-shadow duration-300"
                onClick={() => setShowCoverDropdown(!showCoverDropdown)}
              />
              {/* Cover Dropdown */}
              {showCoverDropdown && (
                <div
                  className="absolute top-2 right-2 w-44 bg-white dark:bg-gray-700 
                             shadow-lg rounded-lg z-10 transition-all duration-300
                             ring-1 ring-gray-200 dark:ring-gray-600"
                >
                  <button
                    onClick={() => {
                      fileInputCover.current.click();
                      setShowCoverDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 
                               dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 
                               rounded-t-lg"
                  >
                    Change Cover
                  </button>
                  <button
                    onClick={() => setShowCoverDropdown(false)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 
                               dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 
                               rounded-b-lg"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputCover}
                onChange={handleCoverFileChange}
                className="hidden"
              />
            </div>
            {previewCover && (
              <div className="mt-4 flex space-x-3">
                <Button
                  onClick={handleCoverUpload}
                  disabled={coverLoading}
                  variant="amber"
                  className="transition-colors duration-500"
                >
                  {coverLoading ? 'Uploading...' : 'Update Cover'}
                </Button>
                <Button
                  onClick={() => {
                    setPreviewCover(null);
                    setCoverFile(null);
                  }}
                  variant="secondary"
                  className="transition-colors duration-500"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UpdateProfilePage;
