import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Calendar, Clock, DollarSign, Share2, Printer, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFullTrip = async () => {
      try {
        const tripRes = await fetch(`http://localhost:3001/api/trips/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (!tripRes.ok) throw new Error('Trip not found');
        const tripData = await tripRes.json();
        setTrip(tripData);

        const stopsRes = await fetch(`http://localhost:3001/api/trips/${id}/stops`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (stopsRes.ok) {
          const stopsData = await stopsRes.json();
          setStops(stopsData);
          
          const activitiesMap = {};
          for (const stop of stopsData) {
            const actRes = await fetch(`http://localhost:3001/api/stops/${stop._id}/activities`, {
              headers: { Authorization: `Bearer ${user.token}` }
            });
            if (actRes.ok) {
              activitiesMap[stop._id] = await actRes.json();
            }
          }
          setActivities(activitiesMap);
        }
      } catch (error) {
        toast.error('Failed to load itinerary details.');
        navigate('/trips');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullTrip();
  }, [id, user.token, navigate]);

  if (isLoading) return <div className="flex justify-center p-12"><span className="loading loading-spinner text-indigo-600"></span></div>;
  if (!trip) return <div>Trip not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(`/trips/${id}/builder`)} className="btn btn-ghost btn-sm text-gray-500">
          <ArrowLeft size={16} /> Back to Editor
        </button>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm"><Printer size={16}/> Print</button>
          <button className="btn btn-primary btn-sm"><Share2 size={16}/> Share</button>
        </div>
      </div>

      {/* Header Cover */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 mb-8 relative">
        <div className="h-64 bg-gray-200 relative">
          {trip.coverPhoto ? (
            <img src={trip.coverPhoto} alt={trip.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
          )}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-6 left-8 right-8 text-white">
            <h1 className="text-4xl font-extrabold mb-2">{trip.title}</h1>
            <p className="text-lg opacity-90 flex items-center gap-2">
              <Calendar size={20}/>
              {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - 
              {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        {trip.description && (
          <div className="p-6 bg-white">
            <p className="text-gray-600 text-lg leading-relaxed">{trip.description}</p>
          </div>
        )}
      </div>

      {/* Itinerary Body */}
      <div className="space-y-12">
        {stops.map((stop, index) => (
          <div key={stop._id} className="relative pl-8 md:pl-0">
            
            {/* Timeline Line (Mobile only) */}
            <div className="md:hidden absolute left-[15px] top-8 bottom-[-3rem] w-0.5 bg-indigo-100 z-0"></div>

            <div className="md:grid md:grid-cols-12 gap-6 items-start">
              
              {/* Date Column (Left side on desktop, hidden on mobile) */}
              <div className="hidden md:block col-span-3 text-right pr-6 pt-2 relative">
                <h3 className="text-xl font-bold text-indigo-600">{new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
                <p className="text-sm text-gray-500">to {new Date(stop.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                {/* Desktop Timeline Dot & Line */}
                <div className="absolute right-[-7px] top-4 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-50 z-10"></div>
                {index !== stops.length - 1 && (
                  <div className="absolute right-[calc(-1px)] top-8 bottom-[-4rem] w-0.5 bg-indigo-100 z-0"></div>
                )}
              </div>

              {/* Mobile Date Header */}
              <div className="md:hidden flex items-center gap-3 mb-4 relative z-10">
                <div className="w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-50 absolute -left-[23px]"></div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-600">{new Date(stop.arrivalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
                </div>
              </div>

              {/* Content Column */}
              <div className="col-span-9 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 z-10 relative">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{stop.city}</h2>
                    <p className="text-gray-500 font-medium">{stop.country}</p>
                  </div>
                </div>

                {activities[stop._id] && activities[stop._id].length > 0 ? (
                  <div className="space-y-4">
                    {activities[stop._id].map(activity => (
                      <div key={activity._id} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50/50 transition-colors border border-transparent hover:border-indigo-100">
                        <div className="flex flex-col items-center pt-1 text-gray-400">
                          <Clock size={18} />
                          <div className="h-full w-px bg-gray-200 my-1"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900 text-lg">{activity.title}</h4>
                            <span className="badge badge-sm font-semibold">{activity.type}</span>
                          </div>
                          {activity.description && <p className="text-gray-600 mb-3 text-sm">{activity.description}</p>}
                          <div className="flex gap-4 text-xs font-semibold text-gray-500">
                            <span className="flex items-center gap-1"><Clock size={14}/> {activity.duration} min</span>
                            {activity.cost > 0 && <span className="flex items-center gap-0.5 text-green-600"><DollarSign size={14}/> {activity.cost}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-4 italic">Free time to explore.</p>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ItineraryView;
