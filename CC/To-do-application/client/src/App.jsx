import React, { useState, useEffect } from 'react';
import api from './api/axios';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async (currentFilter = filter) => {
    try {
      setIsLoading(true);
      setError(null);
      let query = '';
      if (currentFilter === 'active') query = '?status=active';
      if (currentFilter === 'completed') query = '?status=completed';
      
      const response = await api.get(`/${query}`);
      setTodos(response.data);
    } catch (err) {
      setError('Failed to fetch to-dos. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos(filter);
  }, [filter]);

  const handleAddTodo = async (newTodo) => {
    try {
      const response = await api.post('/', newTodo);
      // Depending on filter, we might need to refetch or append
      if (filter === 'completed') {
        // If we are looking at completed, new active tasks shouldn't show immediately
        // But usually we just refetch or let it be
      }
      fetchTodos(filter);
    } catch (err) {
      console.error(err);
      alert('Failed to add to-do.');
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const response = await api.put(`/${id}`, updates);
      setTodos((prev) => prev.map((todo) => (todo._id === id ? response.data : todo)));
      // If we change status and filter is active/completed, it might disappear from view
      if ((filter === 'active' && updates.completed) || (filter === 'completed' && updates.completed === false)) {
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update to-do.');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await api.delete(`/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete to-do.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <TodoForm onAdd={handleAddTodo} />
          </div>
          
          <div className="p-6 sm:p-8 bg-slate-50/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Your Tasks</h2>
              <FilterTabs currentFilter={filter} onFilterChange={setFilter} />
            </div>

            {error && (
              <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <TodoList 
              todos={todos} 
              isLoading={isLoading} 
              onUpdate={handleUpdateTodo} 
              onDelete={handleDeleteTodo} 
              filter={filter}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
