import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, isLoading, onUpdate, onDelete, filter }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">No tasks yet</h3>
        <p className="text-slate-500">
          {filter === 'completed' 
            ? "You don't have any completed tasks." 
            : filter === 'active'
              ? "You don't have any active tasks. You're all caught up!"
              : "Add a task above to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;
