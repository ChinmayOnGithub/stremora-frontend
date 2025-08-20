import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from '../lib/axios';
// import Lottie from "lottie-react";
// TODO: Add your animation file here and uncomment the Lottie component below
// import emailAnimation from '../assets/Email_Sent.json'; 

// Shadcn UI & Lucide Icons
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'; // Import MailCheck
import { DarkModeToggle } from '../components';

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailToVerify = location.state?.email;

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Verification page loaded for email:", emailToVerify);
  }, [emailToVerify]);

  if (!emailToVerify) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>No email address found. Your session may have expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild><Link to="/register">Return to Registration</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleVerify = async () => {
    if (code.length < 6) return;
    setIsLoading(true);

    const verifyPromise = axios.post('/email/verify', {
      email: emailToVerify,
      verificationCode: code,
    });

    toast.promise(verifyPromise, {
      loading: 'Verifying your code...',
      success: () => {
        navigate('/login');
        return 'Email verified successfully! You can now log in.';
      },
      error: (error) => error.response?.data?.message || 'Verification failed.',
      finally: () => setIsLoading(false)
    });
  };

  const handleResendCode = async () => {
    const resendPromise = axios.post('/email/resend', { email: emailToVerify });
    toast.promise(resendPromise, {
      loading: 'Sending a new code...',
      success: 'A new verification code has been sent.',
      error: (error) => error.response?.data?.message || 'Failed to resend code.'
    });
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Section - Visuals with Lottie Animation */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-gray-100 p-8 dark:bg-gray-800 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent"></div>
        <div className="w-full max-w-md text-center z-10">
          {/* --- LOTTIE ANIMATION COMMENTED OUT --- */}
          {/* <Lottie animationData={emailAnimation} loop={true} style={{ height: 300, marginBottom: '2rem' }} /> */}

          {/* --- NEW PLACEHOLDER ICON --- */}
          <div className="flex justify-center mb-8">
            <div className="h-24 w-24 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <MailCheck className="h-12 w-12 text-amber-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Just One More Step
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Enter the code we sent to your email to complete your registration.
          </p>
        </div>
      </div>

      {/* Right Section - Verification Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative bg-background">
        <div className="absolute top-6 left-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/register')} aria-label="Go back to registration">
            <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-200" />
          </Button>
        </div>
        <div className="absolute top-6 right-6">
          <DarkModeToggle />
        </div>

        <div className="w-full max-w-sm space-y-8 text-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Check Your Email</h1>
            <p className="mt-2 text-muted-foreground">
              We&apos;ve sent a 6-digit code to <br />
              <span className="font-semibold text-foreground">{emailToVerify}</span>.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button onClick={handleVerify} disabled={isLoading || code.length < 6} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the email?{' '}
            <Button variant="link" onClick={handleResendCode} className="p-0 h-auto font-semibold text-primary underline-offset-4 hover:underline">
              Resend Code
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
