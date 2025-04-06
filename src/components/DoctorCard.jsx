import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const {
    id,
    name,
    specialization,
    experience,
    languages,
    gender,
    hasAyushmaan
  } = doctor;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
          {hasAyushmaan && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Ayushmaan
            </span>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Specialization:</span> {specialization}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Experience:</span> {experience} years
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Gender:</span> {gender}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="font-medium text-gray-600">Languages:</span>
            {languages.map((lang) => (
              <span
                key={lang}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Link
            to={`/booking/${id}`}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard; 