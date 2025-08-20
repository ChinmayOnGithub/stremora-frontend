import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import axios from '@/lib/axios.js';
import Lottie from "lottie-react"; // 1. Import the Lottie player
import giraffeAnimation from '../assets/Meditating_Giraffe.json'; // 2. Import your new animation

// Shadcn UI & Lucide Icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Camera, MailCheck, Loader2, Eye, EyeOff } from 'lucide-react';
import { DarkModeToggle } from '../components'; // Assuming you have this component

// Main Registration Page Component
function Register() {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "" // Added for confirmation
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const navigate = useNavigate();
  const fullnameRef = useRef(null);

  useEffect(() => {
    fullnameRef.current?.focus();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'username' ? value.replace(/\s/g, '').toLowerCase() : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
        toast.error("Please select an image file smaller than 5MB.");
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, username, email, password, confirmPassword } = formData;

    if (!fullname || !username || !email || !password || !confirmPassword) {
      toast.error("Please fill all required fields.");
      return;
    }

    // --- NEW: Password matching validation ---
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("fullname", fullname);
    formDataToSend.append("username", username);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    if (avatar) formDataToSend.append("avatar", avatar);

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

  // --- RENDER ---
  return (
    <>
      <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
        {/* Left Section - Visuals with Lottie Animation */}
        <div className="relative hidden items-center justify-center overflow-hidden bg-gray-100 p-8 dark:bg-gray-800 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent"></div>
          <div className="w-full max-w-md text-center z-10">
            <Lottie animationData={giraffeAnimation} loop={true} style={{ height: 350, marginBottom: '1rem' }} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Start Your Creative Journey
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Join a community where your content finds its home.
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex items-center justify-center p-6 sm:p-12 relative bg-background">
          <div className="absolute top-6 left-6 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} aria-label="Go back to previous page">
              <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-200" />
            </Button>
          </div>
          <div className="absolute top-6 right-6">
            <DarkModeToggle />
          </div>

          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an Account</h1>
              <p className="mt-2 text-muted-foreground">Enter your details to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center">
                <Label htmlFor="avatar-upload" className="relative cursor-pointer group" aria-label="Upload profile picture">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed group-hover:border-primary transition-colors">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </Label>
                <Input id="avatar-upload" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} disabled={loading} />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="fullname" className="text-foreground">Full Name</Label>
                <Input type="text" id="fullname" name="fullname" placeholder="Chinmay Patil" value={formData.fullname} onChange={handleChange} ref={fullnameRef} disabled={loading} required />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <Input type="text" id="username" name="username" placeholder="chinmaypatil" value={formData.username} onChange={handleChange} disabled={loading} required />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input type="email" id="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} disabled={loading} required />
              </div>
              <div className="grid w-full items-center gap-1.5">
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
                <p className="text-xs text-muted-foreground">Use 8 or more characters with a mix of letters, numbers & symbols.</p>
              </div>

              {/* --- NEW: Confirm Password Field --- */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <MailCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl pt-4">Confirm Your Email</DialogTitle>
            <DialogDescription className="text-center pt-2">
              We sent a verification code to <span className="font-semibold text-foreground">{formData.email}</span>. Please check your inbox to complete your registration.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              className="w-full"
              onClick={() => navigate('/verify-email', { state: { email: formData.email } })}
            >
              Proceed to Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Register;
