import React, { useState } from 'react';
import { Check, Trash2, Calendar, Edit2, X } from 'lucide-react';
import { cn } from '../utils';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const priorityColors = {
    Low: 'bg-blue-50 text-blue-700 border-blue-200',
    Medium: 'bg-orange-50 text-orange-700 border-orange-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const handleSave = () => {
    if (editTitle.trim() !== '') {
      onUpdate(todo._id, { title: editTitle, description: editDescription });
      setIsEditing(false);
    }
  };

  const toggleCompleted = () => {
    onUpdate(todo._id, { completed: !todo.completed });
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 p-4 bg-white rounded-xl border transition-all duration-200 hover:shadow-md",
        todo.completed ? "border-slate-200 bg-slate-50/50" : "border-slate-200"
      )}
    >
      <button
        onClick={toggleCompleted}
        className={cn(
          "mt-1 flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          todo.completed
            ? "bg-indigo-500 border-indigo-500 text-white"
            : "border-slate-300 hover:border-indigo-400 text-transparent"
        )}
      >
        <Check className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "text-base font-medium truncate transition-colors",
                  todo.completed ? "text-slate-400 line-through" : "text-slate-800"
                )}
              >
                {todo.title}
              </h3>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                  aria-label="Edit task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(todo._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {todo.description && (
              <p
                className={cn(
                  "mt-1 text-sm line-clamp-2 transition-colors",
                  todo.completed ? "text-slate-400" : "text-slate-500"
                )}
              >
                {todo.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-md border",
                  todo.completed ? "bg-slate-100 text-slate-500 border-slate-200" : priorityColors[todo.priority]
                )}
              >
                {todo.priority}
              </span>

              {todo.dueDate && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    todo.completed ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
