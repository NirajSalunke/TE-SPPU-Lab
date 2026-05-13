import React from 'react';
import { CheckSquare } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <CheckSquare className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Manage your day efficiently
        </div>
      </div>
    </header>
  );
};

export default Header;
