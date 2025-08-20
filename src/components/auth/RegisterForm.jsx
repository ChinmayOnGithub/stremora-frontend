import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import axios from '@/lib/axios.js';
import { Button } from '../../components';
import FormField from './FormField';
import PasswordField from './PasswordField';

const RegisterForm = ({ formData, setFormData, avatar, coverImage }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fullnameRef = useRef(null);

  useEffect(() => {
    if (fullnameRef.current) {
      fullnameRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setFormData({ ...formData, [name]: value.replace(/\s/g, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, username, email, password } = formData;

    if (!fullname || !username || !email || !password) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    console.log("Attempting to register user with data:", { fullname, username, email });

    const formDataToSend = new FormData();
    formDataToSend.append("fullname", fullname);
    formDataToSend.append("username", username);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    if (avatar) formDataToSend.append("avatar", avatar);
    if (coverImage) formDataToSend.append("coverImage", coverImage);

    // This promise will be given to the toast notification
    const registrationPromise = axios.post('/users/register', formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    toast.promise(registrationPromise, {
      loading: 'Creating your account...',
      success: (response) => {
        console.log("✅ Registration successful! Server response:", response.data);
        // This code runs only after the promise succeeds
        if (response.status === 201 && response.data.data.requiresVerification) {
          navigate('/verify-email', { state: { email: formData.email } });
          return "Registration successful! Redirecting you to verify...";
        } else {
          // This is a failsafe for an unexpected backend response
          throw new Error("Invalid server response during registration.");
        }
      },
      error: (error) => {
        console.error("❌ Registration failed! Server error:", error.response?.data || error);
        return error.response?.data?.message || "Registration failed. Please try again.";
      },
      finally: () => {
        setLoading(false);
      }
    });
  };

  // --- Your original JSX and icons are untouched below ---

  const userIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
    </svg>
  );

  const usernameIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
      <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
    </svg>
  );

  const emailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
      <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
      <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <FormField
          label="Full Name"
          required
          tooltip="Your display name on the platform"
          icon={userIcon}
          placeholder="Chinmay Patil"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          ref={fullnameRef}
          autoFocus
        />
        <FormField
          label="Username"
          required
          tooltip="Your unique @handle (no spaces)"
          icon={usernameIcon}
          placeholder="chinmaypatil"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <FormField
          label="Email"
          required
          tooltip="Used for verification and notifications"
          icon={emailIcon}
          type="email"
          placeholder="chinmay@example.com"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <PasswordField
          label="Password"
          required
          tooltip="Min 8 characters recommended"
          name="password"
          value={formData.password}
          onChange={handleChange}
          showStrengthIndicator={true}
        />
      </div>
      <Button
        type="submit"
        isLoading={loading}
        loadingText="Creating Account..."
        disabled={loading}
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
