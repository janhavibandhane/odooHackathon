// src/components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ sidebarId = "my-drawer-4", onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('/');
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
      else setIsOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const menuItems = [
    { id: '/', name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', badge: null },
    { id: '/trips', name: 'My Trips', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', badge: null },
    { id: '/explore/cities', name: 'Explore Cities', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', badge: null },
    { id: '/explore/activities', name: 'Activities', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z', badge: null },
    { id: '/profile', name: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', badge: null },
    { id: '/admin', name: 'Admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z', badge: null },
  ];

  const handleNavigation = (itemId) => {
    navigate(itemId);
    if (onNavigate) onNavigate(itemId);
    if (isMobile) {
      setIsOpen(false);
      document.getElementById(sidebarId).checked = false;
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isMobile) {
      document.getElementById(sidebarId).checked = !isOpen;
    }
  };

  return (
    <div className="drawer-side shadow-2xl">
      <label 
        htmlFor={sidebarId} 
        className={`drawer-overlay bg-black/20 backdrop-blur-sm transition-all duration-300 ${!isOpen ? 'hidden' : 'block'}`}
        onClick={() => setIsOpen(false)}
      ></label>
      
      <div 
        className={`flex min-h-full flex-col bg-white shadow-2xl transition-all duration-500 ease-in-out ${
          !isMobile && !isOpen ? 'w-20' : 'w-80'
        } ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute ${isOpen ? 'right-2 top-8' : 'right-4 top-10'}  z-50 bg-white rounded-full p-1.5 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-110 group`}
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1">
            <svg 
              className={`size-3 text-white transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </div>
        </button>

        {/* Logo Area */}
        <div className="relative px-6 pt-8 pb-6">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl w-12 h-12 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="size-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className={`overflow-hidden transition-all duration-500 ${!isMobile && !isOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Traveloop</h2>
              <p className="text-xs text-gray-400 font-medium">Your Travel Plan</p>
            </div>
          </div>
        </div>
        
        {/* User Profile Card */}
        <div className={`mx-4 mb-4 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-2xl border border-indigo-100 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
          !isMobile && !isOpen ? 'mx-3 p-3' : ''
        }`}>
          <div className={`flex items-center gap-3 ${!isMobile && !isOpen ? 'justify-center' : ''}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-md opacity-60"></div>
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-14 h-14 flex items-center justify-center shadow-md transform transition-all duration-300 hover:scale-105">
                <span className="text-white font-bold text-xl">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white animate-pulse"></div>
            </div>
            <div className={`flex-1 transition-all duration-300 ${!isMobile && !isOpen ? 'hidden' : 'block'}`}>
              <div className="text-base font-semibold text-gray-800">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.email || 'User'}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[9px] font-bold text-indigo-600">NY</span>
                  </div>
                  <div className="w-6 h-6 bg-purple-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[9px] font-bold text-purple-600">PAR</span>
                  </div>
                  <div className="w-6 h-6 bg-pink-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[9px] font-bold text-pink-600">TOK</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">3 Trips</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
          <div className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3 flex items-center gap-2 transition-all duration-300 ${!isMobile && !isOpen ? 'justify-center' : ''}`}>
            <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            <span className={`whitespace-nowrap text-gray-500 ${!isMobile && !isOpen ? 'hidden' : 'inline'}`}>
              EXPLORE
            </span>
          </div>
          
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => handleNavigation(item.id)}
                  className={`relative w-full group transition-all duration-300 rounded-xl ${
                    activeItem === item.id 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm' 
                      : 'hover:bg-gray-50'
                  } ${!isMobile && !isOpen ? 'px-3 py-3' : 'px-4 py-3'}`}
                >
                  <div className={`flex items-center gap-3 ${!isMobile && !isOpen ? 'justify-center' : ''}`}>
                    {/* Icon */}
                    <div className="relative">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth="1.5" 
                        stroke="currentColor" 
                        className={`size-5 transition-all duration-300 transform group-hover:scale-110 ${
                          activeItem === item.id 
                            ? 'text-indigo-600' 
                            : 'text-gray-500 group-hover:text-indigo-600'
                        }`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    
                    {/* Text */}
                    <span className={`font-medium text-sm transition-all duration-300 ${
                      activeItem === item.id 
                        ? 'text-indigo-600' 
                        : 'text-gray-700 group-hover:text-indigo-600'
                    } ${!isMobile && !isOpen ? 'hidden' : 'inline'}`}>
                      {item.name}
                    </span>
                    
                    {/* Badge */}
                    {item.badge && (!isMobile && !isOpen ? false : (
                      <div className={`ml-auto px-2.5 py-1 text-xs font-bold rounded-full ${
                        activeItem === item.id
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.badge}
                      </div>
                    ))}
                    
                    {/* Active indicator */}
                    {activeItem === item.id && (
                      <div className="absolute right-0 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-full"></div>
                    )}
                  </div>
                  
                  {/* Tooltip for collapsed mode */}
                  {(!isMobile && !isOpen) && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                      {item.name}
                      {item.badge && <span className="ml-1 text-indigo-400">({item.badge})</span>}
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-white">
          <div className="space-y-2.5">
            <button onClick={() => handleNavigation('/trips/create')} className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl py-2.5 px-4 font-semibold text-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="flex items-center justify-center gap-2 relative z-10">
                <svg className="size-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className={`${!isMobile && !isOpen ? 'hidden' : 'inline'}`}>Plan New Trip</span>
              </div>
            </button>
            
            <button className="w-full group flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 text-gray-700 font-medium text-sm rounded-xl border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 transform hover:scale-105" onClick={logout}>
              <svg className="size-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className={`${!isMobile && !isOpen ? 'hidden' : 'inline'}`}>Sign Out</span>
            </button>
          </div>
          
          <div className={`mt-4 text-center transition-all duration-300 ${!isMobile && !isOpen ? 'hidden' : 'block'}`}>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-3"></div>
            <p className="text-[11px] font-medium text-gray-400">Traveloop v1.0.0</p>
            <p className="text-[10px] text-gray-300 mt-1">Hackathon Build</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;