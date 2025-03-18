import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { useAuth } from '../contexts';
import { Button, Container } from '../components';
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
    if (!file) {
      toast.error('No file selected');
      return;
    }
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
      toast.success(res.data.message || 'Image updated successfully');
      setFile(null);
      // After a successful upload, we want to reset the preview.
      // The following reset will clear the temporary preview.
      setPreview(initialPreview);
      await fetchCurrentUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(initialPreview);
  };

  // Clean up any object URLs when the component unmounts
  useEffect(() => {
    return () => {
      if (preview && preview !== initialPreview) URL.revokeObjectURL(preview);
    };
  }, [preview, initialPreview]);

  // Update preview if initialPreview changes (e.g. after fetching current user)
  useEffect(() => {
    setPreview(initialPreview);
  }, [initialPreview]);

  return { file, preview, loading, fileInputRef, handleFileChange, handleUpload, reset };
};

const UpdateProfilePage = () => {
  const { user, token, fetchCurrentUser, updateUser } = useAuth();
  const [fullname, setFullname] = useState(user?.fullname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [accountLoading, setAccountLoading] = useState(false);

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
      updateUser(res.data.data.user);
      await fetchCurrentUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating account details');
    } finally {
      setAccountLoading(false);
    }
  };

  return (
    <Container className="h-full">
      <div className="relative min-h-full max-w-full sm:max-w-[70%] mx-auto my-auto m-10px rounded-4xl border-8 p-0 border-white/10 overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-500">

        {/* Profile Header: Cover & Avatar */}
        <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-t-2xl overflow-visible">
          <img
            src={coverUploader.preview || user?.coverImage || '/default-cover.jpg'}
            alt="Cover Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => coverUploader.fileInputRef.current.click()}
            className="absolute top-4 right-4 p-4 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:ring-2 hover:ring-amber-500 transition-all"
            aria-label="Change cover image"
          >
            <FaImage className="text-gray-600 dark:text-gray-300 text-sm sm:text-md" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={coverUploader.fileInputRef}
            onChange={coverUploader.handleFileChange}
            className="hidden"
          />
          {/* Avatar image */}
          <div className="absolute bottom-[-4rem] left-8">
            <img
              src={avatarUploader.preview || user?.avatar || '/default-avatar.png'}
              alt="Avatar Preview"
              className="w-32 h-32 rounded-full border-4 border-gray-100 dark:border-gray-900 object-cover"
            />
            <button
              onClick={() => avatarUploader.fileInputRef.current.click()}
              className="absolute bottom-2 right-2 p-4 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:ring-2 hover:ring-amber-500 transition-all"
              aria-label="Change profile photo"
            >
              <FaCamera className="text-gray-600 dark:text-gray-300 text-sm sm:text-md" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={avatarUploader.fileInputRef}
              onChange={avatarUploader.handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Image Upload Confirmation Controls */}
        <div className="absolute top-80 left-20 z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 w-fit">
          {avatarUploader.preview && avatarUploader.preview !== user?.avatar && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Profile Photo Preview
              </h2>
              <div className="flex space-x-3">
                <Button
                  onClick={avatarUploader.handleUpload}
                  disabled={avatarUploader.loading}
                  variant="amber"
                >
                  {avatarUploader.loading ? 'Uploading...' : 'Update Avatar'}
                </Button>
                <Button onClick={avatarUploader.reset} variant="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {coverUploader.preview && coverUploader.preview !== user?.coverImage && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Cover Image Preview
              </h2>
              <div className="flex space-x-3">
                <Button
                  onClick={coverUploader.handleUpload}
                  disabled={coverUploader.loading}
                  variant="amber"
                >
                  {coverUploader.loading ? 'Uploading...' : 'Update Cover'}
                </Button>
                <Button onClick={coverUploader.reset} variant="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modernized Account Details */}
        <div className="mt-10 max-w-3xl mx-auto bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl p-6 border-2 border-gray-200 dark:border-gray-700 w-[95%] sm:w-[80%]">
          <div className="flex items-center gap-3 mb-5 border-b pb-4 border-gray-200 dark:border-gray-600">
            <FaUserEdit className="text-amber-500 dark:text-amber-400 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Personal Information
            </h2>
          </div>
          <form onSubmit={handleUpdateDetails} className="space-y-5">
            <div>
              <label htmlFor="fullname" className="block text-gray-600 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-600 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
              />
            </div>
            <Button
              type="submit"
              disabled={accountLoading}
              variant="amber"
              className="w-full font-semibold py-2 transition-all"
            >
              {accountLoading ? 'Updating...' : 'Save Changes'}
            </Button>
          </form>
        </div>

      </div>
    </Container>
    // </div>
  );
};

export default UpdateProfilePage;
