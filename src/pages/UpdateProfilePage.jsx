import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '@/lib/axios.js';
import { toast } from 'sonner';
import { useAuth } from '../contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Image as ImageIcon, User as UserIcon, Loader2 } from 'lucide-react';

// ============================================================================
// Main Page Component - All logic is now centralized and robust
// ============================================================================
const UpdateProfilePage = () => {
  const { user, fetchCurrentUser } = useAuth();

  // State for text inputs
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [detailsLoading, setDetailsLoading] = useState(false);

  // State for image previews and uploads
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Effect to sync local state with the user context
  useEffect(() => {
    if (user) {
      setFullname(user.fullname || '');
      setEmail(user.email || '');
      setAvatarPreview(user.avatar || '');
      setCoverPreview(user.coverImage || '');
    }
  }, [user]);

  // Check if account details have changed
  const hasDetailsChanges = () => fullname !== (user?.fullname || '') || email !== (user?.email || '');

  // Handler for updating text-based account details
  const handleAccountDetailsUpdate = async (e) => {
    e.preventDefault();
    if (!hasDetailsChanges()) {
      toast.info('No changes to save in account details.');
      return;
    }
    setDetailsLoading(true);
    const toastId = toast.loading('Updating account details...');

    try {
      await axiosInstance.patch(`/users/update-account`, { fullname, email });
      await fetchCurrentUser(); // Refetch to update context
      toast.success('Account details updated successfully!', { id: toastId });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update details.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Generic handler for immediate image uploads
  const handleImageUpload = async (file, type) => {
    if (!file) return;

    const endpoint = type === 'avatar' ? '/users/update-avatar' : '/users/update-cover-image';
    const fieldName = type === 'avatar' ? 'avatar' : 'coverImage';
    const setLoading = type === 'avatar' ? setAvatarLoading : setCoverLoading;
    const setPreview = type === 'avatar' ? setAvatarPreview : setCoverPreview;

    setLoading(true);
    const formData = new FormData();
    formData.append(fieldName, file);

    const toastId = toast.loading(`Uploading new ${type}...`);

    try {
      await axiosInstance.patch(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchCurrentUser();
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`, { id: toastId });
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to upload ${type}.`;
      toast.error(errorMessage, { id: toastId });
      // Revert preview on error
      setPreview(user?.[fieldName] || '');
    } finally {
      setLoading(false);
    }
  };

  const onFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const setPreview = type === 'avatar' ? setAvatarPreview : setCoverPreview;
      setPreview(URL.createObjectURL(file));
      handleImageUpload(file, type);
    } else if (file) {
      toast.error('Please select a valid image file.');
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Profile Header Section */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 sm:h-64 w-full rounded-lg overflow-hidden bg-muted">
            <img
              src={coverPreview || '/default-cover.jpg'}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <Button
              type="button"
              onClick={() => coverInputRef.current.click()}
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full h-8 w-8"
              aria-label="Change cover image"
              disabled={coverLoading}
            >
              {coverLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={coverInputRef}
              onChange={(e) => onFileSelect(e, 'coverImage')}
              className="hidden"
            />
          </div>

          {/* Avatar and User Info */}
          <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-center gap-4">
            <div className="relative">
              <img
                src={avatarPreview || '/default-avatar.png'}
                alt="Avatar"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-background"
              />
              <Button
                type="button"
                onClick={() => avatarInputRef.current.click()}
                variant="secondary"
                size="icon"
                className="absolute bottom-1 right-1 rounded-full h-8 w-8"
                aria-label="Change profile photo"
                disabled={avatarLoading}
              >
                {avatarLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={(e) => onFileSelect(e, 'avatar')}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Spacer to push content below the overlapping avatar */}
        <div className="pt-20">
          {/* Account Details Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Account Details
              </CardTitle>
              <CardDescription>
                Update your personal information. Changes will be reflected across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountDetailsUpdate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={detailsLoading || !hasDetailsChanges()} className="w-full">
                  {detailsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {detailsLoading ? 'Saving...' : 'Save Account Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
