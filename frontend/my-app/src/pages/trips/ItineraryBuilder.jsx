import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, MapPin, Calendar, Trash2, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';

import { tripService, stopService, activityService } from '../../services/apiService';

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
  const [newActivity, setNewActivity] = useState({ title: '', type: 'General', cost: 0, duration: 60, description: '' });

  useEffect(() => {
    fetchTripData();
  }, [id, user.token]);

  const fetchTripData = async () => {
    setIsLoading(true);
    try {
      // Fetch trip details
      const tripData = await tripService.getTripById(id);
      setTrip(tripData);

      // Fetch stops
      try {
        const stopsData = await stopService.getStopsForTrip(id);
        setStops(stopsData);
        
        // Fetch activities for each stop
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
      setShowStopForm(false);
      setNewStop({ city: '', country: '', arrivalDate: '', departureDate: '' });
      toast.success('Stop added!');
    } catch (error) {
      toast.error(error.message || 'Failed to add stop');
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Are you sure you want to delete this stop and all its activities?')) return;
    
    try {
      await stopService.deleteStop(id, stopId);
      
      setStops(stops.filter(s => s._id !== stopId));
      const newActivities = { ...activities };
      delete newActivities[stopId];
      setActivities(newActivities);
      toast.success('Stop deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete stop');
    }
  };

  const handleMoveStop = async (index, direction) => {
    if (
      (direction === -1 && index === 0) || 
      (direction === 1 && index === stops.length - 1)
    ) return;

    const newStops = [...stops];
    const targetIndex = index + direction;
    
    // Swap order values
    const tempOrder = newStops[index].order;
    newStops[index].order = newStops[targetIndex].order;
    newStops[targetIndex].order = tempOrder;

    // Swap positions in array
    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    setStops(newStops);

    try {
      await stopService.updateStop(id, newStops[index]._id, { order: newStops[index].order });
      await stopService.updateStop(id, newStops[targetIndex]._id, { order: newStops[targetIndex].order });
    } catch (error) {
      toast.error('Failed to save new order');
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
      setNewActivity({ title: '', type: 'General', cost: 0, duration: 60, description: '' });
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
      toast.success('Activity deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete activity');
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><span className="loading loading-spinner text-indigo-600"></span></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Itinerary Builder: {trip?.title}</h1>
          <div className="flex items-center text-gray-500 gap-4">
            <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(trip?.startDate).toLocaleDateString()} - {new Date(trip?.endDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/trips/${id}/view`)} className="btn btn-outline btn-primary">
            View Final Itinerary <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Stops Timeline */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><MapPin className="text-indigo-500"/> Destinations</h2>
              <button onClick={() => setShowStopForm(!showStopForm)} className="btn btn-circle btn-sm btn-ghost text-indigo-600">
                <Plus size={20} />
              </button>
            </div>

            {showStopForm && (
              <form onSubmit={handleAddStop} className="mb-6 bg-indigo-50 p-4 rounded-xl space-y-3">
                <input required type="text" placeholder="City" className="input input-bordered input-sm w-full" value={newStop.city} onChange={e => setNewStop({...newStop, city: e.target.value})} />
                <input required type="text" placeholder="Country" className="input input-bordered input-sm w-full" value={newStop.country} onChange={e => setNewStop({...newStop, country: e.target.value})} />
                <div className="flex gap-2">
                  <input required type="date" className="input input-bordered input-sm w-full" value={newStop.arrivalDate} onChange={e => setNewStop({...newStop, arrivalDate: e.target.value})} />
                  <input required type="date" className="input input-bordered input-sm w-full" value={newStop.departureDate} onChange={e => setNewStop({...newStop, departureDate: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setShowStopForm(false)} className="btn btn-xs btn-ghost">Cancel</button>
                  <button type="submit" className="btn btn-xs btn-primary">Add</button>
                </div>
              </form>
            )}

            <ul className="steps steps-vertical w-full">
              {stops.map((stop, index) => (
                <li key={stop._id} className={`step ${activeStopId === stop._id ? 'step-primary' : 'step-neutral'} cursor-pointer w-full text-left`} onClick={() => setActiveStopId(stop._id)}>
                  <div className={`p-3 rounded-xl w-full flex justify-between items-center transition-colors ${activeStopId === stop._id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50'}`}>
                    <div className="flex flex-col gap-1 mr-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMoveStop(index, -1); }} 
                        disabled={index === 0}
                        className="text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMoveStop(index, 1); }} 
                        disabled={index === stops.length - 1}
                        className="text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{stop.city}, {stop.country}</h3>
                      <p className="text-xs text-gray-500">{new Date(stop.arrivalDate).toLocaleDateString()} - {new Date(stop.departureDate).toLocaleDateString()}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteStop(stop._id); }} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
              {stops.length === 0 && !showStopForm && (
                <div className="text-center py-8 text-gray-500 text-sm">No destinations added yet.<br/>Click + to add your first stop!</div>
              )}
            </ul>
          </div>
        </div>

        {/* Right Column: Activities for Selected Stop */}
        <div className="lg:w-2/3">
          {activeStopId ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  Things to do in {stops.find(s => s._id === activeStopId)?.city}
                </h2>
                <button onClick={() => setShowActivityForm(!showActivityForm)} className="btn btn-sm btn-primary">
                  <Plus size={16} /> Add Activity
                </button>
              </div>

              {showActivityForm && (
                <form onSubmit={handleAddActivity} className="mb-8 bg-gray-50 border border-gray-200 p-5 rounded-xl">
                  <h3 className="font-bold mb-4 text-gray-700">New Activity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="label py-1"><span className="label-text text-xs font-semibold">Title</span></label>
                      <input required type="text" className="input input-bordered w-full" value={newActivity.title} onChange={e => setNewActivity({...newActivity, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="label py-1"><span className="label-text text-xs font-semibold">Type</span></label>
                      <select className="select select-bordered w-full" value={newActivity.type} onChange={e => setNewActivity({...newActivity, type: e.target.value})}>
                        <option>Sightseeing</option>
                        <option>Food</option>
                        <option>Adventure</option>
                        <option>Relaxation</option>
                        <option>General</option>
                      </select>
                    </div>
                    <div>
                      <label className="label py-1"><span className="label-text text-xs font-semibold">Cost (USD)</span></label>
                      <input type="number" min="0" className="input input-bordered w-full" value={newActivity.cost} onChange={e => setNewActivity({...newActivity, cost: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="label py-1"><span className="label-text text-xs font-semibold">Duration (minutes)</span></label>
                      <input type="number" min="0" step="15" className="input input-bordered w-full" value={newActivity.duration} onChange={e => setNewActivity({...newActivity, duration: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="label py-1"><span className="label-text text-xs font-semibold">Description</span></label>
                    <textarea className="textarea textarea-bordered w-full" value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})}></textarea>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowActivityForm(false)} className="btn btn-ghost">Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Activity</button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {activities[activeStopId]?.length > 0 ? (
                  activities[activeStopId].map(activity => (
                    <div key={activity._id} className="flex border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="w-2 bg-indigo-500"></div>
                      <div className="flex-1 p-4 flex justify-between items-center bg-white">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="badge badge-sm badge-outline text-indigo-600">{activity.type}</span>
                            <h4 className="font-bold text-gray-900">{activity.title}</h4>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">{activity.description}</p>
                          <div className="flex gap-4 mt-2 text-xs font-medium text-gray-400">
                            <span>⏱ {activity.duration} min</span>
                            <span>💵 ${activity.cost}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteActivity(activity._id, activeStopId)} className="btn btn-circle btn-ghost btn-sm text-gray-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 mb-2">No activities planned here yet.</p>
                    <button onClick={() => setShowActivityForm(true)} className="btn btn-sm btn-outline btn-primary">Add an activity</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
              <MapPin size={48} className="text-indigo-300 mb-4" />
              <h3 className="text-xl font-bold text-indigo-900 mb-2">Select a Destination</h3>
              <p className="text-indigo-700/70">Click on a stop in your timeline to view and manage its activities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;
