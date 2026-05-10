import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Calendar, DollarSign, Package, BookOpen } from 'lucide-react';

const TripTabs = () => {
  const { id } = useParams();

  const tabs = [
    { name: 'Itinerary', path: `/trips/${id}/view`, icon: Calendar },
    { name: 'Budget', path: `/trips/${id}/budget`, icon: DollarSign },
    { name: 'Packing', path: `/trips/${id}/packing`, icon: Package },
    { name: 'Journal', path: `/trips/${id}/journal`, icon: BookOpen },
  ];

  return (
    <div className="border-b border-gray-200 bg-white mb-6 sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({ isActive }) =>
                  `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
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
