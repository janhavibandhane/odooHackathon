import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Calendar, MapPin, ArrowRight, Trash2 } from 'lucide-react';

import { tripService } from '../../services/apiService';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getMyTrips();
        setTrips(data);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch trips');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [user.token]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg text-indigo-600"></span></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and view all your travel itineraries.</p>
        </div>
        <button
          onClick={() => navigate('/trips/create')}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Plan New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No trips planned yet</h3>
          <p className="mt-2 text-sm text-gray-500">Get started by creating a new trip itinerary.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/trips/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Trip
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <div key={trip._id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="h-48 w-full bg-gray-200 relative">
                {trip.coverPhoto ? (
                  <img src={trip.coverPhoto} alt={trip.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-white/50" />
                  </div>
                )}
                {trip.isPublic && (
                  <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Shared
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{trip.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <span>
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/trips/${trip._id}/builder`)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    Edit Itinerary
                  </button>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this trip?')) {
                          try {
                            await tripService.deleteTrip(trip._id);
                            setTrips(trips.filter(t => t._id !== trip._id));
                            toast.success('Trip deleted successfully');
                          } catch (error) {
                            toast.error('Failed to delete trip');
                          }
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/trips/${trip._id}/view`)}
                      className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 group-hover:translate-x-1 transition-transform"
                    >
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
