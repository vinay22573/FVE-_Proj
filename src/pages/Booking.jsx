import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../hooks/useAuth';

const Booking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState([]);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const doctorDoc = await getDoc(doc(db, 'doctors', doctorId));
        if (doctorDoc.exists()) {
          setDoctor({ id: doctorDoc.id, ...doctorDoc.data() });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor:', error);
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;

      try {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(
          appointmentsRef,
          where('doctorId', '==', doctorId),
          where('date', '==', selectedDate)
        );
        const snapshot = await getDocs(q);
        const slots = snapshot.docs.map(doc => doc.data().time);
        setBookedSlots(slots);
      } catch (error) {
        console.error('Error fetching booked slots:', error);
      }
    };

    fetchBookedSlots();
  }, [doctorId, selectedDate]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    try {
      const appointmentsRef = collection(db, 'appointments');
      await addDoc(appointmentsRef, {
        doctorId,
        patientId: user.uid,
        date: selectedDate,
        time: selectedTime,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      });

      navigate(`/video-call/${doctorId}-${selectedDate.replace(/-/g, '')}-${selectedTime.replace(/:/g, '')}`);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Doctor not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Book Appointment</h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Doctor Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {doctor.name}</p>
            <p><span className="font-medium">Specialization:</span> {doctor.specialization}</p>
            <p><span className="font-medium">Languages:</span> {doctor.languages.join(', ')}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Select Date and Time</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    onClick={() => !isBooked && setSelectedTime(slot)}
                    disabled={isBooked}
                    className={`p-2 rounded-md text-center ${
                      selectedTime === slot
                        ? 'bg-blue-600 text-white'
                        : isBooked
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking; 