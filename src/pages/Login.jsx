import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import axios from '@/lib/axios.js'; // Using your pre-configured axios instance
import { useAuth } from '../contexts'; // Assuming this is the correct path
import Lottie from "lottie-react"; // 1. Import the Lottie player
import totoroAnimation from '../assets/Totoro_Walk.json'; // 2. Import your animation file

// Shadcn UI & Lucide Icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { DarkModeToggle } from '../components'; // Assuming you have this component

// Main Login Page Component
function Login() {
  // --- STATE AND HOOKS ---
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const identifierRef = useRef(null);

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = formData;

    if (!identifier || !password) {
      toast.error("Please enter both your email/username and password.");
      return;
    }
    setLoading(true);

    const loginPromise = axios.post('/users/login', { identifier, password });

    toast.promise(loginPromise, {
      loading: 'Signing you in...',
      success: (response) => {
        const loginData = response.data.data;
        login(loginData); // Pass the entire data object to the context

        setTimeout(() => navigate(from, { replace: true }), 500);

        return "Welcome back! You've been logged in successfully.";
      },
      error: (error) => error.response?.data?.message || "Login failed. Please check your credentials.",
      finally: () => setLoading(false)
    });
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Section - Visuals with Lottie Animation */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-gray-100 p-8 dark:bg-gray-800 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent"></div>

        <div className="w-full max-w-md text-center z-10">
          <Lottie animationData={totoroAnimation} loop={true} style={{ height: 300, marginBottom: '2rem' }} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back to Stremora
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Your content and community are waiting for you.
          </p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative bg-background">
        <div className="absolute top-6 left-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="Go back to previous page">
            {/* FIX: Added text color classes for light/dark modes */}
            <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-200" />
          </Button>
        </div>
        <div className="absolute top-6 right-6">
          <DarkModeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            {/* FIX: Added text-foreground for automatic light/dark mode color */}
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Login to Your Account</h1>
            <p className="mt-2 text-muted-foreground">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              {/* FIX: Added text-foreground to the label */}
              <Label htmlFor="identifier" className="text-foreground">Email or Username</Label>
              <Input type="text" id="identifier" name="identifier" placeholder="name@example.com or your_username" value={formData.identifier} onChange={handleChange} ref={identifierRef} disabled={loading} required />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <div className="flex items-center justify-between">
                {/* FIX: Added text-foreground to the label */}
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
