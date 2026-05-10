import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { BookOpen, Plus, Trash2, ArrowLeft, Clock } from 'lucide-react';

import { tripService } from '../../services/apiService';
import TripTabs from '../../components/trips/TripTabs';

const Journal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });

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

  const saveNotes = async (newNotes) => {
    try {
      const data = await tripService.updateNotes(id, { notes: newNotes });
      setTrip(data);
      toast.success('Note saved successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to save notes');
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteForm.content.trim()) return toast.error('Note content cannot be empty');

    const newNote = {
      title: noteForm.title || 'Untitled Note',
      content: noteForm.content,
      date: new Date().toISOString()
    };

    const newNotes = [...(trip.notes || []), newNote];
    saveNotes(newNotes);
    
    setNoteForm({ title: '', content: '' });
    setIsAdding(false);
  };

  const handleDeleteNote = (index) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    const newNotes = [...(trip.notes || [])];
    newNotes.splice(index, 1);
    saveNotes(newNotes);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg text-indigo-600"></span></div>;
  }

  if (!trip) return <div className="text-center py-10">Trip not found</div>;

  const notes = trip.notes || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <TripTabs />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
          <button onClick={() => navigate(`/trips/${id}/view`)} className="mr-4 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trip Journal</h1>
            <p className="mt-1 text-sm text-gray-500">Notes & memories for {trip.title}</p>
          </div>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" /> New Note
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add a Note</h2>
          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
              <input
                type="text"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="E.g., Flight Details or Day 1 Thoughts"
                value={noteForm.title}
                onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                required
                rows="5"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Write your note here..."
                value={noteForm.content}
                onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}

      {notes.length === 0 && !isAdding ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No notes yet</h3>
          <p className="mt-1 text-gray-500">Jot down important info, confirmation numbers, or memories.</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="mt-6 text-indigo-600 font-medium hover:text-indigo-800"
          >
            Create your first note
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {notes.slice().reverse().map((note, idx) => {
            const actualIndex = notes.length - 1 - idx;
            return (
              <div key={actualIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{note.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(note.date).toLocaleString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteNote(actualIndex)}
                    className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
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

export default Journal;

