import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EventsListing from './pages/EventsListing';
import EventDetail from './pages/EventDetail';
import RegistrationForm from './pages/RegistrationForm';
import RegistrationSuccess from './pages/RegistrationSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AdminEventForm from './pages/AdminEventForm';
import AdminRegistrations from './pages/AdminRegistrations';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>404</h1>
      <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Page not found</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<EventsListing />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events/:id/register" element={<RegistrationForm />} />
            <Route path="/events/:id/success" element={<RegistrationSuccess />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events/new" element={<AdminEventForm />} />
            <Route path="/admin/events/:id/edit" element={<AdminEventForm />} />
            <Route path="/admin/events/:id/registrations" element={<AdminRegistrations />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
