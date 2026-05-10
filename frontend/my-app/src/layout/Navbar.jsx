// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ sidebarId = "my-drawer-4" }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return ['Workspace', 'Dashboard'];
    if (path === '/my-trips') return ['Workspace', 'My Trips'];
    if (path === '/create-trip') return ['Workspace', 'Create Trip'];
    if (path === '/profile') return ['Account', 'Profile'];
    if (path.includes('/view')) return ['Trip', 'Itinerary'];
    if (path.includes('/budget')) return ['Trip', 'Budget'];
    if (path.includes('/packing')) return ['Trip', 'Packing'];
    if (path.includes('/journal')) return ['Trip', 'Journal'];
    if (path.includes('/builder')) return ['Trip', 'Builder'];
    return ['Workspace', 'Dashboard'];
  };

  const breadcrumbs = getBreadcrumbs();
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);
  
  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white border-b border-gray-50'
      }`}>
        <div className="navbar px-4 md:px-8 py-3">
          {/* Mobile Menu Button */}
          <div className="flex-none lg:hidden">
            <label htmlFor={sidebarId} className="btn-navbar-mobile group">
              <svg className="size-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </label>
          </div>
          
          {/* Logo/Brand - Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg w-9 h-9 flex items-center justify-center shadow-md">
              <svg className="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7h-9M14 17H5M17 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM7 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
            </div>
          </div>
          
          {/* Breadcrumb - Desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 text-xs">
              <button className="text-gray-400 hover:text-indigo-600 transition-all duration-200 hover:scale-110">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <span className="text-gray-300 font-black">/</span>
              <span className="text-gray-400 font-black uppercase tracking-widest">{breadcrumbs[0]}</span>
              <span className="text-gray-300 font-black">/</span>
              <span className="text-indigo-600 font-black uppercase tracking-widest">{breadcrumbs[1]}</span>
            </div>
            
            {/* Time Display */}
            <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
              <svg className="size-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-black text-gray-500 uppercase">{currentTime}</span>
            </div>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 justify-end max-w-md ml-auto">
            <div className="relative w-full group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trips, budgets, or journals..." 
                className="w-full px-5 py-2.5 pl-11 text-sm bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all duration-300 group-hover:shadow-md font-bold"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Right Actions */}
          <div className="flex-none flex items-center gap-2 md:gap-3">
            
            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn-profile group cursor-pointer flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <span className="text-white font-black text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-black text-gray-900 uppercase tracking-tighter">{user?.name || 'User'}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">{user?.email || 'User'}</div>
                </div>
                <svg className="hidden md:block size-4 text-gray-300 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ul tabIndex={0} className="mt-3 p-3 shadow-2xl menu dropdown-content bg-white rounded-[1.5rem] w-72 border border-gray-100 z-[100]">
                <li className="menu-title text-gray-400 px-3 pt-2 pb-1">
                  <span className="text-[10px] font-black tracking-widest">ACCOUNT</span>
                </li>
                <li><Link to="/profile" className="flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-xl group transition-all">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                    <svg className="size-5 text-gray-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-700">My Profile</span>
                </Link></li>
                <div className="divider my-2"></div>
                <li><button className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl group transition-all text-red-600 w-full" onClick={logout}>
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                    <svg className="size-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-bold">Sign Out</span>
                </button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;