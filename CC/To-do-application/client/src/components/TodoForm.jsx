import React, { useState } from 'react';
import { PlusCircle, Calendar, AlertCircle } from 'lucide-react';

const TodoForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await onAdd({ title, description, priority, dueDate: dueDate || undefined });
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
    setIsExpanded(false);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="What needs to be done?"
          className="w-full pl-4 pr-12 py-3 text-lg bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow placeholder:text-slate-400"
          required
        />
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:text-indigo-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>

      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details (optional)"
            rows={2}
            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none placeholder:text-slate-400"
          />
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent border-b border-slate-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5"
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <AlertCircle className="w-4 h-4" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-transparent border-b border-slate-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5 cursor-pointer"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoForm;
