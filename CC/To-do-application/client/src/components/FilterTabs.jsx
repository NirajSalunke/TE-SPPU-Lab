import React from 'react';
import { cn } from '../utils';

const FilterTabs = ({ currentFilter, onFilterChange }) => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="flex space-x-1 bg-slate-200/60 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          className={cn(
            "px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
            currentFilter === tab.id
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
