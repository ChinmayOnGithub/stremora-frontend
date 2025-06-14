import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import axios from 'axios';
import { Button } from '../../components';
import { useAuth } from '../../contexts';
import FormField from './FormField';
import PasswordField from './PasswordField';

const RegisterForm = ({ formData, setFormData, avatar, coverImage }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { fullname, username, email, password } = formData;

    if (!fullname || !username || !email || !password) {
      toast.error("Please fill all required fields.", {
        className: "text-sm sm:text-base bg-gray-800 text-white",
      });
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullname", fullname);
    formDataToSend.append("username", username);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);

    if (avatar) {
      formDataToSend.append("avatar", avatar);
    } else {
      toast.error("Profile picture is compulsory.", {
        className: "text-sm sm:text-base bg-gray-800 text-white",
      });
      setLoading(false);
      return;
    }

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
        const { accessToken, refreshToken } = res.data.data;
        await login(accessToken, refreshToken);

        toast.success("Welcome to Stremora!", {
          description: "Account created & logged in successfully 🎉",
          duration: 3000,
        });

        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Server error occurred.";
        setError(errorMessage);
        toast.error("Registration Failed", {
          description: errorMessage,
          className: "text-sm sm:text-base bg-red-800 text-white",
        });
      } else if (error.request) {
        setError("No response from server. Possible network issue.");
        toast.error("Network Error", {
          description: "Please check your internet connection",
          className: "text-sm sm:text-base bg-red-800 text-white",
        });
      } else {
        setError("Something went wrong. Please try again.");
        toast.error("Error", {
          description: "Something went wrong. Please try again.",
          className: "text-sm sm:text-base bg-red-800 text-white",
        });
      }
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <FormField
          label="Full Name"
          required
          tooltip="Your display name on the platform"
          icon={userIcon}
          placeholder="Chinmay Patil"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
        />

        <FormField
          label="Username"
          required
          tooltip="Your unique @handle (no spaces)"
          icon={usernameIcon}
          placeholder="chinmaypatil"
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
          placeholder="chinmay@example.com"
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

      <Button
        type="submit"
        className="relative h-11 w-full overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:from-amber-600 hover:to-amber-700 hover:shadow-xl hover:shadow-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-70 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800 dark:focus:ring-amber-400/20"
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
            <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 group-hover:translate-y-0"></span>
          </>
        )}
      </Button>
    </form>
  );
};

export default RegisterForm; 