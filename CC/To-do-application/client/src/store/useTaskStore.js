import { create } from 'zustand';
import * as api from '../services/api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getTasks();
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createTask(taskData);
      set((state) => ({ tasks: [response.data, ...state.tasks], isLoading: false }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateTask: async (id, taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.updateTask(id, taskData);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? response.data : t)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateTaskStatus: async (id, status) => {
    set({ error: null });
    // Optimistic update
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? { ...t, status } : t)),
    }));
    try {
      await api.updateTaskStatus(id, status);
    } catch (error) {
      // Revert on failure
      set({ tasks: previousTasks, error: error.message });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useTaskStore;
