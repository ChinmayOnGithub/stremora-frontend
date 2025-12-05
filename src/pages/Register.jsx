import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import axios from '@/lib/axios.js';

// Shadcn UI & Lucide Icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, MailCheck, Loader2, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { DarkModeToggle } from '../components';

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Password Strength Indicator
const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: strength, text: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { level: strength, text: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { level: strength, text: 'Good', color: 'bg-blue-500' };
    return { level: strength, text: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrength();
  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength.level ? strength.color : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${
        strength.text === 'Weak' ? 'text-red-500' :
        strength.text === 'Fair' ? 'text-yellow-500' :
        strength.text === 'Good' ? 'text-blue-500' :
        'text-green-500'
      }`}>
        Password strength: {strength.text}
      </p>
    </div>
  );
};

function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });

  const navigate = useNavigate();
  const fullnameRef = useRef(null);
  const usernameCheckTimeout = useRef(null);

  useEffect(() => {
    fullnameRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'username' ? value.replace(/\s/g, '').toLowerCase() : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));

    // Check username availability
    if (name === 'username' && processedValue.length >= 3) {
      if (usernameCheckTimeout.current) {
        clearTimeout(usernameCheckTimeout.current);
      }
      
      setUsernameStatus({ checking: true, available: null, message: 'Checking...' });
      
      usernameCheckTimeout.current = setTimeout(async () => {
        try {
          const response = await axios.get(`/users/check-username/${processedValue}`);
          setUsernameStatus({
            checking: false,
            available: response.data.data.available,
            message: response.data.data.available ? 'Username available' : 'Username taken'
          });
        } catch (error) {
          setUsernameStatus({ checking: false, available: false, message: 'Error checking username' });
        }
      }, 500);
    } else if (name === 'username') {
      setUsernameStatus({ checking: false, available: null, message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, username, email, password, confirmPassword } = formData;

    if (!fullname || !username || !email || !password || !confirmPassword) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (usernameStatus.available === false) {
      toast.error("Please choose a different username.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("fullname", fullname);
    formDataToSend.append("username", username);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);

    const registrationPromise = axios.post('/users/register', formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    toast.promise(registrationPromise, {
      loading: 'Creating your account...',
      success: (response) => {
        if (response.status === 201 && response.data.data.requiresVerification) {
          setShowVerificationDialog(true);
          return "Account created successfully!";
        }
        throw new Error("Invalid server response.");
      },
      error: (error) => error.response?.data?.message || "Registration failed.",
      finally: () => setLoading(false)
    });
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/auth/google`;
  };

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
        {/* Back Button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <DarkModeToggle />
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md">
          <div className="bg-card border rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
              <p className="text-sm text-muted-foreground">Join Stremora today</p>
            </div>

            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-base font-medium hover:bg-accent"
              onClick={handleGoogleSignup}
            >
              <GoogleIcon />
              <span className="ml-3 text-foreground">Continue with Google</span>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-foreground">Full Name</Label>
                <Input
                  type="text"
                  id="fullname"
                  name="fullname"
                  placeholder="Chinmay Patil"
                  value={formData.fullname}
                  onChange={handleChange}
                  ref={fullnameRef}
                  disabled={loading}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <div className="relative">
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="chinmaypatil"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="h-11 pr-10"
                  />
                  {formData.username.length >= 3 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus.checking ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : usernameStatus.available === true ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : usernameStatus.available === false ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
                {usernameStatus.message && formData.username.length >= 3 && (
                  <p className={`text-xs flex items-center gap-1 ${
                    usernameStatus.available ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {usernameStatus.available ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {usernameStatus.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="chinmaypatil@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
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
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-foreground/60 hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <PasswordStrength password={formData.password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="h-11 pr-10"
                  />
                  {formData.confirmPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {formData.password === formData.confirmPassword ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Passwords do not match
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading || usernameStatus.available === false} className="w-full h-11 text-base font-medium">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Verification Dialog */}
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <MailCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl text-foreground">Verify Your Email</DialogTitle>
            <DialogDescription className="text-center pt-2">
              We sent a verification code to <span className="font-semibold text-foreground">{formData.email}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              className="w-full"
              onClick={() => navigate('/verify-email', { state: { email: formData.email } })}
            >
              Verify Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Register;
