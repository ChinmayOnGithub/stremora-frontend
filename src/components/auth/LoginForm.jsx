// LoginForm.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '../../components';
import { useAuth } from '../../contexts';
import FormField from './FormField';
import PasswordField from './PasswordField';
import axios from 'axios';

const LoginForm = () => {
  const { login } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/'; // fallback to home

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { identifier, password } = formData;

    if (!identifier || !password) {
      toast.error("Please enter both identifier and password", {
        className: "text-sm sm:text-base bg-gray-800 text-white",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/users/login`,
        { identifier, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      const { accessToken, refreshToken } = res.data.data;
      await login(accessToken, refreshToken);
      
      toast.success("Welcome back!", {
        description: "You've been successfully logged in",
        duration: 3000,
      });

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (error) {
      if (error.response) {
        setError(error.response?.data?.message || "Something went wrong.");
        toast.error("Login Failed", {
          description: error.response?.data?.message || "Something went wrong.",
          className: "text-sm sm:text-base bg-red-800 text-white",
        });
      } else if (error.request) {
        setError("No response from server. Check your network.");
        toast.error("Network Error", {
          description: "Please check your internet connection",
          className: "text-sm sm:text-base bg-red-800 text-white",
        });
      } else {
        setError("Something went wrong. Try again.");
        toast.error("Error", {
          description: "Something went wrong. Please try again.",
          className: "text-sm sm:text-base bg-red-800 text-white",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Icons for form fields
  const identifierIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Email or Username"
        required
        tooltip="Enter your email address or username"
        icon={identifierIcon}
        placeholder="you@example.com or username"
        name="identifier"
        value={formData.identifier}
        onChange={handleChange}
      />

      <PasswordField
        label="Password"
        required
        tooltip="Your account password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800/50 dark:focus:ring-amber-400/20"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground dark:text-gray-400">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <a href="#" className="font-medium text-primary hover:text-primary/90 dark:text-amber-400 dark:hover:text-amber-300">
            Forgot password?
          </a>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50/50 backdrop-blur-sm p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400 mt-4">
          <p className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="relative h-9 w-full overflow-hidden bg-amber-500 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-amber-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-70 dark:bg-amber-600 dark:hover:bg-amber-600/90 dark:focus:ring-amber-400/20"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Signing in...</span>
          </div>
        ) : (
          <>
            <span className="relative z-10">Login</span>
            <span className="absolute bottom-0 left-0 h-1 w-full bg-white/20"></span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 hover:translate-y-0"></span>
          </>
        )}
      </Button>
    </form>
  );
};

export default LoginForm; 