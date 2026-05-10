import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, IndianRupee, Filter, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../../services/geminiService';
import { tripService, stopService, activityService } from '../../services/apiService';
import { toast } from 'react-toastify';

const MOCK_ACTIVITIES = [
  { id: 1, title: 'Taj Mahal Sunrise Tour', city: 'Agra', type: 'History', cost: 1200, duration: 180, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=600' },
  { id: 2, title: 'Old Delhi Food Walk', city: 'New Delhi', type: 'Food', cost: 850, duration: 150, image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=600' },
  { id: 3, title: 'Amber Fort Heritage Tour', city: 'Jaipur', type: 'History', cost: 900, duration: 240, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=600' },
  { id: 4, title: 'Marine Drive Evening Cycling', city: 'Mumbai', type: 'Active', cost: 500, duration: 120, image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&q=80&w=600' },
];

const CATEGORIES = ['All', 'Sightseeing', 'Food', 'History', 'Active', 'Nature', 'Adventure'];

const ActivitySearch = () => {
  const [searchTerm, setSearchTerm] = useState(''); // e.g. "Tokyo"
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityToAdd, setActivityToAdd] = useState(null);
  const [myTrips, setMyTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [tripStops, setTripStops] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setActivities(MOCK_ACTIVITIES);
      return;
    }

    setIsSearching(true);
    try {
      const type = selectedCategory === 'All' ? 'Popular' : selectedCategory;
      const results = await geminiService.searchActivities(searchTerm, type);
      // Gemini doesn't always provide image URLs in our prompt for activities, so we add a generic placeholder or keep it simple
      const enrichedResults = results.map(r => ({
        ...r,
        city: searchTerm, // Attach the searched city
        image: `https://source.unsplash.com/600x400/?${encodeURIComponent(r.type + ' ' + searchTerm)}`
      }));
      setActivities(enrichedResults);
    } catch (error) {
      toast.error(error.message);
      // Fallback
      setActivities(MOCK_ACTIVITIES);
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenAddModal = async (activity) => {
    setActivityToAdd(activity);
    setIsModalOpen(true);
    try {
      const trips = await tripService.getMyTrips();
      setMyTrips(trips);
      if (trips.length > 0) {
        setSelectedTripId(trips[0]._id);
        loadStopsForTrip(trips[0]._id);
      }
    } catch (error) {
      toast.error("Failed to load trips");
    }
  };

  const loadStopsForTrip = async (tripId) => {
    try {
      const stops = await stopService.getStopsForTrip(tripId);
      setTripStops(stops);
      if (stops.length > 0) {
        setSelectedStopId(stops[0]._id);
      } else {
        setSelectedStopId('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTripChange = (e) => {
    const tId = e.target.value;
    setSelectedTripId(tId);
    loadStopsForTrip(tId);
  };

  const handleConfirmAdd = async () => {
    if (!selectedStopId) return toast.error("Please select a destination stop.");
    setIsAdding(true);
    try {
      await activityService.createActivity(selectedStopId, {
        title: activityToAdd.title,
        type: activityToAdd.type,
        cost: activityToAdd.cost || 0,
        duration: activityToAdd.duration || 60,
        description: activityToAdd.description || ''
      });
      toast.success("Activity added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to add activity");
    } finally {
      setIsAdding(false);
    }
  };

  const displayedActivities = selectedCategory === 'All' 
    ? activities 
    : activities.filter(a => a.type?.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Things to Do</h1>
          <p className="mt-1 text-sm text-gray-500">Discover and add amazing AI-generated experiences to your trips.</p>
        </div>
        
        <div className="flex-1 max-w-md w-full">
          <form onSubmit={handleSearch} className="relative flex items-center shadow-sm rounded-md overflow-hidden">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-24 py-2 border-y border-l border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter a city to explore..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={isSearching}
              className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 rounded-r-md border border-indigo-600"
            >
              {isSearching ? <span className="loading loading-spinner loading-xs"></span> : <><Sparkles className="w-4 h-4 mr-1"/> AI</>}
            </button>
          </form>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
        <div className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mr-2">
          <Filter className="w-4 h-4 mr-1" /> Filters
        </div>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isSearching ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex flex-col gap-4">
              <div className="skeleton h-48 w-full rounded-xl"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedActivities.map((activity, index) => (
            <div key={activity.id || index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 w-full relative bg-gray-200">
                <img src={activity.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600"} alt={activity.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  {activity.type}
                </span>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{activity.title}</h3>
                {activity.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{activity.description}</p>}
                
                <div className="mt-auto space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {activity.city}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {activity.duration} mins
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center text-lg font-bold text-gray-900">
                    <IndianRupee className="w-4 h-4 text-gray-500" />{activity.cost}
                  </div>
                  <button 
                    onClick={() => handleOpenAddModal(activity)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors"
                  >
                    Add to Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isSearching && displayedActivities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 mt-4">
          <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No activities found</h3>
          <p className="mt-1 text-gray-500">Try selecting a different category or searching.</p>
          <button 
            onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
            className="mt-4 text-indigo-600 font-medium hover:text-indigo-800"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <dialog open className="modal modal-open bg-black/40 backdrop-blur-sm">
          <div className="modal-box bg-white rounded-3xl p-8 max-w-md">
            <h3 className="font-black text-2xl text-gray-900 mb-2">Add to Trip</h3>
            <p className="text-gray-500 font-medium text-sm mb-6">Choose where you'd like to add <span className="text-indigo-600 font-bold">{activityToAdd?.title}</span>.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Trip</label>
                <select 
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all shadow-sm mt-1"
                  value={selectedTripId}
                  onChange={handleTripChange}
                >
                  <option value="" disabled>Select a trip</option>
                  {myTrips.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                </select>
                {myTrips.length === 0 && <p className="text-xs text-red-500 mt-1">You don't have any trips yet.</p>}
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Destination (Stop)</label>
                <select 
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all shadow-sm mt-1 disabled:opacity-50"
                  value={selectedStopId}
                  onChange={e => setSelectedStopId(e.target.value)}
                  disabled={!selectedTripId || tripStops.length === 0}
                >
                  <option value="" disabled>Select a destination</option>
                  {tripStops.map(s => <option key={s._id} value={s._id}>{s.city}, {s.country}</option>)}
                </select>
                {selectedTripId && tripStops.length === 0 && <p className="text-xs text-orange-500 mt-1">This trip has no destinations. Please add a destination to the trip first.</p>}
              </div>
            </div>

            <div className="modal-action mt-8 flex gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost flex-1 rounded-xl">Cancel</button>
              <button 
                type="button" 
                onClick={handleConfirmAdd} 
                disabled={isAdding || !selectedStopId}
                className="btn btn-primary flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 border-none text-white font-bold disabled:opacity-50"
              >
                {isAdding ? <span className="loading loading-spinner loading-xs"></span> : 'Add Activity'}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ActivitySearch;

