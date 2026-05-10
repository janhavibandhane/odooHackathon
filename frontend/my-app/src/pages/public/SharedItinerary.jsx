import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Compass, Share2, Globe, Heart } from 'lucide-react';

import { tripService } from '../../services/apiService';

const SharedItinerary = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicTrip = async () => {
      try {
        const data = await tripService.getPublicTrip(tripId);
        setTrip(data);
      } catch (err) {
        setError(err.message || 'Trip not found or is private');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicTrip();
  }, [tripId]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center"><span className="loading loading-spinner loading-lg text-indigo-600"></span></div>;
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <Globe className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
        <p className="text-gray-500 mb-6">{error || "We couldn't find this itinerary."}</p>
        <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">
          Go to Traveloop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full">
        <img 
          src={trip.coverPhoto || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000"} 
          alt={trip.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-between p-6">
           <Link to="/" className="text-white font-bold text-xl tracking-tight bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full self-start">Traveloop</Link>
           <button 
             onClick={() => {
               navigator.clipboard.writeText(window.location.href);
               alert("Link copied to clipboard!");
             }}
             className="text-white bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full flex items-center self-start transition-colors"
           >
             <Share2 className="w-4 h-4 mr-2" /> Share
           </button>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10">
          <div className="max-w-5xl mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/80 text-white backdrop-blur-sm mb-3">
              Public Itinerary
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-2">
              {trip.title}
            </h1>
            <div className="flex flex-wrap items-center text-gray-200 gap-4 mt-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 opacity-80" />
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Compass className="w-5 h-5 mr-2 opacity-80" />
                Curated by {trip.userId?.name || 'Traveler'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-100">
          
          <div className="prose max-w-none mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-3">About this trip</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {trip.description || "Get ready for an amazing journey!"}
            </p>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Call to action for viewers */}
          <div className="bg-indigo-50 rounded-2xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between border border-indigo-100">
            <div className="mb-6 sm:mb-0 sm:mr-6">
              <h3 className="text-2xl font-bold text-indigo-900 mb-2">Inspired by this trip?</h3>
              <p className="text-indigo-700">Create your own personalized itinerary with Traveloop.</p>
            </div>
            <Link to="/register" className="whitespace-nowrap px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Start Planning Free
            </Link>
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center mt-12 text-gray-500 flex items-center justify-center">
        <p>Made with <Heart className="w-4 h-4 inline text-red-500 mx-1" /> by Traveloop</p>
      </div>
    </div>
  );
};

export default SharedItinerary;

