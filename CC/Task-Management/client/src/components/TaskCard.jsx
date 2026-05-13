import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, AlertCircle } from 'lucide-react';

function TaskCard({ task }) {
  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
  };

  const priorityColors = {
    'Low': 'text-gray-500 dark:text-gray-400',
    'Medium': 'text-orange-500 dark:text-orange-400',
    'High': 'text-red-600 dark:text-red-500'
  };

  return (
    <Link to={`/tasks/${task._id}`} className="group block">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 h-full flex flex-col relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full ${task.status === 'Completed' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
        
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusColors[task.status]}`}>
            {task.status}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
            <AlertCircle className={`w-3 h-3 ${priorityColors[task.priority]}`} />
            <span className="text-gray-700 dark:text-gray-300">{task.priority}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {task.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
          {task.description || 'No description provided.'}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          {task.dueDate ? (
            <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Due {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
            </div>
          ) : (
            <span>No due date</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default TaskCard;
