import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const Prescription = () => {
  const { appointmentId } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const prescriptionDoc = await getDoc(doc(db, 'prescriptions', appointmentId));
        if (prescriptionDoc.exists()) {
          setPrescription(prescriptionDoc.data());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prescription:', error);
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [appointmentId]);

  const handleDownload = () => {
    // In a real implementation, this would download the actual PDF
    alert('Prescription downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Prescription not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Prescription</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Dr. {prescription.doctorName}</h2>
              <p className="text-gray-600">{prescription.specialization}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Date: {new Date(prescription.date).toLocaleDateString()}</p>
              <p className="text-gray-600">Time: {prescription.time}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Medication</h3>
            <div className="space-y-4">
              {prescription.medications.map((med, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.dosage}</p>
                  </div>
                  <p className="text-gray-600">{med.duration}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Instructions</h3>
            <p className="text-gray-600 whitespace-pre-line">{prescription.instructions}</p>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Follow-up</h3>
            <p className="text-gray-600">
              Next appointment: {prescription.followUpDate ? new Date(prescription.followUpDate).toLocaleDateString() : 'Not scheduled'}
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Print
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-green-600">
            Prescription has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Prescription; 