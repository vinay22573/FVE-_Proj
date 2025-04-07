import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function Prescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const appointmentDoc = await getDoc(doc(db, 'appointments', appointmentId));
        if (appointmentDoc.exists()) {
          const data = appointmentDoc.data();
          // Check if the current user is either the patient or the doctor
          if (data.patientId !== currentUser.uid && data.doctorId !== currentUser.uid) {
            setError('You are not authorized to view this prescription');
            return;
          }
          setPrescription(data.prescription || {});
        } else {
          setError('Prescription not found');
        }
      } catch (error) {
        console.error('Error fetching prescription:', error);
        setError('Failed to load prescription');
      }
      setLoading(false);
    };

    fetchPrescription();
  }, [appointmentId, currentUser.uid]);

  const handleDownload = () => {
    // Create a PDF document with the prescription details
    const doc = new window.jspdf.jsPDF();
    
    // Add prescription header
    doc.setFontSize(20);
    doc.text('ReproMitra - Prescription', 105, 20, { align: 'center' });
    
    // Add patient details
    doc.setFontSize(12);
    doc.text(`Patient ID: ${prescription.patientId}`, 20, 40);
    doc.text(`Date: ${new Date(prescription.date).toLocaleDateString()}`, 20, 50);
    
    // Add medications
    doc.setFontSize(14);
    doc.text('Medications:', 20, 70);
    doc.setFontSize(12);
    prescription.medications.forEach((med, index) => {
      const y = 80 + (index * 20);
      doc.text(`${med.name} - ${med.dosage}`, 20, y);
      doc.text(`Instructions: ${med.instructions}`, 20, y + 10);
    });
    
    // Add doctor's notes
    if (prescription.notes) {
      doc.setFontSize(14);
      doc.text('Doctor\'s Notes:', 20, 160);
      doc.setFontSize(12);
      doc.text(prescription.notes, 20, 170);
    }
    
    // Save the PDF
    doc.save(`prescription-${appointmentId}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Error</h1>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Prescription
              </h3>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Download PDF
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(prescription.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Medications</h4>
                <div className="mt-2 space-y-4">
                  {prescription.medications?.map((med, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-900">{med.name}</p>
                      <p className="mt-1 text-sm text-gray-500">Dosage: {med.dosage}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Instructions: {med.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {prescription.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Doctor's Notes</h4>
                  <p className="mt-1 text-sm text-gray-900">{prescription.notes}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500">Follow-up</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {prescription.followUpDate
                    ? `Recommended follow-up on ${new Date(
                        prescription.followUpDate
                      ).toLocaleDateString()}`
                    : 'No follow-up scheduled'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 