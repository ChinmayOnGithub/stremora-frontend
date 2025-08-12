// src/components/auth/LoginForm.jsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '../../components';
import { useAuth } from '../../contexts';
import FormField from './FormField';
import PasswordField from './PasswordField';
// 1. Correctly import the axios instance
import axiosInstance from '../../lib/axios.js';

const LoginForm = () => {
  const { login } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const identifierRef = useRef(null);

  useEffect(() => {
    if (identifierRef.current) {
      identifierRef.current.focus();
    }
  }, []);

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
      toast.error("Please enter both identifier and password");
      setLoading(false);
      return;
    }

    try {
      // 2. Use the correct axiosInstance for the API call
      const res = await axiosInstance.post(
        `/users/login`, // No need for the full URL, axiosInstance knows the base URL
        { identifier, password }
      );

      // 3. This is the critical fix. Pass the entire data object to the login function.
      const loginData = res.data.data; // This object contains user, accessToken, and refreshToken
      login(loginData);

      toast.success("Welcome back!", {
        description: "You've been successfully logged in",
        duration: 3000,
      });

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error("Login Failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // ... (the rest of your JSX remains the same)
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
        name="identifier"
        value={formData.identifier}
        onChange={handleChange}
        ref={identifierRef}
        autoFocus
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
            className="relative h-4 w-4 rounded-full border-gray-300 text-amber-500 focus:ring-amber-400/20 
            bg-gray-100 appearance-none checked:bg-amber-500 checked:border-amber-500
            dark:border-gray-600 dark:bg-gray-800/50 dark:text-amber-400 dark:focus:ring-amber-400/20
            dark:checked:bg-amber-500 dark:checked:border-amber-500
            before:content-[''] before:absolute before:inset-0 before:bg-amber-500 before:opacity-0 checked:before:opacity-100
            before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjIwIDYgOSAxNyA0IDEyIj48L3BvbHlsaW5lPjwvc3ZnPg==')]
            before:bg-no-repeat before:bg-center before:bg-[length:12px_12px] before:rounded-full"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground dark:text-gray-400">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/90 dark:text-amber-400 dark:hover:text-amber-300">
            Forgot password?
          </Link>
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
        isLoading={loading}
        loadingText="Signing in..."
        disabled={loading}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;