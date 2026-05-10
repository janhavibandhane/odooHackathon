import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { CheckSquare, Square, Plus, Trash2, ArrowLeft, Package } from 'lucide-react';

import { tripService } from '../../services/apiService';
import TripTabs from '../../components/trips/TripTabs';

const CATEGORIES = ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Other'];

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
    acc[cat] = packingList.map((item, index) => ({...item, originalIndex: index})).filter(item => item.category === cat);
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 min-h-screen">
      <TripTabs />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(`/trips/${id}/view`)} className="mr-4 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
          <h1 className="text-3xl font-bold text-gray-900">Packing List</h1>
          <p className="mt-1 text-sm text-gray-500">Get ready for {trip.title}</p>
        </div>
      </div>

      {/* Progress & Add Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
          <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-gray-700">Packing Progress</span>
              <span className="text-sm text-gray-500">{packedCount} of {totalCount} items</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <button 
            onClick={handleReset}
            disabled={packedCount === 0}
            className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50 font-medium"
          >
            Reset Checklist
          </button>
        </div>

        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            className="flex-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add a new item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <select
            className="block w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button type="submit" className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-5 h-5 mr-1" /> Add
          </button>
        </form>
      </div>

      {/* Checklist by Category */}
      {totalCount === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Your bag is empty</h3>
          <p className="mt-1 text-gray-500">Start adding items you need to pack above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map(category => {
            const items = groupedList[category];
            if (items.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{category}</h3>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                    {items.filter(i => i.isPacked).length} / {items.length}
                  </span>
                </div>
                <ul className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <li key={item.originalIndex} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center flex-1 cursor-pointer" onClick={() => handleToggleItem(item.originalIndex)}>
                        {item.isPacked ? (
                          <CheckSquare className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" />
                        ) : (
                          <Square className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" />
                        )}
                        <span className={`text-gray-900 ${item.isPacked ? 'line-through text-gray-400' : ''}`}>
                          {item.item}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleDeleteItem(item.originalIndex)}
                        className="text-gray-400 hover:text-red-500 ml-4 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
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

