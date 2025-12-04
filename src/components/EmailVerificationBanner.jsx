import { useAuth } from '../contexts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmailVerificationBanner() {
  const { user, isVerified } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  // Don't show if user is not logged in, is verified, or banner is dismissed
  if (!user || isVerified || dismissed) {
    return null;
  }

  return (
    <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20 mb-4 relative">
      <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <span className="font-semibold text-amber-900 dark:text-amber-100">
            Email Verification Required
          </span>
          <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
            Please verify your email to like videos, comment, and access all features. Check your inbox for the verification code.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/verify-email')}
            className="border-amber-600 text-amber-900 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-900/30"
          >
            Verify Now
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDismissed(true)}
            className="h-8 w-8 text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
