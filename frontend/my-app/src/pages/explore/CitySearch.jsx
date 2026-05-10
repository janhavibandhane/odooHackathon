import React, { useState } from 'react';
import { Search, MapPin, Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_CITIES = [
  { id: 1, name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602861271-e970a25df600?auto=format&fit=crop&q=80&w=600', rating: 4.8, costIndex: '$$$' },
  { id: 2, name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600', rating: 4.9, costIndex: '$$$' },
  { id: 3, name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600', rating: 4.7, costIndex: '$$' },
  { id: 4, name: 'New York City', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600', rating: 4.8, costIndex: '$$$$' },
  { id: 5, name: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1583422409516-15e0a0d4db08?auto=format&fit=crop&q=80&w=600', rating: 4.6, costIndex: '$$' },
  { id: 6, name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600', rating: 4.7, costIndex: '$' },
  { id: 7, name: 'London', country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-5969336cd753?auto=format&fit=crop&q=80&w=600', rating: 4.6, costIndex: '$$$$' },
  { id: 8, name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600', rating: 4.5, costIndex: '$$$' },
];

const CitySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredCities = MOCK_CITIES.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Explore Destinations</h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">Find the perfect city for your next adventure.</p>
        
        <div className="mt-8 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg shadow-sm"
              placeholder="Search by city or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCities.map(city => (
          <div key={city.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="relative h-48 overflow-hidden">
              <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
      
      {filteredCities.length === 0 && (
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

