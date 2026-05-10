import React, { useState } from 'react';
import { Search, MapPin, Clock, DollarSign, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_ACTIVITIES = [
  { id: 1, title: 'Eiffel Tower Summit Tour', city: 'Paris', type: 'Sightseeing', cost: 45, duration: '2 hours', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=600' },
  { id: 2, title: 'Sushi Making Class', city: 'Tokyo', type: 'Food', cost: 80, duration: '3 hours', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=600' },
  { id: 3, title: 'Colosseum Underground Tour', city: 'Rome', type: 'History', cost: 60, duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=600' },
  { id: 4, title: 'Central Park Bike Rental', city: 'New York City', type: 'Active', cost: 15, duration: 'Half day', image: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80&w=600' },
  { id: 5, title: 'Sagrada Familia Fast Track', city: 'Barcelona', type: 'Sightseeing', cost: 35, duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1583422409516-15e0a0d4db08?auto=format&fit=crop&q=80&w=600' },
  { id: 6, title: 'Ubud Rice Terrace Trek', city: 'Bali', type: 'Nature', cost: 25, duration: '4 hours', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600' },
  { id: 7, title: 'Thames River Cruise', city: 'London', type: 'Sightseeing', cost: 30, duration: '1 hour', image: 'https://images.unsplash.com/photo-1513635269975-5969336cd753?auto=format&fit=crop&q=80&w=600' },
  { id: 8, title: 'Desert Safari & BBQ', city: 'Dubai', type: 'Adventure', cost: 90, duration: '6 hours', image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&q=80&w=600' },
];

const CATEGORIES = ['All', 'Sightseeing', 'Food', 'History', 'Active', 'Nature', 'Adventure'];

const ActivitySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const filteredActivities = MOCK_ACTIVITIES.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          activity.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || activity.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Things to Do</h1>
          <p className="mt-1 text-sm text-gray-500">Discover and add amazing experiences to your trips.</p>
        </div>
        
        <div className="flex-1 max-w-md w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search activities or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 w-full relative">
              <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-bold text-indigo-700 uppercase tracking-wider">
                {activity.type}
              </span>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{activity.title}</h3>
              
              <div className="mt-auto space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {activity.city}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {activity.duration}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center text-lg font-bold text-gray-900">
                  <DollarSign className="w-4 h-4 text-gray-500" />{activity.cost}
                </div>
                <button 
                  onClick={() => navigate('/trips')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors"
                >
                  Add to Trip
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredActivities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 mt-4">
          <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No activities found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your filters or search terms.</p>
          <button 
            onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
            className="mt-4 text-indigo-600 font-medium hover:text-indigo-800"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivitySearch;

