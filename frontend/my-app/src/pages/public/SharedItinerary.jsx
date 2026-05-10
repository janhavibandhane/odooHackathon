import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Calendar, MapPin, Clock, Share2, Download, Plane, Navigation, Activity,
  ChevronRight, DollarSign, Layers, Heart, Copy, ArrowRight, Globe,
  MessageCircle, Send, LinkIcon
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
    } finally {
      setIsCopying(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this amazing trip to ${trip?.title} on Traveloop! ✈️🌍`;
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Sharable link copied to clipboard!');
      return;
    }
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`
    };
    window.open(shareUrls[platform], '_blank');
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
        <p className="text-gray-400 font-bold mb-10 leading-relaxed">This trip hasn't been shared publicly yet or the link has expired.</p>
        <button onClick={() => navigate('/')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-100 hover:scale-[1.02] transition-all">Back to Reality</button>
      </div>
    </div>
  );

  const totalCost = trip.stops?.reduce((acc, stop) => 
    acc + (stop.activities?.reduce((sAcc, act) => sAcc + (act.cost || 0), 0) || 0), 0);

  return (
    <div className="bg-[#efedf7] min-h-screen pb-24 font-['Outfit']">
      {/* Header */}
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
              <button onClick={() => navigate('/login')} className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Get Started</button>
            ) : (
              <button onClick={() => navigate('/')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all">My Dashboard</button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - Compacted */}
      <div className="relative h-[400px] bg-indigo-900 overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-t from-[#efedf7] via-gray-900/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
          <div className="text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/90 backdrop-blur-xl rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 shadow-2xl border border-white/20">
              <Globe size={12}/> Public Itinerary
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl leading-[0.9]">{trip.title}</h1>
            <div className="flex flex-wrap justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              <div className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-2xl backdrop-blur-xl"><Calendar size={14}/> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</div>
              <div className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-2xl backdrop-blur-xl"><MapPin size={14}/> {trip.stops?.length || 0} Destinations</div>
              <div className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-2xl backdrop-blur-xl"><Navigation size={14}/> {trip.userId?.name || 'Curator'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-24 relative z-30">
        
        {/* Action Bar - Compacted */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 mb-12 flex flex-wrap md:flex-nowrap justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-8">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Cost</span>
              <span className="text-3xl font-black text-gray-900 tracking-tighter block">₹{totalCost?.toLocaleString()}</span>
            </div>
            <div className="hidden md:block w-px h-10 bg-gray-100"></div>
            <div className="flex gap-2">
              <button onClick={() => handleShare('whatsapp')} className="p-3 bg-green-50 hover:bg-green-500 hover:text-white text-green-600 rounded-xl transition-all"><MessageCircle size={18}/></button>
              <button onClick={() => handleShare('twitter')} className="p-3 bg-blue-50 hover:bg-[#1DA1F2] hover:text-white text-blue-400 rounded-xl transition-all"><Send size={18}/></button>
              <button onClick={() => handleShare('facebook')} className="p-3 bg-indigo-50 hover:bg-[#1877F2] hover:text-white text-indigo-400 rounded-xl transition-all"><LinkIcon size={18}/></button>
              <button onClick={() => handleShare('copy')} className="p-3 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-500 rounded-xl transition-all"><Copy size={18}/></button>
            </div>
          </div>
          <button onClick={handleCopyTrip} disabled={isCopying} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-[0.2em] text-[11px] disabled:opacity-50">
            {isCopying ? <span className="loading loading-spinner loading-sm"></span> : <><Download size={18}/> Copy Trip</>}
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Timeline Section */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Description */}
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Activity size={20}/>
                </div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Inspiration</h3>
              </div>
              <p className="text-xl font-bold text-gray-800 leading-tight italic">"{trip.description || "A carefully curated journey designed for those who seek the perfect balance of luxury, adventure, and local culture."}"</p>
            </div>

            {/* Stops */}
            <div className="space-y-16">
              {trip.stops?.map((stop, index) => (
                <div key={stop._id}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center text-3xl font-black text-indigo-600 border border-gray-50 flex-none">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-indigo-500"/>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Destination</span>
                      </div>
                      <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{stop.city}</h2>
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 rounded-xl text-[10px] font-black text-indigo-600">
                      {new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stop.activities?.map((activity, aIdx) => (
                      <div key={aIdx} className="p-6 bg-white rounded-2xl border border-gray-50 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            <Navigation size={20}/>
                          </div>
                          <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-wider">{activity.type || 'Activity'}</span>
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{activity.title}</h4>
                        <p className="text-sm text-gray-400 font-bold leading-relaxed mb-4">{activity.description || 'Discover hidden gems and local experiences.'}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase">
                            <Clock size={12} className="text-indigo-400"/> {activity.duration || 60} MIN
                          </div>
                          <div className="flex items-center gap-1 text-lg font-black text-gray-900">
                            <span className="text-sm text-green-500">₹</span>{activity.cost?.toLocaleString() || 0}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {index !== trip.stops.length - 1 && (
                    <div className="flex flex-col items-center py-8">
                      <div className="w-px h-16 bg-gradient-to-b from-indigo-100 to-transparent"></div>
                      <Plane className="text-indigo-300 rotate-90 bg-white rounded-full p-1" size={24}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Compacted */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 sticky top-28">
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-8 text-center">Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl hover:bg-indigo-50 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-md"><Layers size={22}/></div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Destinations</p>
                    <p className="text-2xl font-black text-gray-900">{trip.stops?.length || 0} Cities</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl hover:bg-green-50 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-md"><DollarSign size={22}/></div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Budget</p>
                    <p className="text-2xl font-black text-gray-900">₹{totalCost?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-lg mt-6">
                  <h4 className="text-xl font-black mb-3">Your Turn?</h4>
                  <p className="text-xs font-bold text-indigo-100 mb-6">Join thousands of travelers crafting perfect journeys.</p>
                  <button onClick={() => navigate('/register')} className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 hover:gap-3 transition-all">
                    Plan My Trip <ArrowRight size={14}/>
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-1 text-[9px] font-black text-gray-300 uppercase tracking-wider">
                  Built for <Heart size={10} className="text-red-500 fill-red-500"/> by Traveloop
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