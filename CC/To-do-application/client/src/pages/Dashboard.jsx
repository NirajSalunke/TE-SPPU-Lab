import React, { useEffect, useState } from 'react';
import useTaskStore from '../store/useTaskStore';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Button } from '../components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';

export default function Dashboard() {
  const { tasks, fetchTasks, isLoading, error, updateTaskStatus, deleteTask, addTask, updateTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (data) => {
    if (editingTask) {
      await updateTask(editingTask._id, data);
    } else {
      await addTask(data);
    }
    handleCloseModal();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <Button variant={filterStatus === 'all' ? 'default' : 'outline'} onClick={() => setFilterStatus('all')}>All</Button>
          <Button variant={filterStatus === 'pending' ? 'default' : 'outline'} onClick={() => setFilterStatus('pending')}>Pending</Button>
          <Button variant={filterStatus === 'in-progress' ? 'default' : 'outline'} onClick={() => setFilterStatus('in-progress')}>In Progress</Button>
          <Button variant={filterStatus === 'completed' ? 'default' : 'outline'} onClick={() => setFilterStatus('completed')}>Completed</Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-card border-dashed">
          <p className="text-muted-foreground">No tasks found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onStatusChange={updateTaskStatus}
              onDelete={deleteTask}
              onEdit={handleOpenModal}
            />
          ))}
        </div>
      )}

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-lg border p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
            <TaskForm 
              initialData={editingTask} 
              onSubmit={handleSubmitTask} 
              onCancel={handleCloseModal} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
