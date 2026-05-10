import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  Download, 
  Printer, 
  ArrowLeft, 
  Navigation,
  Activity,
  ChevronRight,
  Plane,
  Edit3,
  DollarSign,
  Layers,
  Info
} from 'lucide-react';

import { tripService } from '../../services/apiService';
import TripTabs from '../../components/trips/TripTabs';

const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cities'); // 'cities' or 'timeline'

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const data = await tripService.getTripById(id);
      setTrip(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch trip data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg text-indigo-600"></span></div>;
  }

  if (!trip) return <div className="text-center py-10 font-black text-gray-500">Trip not found</div>;

  const totalCost = trip.stops?.reduce((acc, stop) => {
    return acc + (stop.activities?.reduce((sAcc, act) => sAcc + (act.cost || 0), 0) || 0);
  }, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <TripTabs />
      
      {/* Premium Hero Section */}
      <div className="relative h-[400px] bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90 z-10"></div>
        {trip.coverPhoto ? (
            <img src={trip.coverPhoto} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" />
        ) : (
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
        )}
        <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white px-4">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-white/20">
                    <Plane size={14}/> Final Itinerary
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter drop-shadow-2xl">{trip.title}</h1>
                <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-black uppercase tracking-widest text-indigo-100">
                    <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10"><Calendar size={18} className="text-indigo-400"/> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10"><MapPin size={18} className="text-indigo-400"/> {trip.stops?.length || 0} Cities</div>
                    <div className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-900/50"><DollarSign size={18}/> Total Est: ${totalCost}</div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">
        
        {/* Modern Action Bar */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl border border-gray-100 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                <button 
                    onClick={() => setViewMode('cities')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'cities' ? 'bg-white shadow-lg text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <MapPin size={16}/> City View
                </button>
                <button 
                    onClick={() => setViewMode('timeline')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'timeline' ? 'bg-white shadow-lg text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Layers size={16}/> Timeline View
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden sm:flex gap-1">
                    <button className="p-4 hover:bg-indigo-50 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"><Share2 size={20}/></button>
                    <button className="p-4 hover:bg-indigo-50 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100"><Download size={20}/></button>
                </div>
                <div className="w-px h-10 bg-gray-100 mx-2 hidden sm:block"></div>
                <button 
                  onClick={() => navigate(`/trips/${id}/builder`)}
                  className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-[0.2em] text-[10px]"
                >
                    <Edit3 size={18}/> Customize Plan
                </button>
            </div>
        </div>

        {/* Content Section */}
        {(!trip.stops || trip.stops.length === 0) ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 animate-in fade-in duration-1000">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Navigation className="h-12 w-12 text-indigo-300" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Your Map is Blank</h3>
                <p className="mt-4 text-gray-400 max-w-sm mx-auto font-bold leading-relaxed">Let's start building your dream itinerary. Every great journey begins with a single destination.</p>
                <button 
                    onClick={() => navigate(`/trips/${id}/builder`)}
                    className="mt-12 px-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
                >
                    Add Your First Stop
                </button>
            </div>
        ) : viewMode === 'cities' ? (
            <div className="space-y-20">
                {trip.stops.map((stop, index) => (
                    <div key={stop._id} className="relative animate-in fade-in slide-in-from-bottom-12 duration-700">
                        {/* City Header Card */}
                        <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="flex flex-col lg:flex-row">
                                {/* Left Side: City Info */}
                                <div className="p-12 flex-1 relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-100">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] block mb-1">Destination Header</span>
                                                <h2 className="text-5xl font-black text-gray-900 tracking-tighter">{stop.city}</h2>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mb-12">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                                                <Calendar size={14} className="text-indigo-400"/> Arrive: {new Date(stop.arrivalDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                                                <Calendar size={14} className="text-indigo-400"/> Depart: {new Date(stop.departureDate).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Activity Blocks */}
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between px-2">
                                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Activity size={18} className="text-indigo-500"/> Activity Blocks
                                                </h3>
                                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">{stop.activities?.length || 0} TOTAL</span>
                                            </div>

                                            {(!stop.activities || stop.activities.length === 0) ? (
                                                <div className="p-10 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center">
                                                    <p className="text-gray-400 font-black text-sm italic">No events mapped for this city.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {stop.activities.map((activity, aIdx) => (
                                                        <div key={aIdx} className="group/item flex flex-col p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-500 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-500">
                                                                    <Navigation size={22}/>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">{activity.type || 'Activity'}</span>
                                                                </div>
                                                            </div>
                                                            <h4 className="text-lg font-black text-gray-900 mb-2 leading-tight">{activity.name}</h4>
                                                            <p className="text-xs text-gray-400 font-bold line-clamp-2 mb-6 leading-relaxed flex-1">{activity.description || 'Enjoy the local scenery and culture.'}</p>
                                                            
                                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase">
                                                                    <Clock size={14} className="text-indigo-400"/> {activity.duration || 60} MIN
                                                                </div>
                                                                <div className="flex items-center gap-1 text-sm font-black text-gray-900">
                                                                    <span className="text-xs text-green-500">$</span>{activity.cost || 0}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Visual Sidebar */}
                                <div className="w-full lg:w-96 bg-gray-50/80 p-12 border-l border-gray-100 flex flex-col justify-between relative">
                                    <div className="space-y-10">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Logistics & Stats</p>
                                            <div className="space-y-4">
                                                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 group/stat hover:-translate-y-1 transition-all">
                                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><DollarSign size={24}/></div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. City Cost</p>
                                                        <p className="text-2xl font-black text-gray-900">${stop.activities?.reduce((sum, a) => sum + (a.cost || 0), 0) || 0}</p>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 group/stat hover:-translate-y-1 transition-all">
                                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center"><Clock size={24}/></div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Duration</p>
                                                        <p className="text-2xl font-black text-gray-900">{Math.round((stop.activities?.reduce((sum, a) => sum + (a.duration || 0), 0) || 0) / 60)}h</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group/hint">
                                            <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Info size={14}/> Travel Insight
                                            </h4>
                                            <p className="text-sm font-bold leading-relaxed text-indigo-50">
                                                Based on your arrival in {stop.city}, we recommend checking in early to avoid the peak tourism rush at local landmarks.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <button className="mt-12 group/btn flex items-center justify-center gap-4 w-full py-5 bg-white hover:bg-gray-900 border-2 border-gray-100 hover:border-gray-900 rounded-[1.5rem] text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest transition-all duration-500 shadow-sm hover:shadow-2xl active:scale-95">
                                        Location Details <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-2"/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Connection Line */}
                        {index !== trip.stops.length - 1 && (
                            <div className="flex flex-col items-center py-8">
                                <div className="w-1 h-20 bg-gradient-to-b from-indigo-200 via-indigo-100 to-transparent rounded-full"></div>
                                <div className="w-10 h-10 bg-white rounded-full shadow-lg border-2 border-indigo-100 flex items-center justify-center animate-bounce mt-[-1rem]">
                                    <Plane size={16} className="text-indigo-400 rotate-90" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-gray-100 animate-in fade-in duration-700">
                <div className="space-y-16 relative">
                    <div className="absolute left-6 top-0 bottom-0 w-1 bg-indigo-50 rounded-full"></div>
                    {trip.stops.map((stop, sIdx) => (
                        <div key={stop._id} className="relative pl-16">
                            <div className="absolute left-0 top-0 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg z-10">
                                {sIdx + 1}
                            </div>
                            <div className="mb-8">
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stop.city}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">{new Date(stop.arrivalDate).toLocaleDateString()} - {new Date(stop.departureDate).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-4">
                                {stop.activities?.map((activity, aIdx) => (
                                    <div key={aIdx} className="flex items-center justify-between p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100 hover:bg-white hover:shadow-xl transition-all group/item">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all"><Navigation size={20}/></div>
                                            <div>
                                                <h4 className="font-black text-lg text-gray-800 leading-none mb-1">{activity.name}</h4>
                                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{activity.type}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8 text-right">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Time</p>
                                                <p className="text-sm font-black text-gray-800">{activity.duration || 0} MIN</p>
                                            </div>
                                            <div className="w-px h-8 bg-gray-100"></div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Cost</p>
                                                <p className="text-sm font-black text-indigo-600">${activity.cost || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryView;
