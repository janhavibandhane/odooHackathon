import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Package, 
  Shirt, 
  Bath, 
  Smartphone, 
  FileText, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

import { tripService } from '../../services/apiService';
import TripTabs from '../../components/trips/TripTabs';

const CATEGORIES = [
  { id: 'Clothing', icon: Shirt, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'Toiletries', icon: Bath, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'Electronics', icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'Documents', icon: FileText, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'Other', icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-50' }
];

const PackingList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Clothing');

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const data = await tripService.getTripById(id);
      setTrip(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch trip data');
    } finally {
      setIsLoading(false);
    }
  };

  const savePackingList = async (newList) => {
    try {
      const data = await tripService.updatePackingList(id, { packingList: newList });
      setTrip(data);
    } catch (error) {
      toast.error(error.message || 'Failed to save packing list');
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newList = [
      ...(trip.packingList || []),
      { item: newItemName, isPacked: false, category: newItemCategory }
    ];
    
    savePackingList(newList);
    setNewItemName('');
  };

  const handleToggleItem = (index) => {
    const newList = [...(trip.packingList || [])];
    newList[index].isPacked = !newList[index].isPacked;
    savePackingList(newList);
  };

  const handleDeleteItem = (index) => {
    const newList = [...(trip.packingList || [])];
    newList.splice(index, 1);
    savePackingList(newList);
  };

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to uncheck all items?')) return;
    const newList = (trip.packingList || []).map(item => ({ ...item, isPacked: false }));
    savePackingList(newList);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg text-indigo-600"></span></div>;
  }

  if (!trip) return <div className="text-center py-10">Trip not found</div>;

  const packingList = trip.packingList || [];
  const packedCount = packingList.filter(item => item.isPacked).length;
  const totalCount = packingList.length;
  const progress = totalCount === 0 ? 0 : (packedCount / totalCount) * 100;

  // Group by category
  const groupedList = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = packingList.map((item, index) => ({...item, originalIndex: index})).filter(item => item.category === cat.id);
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 min-h-screen">
      <TripTabs />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Modern Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center">
              <button onClick={() => navigate(`/trips/${id}/view`)} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-500" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Packing Checklist</h1>
                <p className="text-gray-500 font-medium">Get ready for {trip.title}</p>
              </div>
            </div>
            
            <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Items Packed</p>
                <div className="flex items-center justify-end gap-2 text-2xl font-black text-indigo-900">
                  <span>{packedCount}</span>
                  <span className="text-indigo-300 text-lg">/</span>
                  <span>{totalCount}</span>
                </div>
              </div>
              <div className="w-px h-10 bg-indigo-200 mx-2"></div>
              <button 
                onClick={handleReset}
                disabled={packedCount === 0}
                className="p-2 hover:bg-white rounded-xl text-indigo-600 transition-all disabled:opacity-30"
                title="Reset Checklist"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-gray-700">Completion Status</span>
              <span className="text-sm font-black text-indigo-600">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-1000 ease-out rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
                placeholder="What do you need to pack?"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
              <div className="absolute right-4 top-4">
                <Plus size={20} className="text-indigo-400" />
              </div>
            </div>
            <select
              className="sm:w-48 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.id}</option>)}
            </select>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95">
              Add to List
            </button>
          </form>
        </div>

        {/* Checklist */}
        {totalCount === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Your suitcase is empty!</h3>
            <p className="mt-2 text-gray-400 max-w-sm mx-auto">Start adding items like clothes, toiletries, or electronics to your packing checklist.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {CATEGORIES.map(cat => {
              const items = groupedList[cat.id];
              if (items.length === 0) return null;
              const CatIcon = cat.icon;

              return (
                <div key={cat.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className={`p-2 rounded-xl ${cat.bg} ${cat.color}`}>
                      <CatIcon size={20} />
                    </div>
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest">{cat.id}</h3>
                    <div className="h-px bg-gray-100 flex-1 ml-2"></div>
                    <span className="text-xs font-black text-gray-400 px-3 py-1 bg-white border border-gray-100 rounded-lg">
                      {items.filter(i => i.isPacked).length}/{items.length}
                    </span>
                  </div>
                  
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {items.map((item) => (
                      <div 
                        key={item.originalIndex} 
                        className={`flex items-center justify-between p-5 hover:bg-indigo-50/20 transition-all group cursor-pointer ${item.isPacked ? 'opacity-60' : ''}`}
                        onClick={() => handleToggleItem(item.originalIndex)}
                      >
                        <div className="flex items-center flex-1">
                          <div className={`mr-4 transition-transform duration-200 group-active:scale-90`}>
                            {item.isPacked ? (
                              <div className="bg-green-500 text-white rounded-lg p-1.5 shadow-sm shadow-green-100">
                                <CheckSquare className="w-6 h-6" />
                              </div>
                            ) : (
                              <div className="text-gray-300 rounded-lg p-1.5 border-2 border-gray-100">
                                <Square className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <span className={`text-lg font-bold transition-all ${item.isPacked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {item.item}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.originalIndex); }}
                          className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackingList;

