import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { 
  Plane, 
  Calendar, 
  Map, 
  FileText, 
  Camera, 
  ArrowRight, 
  X,
  Sparkles
} from 'lucide-react';
import { tripService } from '../../services/apiService';

const CreateTrip = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      coverPhoto: ''
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Image too large (max 2MB)");
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setValue('coverPhoto', reader.result); // Store base64 in form
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await tripService.createTrip(data);
      toast.success('Your adventure has been created! ✈️');
      navigate(`/trips/${result._id}/builder`);
    } catch (error) {
      toast.error(error.message || 'Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#efedf7] py-12 px-4 sm:px-6 lg:px-8 font-['Outfit']">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-12 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <Plane size={28}/>
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Start Your Adventure</h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">New Journey Creation</p>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Form Side */}
            <div className="flex-1 p-10 md:p-16 border-r border-gray-50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                
                <div className="space-y-8">
                  {/* Trip Title */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Sparkles size={14} className="text-indigo-400"/> Adventure Name
                    </label>
                    <input
                      type="text"
                      {...register('title', { required: 'Give your trip a cool name' })}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all outline-none"
                      placeholder="e.g. Dreamy Tokyo Escape"
                    />
                    {errors.title && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-4">{errors.title.message}</p>}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-400"/> Departure
                      </label>
                      <input
                        type="date"
                        {...register('startDate', { required: 'When does it start?' })}
                        className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-400"/> Return
                      </label>
                      <input
                        type="date"
                        {...register('endDate', { required: 'When do you come back?' })}
                        className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <FileText size={14} className="text-indigo-400"/> Trip Vibe
                    </label>
                    <textarea
                      rows={4}
                      {...register('description')}
                      className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all outline-none resize-none"
                      placeholder="Briefly describe the purpose or vibe of your trip..."
                    />
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Sparkles size={14} className="text-indigo-400"/> Total Budget (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-5 text-gray-400 font-bold">₹</span>
                      <input
                        type="number"
                        {...register('budget.totalBudget', { valueAsNumber: true })}
                        className="w-full px-12 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all outline-none"
                        placeholder="e.g. 50000"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => navigate('/trips')}
                    className="px-10 py-5 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-4 px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isLoading ? <span className="loading loading-spinner loading-md"></span> : (
                      <>
                        Create Itinerary <ArrowRight size={18}/>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Visual Side (Cover Upload) */}
            <div className="w-full lg:w-96 bg-gray-50 p-10 flex flex-col items-center justify-center text-center">
              <div className="space-y-8 w-full">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tighter mb-2">Trip Aesthetic</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Select a Cover Photo</p>
                </div>

                <div className="relative group mx-auto w-full max-w-[280px]">
                  <div className="aspect-[3/4] rounded-[2.5rem] bg-white border-4 border-white shadow-2xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
                    {coverPreview ? (
                      <>
                        <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => { setCoverPreview(null); setValue('coverPhoto', ''); }}
                          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl text-red-500 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16}/>
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-gray-300">
                        <Camera size={48} className="mb-4 opacity-50"/>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 text-center">No Cover Selected</p>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                       <span className="text-white text-[10px] font-black uppercase tracking-widest border border-white/40 px-4 py-2 rounded-xl backdrop-blur-sm">Change Photo</span>
                    </div>
                  </div>
                  
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*"
                  />
                </div>

                <div className="p-6 bg-white rounded-[2rem] border border-gray-100 text-left">
                  <div className="flex gap-3 items-center mb-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600"><Map size={16}/></div>
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Planning Tip</span>
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic">
                    "A beautiful cover photo helps you get inspired while planning. Choose something that represents the 'vibe' of your destination!"
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
