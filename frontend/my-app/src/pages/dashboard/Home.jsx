import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Map, 
  Calendar, 
  Plus, 
  Compass, 
  Heart, 
  Clock, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Globe,
  Sparkles,
  Plane,
  ChevronRight,
  Navigation
} from 'lucide-react';
import { tripService } from '../../services/apiService';
import { toast } from 'react-toastify';

const RECOMMENDED_CITIES = [
  { name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200' },
  { name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1200' },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const trips = await tripService.getMyTrips();
        setAllTrips(trips);
        
        // Upcoming trips: sorted by date
        const sorted = [...trips]
          .filter(t => new Date(t.startDate) >= new Date().setHours(0,0,0,0))
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 3);
        setUpcomingTrips(sorted);
      } catch (error) {
        toast.error('Failed to load trips');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalCountries = new Set(allTrips.flatMap(t => t.stops?.map(s => s.country) || [])).size;

  return (
    <div className="min-h-screen bg-[#efedf7] pb-16 font-['Outfit'] selection:bg-indigo-600 selection:text-white">
      
      {/* Compact Hero Header */}
      <div className="relative h-[300px] bg-indigo-900 overflow-hidden mb-[-60px] rounded-b-[3rem] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 animate-float" 
          alt="Travel" 
        />
        
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-[9px] font-black text-white uppercase tracking-[0.3em] mb-4 border border-white/10 w-fit">
                <Sparkles size={12} className="text-yellow-400"/> Workspace
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-2 animate-in fade-in slide-in-from-left-8 duration-700 leading-none">
                Hi, {user?.name?.split(' ')[0] || 'Traveler'}!
            </h1>
            <p className="text-base md:text-lg font-bold text-indigo-100/70 max-w-xl tracking-tight leading-relaxed">
                You have <span className="text-white font-black">{upcomingTrips.length} upcoming trips</span>. Ready to explore?
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-30">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2rem] shadow-lg border border-white/50 flex items-center gap-4 group hover:scale-[1.02] transition-all">
                <div className="w-12 h-12 bg-indigo-600 rounded-[1rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform">
                    <Globe size={22}/>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Trips</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{allTrips.length}</p>
                </div>
            </div>
            <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2rem] shadow-lg border border-white/50 flex items-center gap-4 group hover:scale-[1.02] transition-all">
                <div className="w-12 h-12 bg-purple-600 rounded-[1rem] flex items-center justify-center text-white shadow-xl shadow-purple-100 group-hover:rotate-6 transition-transform">
                    <Navigation size={22}/>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Countries</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{totalCountries}</p>
                </div>
            </div>
            <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-between group hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative" onClick={() => navigate('/trips/create')}>
                <div className="relative z-10">
                    <p className="text-[9px] font-black text-indigo-100 uppercase tracking-[0.2em] mb-1">Plan Now</p>
                    <p className="text-xl font-black text-white tracking-tighter">New Adventure</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-[1rem] flex items-center justify-center text-white backdrop-blur-md group-hover:bg-white group-hover:text-indigo-600 transition-all">
                    <Plus size={22}/>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Main Column - Timeline & Trips */}
            <div className="lg:col-span-8 space-y-12">
                
                <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                        <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
                        Upcoming Journeys
                    </h2>
                    <Link to="/trips" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:gap-3 flex items-center gap-1 transition-all group">
                        View All Trips <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2].map(i => <div key={i} className="h-40 bg-white rounded-[3rem] animate-pulse"></div>)}
                    </div>
                ) : upcomingTrips.length > 0 ? (
                    <div className="space-y-8">
                        {upcomingTrips.map((trip, idx) => (
                            <div 
                                key={trip._id}
                                onClick={() => navigate(`/trips/${trip._id}/view`)}
                                className="group bg-white p-8 rounded-[3.5rem] shadow-sm border border-gray-50 flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-bottom-8"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                <div className="w-full md:w-56 h-48 rounded-[2.5rem] overflow-hidden flex-none relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <img 
                                        src={trip.coverPhoto || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80'} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        alt={trip.title}
                                    />
                                    <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-xl">Explore</div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar size={14} className="text-indigo-400"/>
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-indigo-600 transition-colors">{trip.title}</h3>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                            <ChevronRight size={24}/>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100"><MapPin size={14}/> {trip.stops?.length || 0} Destinations</div>
                                        <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 rounded-2xl text-[10px] font-black text-green-600 uppercase tracking-widest border border-green-100"><TrendingUp size={14}/> Live Planning</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[4rem] p-20 text-center border-2 border-dashed border-gray-100 group hover:border-indigo-200 transition-all">
                        <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-400 mx-auto mb-10 group-hover:scale-110 transition-transform">
                            <Compass size={48} className="animate-float"/>
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">No trips found</h3>
                        <p className="text-lg font-bold text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">It looks like you haven't planned your next adventure yet. Let's start building your dream itinerary!</p>
                        <button onClick={() => navigate('/trips/create')} className="px-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">Start Planning</button>
                    </div>
                )}
            </div>

            {/* Sidebar Column - Inspiration */}
            <div className="lg:col-span-4 space-y-12">
                
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-8 flex items-center gap-4">
                         <div className="w-2 h-10 bg-purple-600 rounded-full"></div>
                        Inspiration
                    </h2>
                    <div className="space-y-6">
                        {RECOMMENDED_CITIES.map((city, idx) => (
                            <div 
                                key={city.name}
                                onClick={() => navigate('/explore/cities', { state: { search: city.name } })}
                                className="group relative h-48 rounded-[3rem] overflow-hidden cursor-pointer shadow-xl animate-in fade-in slide-in-from-right-8"
                                style={{ animationDelay: `${idx * 200}ms` }}
                            >
                                <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                <div className="absolute bottom-8 left-8 z-20">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1">{city.country}</p>
                                    <h4 className="text-3xl font-black text-white tracking-tighter leading-none">{city.name}</h4>
                                </div>
                                <div className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                    <Plus size={24}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                

            </div>

        </div>

      </div>
    </div>
  );
};

export default Home;