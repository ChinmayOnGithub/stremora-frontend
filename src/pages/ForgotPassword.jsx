import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../lib/axios';

// Shadcn UI & Lucide Icons
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Loader2, MailQuestion } from 'lucide-react';
import { DarkModeToggle } from '../components';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsLoading(true);

    const forgotPasswordPromise = axios.post('/users/forgot-password', { email });

    toast.promise(forgotPasswordPromise, {
      loading: 'Sending reset link...',
      success: () => {
        setEmail(''); // Clear the input on success
        return "If an account with that email exists, a reset link has been sent.";
      },
      error: (error) => error.response?.data?.message || 'Failed to send reset link.',
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
                <MailQuestion className="h-12 w-12 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              Forgot Your Password?
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
              No problem. We all forget things sometimes.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-gray-700 dark:text-gray-400">
            <p>Enter your email address and we&apos;ll send you a link to get back into your account.</p>
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Password Reset</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your email to receive a reset link.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
