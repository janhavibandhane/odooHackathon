import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, Image as ImageIcon, Shield, Save } from 'lucide-react';
import { authService } from '../../services/apiService';

const ProfileSettings = () => {
  const { user, login } = useAuth(); // We might use login to update the user context
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile({
        name: formData.name,
        avatar: formData.avatar,
        ...(formData.password && { password: formData.password })
      });

      
      // Update local storage and context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(updatedUser); // This updates the auth context

      toast.success('Profile updated successfully');
      setFormData({ ...formData, password: '', confirmPassword: '' }); // clear passwords
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Update your personal information and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          
          {/* Profile Section */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Personal Info</h2>
              <p className="text-sm text-gray-500">This information will be displayed on your profile.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-indigo-100 shrink-0">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="block w-full pl-10 px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md shadow-sm sm:text-sm cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="p-6 sm:p-8 space-y-6 bg-gray-50">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-1 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" /> Security
              </h2>
              <p className="text-sm text-gray-500">Update your password to keep your account secure. Leave blank to keep current password.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="p-6 sm:p-8 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm mr-2"></span>
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;

