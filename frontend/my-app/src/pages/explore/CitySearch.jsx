import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../../services/geminiService';
import { toast } from 'react-toastify';

const MOCK_CITIES = [
  { id: 1, name: 'Mumbai', country: 'India', image: 'https://images.unsplash.com/photo-1570160897545-222a76f254e4?auto=format&fit=crop&q=80&w=1200', rating: 4.7, costIndex: '$$' },
  { id: 2, name: 'Jaipur', country: 'India', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1200', rating: 4.8, costIndex: '$' },
  { id: 3, name: 'Goa', country: 'India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200', rating: 4.6, costIndex: '$$' },
  { id: 4, name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602861271-e970a25df600?auto=format&fit=crop&q=80&w=1200', rating: 4.8, costIndex: '$$$' },
  { id: 5, name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1200', rating: 4.9, costIndex: '$$$' },
  { id: 6, name: 'New Delhi', country: 'India', image: 'https://images.unsplash.com/photo-1587474260584-1301b4c47fd9?auto=format&fit=crop&q=80&w=1200', rating: 4.5, costIndex: '$$' },
  { id: 7, name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200', rating: 4.7, costIndex: '$' },
  { id: 8, name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200', rating: 4.5, costIndex: '$$$' },
];

const CitySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState(MOCK_CITIES);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setCities(MOCK_CITIES);
      return;
    }

    setIsSearching(true);
    try {
      const results = await geminiService.searchCities(searchTerm);
      setCities(results);
    } catch (error) {
      toast.error(error.message);
      // Fallback to local filter
      const filtered = MOCK_CITIES.filter(city => 
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCities(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighte">Explore Destinations</h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">Find the perfect city for your next adventure with AI.</p>
        
        <div className="mt-8 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative flex items-center shadow-sm rounded-xl overflow-hidden">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-32 py-4 border-y border-l border-gray-300 rounded-l-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
              placeholder="Search e.g., 'Romantic cities in Europe'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={isSearching}
              className="absolute right-0 top-0 bottom-0 px-6 flex items-center justify-center bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70 rounded-r-xl"
            >
              {isSearching ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Search</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {isSearching ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex flex-col gap-4">
              <div className="skeleton h-48 w-full rounded-2xl"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cities.map((city, index) => (
            <div key={city.id || index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="relative h-48 overflow-hidden">
                <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600" }} />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center text-sm font-semibold shadow-sm">
                  <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" /> {city.rating}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{city.name}</h3>
                    <div className="flex items-center text-gray-500 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{city.country}</span>
                    </div>
                  </div>
                  <span className="text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded text-sm">{city.costIndex}</span>
                </div>
                <div className="mt-6">
                  <button 
                    onClick={() => navigate('/trips/create', { state: { suggestedCity: city.name }})}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add to Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isSearching && cities.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No destinations found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
};

export default CitySearch;

