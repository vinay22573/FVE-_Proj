import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DoctorDirectory from './pages/DoctorDirectory';
import AppointmentBooking from './pages/AppointmentBooking';
import VideoConsultation from './pages/VideoConsultation';
import Prescription from './pages/Prescription';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/doctors" element={<DoctorDirectory />} />
                  <Route
                    path="/appointment/:doctorId"
                    element={
                      <PrivateRoute>
                        <AppointmentBooking />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/consultation/:appointmentId"
                    element={
                      <PrivateRoute>
                        <VideoConsultation />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/prescription/:appointmentId"
                    element={
                      <PrivateRoute>
                        <Prescription />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
} 