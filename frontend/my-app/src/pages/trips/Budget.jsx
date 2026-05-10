import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { DollarSign, PieChart, TrendingUp, Plus, Trash2, ArrowLeft } from 'lucide-react';

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
  const [expenseForm, setExpenseForm] = useState({ category: 'Transport', amount: '', description: '' });

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

    const newExpense = {
      ...expenseForm,
      amount,
      date: new Date().toISOString()
    };

    const newBudget = {
      ...trip.budget,
      totalBudget: trip.budget?.totalBudget || 0,
      expenses: [...(trip.budget?.expenses || []), newExpense]
    };
    saveBudget(newBudget);
    setExpenseForm({ category: 'Transport', amount: '', description: '' });
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

  // Calculate expenses by category
  const categoryTotals = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = currentBudget.expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {});

  return (
    <div className="bg-gray-50 min-h-screen">
      <TripTabs />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(`/trips/${id}/view`)} className="mr-4 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
            <p className="mt-1 text-sm text-gray-500">Manage expenses for {trip.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Overview & Add Expense */}
        <div className="lg:col-span-1 space-y-6">
          {/* Total Budget Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" /> Total Budget
            </h2>
            <form onSubmit={handleUpdateTotal} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={totalBudgetInput}
                  onChange={(e) => setTotalBudgetInput(e.target.value)}
                  placeholder="Set total budget"
                />
              </div>
              <button type="submit" className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Set
              </button>
            </form>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Total Spent</span>
                  <span className="font-semibold text-gray-900">${totalExpenses.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${percentUsed > 90 ? 'bg-red-500' : percentUsed > 75 ? 'bg-yellow-500' : 'bg-indigo-600'}`} style={{ width: `${percentUsed}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Remaining</span>
                <span className={`font-semibold ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${remainingBudget.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Add Expense Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-indigo-600" /> Add Expense
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  placeholder="E.g., Dinner at Luigi's"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Add Expense
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Breakdown & List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-indigo-600" /> Expense Breakdown
            </h2>
            {totalExpenses === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">No expenses logged yet.</p>
            ) : (
              <div>
                {/* Visual Bar */}
                <div className="w-full h-4 rounded-full overflow-hidden flex mb-6">
                  {CATEGORIES.map(cat => (
                    categoryTotals[cat] > 0 && (
                      <div 
                        key={cat} 
                        className={CATEGORY_COLORS[cat]} 
                        style={{ width: `${(categoryTotals[cat] / totalExpenses) * 100}%` }}
                        title={`${cat}: $${categoryTotals[cat].toFixed(2)}`}
                      ></div>
                    )
                  ))}
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {CATEGORIES.map(cat => (
                    <div key={cat} className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${CATEGORY_COLORS[cat]}`}></span>
                      <div className="text-sm">
                        <span className="text-gray-500 block">{cat}</span>
                        <span className="font-semibold text-gray-900">${categoryTotals[cat].toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Expense List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
            </div>
            {currentBudget.expenses.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No expenses to display.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {currentBudget.expenses.slice().reverse().map((expense, i) => {
                  const actualIndex = currentBudget.expenses.length - 1 - i;
                  return (
                    <li key={actualIndex} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-gray-100`}>
                          <span className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[expense.category]}`}></span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                          <div className="flex text-xs text-gray-500 mt-0.5 space-x-2">
                            <span>{expense.category}</span>
                            <span>•</span>
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-900 mr-4">${expense.amount.toFixed(2)}</span>
                        <button onClick={() => handleDeleteExpense(actualIndex)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Budget;

