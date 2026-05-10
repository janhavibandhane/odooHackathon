import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  User, 
  Mail, 
  Camera, 
  Shield, 
  Save, 
  Trash2, 
  Globe, 
  MapPin, 
  ChevronRight,
  LogOut,
  Heart,
  Settings,
  Bell,
  Lock
} from 'lucide-react';
import { authService } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    language: 'English',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'security', 'preferences', 'danger'

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        language: user.language || 'English',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Image too large (max 2MB)");
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
        language: formData.language,
        ...(formData.password && { password: formData.password })
      });

      updateUser(updatedUser);
      toast.success('Profile updated successfully! ✨');
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure? This will permanently delete your account and all your trips. This action cannot be undone.')) {
      try {
        await authService.deleteAccount();
        toast.success('Account deleted. We are sorry to see you go.');
        logout();
        navigate('/register');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  return (
    <div className="min-h-screen bg-[#efedf7] py-12 px-4 sm:px-6 lg:px-8 font-['Outfit']">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-80 shrink-0 space-y-4">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10"></div>
              <div className="relative z-10">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-black text-indigo-300">
                        {formData.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-white text-indigo-600 rounded-2xl shadow-xl border border-gray-100 hover:scale-110 transition-all active:scale-95"
                  >
                    <Camera size={18}/>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter">{formData.name || 'Your Name'}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{formData.email}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-4 shadow-xl border border-gray-100 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-2' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  }`}
                >
                  <tab.icon size={18}/>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            
            {activeTab === 'personal' && (
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <User size={24}/>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Account details</h3>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Personal Information</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address (Read Only)</label>
                      <div className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-400 cursor-not-allowed flex items-center gap-2">
                        <Lock size={14}/> {formData.email}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-50 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-3 px-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <Save size={18}/>}
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                    <Shield size={24}/>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Privacy & Safety</h3>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Security Settings</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-purple-50 rounded-[2rem] border border-purple-100 flex gap-4">
                    <Shield className="text-purple-600 shrink-0" size={20}/>
                    <p className="text-xs font-bold text-purple-900 leading-relaxed">
                      Make sure your password is at least 8 characters long and includes numbers and special characters to ensure maximum safety for your travel data.
                    </p>
                  </div>

                  <div className="pt-8 border-t border-gray-50 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-3 px-12 py-5 bg-purple-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-purple-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <Lock size={18}/>}
                      Update Security
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                    <Settings size={24}/>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Customization</h3>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Profile Preferences</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Language</label>
                      <select 
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all appearance-none cursor-pointer"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Hindi</option>
                        <option>Japanese</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                       <MapPin size={16} className="text-green-500"/> Saved Destinations
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {user.savedDestinations?.length > 0 ? (
                        user.savedDestinations.map((dest, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-green-600 shadow-sm"><MapPin size={14}/></div>
                              <span className="text-xs font-black text-gray-800">{dest.city}</span>
                            </div>
                            <Trash2 size={14} className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors"/>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
                          <p className="text-xs font-bold text-gray-400 italic">No saved destinations yet. Start exploring!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-50 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-3 px-12 py-5 bg-green-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-green-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <Save size={18}/>}
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-red-50 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                    <Trash2 size={24}/>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Account closure</h3>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Danger Zone</h2>
                  </div>
                </div>

                <div className="p-10 bg-red-50 rounded-[3rem] border border-red-100 space-y-8">
                  <div>
                    <h4 className="text-xl font-black text-red-900 mb-2 leading-none">Delete your account</h4>
                    <p className="text-sm font-bold text-red-600 leading-relaxed">
                      Once you delete your account, there is no going back. All your travel history, custom itineraries, and personal data will be wiped from our servers permanently.
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-3 px-10 py-5 bg-red-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
                  >
                    <Trash2 size={18}/> 
                    Permanently Delete Account
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfileSettings;
