import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Events
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Registrations
export const getRegistrations = (eventId) => api.get(`/events/${eventId}/registrations`);
export const registerForEvent = (eventId, data) => api.post(`/events/${eventId}/register`, data);
export const deleteRegistration = (regId) => api.delete(`/registrations/${regId}`);

export default api;
