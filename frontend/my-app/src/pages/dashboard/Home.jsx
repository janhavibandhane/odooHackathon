import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Map, 
  Calendar, 
  Plus, 
  Compass, 
  Heart, 
  Clock, 
  MapPin, 
  ArrowRight
} from 'lucide-react';
import { tripService } from '../../services/apiService';
import { toast } from 'react-toastify';

const RECOMMENDED_CITIES = [
  { name: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600' },
  { name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600' },
  { name: 'Cape Town', country: 'South Africa', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=600' }
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect admin to Admin Dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const trips = await tripService.getMyTrips();
        // Sort by start date, only future trips, take top 3
        const sorted = trips
          .filter(t => new Date(t.startDate) >= new Date())
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
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 shadow-xl text-white">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome back, {user?.name || 'Traveler'}! ✈️
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl">
            Where to next? The world is yours to explore. Plan your dream trip or discover new destinations.
          </p>
        </div>
        <button 
          onClick={() => navigate('/trips/create')}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" />
          Plan New Trip
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upcoming Trips */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-indigo-600" /> 
              Upcoming Trips
            </h2>
            <button 
              onClick={() => navigate('/trips')}
              className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center text-sm"
            >
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="skeleton h-32 w-full rounded-2xl"></div>
              ))}
            </div>
          ) : upcomingTrips.length > 0 ? (
            <div className="grid gap-6">
              {upcomingTrips.map(trip => (
                <div 
                  key={trip._id}
                  onClick={() => navigate(`/trips/${trip._id}/view`)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-6 cursor-pointer hover:shadow-md transition-shadow group"
                >
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                    {trip.coverPhoto ? (
                      <img src={trip.coverPhoto} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Map className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{trip.title}</h3>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md font-semibold">Upcoming</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {formatDate(trip.startDate)}</div>
                      <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {trip.destinations?.length || 0} Stops</div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-gray-400">Planning Progress</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trips/${trip._id}/builder`);
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                      >
                        Edit Plan <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="bg-indigo-50 p-4 rounded-full mb-4">
                <Compass className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming trips</h3>
              <p className="text-gray-500 mb-6 max-w-md">You don't have any future trips planned yet. Start dreaming and build your first itinerary!</p>
              <button 
                onClick={() => navigate('/trips/create')}
                className="btn bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Create a Trip
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Quick Actions & Inspiration */}
        <div className="space-y-8">
          {/* Quick Explore */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Compass className="w-5 h-5 mr-2 text-indigo-600" />
              Explore Module
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/explore/cities')}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-gray-100"
              >
                <MapPin className="w-8 h-8 mb-2 text-gray-400" />
                <span className="font-medium text-sm">Find Cities</span>
              </button>
              <button 
                onClick={() => navigate('/explore/activities')}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-gray-100"
              >
                <Heart className="w-8 h-8 mb-2 text-gray-400" />
                <span className="font-medium text-sm">Activities</span>
              </button>
            </div>
          </div>

          {/* Inspiration */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
              Recommended for you
            </h3>
            <div className="space-y-4">
              {RECOMMENDED_CITIES.map(city => (
                <div 
                  key={city.name}
                  onClick={() => navigate('/explore/cities', { state: { search: city.name } })}
                  className="relative h-24 rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <p className="font-bold">{city.name}</p>
                    <p className="text-xs text-gray-300">{city.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;