import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DoctorDirectory from './pages/DoctorDirectory';
import AppointmentBooking from './pages/AppointmentBooking';
import VideoConsultation from './pages/VideoConsultation';
import Prescription from './pages/Prescription';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 