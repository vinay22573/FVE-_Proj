import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function VideoConsultation() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const jitsiContainer = useRef(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const appointmentDoc = await getDoc(doc(db, 'appointments', appointmentId));
        if (appointmentDoc.exists()) {
          const data = appointmentDoc.data();
          // Check if the current user is either the patient or the doctor
          if (data.patientId !== currentUser.uid && data.doctorId !== currentUser.uid) {
            setError('You are not authorized to access this consultation');
            return;
          }
          setAppointment(data);
        } else {
          setError('Appointment not found');
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setError('Failed to load appointment details');
      }
      setLoading(false);
    };

    fetchAppointment();
  }, [appointmentId, currentUser.uid]);

  useEffect(() => {
    if (appointment && jitsiContainer.current) {
      const domain = import.meta.env.VITE_JITSI_DOMAIN;
      const options = {
        roomName: `ReproMitra-${appointmentId}`,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainer.current,
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'closedcaptions',
            'desktop',
            'fullscreen',
            'fodeviceselection',
            'hangup',
            'profile',
            'chat',
            'recording',
            'livestreaming',
            'etherpad',
            'sharedvideo',
            'settings',
            'raisehand',
            'videoquality',
            'filmstrip',
            'invite',
            'feedback',
            'stats',
            'shortcuts',
            'tileview',
            'videobackgroundblur',
            'download',
            'help',
            'mute-everyone',
            'mute-video-everyone'
          ]
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableClosePage: true,
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          enableNoAudioDetection: true,
          enableNoisyMicDetection: true,
          requireDisplayName: true,
          startScreenSharing: false,
          enableEmailInStats: false
        },
        userInfo: {
          displayName: userData?.pseudonym || 'Anonymous User',
          email: currentUser.email
        },
        onload: () => {
          console.log('Jitsi Meet loaded');
        }
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      api.addEventListeners({
        readyToClose: async () => {
          try {
            await updateDoc(doc(db, 'appointments', appointmentId), {
              status: 'completed',
              completedAt: new Date()
            });
            navigate(`/prescription/${appointmentId}`);
          } catch (error) {
            console.error('Error updating appointment status:', error);
          }
        },
        participantLeft: () => {
          console.log('Participant left');
        },
        participantJoined: () => {
          console.log('Participant joined');
        },
        videoConferenceJoined: () => {
          console.log('Video conference joined');
        },
        videoConferenceLeft: () => {
          console.log('Video conference left');
        }
      });

      return () => {
        api.dispose();
      };
    }
  }, [appointment, appointmentId, currentUser.email, userData?.pseudonym, navigate]);

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
    <div className="h-screen w-full">
      <div ref={jitsiContainer} className="h-full w-full" />
    </div>
  );
} 