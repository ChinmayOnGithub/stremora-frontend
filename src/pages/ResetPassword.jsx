import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../lib/axios';

// Shadcn UI & Lucide Icons
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';
import { DarkModeToggle } from '../components';

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);

    const resetPromise = axios.post('/users/reset-password', {
      token,
      newPassword: password,
    });

    toast.promise(resetPromise, {
      loading: 'Resetting your password...',
      success: () => {
        setTimeout(() => navigate('/login'), 1500);
        return 'Password has been reset successfully! Redirecting to login...';
      },
      error: (error) => error.response?.data?.message || 'Failed to reset password.',
      finally: () => setIsLoading(false)
    });
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Section - Visuals */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-gray-100 p-8 dark:bg-gray-800 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent"></div>
        <Card className="w-full max-w-md bg-white/50 dark:bg-black/50 backdrop-blur-lg border-white/20 shadow-2xl z-10">
          <CardHeader className="items-center text-center">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                <KeyRound className="h-12 w-12 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              Set a New Password
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
              A strong password helps keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-gray-700 dark:text-gray-400">
            <p>Once you reset it, you can log in with your new password immediately.</p>
          </CardContent>
        </Card>
      </div>

      {/* Right Section - Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative bg-background">
        <div className="absolute top-6 left-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/login')} aria-label="Go back to login">
            <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-200" />
          </Button>
        </div>
        <div className="absolute top-6 right-6">
          <DarkModeToggle />
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Reset Your Password</h1>
            <p className="mt-2 text-muted-foreground">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
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

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
