import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Calendar, DollarSign, Package, BookOpen, Layout } from 'lucide-react';

const TripTabs = () => {
  const { id } = useParams();

  const tabs = [
    { name: 'Itinerary', path: `/trips/${id}/view`, icon: Calendar },
    { name: 'Budget', path: `/trips/${id}/budget`, icon: DollarSign },
    { name: 'Packing', path: `/trips/${id}/packing`, icon: Package },
    { name: 'Journal', path: `/trips/${id}/journal`, icon: BookOpen },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md border-1 border-gray-200 rounded-lg m-2  shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center sm:justify-start space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({ isActive }) =>
                  `group whitespace-nowrap py-5 px-4 border-b-4 font-black text-xs uppercase tracking-widest flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-400 hover:text-gray-900 hover:border-gray-200'
                  }`
                }
              >
                <div className={({ isActive }) => `p-1.5 rounded-lg transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-transparent group-hover:bg-gray-50'}`}>
                    <Icon className="w-4 h-4" />
                </div>
                {tab.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TripTabs;
