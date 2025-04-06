import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'doctor'));
        const querySnapshot = await getDocs(q);
        const doctorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !specialtyFilter || doctor.specialty === specialtyFilter;
    const matchesLanguage = !languageFilter || doctor.languages.includes(languageFilter);
    
    return matchesSearch && matchesSpecialty && matchesLanguage;
  });

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];
  const languages = [...new Set(doctors.flatMap(doctor => doctor.languages))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="mt-2 text-gray-600">
          Browse our network of qualified reproductive health specialists
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Search by name or specialty"
                />
              </div>

              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <select
                  id="specialty"
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">All Specialties</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  id="language"
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">All Languages</option>
                  {languages.map(language => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor List */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      className="h-16 w-16 rounded-full"
                      src={doctor.photoURL}
                      alt={doctor.name}
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{doctor.bio}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Languages</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doctor.languages.map(language => (
                        <span
                          key={language}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      to={`/appointment/${doctor.id}`}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No doctors found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 