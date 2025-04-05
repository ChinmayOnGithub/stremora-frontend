import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import axios from 'axios';
import { Button } from '../../components';
import { useAuth } from '../../contexts';
import FormField from './FormField';
import FileUploadField from './FileUploadField';
import PasswordField from './PasswordField';

const RegisterForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for username to prevent spaces
    if (name === 'username') {
      setFormData({
        ...formData,
        [name]: value.replace(/\s/g, '')
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setCoverImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { fullname, username, email, password } = formData;

    if (!fullname || !username || !email || !password || !avatar) {
      toast.error("Please fill all required fields and select a profile picture.", {
        className: "text-sm sm:text-base bg-gray-800 text-white",
      });
      setLoading(false);
      return;
    }

    if (avatar.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Avatar file is too large! Please upload a smaller file.", {
        className: "text-sm sm:text-base bg-gray-800 text-white",
      });
      setLoading(false);
      return;
    }

    // Create FormData for file uploads
    const formDataToSend = new FormData();
    formDataToSend.append("fullname", fullname);
    formDataToSend.append("username", username);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    formDataToSend.append("avatar", avatar);

    if (coverImage) {
      formDataToSend.append("coverImage", coverImage);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/users/register`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (res.data.success) {
        // Immediately log in with received tokens
        const { accessToken, refreshToken } = res.data.data;
        await login(accessToken, refreshToken);

        setTimeout(() => navigate("/"), 0);

        // Show success message
        toast.success("Welcome to Streamora!", {
          description: "Account created & logged in successfully 🎉",
          duration: 3000,
          className: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
        });
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Server error occurred.";
        setError(errorMessage);
      } else if (error.request) {
        setError("No response from server. Possible network issue.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Icons for form fields
  const userIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
    </svg>
  );

  const usernameIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
      <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
    </svg>
  );

  const emailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
      <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
      <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
    </svg>
  );

  const avatarIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8 text-muted-foreground/40">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
    </svg>
  );

  const coverIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-8 w-8 text-muted-foreground/40">
      <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Form fields section */}
      <div className="space-y-3">
        <FormField
          label="Full Name"
          required
          tooltip="Your display name on the platform"
          icon={userIcon}
          placeholder="John Doe"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
        />

        <FormField
          label="Username"
          required
          tooltip="Your unique @handle (no spaces)"
          icon={usernameIcon}
          placeholder="johndoe"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <FormField
          label="Email"
          required
          tooltip="Used for verification and notifications"
          icon={emailIcon}
          type="email"
          placeholder="john@example.com"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <PasswordField
          label="Password"
          required
          tooltip="Min 8 characters recommended"
          name="password"
          value={formData.password}
          onChange={handleChange}
          showStrengthIndicator={true}
        />
      </div>

      {/* File uploads section */}
      <div className="space-y-3">
        <FileUploadField
          label="Profile Picture"
          required
          tooltip="Square image for your profile (max 5MB)"
          preview={avatarPreview}
          onFileChange={handleAvatarChange}
          onRemove={() => {
            setAvatar(null);
            setAvatarPreview(null);
          }}
          isCircular={true}
          icon={avatarIcon}
          helpText="Max 5MB. JPG, PNG or GIF."
        />

        <FileUploadField
          label="Cover Image"
          required={false}
          tooltip="Banner image for your profile (16:9 ratio ideal)"
          preview={coverPreview}
          onFileChange={handleCoverChange}
          onRemove={() => {
            setCoverImage(null);
            setCoverPreview(null);
          }}
          icon={coverIcon}
          helpText="Banner image for your profile."
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
          <p className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        className="relative h-9 w-full overflow-hidden bg-primary text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg focus:ring-2 focus:ring-primary/20 disabled:opacity-70 dark:bg-amber-600 dark:hover:bg-amber-600/90 dark:focus:ring-amber-400/20"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Creating Account...</span>
          </div>
        ) : (
          <>
            <span className="relative z-10">Create Account</span>
            <span className="absolute bottom-0 left-0 h-1 w-full bg-white/20"></span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 hover:translate-y-0"></span>
          </>
        )}
      </Button>

      {/* Already have an account link */}
      <div className="pt-2 text-center relative z-10">
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="font-medium text-primary underline-offset-4 hover:underline dark:text-amber-400 cursor-pointer relative z-20"
          >
            Sign in
          </span>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm; 