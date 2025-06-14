import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import FileUploadField from '../components/auth/FileUploadField';
import { CheckIcon } from '../components/icons.jsx';
import { toast } from 'sonner';

function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: ""
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type! Please upload an image.", {
          className: "text-sm sm:text-base bg-red-800 text-white",
        });
        e.target.value = null; // Clear the input
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Avatar file is too large! Max 5MB.", {
          className: "text-sm sm:text-base bg-red-800 text-white",
        });
        e.target.value = null; // Clear the input
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatar(null);
      setAvatarPreview(null);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type! Please upload an image.", {
          className: "text-sm sm:text-base bg-red-800 text-white",
        });
        e.target.value = null; // Clear the input
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Cover image file is too large! Max 10MB.", {
          className: "text-sm sm:text-base bg-red-800 text-white",
        });
        e.target.value = null; // Clear the input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setCoverImage(file);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImage(null);
      setCoverPreview(null);
    }
  };

  const avatarIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-12 w-12 text-white/80">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
    </svg>
  );

  return (
    <div className="min-h-full flex-1 flex items-center justify-center bg-gray-100 dark:bg-black transition-all px-4 py-2 relative overflow-hidden">
      {/* Background Elements - Only visible on mobile */}
      <div className="absolute inset-0 md:hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-amber-500/20 to-amber-400/20"
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradientMove 15s ease infinite'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.1),rgba(251,191,36,0))]"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl"></div>
      </div>

      <style>
        {`
          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>

      <div className="w-full max-w-2xl overflow-hidden rounded-lg shadow-lg transition-all duration-300 dark:shadow-gray-800/20 sm:grid md:grid-cols-[0.8fr_1.4fr] relative z-10">
        {/* Left Section - Profile Setup */}
        <div className="relative bg-amber-700 dark:bg-amber-800 flex flex-col">
          {/* Cover Image Section - Hidden on mobile */}
          <div className="relative h-40 w-full overflow-hidden group hidden md:block">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-600 flex items-center justify-center">
                <h2 className="text-base sm:text-lg md:text-xl text-white/80 font-medium">Upload Cover Image</h2>
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              <h3 className="text-sm sm:text-base md:text-lg text-white font-medium">Click to upload</h3>
            </label>
          </div>

          {/* Profile Photo Section - Optimized for mobile */}
          <div className="relative mt-6 md:-mt-16 mx-auto mb-4 md:mb-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-amber-700 dark:border-amber-800 bg-amber-600 group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {avatarIcon}
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <h3 className="text-sm text-white font-medium">Click to upload</h3>
              </label>
            </div>
          </div>

          {/* Profile Setup Title - Optimized for mobile */}
          <div className="px-4 md:px-6 pb-4 md:pb-8 text-center">
            <h1 className="text-lg md:text-2xl font-bold leading-tight text-white">
              Profile Setup<span className="text-red-300">*</span>
            </h1>
            <p className="text-sm md:text-base text-white/80 mt-2 md:mt-3">
              Add your profile picture
              <span className="hidden md:inline"> and cover image</span>
            </p>
          </div>
        </div>

        {/* Right Section - Register Form */}
        <div className="relative bg-background/80 backdrop-blur-sm md:bg-background md:backdrop-blur-none p-4 md:p-8 dark:bg-gray-900/80 md:dark:bg-gray-900">
          <h1 className="mb-4 md:mb-8 text-xl md:text-3xl font-bold tracking-tight text-foreground dark:text-white text-center">
            Create Account
          </h1>

          <RegisterForm formData={formData} setFormData={setFormData} avatar={avatar} coverImage={coverImage} />

          <div className="mt-4 md:mt-8 text-center">
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-amber-500 underline-offset-4 hover:underline dark:text-amber-400"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register; 