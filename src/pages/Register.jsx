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

  const coverIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8 text-muted-foreground/40">
      <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="min-h-full flex-1 flex items-center justify-center bg-background px-4 py-2">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl dark:shadow-gray-800/20 dark:hover:shadow-gray-800/30 sm:grid md:grid-cols-[0.6fr_1.4fr]">
        {/* Left Section - Profile Setup */}
        <div className="relative bg-amber-700 dark:bg-amber-800 flex flex-col">
          {/* Cover Image Section */}
          <div className="relative h-40 w-full overflow-hidden group">
            {coverPreview ? (
              <img 
                src={coverPreview} 
                alt="Cover Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-600 flex items-center justify-center">
                <span className="text-white/80 text-sm font-medium">Add Cover Image</span>
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              <span className="text-white text-sm font-medium">Click to upload cover</span>
            </label>
          </div>

          {/* Profile Photo Section */}
          <div className="relative -mt-16 mx-auto mb-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-700 dark:border-amber-800 bg-amber-600 group">
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
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <span className="text-white text-sm font-medium">Upload photo</span>
              </label>
            </div>
          </div>

          {/* Profile Setup Title */}
          <div className="px-6 pb-6">
            <h2 className="text-lg font-bold leading-tight text-white text-center">
              Profile Setup<span className="text-red-400">*</span>
            </h2>
            <p className="text-sm text-white/80 text-center mt-2">
              Add your profile picture and cover image
            </p>
          </div>
        </div>

        {/* Right Section - Register Form */}
        <div className="relative bg-background p-8 dark:bg-gray-900">
          <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground dark:text-white text-center">
            Create Your Account
          </h1>

          <RegisterForm formData={formData} setFormData={setFormData} avatar={avatar} coverImage={coverImage} />

          <div className="mt-6 text-center">
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