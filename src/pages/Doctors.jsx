import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import DoctorCard from '../components/DoctorCard';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, 'doctors');
        const snapshot = await getDocs(doctorsCollection);
        const doctorsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = [...doctors];

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.languages.includes(selectedLanguage)
      );
    }

    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.specialization === selectedSpecialization
      );
    }

    setFilteredDoctors(filtered);
  }, [selectedLanguage, selectedSpecialization, doctors]);

  const languages = ['all', 'English', 'Hindi', 'Odia', 'Tamil'];
  const specializations = ['all', 'Gynecologist', 'General Physician', 'Pediatrician'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Find a Doctor</h1>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization
          </label>
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Doctors; 