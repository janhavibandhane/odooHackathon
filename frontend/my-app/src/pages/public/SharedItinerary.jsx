import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  Download, 
  Plane,
  Navigation,
  Activity,
  ChevronRight,
  DollarSign,
  Layers,
  Heart,
  Copy,
  ArrowRight,
  Globe,
  MessageCircle,
  Send,
  Link as LinkIcon
} from 'lucide-react';

import { tripService } from '../../services/apiService';

const SharedItinerary = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cities');
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    fetchPublicTrip();
  }, [tripId]);

  const fetchPublicTrip = async () => {
    try {
      const data = await tripService.getPublicTrip(tripId);
      setTrip(data);
    } catch (error) {
      toast.error(error.message || 'Trip not found or private');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTrip = async () => {
    if (!user) {
      toast.info('Please login to copy this trip to your workspace');
      navigate('/login', { state: { from: `/shared/${tripId}` } });
      return;
    }

    setIsCopying(true);
    try {
      const clonedTrip = await tripService.cloneTrip(tripId);
      toast.success('Trip duplicated into your account successfully! 🔥');
      navigate(`/trips/${clonedTrip._id}/view`);
    } catch (error) {
      toast.error('Failed to copy trip. Please try again.');
      console.error(error);
    } finally {
      setIsCopying(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this amazing trip to ${trip?.title} on Traveloop! ✈️🌍`;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`; break;
      case 'copy': 
        navigator.clipboard.writeText(url);
        toast.success('Sharable link copied to clipboard!');
        return;
      default: return;
    }
    window.open(shareUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#efedf7] flex flex-col justify-center items-center font-['Outfit']">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-pulse" size={24} />
        </div>
        <p className="mt-8 font-black text-indigo-900 uppercase tracking-[0.3em] text-[10px]">Mapping Public Itinerary...</p>
      </div>
    );
  }

  if (!trip) return (
    <div className="min-h-screen bg-[#efedf7] flex flex-col justify-center items-center px-4 font-['Outfit']">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center max-w-md border border-gray-100">
        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-500 shadow-inner">
          <Globe size={48} className="animate-pulse" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Private Space</h2>
        <p className="text-gray-400 font-bold mb-10 leading-relaxed">This trip hasn't been shared publicly yet or the link has expired. Join Traveloop to create your own stories.</p>
        <button onClick={() => navigate('/')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">Back to Reality</button>
      </div>
    </div>
  );

  const totalCost = trip.stops?.reduce((acc, stop) => {
    return acc + (stop.activities?.reduce((sAcc, act) => sAcc + (act.cost || 0), 0) || 0);
  }, 0);

  return (
    <div className="bg-[#efedf7] min-h-screen pb-24 font-['Outfit'] selection:bg-indigo-600 selection:text-white">
      
      {/* Premium Public Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-5 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl w-11 h-11 flex items-center justify-center shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform">
              <Plane className="text-white" size={22}/>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">Traveloop</span>
          </Link>
          <div className="flex items-center gap-4">
            {!user ? (
              <button onClick={() => navigate('/login')} className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all">Get Started</button>
            ) : (
              <button onClick={() => navigate('/')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-100 transition-all">My Dashboard</button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[550px] bg-indigo-900 overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-t from-[#efedf7] via-gray-900/60 to-transparent opacity-100 z-10"></div>
        {trip.coverPhoto ? (
            <img src={trip.coverPhoto} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 scale-110" />
        ) : (
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40"></div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
            <div className="text-center max-w-5xl">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600/90 backdrop-blur-xl rounded-full text-[10px] font-black text-white uppercase tracking-[0.4em] mb-10 shadow-2xl border border-white/20 animate-in fade-in slide-in-from-top-6 duration-1000">
                    <Globe size={14}/> Public Itinerary Review
                </div>
                <h1 className="text-7xl md:text-9xl font-black text-white mb-10 tracking-tighter drop-shadow-2xl animate-in fade-in zoom-in duration-1000 leading-[0.9]">{trip.title}</h1>
                <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    <div className="flex items-center gap-3 px-8 py-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl"><Calendar size={18} className="text-indigo-400"/> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</div>
                    <div className="flex items-center gap-3 px-8 py-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl"><MapPin size={18} className="text-indigo-400"/> {trip.stops?.length || 0} Destinations</div>
                    <div className="flex items-center gap-3 px-8 py-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl"><Navigation size={18} className="text-indigo-400"/> {trip.userId?.name || 'Curator'}</div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-32 relative z-30">
        
        {/* Deep Copy Action Bar */}
        <div className="bg-white rounded-[3.5rem] p-8 shadow-2xl border border-gray-100 mb-20 flex flex-col xl:flex-row justify-between items-center gap-10">
            <div className="flex flex-wrap items-center justify-center gap-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Total Estimated Cost</span>
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{totalCost?.toLocaleString()} <span className="text-xs text-indigo-400 uppercase tracking-widest font-black ml-1">INR</span></span>
                </div>
                <div className="hidden md:block w-px h-14 bg-gray-100"></div>
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block px-1 text-center md:text-left">Share Adventure</span>
                  <div className="flex gap-3">
                    <button onClick={() => handleShare('whatsapp')} className="p-4 bg-green-50 hover:bg-green-500 hover:text-white text-green-600 rounded-2xl transition-all shadow-sm hover:shadow-lg hover:shadow-green-100"><MessageCircle size={22}/></button>
                    <button onClick={() => handleShare('twitter')} className="p-4 bg-blue-50 hover:bg-[#1DA1F2] hover:text-white text-blue-400 rounded-2xl transition-all shadow-sm hover:shadow-lg hover:shadow-blue-100"><Send size={22}/></button>
                    <button onClick={() => handleShare('facebook')} className="p-4 bg-indigo-50 hover:bg-[#1877F2] hover:text-white text-indigo-400 rounded-2xl transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-100"><LinkIcon size={22}/></button>
                    <button onClick={() => handleShare('copy')} className="p-4 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-500 rounded-2xl transition-all shadow-sm hover:shadow-lg"><Copy size={22}/></button>
                  </div>
                </div>
            </div>

            <button 
              onClick={handleCopyTrip}
              disabled={isCopying}
              className="group relative overflow-hidden flex items-center justify-center gap-4 px-16 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-[0.2em] text-[11px] disabled:opacity-50 w-full xl:w-auto"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {isCopying ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <>
                    <Download size={22} className="group-hover:translate-y-1 transition-transform"/> 
                    Copy Trip to My Account
                  </>
                )}
            </button>
        </div>

        {/* Itinerary Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Timeline Section */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Intro Description */}
            <div className="bg-white rounded-[4rem] p-16 shadow-2xl border border-gray-100 relative overflow-hidden group">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-50 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                    <Activity size={24}/>
                  </div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">The Inspiration</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800 leading-tight tracking-tight italic">
                  "{trip.description || "A carefully curated journey designed for those who seek the perfect balance of luxury, adventure, and local culture. This itinerary represents a dream realized."}"
                </p>
              </div>
            </div>

            {/* Stop-by-Stop Breakdown */}
            <div className="space-y-32">
              {trip.stops?.map((stop, index) => (
                <div key={stop._id} className="relative">
                  <div className="flex flex-col md:flex-row md:items-end gap-8 mb-12">
                    <div className="w-20 h-20 bg-white shadow-2xl rounded-[2rem] flex items-center justify-center text-4xl font-black text-indigo-600 border border-gray-50 flex-none animate-in fade-in slide-in-from-left-8 duration-700">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin size={18} className="text-indigo-500"/>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Destination Route</span>
                      </div>
                      <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">{stop.city}</h2>
                    </div>
                    <div className="flex-none">
                      <div className="px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                        {new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {stop.activities?.map((activity, aIdx) => (
                      <div key={aIdx} className="group/item flex flex-col p-10 bg-white rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-indigo-100 transition-all duration-700 hover:-translate-y-2">
                        <div className="flex items-center justify-between mb-8">
                          <div className="w-14 h-14 bg-gray-50 group-hover/item:bg-indigo-600 group-hover/item:text-white rounded-2xl flex items-center justify-center text-gray-400 shadow-inner transition-all duration-700">
                            <Navigation size={26}/>
                          </div>
                          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-4 py-1.5 rounded-xl border border-indigo-100 uppercase tracking-[0.2em]">
                            {activity.type || 'General'}
                          </span>
                        </div>
                        <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight leading-tight">{activity.title}</h4>
                        <p className="text-[15px] text-gray-400 font-bold leading-relaxed mb-10 flex-1">{activity.description || 'Dive deep into the local essence and discover hidden gems.'}</p>
                        
                        <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                          <div className="flex items-center gap-2.5 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            <Clock size={16} className="text-indigo-400"/> {activity.duration || 60} MINS
                          </div>
                          <div className="flex items-center gap-1.5 text-xl font-black text-gray-900 tracking-tighter">
                            <span className="text-sm text-green-500 font-black">₹</span>{activity.cost?.toLocaleString() || 0}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {index !== trip.stops.length - 1 && (
                    <div className="flex flex-col items-center py-16">
                      <div className="w-1 h-32 bg-gradient-to-b from-indigo-100 via-indigo-50 to-transparent rounded-full opacity-50"></div>
                      <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center -mt-6 border border-indigo-50 animate-bounce">
                        <Plane className="text-indigo-300 rotate-90" size={20}/>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Review Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-gray-100 sticky top-32 group/side">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent opacity-0 group-hover/side:opacity-100 transition-opacity rounded-[4rem]"></div>
              <div className="relative z-10">
                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-12 text-center">Itinerary Stats</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6 p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all group/stat">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100 group-hover/stat:scale-110 transition-transform"><Layers size={28}/></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Destinations</p>
                      <p className="text-3xl font-black text-gray-900 tracking-tighter">{trip.stops?.length || 0} Cities</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-50 hover:bg-green-50 hover:border-green-100 transition-all group/stat">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-xl shadow-green-100 group-hover/stat:scale-110 transition-transform"><DollarSign size={28}/></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Budget</p>
                      <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{totalCost?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-[0_20px_50px_rgba(99,102,241,0.3)] relative overflow-hidden group/cta">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative z-10">
                      <h4 className="text-2xl font-black mb-6 leading-none tracking-tighter">Your Turn to Explore?</h4>
                      <p className="text-sm font-bold text-indigo-100 mb-10 leading-relaxed opacity-90">Join thousands of travelers crafting the perfect journeys every day.</p>
                      <button onClick={() => navigate('/register')} className="w-full py-5 bg-white text-indigo-600 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:gap-6 transition-all shadow-2xl">
                        Plan My Trip <ArrowRight size={18}/>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-black text-gray-300 uppercase tracking-[0.3em]">
                    Built for <Heart size={14} className="text-red-500 fill-red-500 animate-pulse"/> by Traveloop
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SharedItinerary;
