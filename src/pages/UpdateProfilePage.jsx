import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { useAuth } from '../contexts';
import { Button } from '../components';
import { FaUserEdit, FaCamera, FaImage } from 'react-icons/fa';

// Custom hook for handling image uploads
const useImageUploader = (initialPreview, uploadEndpoint, formFieldName) => {
  const { token, fetchCurrentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialPreview);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleUpload = async () => {
    if (!file) return null;
    setLoading(true);
    const formData = new FormData();
    formData.append(formFieldName, file);
    try {
      const res = await axios.put(uploadEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setFile(null);
      setPreview(initialPreview);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading image');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(initialPreview);
  };

  useEffect(() => {
    return () => {
      if (preview && preview !== initialPreview) URL.revokeObjectURL(preview);
    };
  }, [preview, initialPreview]);

  useEffect(() => {
    setPreview(initialPreview);
  }, [initialPreview]);

  return { file, preview, loading, fileInputRef, handleFileChange, handleUpload, reset };
};

const UpdateProfilePage = () => {
  const { user, token, fetchCurrentUser, updateUser } = useAuth();
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const avatarUploader = useImageUploader(
    user?.avatar,
    `${import.meta.env.VITE_BACKEND_URI}/users/update-avatar`,
    'avatar'
  );

  const coverUploader = useImageUploader(
    user?.coverImage,
    `${import.meta.env.VITE_BACKEND_URI}/users/update-cover-image`,
    'cover-image'
  );

  const hasChanges = () => {
    return (
      avatarUploader.file ||
      coverUploader.file ||
      fullname !== user?.fullname ||
      email !== user?.email
    );
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!hasChanges()) {
      toast.info('No changes to save');
      return;
    }

    setLoading(true);
    try {
      // Update account details if changed
      if (fullname !== user?.fullname || email !== user?.email) {
        const accountRes = await axios.put(
          `${import.meta.env.VITE_BACKEND_URI}/users/update-account`,
          { fullname, email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updateUser(accountRes.data.data.user);
      }

      // Update avatar if changed
      if (avatarUploader.file) {
        await avatarUploader.handleUpload();
      }

      // Update cover image if changed
      if (coverUploader.file) {
        await coverUploader.handleUpload();
      }

      // Refresh user data
      await fetchCurrentUser();
      toast.success('Profile updated successfully!');
      
      // Reset all uploaders
      avatarUploader.reset();
      coverUploader.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Cover Image Section */}
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-800">
        <img
          src={coverUploader.preview || user?.coverImage || '/default-cover.jpg'}
          alt="Cover Preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent dark:from-black/70"></div>
        <Button
          onClick={() => coverUploader.fileInputRef.current.click()}
          variant="secondary"
          className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-amber-100 dark:hover:bg-amber-900/30"
          aria-label="Change cover image"
        >
          <FaImage className="text-gray-700 dark:text-gray-300 text-base" />
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={coverUploader.fileInputRef}
          onChange={coverUploader.handleFileChange}
          className="hidden"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Photo Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={avatarUploader.preview || user?.avatar || '/default-avatar.png'}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-md object-cover"
              />
              <Button
                onClick={() => avatarUploader.fileInputRef.current.click()}
                variant="secondary"
                className="absolute bottom-0 right-0 p-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-amber-100 dark:hover:bg-amber-900/30"
                aria-label="Change profile photo"
              >
                <FaCamera className="text-gray-700 dark:text-gray-300 text-sm" />
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={avatarUploader.fileInputRef}
                onChange={avatarUploader.handleFileChange}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Photo</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This will be displayed on your profile
              </p>
            </div>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaUserEdit className="text-amber-500 w-4 h-4" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Account Details
            </h2>
          </div>
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-500/80 dark:text-gray-400/80 mb-2"
                >
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    id="fullname"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300/50 dark:border-gray-700/50 bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm px-4 py-3.5 text-gray-900 dark:text-gray-100 placeholder-gray-500/70 focus:border-white/30 focus:ring-2 focus:ring-white/10 focus:outline-none transition-all duration-300 text-base"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-500/80 dark:text-gray-400/80 mb-2"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300/50 dark:border-gray-700/50 bg-white/5 dark:bg-gray-800/5 backdrop-blur-sm px-4 py-3.5 text-gray-900 dark:text-gray-100 placeholder-gray-500/70 focus:border-white/30 focus:ring-2 focus:ring-white/10 focus:outline-none transition-all duration-300 text-base"
                  />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                disabled={loading || !hasChanges()}
                variant="amber"
                className="w-full font-medium py-2 transition-all text-base"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
