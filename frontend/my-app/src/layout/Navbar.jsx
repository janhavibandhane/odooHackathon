// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar({ sidebarId = "my-drawer-4" }) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showSearch, setShowSearch] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
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
  
  const quickActions = [
    { name: 'New Task', icon: 'M12 4.5v15m7.5-7.5h-15', color: 'indigo', shortcut: '⌘N' },
    { name: 'New Project', icon: 'M4 4m0 2a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2h-12a2 2 0 01-2-2z', color: 'purple', shortcut: '⌘P' },
    { name: 'Invite Member', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'pink', shortcut: '⌘I' },
  ];
  
  return (
    <>
      <nav className={`sticky top-0 z-20 transition-all duration-500 shadow-b-lg ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
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
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">prodify</span>
          </div>
          
          {/* Breadcrumb - Desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 text-sm">
              <button className="text-gray-400 hover:text-indigo-600 transition-all duration-200 hover:scale-110">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <span className="text-gray-300">/</span>
              <button className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">Workspace</button>
              <span className="text-gray-300">/</span>
              <button className="text-indigo-600 font-semibold">Dashboard</button>
            </div>
            
            {/* Time Display */}
            <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <svg className="size-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-gray-600">{currentTime}</span>
            </div>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 justify-end max-w-md ml-auto">
            <div className="relative w-full group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, projects, or members..." 
                className="w-full px-5 py-2.5 pl-11 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-300 group-hover:shadow-md"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <kbd className="hidden xl:block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">⌘K</kbd>
              </div>
            </div>
          </div>
          
          {/* Right Actions */}
          <div className="flex-none flex items-center gap-2 md:gap-3">
            {/* Quick Actions Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn-navbar-icon group">
                <svg className="size-5 transition-transform group-hover:scale-110 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="hidden sm:inline text-sm font-medium">Create</span>
              </div>
              <ul className="mt-3 p-2 shadow-xl menu dropdown-content bg-white rounded-2xl w-80 border border-gray-100">
                <li className="menu-title text-gray-400 px-3 pt-2 pb-1 text-xs font-bold tracking-wider">
                  <span>QUICK CREATE</span>
                </li>
                {quickActions.map((action, idx) => (
                  <li key={idx}>
                    <a className="group rounded-xl transition-all duration-200 hover:bg-gray-50">
                      <div className={`w-9 h-9 bg-${action.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <svg className={`size-5 text-${action.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">{action.name}</span>
                      <span className="text-xs text-gray-400 font-mono ml-auto">{action.shortcut}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Search Button - Mobile */}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="lg:hidden btn-navbar-icon"
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Notifications */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn-navbar-icon relative group">
                <div className="indicator">
                  <svg className="size-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  {notifications > 0 && (
                    <span className="badge-notification animate-pulse">{notifications}</span>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 p-2 shadow-xl menu dropdown-content bg-white rounded-2xl w-96 border border-gray-100">
                <li className="menu-title text-gray-400 flex justify-between items-center px-3 pt-2 pb-1">
                  <span className="text-xs font-bold tracking-wider">NOTIFICATIONS</span>
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Mark all read</button>
                </li>
                <li>
                  <a className="notification-item group">
                    <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="size-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Task completed</div>
                      <div className="text-xs text-gray-500 mt-0.5">"Update documentation" was marked as done</div>
                      <div className="text-xs text-gray-400 mt-1">2 minutes ago</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="notification-item group">
                    <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="size-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">New team member</div>
                      <div className="text-xs text-gray-500 mt-0.5">Sarah joined the workspace</div>
                      <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn-profile group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-11 h-11 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-base">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white"></div>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.email || 'User'}</div>
                </div>
                <svg className="hidden md:block size-4 text-gray-400 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ul tabIndex={0} className="mt-3 p-2 shadow-xl menu dropdown-content bg-white rounded-2xl w-72 border border-gray-100">
                <li className="menu-title text-gray-400 px-3 pt-2 pb-1">
                  <span className="text-xs font-bold tracking-wider">ACCOUNT</span>
                </li>
                <li><a className="profile-menu-item">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <svg className="size-5 text-gray-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">My Profile</span>
                </a></li>
                <li><a className="profile-menu-item">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <svg className="size-5 text-gray-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Settings</span>
                </a></li>
                <div className="divider my-1"></div>
                <li><button className="profile-menu-item text-red-600 hover:bg-red-50 w-full" onClick={logout}>
                  <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <svg className="size-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-medium">Sign Out</span>
                </button></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="lg:hidden p-4 border-t border-gray-100 animate-slideDown bg-white">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search tasks, projects, or members..." 
                className="w-full px-4 py-3 pl-11 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                autoFocus
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;