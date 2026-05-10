import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { BookOpen, Plus, Trash2, ArrowLeft, Clock, Edit2, Save, X } from 'lucide-react';

import { tripService } from '../../services/apiService';
import TripTabs from '../../components/trips/TripTabs';

const Journal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
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
      toast.success(editingIndex !== null ? 'Note updated' : 'Note saved');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to save notes');
      return false;
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteForm.content.trim()) return toast.error('Note content cannot be empty');

    const newNote = {
      title: noteForm.title || 'Untitled Note',
      content: noteForm.content,
      date: editingIndex !== null ? trip.notes[editingIndex].date : new Date().toISOString()
    };

    let newNotes;
    if (editingIndex !== null) {
      newNotes = [...trip.notes];
      newNotes[editingIndex] = newNote;
    } else {
      newNotes = [...(trip.notes || []), newNote];
    }

    const success = await saveNotes(newNotes);
    if (success) {
      setNoteForm({ title: '', content: '' });
      setIsAdding(false);
      setEditingIndex(null);
    }
  };

  const handleEditNote = (index) => {
    const note = trip.notes[index];
    setNoteForm({ title: note.title, content: note.content });
    setEditingIndex(index);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <button onClick={() => navigate(`/trips/${id}/view`)} className="mr-4 text-gray-500 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trip Journal</h1>
              <p className="mt-1 text-sm text-gray-500">Notes & memories for {trip.title}</p>
            </div>
          </div>
          {!isAdding && (
            <button 
              onClick={() => {
                setEditingIndex(null);
                setNoteForm({ title: '', content: '' });
                setIsAdding(true);
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-1" /> New Note
            </button>
          )}
        </div>

        {isAdding && (
          <div className="bg-white rounded-2xl shadow-md border border-indigo-100 p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              {editingIndex !== null ? <Edit2 size={20} className="text-indigo-500" /> : <Plus size={20} className="text-indigo-500" />}
              {editingIndex !== null ? 'Edit Note' : 'Add a New Note'}
            </h2>
            <form onSubmit={handleAddNote} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Note Title</label>
                <input
                  type="text"
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="E.g., Day 1: Exploring Rome"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Content</label>
                <textarea
                  required
                  rows="6"
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Write your thoughts, memories, or important info here..."
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-50">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingIndex(null);
                  }}
                  className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all font-bold"
                >
                  {editingIndex !== null ? <Save size={18}/> : <Plus size={18}/>}
                  {editingIndex !== null ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        )}

        {notes.length === 0 && !isAdding ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <BookOpen className="mx-auto h-16 w-16 text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Your journal is empty</h3>
            <p className="mt-2 text-gray-400 max-w-sm mx-auto">Capture your travel moments, keep track of bookings, or jot down your daily discoveries.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-8 btn btn-primary px-8 rounded-xl"
            >
              Start Writing
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {notes.slice().reverse().map((note, idx) => {
              const actualIndex = notes.length - 1 - idx;
              return (
                <div key={actualIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:border-indigo-200 transition-all">
                  <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{note.title}</h3>
                      <div className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(note.date).toLocaleDateString()} at {new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditNote(actualIndex)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Edit note"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(actualIndex)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete note"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">{note.content}</p>
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

