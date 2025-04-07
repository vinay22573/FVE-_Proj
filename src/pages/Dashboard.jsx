import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { currentUser, userData } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(
          collection(db, 'appointments'),
          where('patientId', '==', currentUser.uid),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const appointmentsData = [];
        
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const doctorDoc = await getDoc(doc(db, 'users', data.doctorId));
          appointmentsData.push({
            id: doc.id,
            ...data,
            doctor: doctorDoc.data()
          });
        }
        
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
      }
      setLoading(false);
    };

    fetchAppointments();
  }, [currentUser.uid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile Information
              </h3>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pseudonym</p>
                  <p className="mt-1 text-sm text-gray-900">{userData?.pseudonym}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Created</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/profile"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Your Appointments
                </h3>
                <Link
                  to="/doctors"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Book New Appointment
                </Link>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No appointments found. Book your first appointment with a doctor.
                  </p>
                ) : (
                  appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Dr. {appointment.doctor?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {appointment.doctor?.specialty}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()} at{' '}
                          {appointment.time}
                        </p>
                        {appointment.reason && (
                          <p className="mt-1 text-sm text-gray-500">
                            Reason: {appointment.reason}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex space-x-3">
                        {appointment.status === 'scheduled' && (
                          <Link
                            to={`/consultation/${appointment.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Join Consultation
                          </Link>
                        )}
                        {appointment.status === 'completed' && (
                          <Link
                            to={`/prescription/${appointment.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            View Prescription
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 