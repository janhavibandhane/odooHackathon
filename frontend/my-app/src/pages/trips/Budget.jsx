import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  IndianRupee, 
  PieChart, 
  TrendingUp, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  AlertCircle,
  BarChart3,
  Calendar,
  Wallet
} from 'lucide-react';

import { tripService } from '../../services/apiService';
import TripTabs from '../../components/trips/TripTabs';

const CATEGORIES = ['Transport', 'Stay', 'Activities', 'Meals', 'Other'];
const CATEGORY_COLORS = {
  'Transport': 'bg-blue-500',
  'Stay': 'bg-indigo-500',
  'Activities': 'bg-green-500',
  'Meals': 'bg-yellow-500',
  'Other': 'bg-gray-400'
};

const Budget = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [totalBudgetInput, setTotalBudgetInput] = useState('');
  const [expenseForm, setExpenseForm] = useState({ category: 'Transport', amount: '', description: '', date: '' });

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const data = await tripService.getTripById(id);
      setTrip(data);
      if (data.budget && data.budget.totalBudget) {
        setTotalBudgetInput(data.budget.totalBudget.toString());
      }
      // Set default date to today or trip start date
      const today = new Date().toISOString().split('T')[0];
      setExpenseForm(prev => ({ ...prev, date: today }));
    } catch (error) {
      toast.error(error.message || 'Failed to fetch trip data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveBudget = async (budgetData) => {
    try {
      const data = await tripService.updateBudget(id, { budget: budgetData });
      setTrip(data);
      toast.success('Budget updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update budget');
    }
  };

  const handleUpdateTotal = (e) => {
    e.preventDefault();
    const newTotal = parseFloat(totalBudgetInput);
    if (isNaN(newTotal) || newTotal < 0) return toast.error('Enter a valid amount');
    
    const newBudget = {
      ...trip.budget,
      totalBudget: newTotal,
      expenses: trip.budget?.expenses || []
    };
    saveBudget(newBudget);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const amount = parseFloat(expenseForm.amount);
    if (isNaN(amount) || amount <= 0) return toast.error('Enter a valid amount');
    if (!expenseForm.description.trim()) return toast.error('Enter a description');

    const newBudget = {
      ...trip.budget,
      totalBudget: trip.budget?.totalBudget || 0,
      expenses: [...(trip.budget?.expenses || []), { ...expenseForm, amount }]
    };
    saveBudget(newBudget);
    setExpenseForm({ category: 'Transport', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteExpense = (index) => {
    const expenses = [...(trip.budget?.expenses || [])];
    expenses.splice(index, 1);
    
    const newBudget = {
      ...trip.budget,
      expenses
    };
    saveBudget(newBudget);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg text-indigo-600"></span></div>;
  }

  if (!trip) return <div className="text-center py-10">Trip not found</div>;

  const currentBudget = trip.budget || { totalBudget: 0, expenses: [] };
  const totalExpenses = currentBudget.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = currentBudget.totalBudget - totalExpenses;
  const percentUsed = currentBudget.totalBudget > 0 ? Math.min(100, (totalExpenses / currentBudget.totalBudget) * 100) : 0;

  // Calculate Trip Duration
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  
  const avgCostPerDay = totalExpenses / diffDays;
  const dailyBudget = currentBudget.totalBudget / diffDays;
  const isOverDailyBudget = avgCostPerDay > dailyBudget && currentBudget.totalBudget > 0;

  // Calculate expenses by category
  const categoryTotals = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = currentBudget.expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 min-h-screen">
      <TripTabs />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Premium Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center">
              <button onClick={() => navigate(`/trips/${id}/view`)} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-500" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Summary</h1>
                <p className="text-gray-500 font-medium">Budget analysis for {trip.title}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Total Budget</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-indigo-900">₹{currentBudget.totalBudget.toLocaleString()}</span>
                  <button 
                    onClick={() => document.getElementById('budget_modal').showModal()} 
                    className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    Set Goal
                  </button>
                </div>
              </div>
              <div className={`px-6 py-3 rounded-2xl border ${remainingBudget < 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {remainingBudget < 0 ? 'Over Budget' : 'Remaining'}
                </p>
                <span className={`text-2xl font-black ${remainingBudget < 0 ? 'text-red-900' : 'text-green-900'}`}>
                  ₹{Math.abs(remainingBudget).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar with Alerts */}
          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-gray-700">Budget Utilization</span>
              <span className={`text-sm font-black ${percentUsed > 90 ? 'text-red-600' : 'text-indigo-600'}`}>{percentUsed.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full ${
                  percentUsed > 90 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 
                  percentUsed > 75 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 
                  'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`} 
                style={{ width: `${percentUsed}%` }}
              ></div>
            </div>
            {percentUsed > 100 && (
              <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">
                <AlertCircle size={18} />
                <span className="text-sm font-bold">You have exceeded your planned budget!</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Grid */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="text-indigo-500" /> Key Insights
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={20}/></div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Daily Average</p>
                      <p className="text-xl font-black text-gray-900">₹{avgCostPerDay.toFixed(2)}</p>
                    </div>
                  </div>
                  {isOverDailyBudget && (
                    <div className="tooltip tooltip-left" data-tip="Above daily target">
                      <AlertCircle className="text-orange-500 animate-bounce" size={20} />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Wallet size={20}/></div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Daily Target</p>
                    <p className="text-xl font-black text-gray-900">₹{dailyBudget.toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                   <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Category Breakdown</h4>
                   <div className="space-y-4">
                     {CATEGORIES.map(cat => (
                       <div key={cat}>
                         <div className="flex justify-between text-sm mb-1.5">
                           <span className="font-semibold text-gray-700">{cat}</span>
                           <span className="font-black text-gray-900">₹{categoryTotals[cat].toLocaleString()}</span>
                         </div>
                         <div className="w-full bg-gray-50 rounded-full h-1.5">
                           <div 
                             className={`h-full rounded-full ${CATEGORY_COLORS[cat]}`} 
                             style={{ width: `${totalExpenses > 0 ? (categoryTotals[cat] / totalExpenses) * 100 : 0}%` }}
                           ></div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Quick Add Form */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Plus className="text-indigo-400" /> Log Expense
              </h3>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <input
                  type="text"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-white/40"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  placeholder="What did you buy?"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-white/40 text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-6 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <select
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat} className="text-gray-900">{cat}</option>)}
                  </select>
                </div>
                <input
                  type="date"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                />
                <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/30">
                  Add to Budget
                </button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold uppercase">{currentBudget.expenses.length} Total</span>
              </div>
              
              {currentBudget.expenses.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IndianRupee className="text-gray-300" size={40} />
                  </div>
                  <h4 className="text-gray-900 font-bold">No expenses yet</h4>
                  <p className="text-gray-400 text-sm">Start logging your costs to see the breakdown.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Description</th>
                        <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                        <th className="text-left py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                        <th className="text-right py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                        <th className="py-4 px-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {currentBudget.expenses.slice().reverse().map((expense, i) => {
                        const actualIndex = currentBudget.expenses.length - 1 - i;
                        return (
                          <tr key={actualIndex} className="hover:bg-indigo-50/30 transition-colors group">
                            <td className="py-4 px-6">
                              <span className="font-bold text-gray-900">{expense.description}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${CATEGORY_COLORS[expense.category]}`}>
                                {expense.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                              {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <span className="font-black text-gray-900">₹{expense.amount.toLocaleString()}</span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button 
                                onClick={() => handleDeleteExpense(actualIndex)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Edit Modal */}
      <dialog id="budget_modal" className="modal">
        <div className="modal-box bg-white rounded-3xl p-8">
          <h3 className="font-black text-2xl mb-6 text-gray-900">Set Trip Budget</h3>
          <form onSubmit={handleUpdateTotal}>
            <div className="relative mb-6">
              <span className="absolute left-4 top-4 text-gray-400 font-bold text-xl">₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-10 pr-6 py-4 text-xl font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                value={totalBudgetInput}
                onChange={(e) => setTotalBudgetInput(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="modal-action">
              <form method="dialog" className="flex gap-3 w-full">
                <button className="btn btn-ghost flex-1 rounded-xl">Cancel</button>
                <button type="submit" onClick={() => document.getElementById('budget_modal').close()} className="btn btn-primary flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 border-none text-white font-bold">
                  Update Total
                </button>
              </form>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Budget;

