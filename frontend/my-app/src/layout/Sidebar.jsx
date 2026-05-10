import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Search, 
  Heart, 
  ShieldAlert, 
  Plus, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Globe,
  Settings,
  User,
  Navigation
} from 'lucide-react';

function Sidebar({ sidebarId = "main-drawer", onNavigate }) {
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
    { id: '/', name: 'Dashboard', icon: LayoutDashboard },
    { id: '/trips', name: 'My Trips', icon: Map },
    { id: '/explore/cities', name: 'Explore Cities', icon: Search },
    { id: '/explore/activities', name: 'Activities', icon: Heart },
    { id: '/profile', name: 'Profile', icon: Settings },
    { id: '/admin', name: 'Admin', icon: ShieldAlert, adminOnly: true },
  ];

  const handleNavigation = (itemId) => {
    navigate(itemId);
    if (onNavigate) onNavigate(itemId);
    if (isMobile) {
      setIsOpen(false);
      const checkbox = document.getElementById(sidebarId);
      if (checkbox) checkbox.checked = false;
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isMobile) {
      const checkbox = document.getElementById(sidebarId);
      if (checkbox) checkbox.checked = !isOpen;
    }
  };

  return (
    <div className="drawer-side z-[100] shadow-xl selection:bg-indigo-600 selection:text-white font-['Outfit']">
      <label 
        htmlFor={sidebarId} 
        className="drawer-overlay bg-black/40 backdrop-blur-sm transition-all duration-500"
        onClick={() => setIsOpen(false)}
      ></label>
      
      <div 
        className={`flex min-h-full flex-col bg-white border-r border-gray-100 transition-all duration-500 ease-in-out relative ${
          !isMobile && !isOpen ? 'w-[100px]' : 'w-72'
        } ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Toggle Button - Sleek & Subtle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 z-[110] w-6 h-6 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl text-indigo-600 hover:scale-110 active:scale-95 transition-all"
        >
          {isOpen ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
        </button>

        {/* Logo Area - More Compact */}
        <div className="px-6 py-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
             {/* <Plane size={22} className="rotate-45"/> */}
          </div>
          <div className={`overflow-hidden transition-all duration-500 ${!isMobile && !isOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <h2 className="text-xl font-black text-gray-900 tracking-tighter leading-none">Traveloop</h2>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-0.5">Workspace</p>
          </div>
        </div>

        {/* Profile Card - Sleek Compact Version */}
        <div className="px-4 mb-6">
            <div 
                onClick={() => navigate('/profile')}
                className={`bg-gray-50 rounded-[2rem] border border-gray-100 p-3 flex items-center gap-3 cursor-pointer hover:bg-indigo-50 hover:border-indigo-100 transition-all group ${!isMobile && !isOpen ? 'justify-center' : ''}`}
            >
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100 shrink-0 group-hover:rotate-12 transition-transform">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className={`overflow-hidden transition-all duration-500 ${!isMobile && !isOpen ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <p className="text-xs font-black text-gray-900 leading-none truncate">{user?.name || 'Traveler'}</p>
                    <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Explorer</p>
                </div>
            </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          
          <div>
            <p className={`text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] px-4 mb-4 ${!isMobile && !isOpen ? 'text-center' : ''}`}>
               {isOpen ? 'Main Navigation' : '•'}
            </p>
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                if (item.adminOnly && user?.role !== 'admin') return null;
                const isActive = activeItem === item.id;
                return (
                  <button 
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full group flex items-center gap-3 px-4 py-3.5 rounded-[1.5rem] transition-all relative ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-600'
                    } ${!isMobile && !isOpen ? 'justify-center px-0' : ''}`}
                  >
                    <item.icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`}/>
                    <span className={`text-[11px] font-black uppercase tracking-widest transition-all ${!isMobile && !isOpen ? 'hidden' : 'block'}`}>
                      {item.name}
                    </span>
                    
                    {/* Active Indicator Bar */}
                    {isActive && isOpen && (
                        <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-full"></div>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {!isOpen && !isMobile && (
                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[200]">
                            {item.name}
                        </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <p className={`text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] px-4 mb-4 ${!isMobile && !isOpen ? 'text-center' : ''}`}>
               {isOpen ? 'Quick Actions' : '•'}
            </p>
            <div className="space-y-2">
                <button 
                    onClick={() => navigate('/trips/create')}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[1.5rem] text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all ${!isMobile && !isOpen ? 'justify-center px-0' : ''}`}
                >
                    <Plus size={18} className="shrink-0"/>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${!isMobile && !isOpen ? 'hidden' : 'block'}`}>New Trip</span>
                </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="p-4 mt-auto">
          <button 
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-[1.5rem] text-red-500 hover:bg-red-50 transition-all ${!isMobile && !isOpen ? 'justify-center px-0' : ''}`}
          >
            <LogOut size={18} className="shrink-0"/>
            <span className={`text-[11px] font-black uppercase tracking-widest ${!isMobile && !isOpen ? 'hidden' : 'block'}`}>Sign Out</span>
          </button>
          
          <div className={`mt-4 text-center transition-all duration-300 ${!isMobile && !isOpen ? 'hidden' : 'block'}`}>
            <div className="h-px bg-gray-50 mb-4"></div>
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Traveloop Build v1</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;