import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Trash2, 
  ArrowRight, 
  ChevronUp, 
  ChevronDown, 
  Navigation,
  Clock,
  DollarSign,
  Info,
  Layout,
  Flag
} from 'lucide-react';

import { tripService, stopService, activityService } from '../../services/apiService';
import TripTabs from '../../components/trips/TripTabs';

const ItineraryBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [showStopForm, setShowStopForm] = useState(false);
  const [newStop, setNewStop] = useState({ city: '', country: '', arrivalDate: '', departureDate: '' });

  const [activeStopId, setActiveStopId] = useState(null);
  const [activities, setActivities] = useState({}); // { stopId: [activities] }
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', type: 'Sightseeing', cost: 0, duration: 60, description: '' });

  useEffect(() => {
    fetchTripData();
  }, [id, user.token]);

  const fetchTripData = async () => {
    setIsLoading(true);
    try {
      const tripData = await tripService.getTripById(id);
      setTrip(tripData);

      try {
        const stopsData = await stopService.getStopsForTrip(id);
        setStops(stopsData);
        if (stopsData.length > 0 && !activeStopId) {
            setActiveStopId(stopsData[0]._id);
        }
        
        const activitiesMap = {};
        for (const stop of stopsData) {
          try {
            activitiesMap[stop._id] = await activityService.getActivitiesForStop(stop._id);
          } catch (err) {
            console.error(`Failed to load activities for stop ${stop._id}`);
          }
        }
        setActivities(activitiesMap);
      } catch (err) {
        console.error("Failed to load stops or activities", err);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch trip data');
      navigate('/trips');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    try {
      const addedStop = await stopService.createStop(id, { ...newStop, order: stops.length });
      setStops([...stops, addedStop]);
      setActivities({ ...activities, [addedStop._id]: [] });
      setActiveStopId(addedStop._id);
      setShowStopForm(false);
      setNewStop({ city: '', country: '', arrivalDate: '', departureDate: '' });
      toast.success('Destination added!');
    } catch (error) {
      toast.error(error.message || 'Failed to add stop');
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await stopService.deleteStop(id, stopId);
      setStops(stops.filter(s => s._id !== stopId));
      if (activeStopId === stopId) setActiveStopId(null);
      toast.success('Destination removed');
    } catch (error) {
      toast.error(error.message || 'Failed to delete stop');
    }
  };

  const handleMoveStop = async (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === stops.length - 1)) return;
    const newStops = [...stops];
    const targetIndex = index + direction;
    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;
    setStops(newStops);
    try {
      await stopService.updateStop(id, newStops[index]._id, { order: index });
      await stopService.updateStop(id, newStops[targetIndex]._id, { order: targetIndex });
    } catch (error) {
      toast.error('Failed to save order');
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const addedActivity = await activityService.createActivity(activeStopId, newActivity);
      setActivities({
        ...activities,
        [activeStopId]: [...(activities[activeStopId] || []), addedActivity]
      });
      setShowActivityForm(false);
      setNewActivity({ title: '', type: 'Sightseeing', cost: 0, duration: 60, description: '' });
      toast.success('Activity added!');
    } catch (error) {
      toast.error(error.message || 'Failed to add activity');
    }
  };

  const handleDeleteActivity = async (activityId, stopId) => {
    try {
      await activityService.deleteActivity(activityId);
      setActivities({
        ...activities,
        [stopId]: activities[stopId].filter(a => a._id !== activityId)
      });
      toast.success('Activity removed');
    } catch (error) {
      toast.error(error.message || 'Failed to delete activity');
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-gray-50"><span className="loading loading-spinner loading-lg text-indigo-600"></span></div>;

  const activeStop = stops.find(s => s._id === activeStopId);

  return (
    <div className="bg-gray-50 min-h-screen">
      <TripTabs />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header workspace */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <Layout size={14}/> Planning Workspace
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{trip?.title}</h1>
            <p className="text-gray-400 font-bold mt-1">Building the ultimate adventure for you.</p>
          </div>
          <button 
            onClick={() => navigate(`/trips/${id}/view`)} 
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            Review Full Itinerary <ArrowRight size={18} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Destinations */}
          <div className="lg:w-[380px] shrink-0">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="flex justify-between items-center mb-8 px-2">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <Flag className="text-indigo-500" size={24}/> Route
                </h2>
                <button 
                    onClick={() => setShowStopForm(!showStopForm)} 
                    className="w-10 h-10 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
                >
                  <Plus size={24} />
                </button>
              </div>

              {showStopForm && (
                <div className="mb-8 bg-indigo-50 p-6 rounded-[1.5rem] border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-4">Add Destination</h3>
                    <form onSubmit={handleAddStop} className="space-y-4">
                        <input required type="text" placeholder="City Name" className="w-full bg-white border-2 border-transparent focus:border-indigo-200 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all" value={newStop.city} onChange={e => setNewStop({...newStop, city: e.target.value})} />
                        <input required type="text" placeholder="Country" className="w-full bg-white border-2 border-transparent focus:border-indigo-200 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all" value={newStop.country} onChange={e => setNewStop({...newStop, country: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                            <input required type="date" className="bg-white border-2 border-transparent focus:border-indigo-200 rounded-xl px-3 py-3 text-xs font-bold outline-none transition-all" value={newStop.arrivalDate} onChange={e => setNewStop({...newStop, arrivalDate: e.target.value})} />
                            <input required type="date" className="bg-white border-2 border-transparent focus:border-indigo-200 rounded-xl px-3 py-3 text-xs font-bold outline-none transition-all" value={newStop.departureDate} onChange={e => setNewStop({...newStop, departureDate: e.target.value})} />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setShowStopForm(false)} className="flex-1 py-3 text-xs font-black text-indigo-400 hover:bg-white rounded-xl transition-all">CANCEL</button>
                            <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs shadow-lg shadow-indigo-100">ADD STOP</button>
                        </div>
                    </form>
                </div>
              )}

              <div className="space-y-3">
                {stops.map((stop, index) => (
                  <div 
                    key={stop._id} 
                    className={`group relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${activeStopId === stop._id ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-white border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/30'}`}
                    onClick={() => setActiveStopId(stop._id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${activeStopId === stop._id ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                {index + 1}
                            </div>
                            <h3 className={`font-black text-lg tracking-tight ${activeStopId === stop._id ? 'text-white' : 'text-gray-900'}`}>{stop.city}</h3>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex flex-col">
                                <button onClick={(e) => { e.stopPropagation(); handleMoveStop(index, -1); }} disabled={index === 0} className={`p-1 hover:bg-white/20 rounded ${activeStopId === stop._id ? 'text-white' : 'text-indigo-400'} disabled:opacity-20`}><ChevronUp size={14}/></button>
                                <button onClick={(e) => { e.stopPropagation(); handleMoveStop(index, 1); }} disabled={index === stops.length - 1} className={`p-1 hover:bg-white/20 rounded ${activeStopId === stop._id ? 'text-white' : 'text-indigo-400'} disabled:opacity-20`}><ChevronDown size={14}/></button>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteStop(stop._id); }} className={`p-2 hover:bg-red-500 hover:text-white rounded-xl transition-all ${activeStopId === stop._id ? 'text-white/50' : 'text-gray-300'}`}><Trash2 size={16}/></button>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${activeStopId === stop._id ? 'text-indigo-100' : 'text-gray-400'}`}>
                        <Calendar size={12}/> {new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
                
                {stops.length === 0 && !showStopForm && (
                  <div className="p-12 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                    <MapPin size={32} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold text-sm">No destinations yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Activities Workspace */}
          <div className="flex-1">
            {activeStopId ? (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b border-gray-50">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-widest mb-2">
                        <MapPin size={14}/> {activeStop?.country}
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                      Experience {activeStop?.city}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowActivityForm(!showActivityForm)} 
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                  >
                    <Plus size={18} /> New Activity
                  </button>
                </div>

                {showActivityForm && (
                  <div className="mb-12 bg-gray-50 rounded-[2rem] p-8 border border-gray-100 shadow-inner animate-in fade-in slide-in-from-top-6 duration-500">
                    <h3 className="text-lg font-black text-gray-900 mb-6">Plan an Event</h3>
                    <form onSubmit={handleAddActivity} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                          <input required type="text" className="w-full bg-white border-2 border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all shadow-sm" value={newActivity.title} onChange={e => setNewActivity({...newActivity, title: e.target.value})} placeholder="e.g. Visit the Eiffel Tower" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                          <select className="w-full bg-white border-2 border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all shadow-sm" value={newActivity.type} onChange={e => setNewActivity({...newActivity, type: e.target.value})}>
                            <option>Sightseeing</option>
                            <option>Food</option>
                            <option>Adventure</option>
                            <option>Relaxation</option>
                            <option>Transport</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estimated Cost ($)</label>
                          <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-black">$</div>
                            <input type="number" min="0" className="w-full bg-white border-2 border-transparent focus:border-indigo-100 rounded-2xl pl-10 pr-5 py-4 text-sm font-bold outline-none transition-all shadow-sm" value={newActivity.cost} onChange={e => setNewActivity({...newActivity, cost: Number(e.target.value)})} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration (Min)</label>
                          <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-black"><Clock size={16}/></div>
                            <input type="number" min="0" step="15" className="w-full bg-white border-2 border-transparent focus:border-indigo-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold outline-none transition-all shadow-sm" value={newActivity.duration} onChange={e => setNewActivity({...newActivity, duration: Number(e.target.value)})} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes / Description</label>
                        <textarea className="w-full bg-white border-2 border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none transition-all shadow-sm min-h-[120px]" value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} placeholder="Any specific details or booking info..."></textarea>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setShowActivityForm(false)} className="px-8 py-3 text-xs font-black text-gray-400 hover:bg-white rounded-2xl transition-all uppercase tracking-widest">Discard</button>
                        <button type="submit" className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100">Confirm Event</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-4">
                  {activities[activeStopId]?.length > 0 ? (
                    activities[activeStopId].map(activity => (
                      <div key={activity._id} className="group flex bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                        <div className="w-3 bg-indigo-500 group-hover:w-4 transition-all"></div>
                        <div className="flex-1 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest border border-indigo-100">{activity.type}</span>
                              <h4 className="font-black text-xl text-gray-900 tracking-tight">{activity.title}</h4>
                            </div>
                            <p className="text-sm text-gray-400 font-medium line-clamp-1 mt-1">{activity.description || 'No description provided.'}</p>
                            <div className="flex gap-6 mt-4">
                              <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                <Clock size={14} className="text-indigo-300"/> {activity.duration} MIN
                              </div>
                              <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                <DollarSign size={14} className="text-green-400"/> ${activity.cost}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteActivity(activity._id, activeStopId)} 
                            className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-100 text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                        <Navigation size={32} className="text-indigo-200" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">What's the plan?</h3>
                      <p className="text-gray-400 font-bold mt-2 max-w-xs mx-auto">Click "New Activity" to start filling your time in {activeStop?.city} with amazing memories.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] border-2 border-gray-50 p-20 text-center h-full flex flex-col items-center justify-center min-h-[500px] shadow-sm">
                <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
                    <Info size={64} className="text-indigo-300" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Select a Destination</h3>
                <p className="text-gray-400 font-bold max-w-md mx-auto leading-relaxed">Choose a city from your route on the left to start adding activities, tours, and dining experiences.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
