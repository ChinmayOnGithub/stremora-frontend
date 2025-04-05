import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '../../components';
import { useAuth } from '../../contexts';
import FormField from './FormField';
import PasswordField from './PasswordField';
import axios from 'axios';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
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

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please enter both email and password", {
        className: "text-sm sm:text-base bg-gray-800 text-white",
      });
      setLoading(false);
      return;
    }

    try {
      // Use axios and the same API structure as the original Login component
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/users/login`,
        { identifier: email, password }, // Use identifier instead of email to match the API
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      const { accessToken, refreshToken } = res.data.data;
      await login(accessToken, refreshToken);

      toast.success("User logged in successfully!", {
        description: "Welcome back!",
        duration: 3000,
      });

      setTimeout(() => navigate("/"), 0);
    } catch (error) {
      if (error.response) {
        // Axios error for status 400, 401, 404, etc.
        setError(error.response?.data?.message || "Something went wrong.");
        toast.error("Login Failed ❌", {
          description: error.response?.data?.message || "Something went wrong.",
        });
      } else if (error.request) {
        // Request sent but no response received (server down, network issue)
        setError("No response from server. Check your network.");
        toast.error("No response from server. Check your network.");
      } else {
        // Axios internal error
        setError("Something went wrong. Try again.");
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Icons for form fields
  const emailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
      <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
      <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Email"
        required
        tooltip="Email address used during registration"
        icon={emailIcon}
        type="email"
        placeholder="you@example.com"
        name="email"
        value={formData.email}
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

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-amber-400/20"
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
            <span>Signing in...</span>
          </div>
        ) : (
          <>
            <span className="relative z-10">Sign in</span>
            <span className="absolute bottom-0 left-0 h-1 w-full bg-white/20"></span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-t from-black/20 to-transparent transition-transform duration-300 hover:translate-y-0"></span>
          </>
        )}
      </Button>
    </form>
  );
};

export default LoginForm; 