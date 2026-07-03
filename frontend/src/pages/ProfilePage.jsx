import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Camera,
  Edit2,
  Save,
  X,
  Calendar,
  Link as LinkIcon,
  Check,
  Loader2,
  ArrowBigLeft,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../components/ToastContainer';
import Avatar from '../components/common/Avatar.jsx';
import { updateProfile, uploadUserAvatar } from '../api/user.api.js';
import { fetchUserProfile } from '../store/actions/user.actions.js';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [tempAvatarPreview, setTempAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    role: currentUser?.role || '',
    website: currentUser?.website || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
  });

  const [previewAvatar, setPreviewAvatar] = useState(currentUser?.avatar || null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error('Avatar size should be less than 5MB');
        return;
      }

      setSelectedAvatarFile(file);

      // Show preview in modal
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Show confirmation modal
      setShowAvatarModal(true);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedAvatarFile) return;

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedAvatarFile);

      const result = await uploadUserAvatar(formData);
      console.log('Avatar uploaded:', result);

      // Update preview with new avatar
      setPreviewAvatar(tempAvatarPreview);

      // Update user profile in Redux store
      dispatch(fetchUserProfile());

      toast.success('Avatar updated successfully!');

      // Close modal and reset states
      setShowAvatarModal(false);
      setSelectedAvatarFile(null);
      setTempAvatarPreview(null);
    } catch (error) {
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarCancel = () => {
    setShowAvatarModal(false);
    setSelectedAvatarFile(null);
    setTempAvatarPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // if (!formData.email.trim()) {
    //   newErrors.email = 'Email is required';
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = 'Email is invalid';
    // }

    // if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
    //   newErrors.phone = 'Invalid phone number format';
    // }

    // if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
    //   newErrors.website = 'Website must be a valid URL';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // if (!validateForm()) {
    //   toast.error('Please fix the errors in the form');
    //   return;
    // }

    setIsLoading(true);
    try {
      // TODO: Call API to update user profile
      // await updateUserProfile(formData);

      const result = await updateProfile({ username: formData.username });
      dispatch(fetchUserProfile());
      console.log(result);

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      bio: currentUser?.bio || '',
      location: currentUser?.location || '',
      role: currentUser?.role || '',
      website: currentUser?.website || '',
      dateOfBirth: currentUser?.dateOfBirth || '',
    });
    setPreviewAvatar(currentUser?.avatar || null);
    setErrors({});
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-surface-alt p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-dark-text mb-2">Profile Settings</h1>
            <p className="text-dark-text-muted">Manage your personal information and preferences</p>
          </div>
          <button
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowBigLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-xl">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                    {previewAvatar ? (
                      <img
                        src={previewAvatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <User size={48} className="text-primary" />
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${
                        isUploadingAvatar
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                    >
                      {isUploadingAvatar ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Camera size={16} />
                      )}
                    </motion.button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isUploadingAvatar}
                  className="hidden"
                />

                <h2 className="text-xl font-bold text-dark-text mt-4">
                  {formData.username || 'Your Name'}
                </h2>
                <p className="text-dark-text-muted mt-1">{formData.role || 'No role specified'}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-dark-surface-alt rounded-lg">
                  <p className="text-lg font-bold text-primary">{currentUser.chatCount || 0}</p>
                  <p className="text-xs text-dark-text-muted">Chats</p>
                </div>
                <div className="text-center p-3 bg-dark-surface-alt rounded-lg">
                  <p className="text-lg font-bold text-primary">
                    {currentUser.groupChatCount || 0}
                  </p>
                  <p className="text-xs text-dark-text-muted">Groups</p>
                </div>
                {/* <div className="text-center p-3 bg-dark-surface-alt rounded-lg">
                  <p className="text-lg font-bold text-primary">0</p>
                  <p className="text-xs text-dark-text-muted">Media</p>
                </div> */}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="flex-1 p-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1 p-3 bg-success hover:bg-success/90 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {isLoading ? 'Saving...' : 'Save'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancel}
                      className="flex-1 p-3 bg-dark-surface-alt hover:bg-dark-surface-2 text-dark-text rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <X size={16} />
                      Cancel
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-dark-text mb-6">Personal Information</h3>

              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Username</label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted"
                    />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 bg-dark-surface-alt border ${
                        errors.username ? 'border-red-500' : 'border-dark-border'
                      } rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="Enter your username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className={`w-full pl-10 pr-3 py-2 bg-dark-surface-alt border ${
                        errors.email ? 'border-red-500' : 'border-dark-border'
                      } rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 bg-dark-surface-alt border ${
                        errors.phone ? 'border-red-500' : 'border-dark-border'
                      } rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 bg-dark-surface-alt border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Location</label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted"
                    />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 bg-dark-surface-alt border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Role</label>
                  <div className="relative">
                    <Briefcase
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted"
                    />
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 bg-dark-surface-alt border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="e.g. Developer, Designer"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Website</label>
                  <div className="relative">
                    <LinkIcon
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted"
                    />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 bg-dark-surface-alt border ${
                        errors.website ? 'border-red-500' : 'border-dark-border'
                      } rounded-lg text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted"
                    />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 bg-dark-surface-alt border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="mt-8 pt-6 border-t border-dark-border">
                <h4 className="text-sm font-medium text-dark-text mb-4">Account Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-dark-surface-alt rounded-lg">
                    <p className="text-xs text-dark-text-muted mb-1">Member Since</p>
                    <p className="text-sm text-dark-text font-medium">
                      {currentUser?.createdAt ? formatDate(currentUser.createdAt) : 'Not available'}
                    </p>
                  </div>
                  <div className="p-3 bg-dark-surface-alt rounded-lg">
                    <p className="text-xs text-dark-text-muted mb-1">Account Status</p>
                    <p className="text-sm text-success font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Avatar Upload Confirmation Modal */}
        <AnimatePresence>
          {showAvatarModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleAvatarCancel}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />

              {/* Modal */}
              <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', bounce: 0.3 }}
                  className="w-full max-w-md bg-dark-surface border border-dark-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-dark-border">
                    <h3 className="text-lg font-semibold text-dark-text">Change Profile Picture</h3>
                    <p className="text-sm text-dark-text-muted mt-1">
                      Preview your new avatar before uploading
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Avatar Preview */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                          {tempAvatarPreview ? (
                            <img
                              src={tempAvatarPreview}
                              alt="New avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <User size={48} className="text-primary" />
                            </div>
                          )}
                        </div>

                        {/* File info */}
                        {selectedAvatarFile && (
                          <div className="mt-4 text-center">
                            <p className="text-sm text-dark-text font-medium">
                              {selectedAvatarFile.name}
                            </p>
                            <p className="text-xs text-dark-text-muted">
                              {(selectedAvatarFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAvatarCancel}
                        disabled={isUploadingAvatar}
                        className="flex-1 p-3 bg-dark-surface-alt hover:bg-dark-surface-2 text-dark-text rounded-lg transition-colors font-medium disabled:opacity-50"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAvatarUpload}
                        disabled={isUploadingAvatar}
                        className="flex-1 p-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isUploadingAvatar ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            Upload
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
