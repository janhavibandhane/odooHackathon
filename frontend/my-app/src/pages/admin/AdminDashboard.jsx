import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Users, 
  Map, 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  Globe, 
  Settings,
  Search,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { adminService } from '../../services/apiService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/');
      return;
    }

    const fetchAdminStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#f8fafc]">
        <span className="loading loading-spinner loading-lg text-indigo-600 mb-4"></span>
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Loading Control Center</p>
      </div>
    );
  }

  if (!stats) return <div className="text-center py-20 font-black text-gray-400">COULD NOT LOAD STATS.</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-['Outfit']">
      
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ShieldAlert size={24}/>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">Control Center</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Platform Administrator Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">System Online</span>
             </div>
             <button className="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:text-indigo-600 transition-colors">
                <Settings size={18}/>
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        
        {/* Compact KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'indigo', growth: '+12%' },
            { label: 'Total Trips', value: stats.totalTrips, icon: Map, color: 'purple', growth: '+8%' },
            { label: 'Public Assets', value: stats.recentTrips?.filter(t => t.isPublic).length || 0, icon: Globe, color: 'blue', growth: '+24%' },
            { label: 'Active Tasks', value: '42', icon: Activity, color: 'green', growth: 'Stable' },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-xl`}>
                  <kpi.icon size={20}/>
                </div>
                <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-md">{kpi.growth}</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-3xl font-black text-gray-900 tracking-tighter mt-1">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* User Management Table */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Signups</h2>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                  Manage Users <ArrowUpRight size={14}/>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Permission</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentUsers?.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black text-xs">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 leading-none">{u.name}</p>
                              <p className="text-[10px] font-medium text-gray-400 mt-1">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[11px] font-bold text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-300 hover:text-gray-600 transition-colors"><MoreVertical size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity Stream */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Recent Platform Activity</h2>
              <div className="space-y-6">
                {stats.recentTrips?.slice(0, 5).map((trip, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {idx !== 4 && <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-gray-50"></div>}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${trip.isPublic ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {trip.isPublic ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-tight">
                        <span className="text-indigo-600">New Trip:</span> {trip.title}
                      </p>
                      <p className="text-[10px] font-medium text-gray-400 mt-1 flex items-center gap-2">
                        Created by {trip.userId?.name || 'User'} • {new Date(trip.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-xl hover:bg-gray-100 hover:text-gray-600 transition-all">
                View Full Logs
              </button>
            </div>

            {/* System Health */}
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
               <div className="flex items-center gap-3 mb-4">
                  <Activity size={20} className="text-indigo-200"/>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">Platform Integrity</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Storage Usage</span>
                     <span className="text-xs font-black">74%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                     <div className="bg-white h-1.5 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                  <div className="flex justify-between items-end">
                     <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">API Uptime</span>
                     <span className="text-xs font-black">99.9%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                     <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
