import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    language: 'English',
    age: '',
    gender: ''
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where('patientId', '==', user.uid));
        const snapshot = await getDocs(q);
        const appointmentsData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const appointmentData = doc.data();
            const doctorDoc = await getDoc(doc(db, 'doctors', appointmentData.doctorId));
            return {
              id: doc.id,
              ...appointmentData,
              doctor: doctorDoc.data()
            };
          })
        );
        setAppointments(appointmentsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    const fetchPreferences = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setPreferences(userDoc.data().preferences || preferences);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchAppointments();
    fetchPreferences();
  }, [user.uid]);

  const handlePreferenceChange = async (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        preferences: { ...preferences, [name]: value }
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Language
                </label>
                <select
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferenceChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Odia">Odia</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={preferences.age}
                  onChange={handlePreferenceChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={preferences.gender}
                  onChange={handlePreferenceChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Dr. {appointment.doctor.name}</h3>
                      <p className="text-gray-600">{appointment.doctor.specialization}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">{appointment.time}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}

              {appointments.length === 0 && (
                <p className="text-gray-600 text-center py-4">
                  No appointments found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 