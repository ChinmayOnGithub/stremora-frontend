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

      <div className="w-full max-w-2xl overflow-hidden rounded-lg shadow-xl transition-all duration-300 dark:shadow-gray-800/20 sm:grid md:grid-cols-[0.8fr_1.4fr] relative z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        {/* Left Section - Profile Setup */}
        <div className="relative bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-700 dark:to-amber-800 flex flex-col">
          {/* Cover Image Section - Hidden on mobile */}
          <div className="relative h-40 w-full overflow-hidden group hidden md:block">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-600/80 to-amber-500/80 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-white/80">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                </svg>
                <h3 className="text-sm sm:text-base md:text-lg text-white font-medium">Click to upload</h3>
              </div>
            </label>
          </div>

          {/* Profile Photo Section - Optimized for mobile */}
          <div className="relative mt-6 md:-mt-16 mx-auto mb-4 md:mb-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-amber-700 dark:border-amber-800 bg-amber-600 group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {avatarIcon}
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white">
                    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-sm sm:text-base md:text-lg text-white font-medium">Click to upload</h3>
                </div>
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
        <div className="relative bg-white/90 backdrop-blur-sm md:bg-white/95 md:backdrop-blur-none p-6 md:p-8 dark:bg-gray-900/90 md:dark:bg-gray-900">
          <h1 className="mb-6 md:mb-8 text-2xl md:text-3xl font-bold tracking-tight text-foreground dark:text-white text-center">
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