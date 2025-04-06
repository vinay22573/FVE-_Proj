import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const VideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const jitsiRef = useRef(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const appointmentDoc = await getDoc(doc(db, 'appointments', appointmentId));
        if (appointmentDoc.exists()) {
          setAppointment(appointmentDoc.data());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleApiReady = (api) => {
    jitsiRef.current = api;
  };

  const handleReadyToClose = () => {
    navigate(`/prescription/${appointmentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Appointment not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <JitsiMeeting
        roomName={`ReproMitra-${appointmentId}`}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableClosePage: true,
          disableDeepLinking: true,
          prejoinPageEnabled: false,
          toolbarButtons: [
            'microphone',
            'camera',
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
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false,
          MOBILE_APP_PROMO: false,
          HIDE_INVITE_MORE_HEADER: true
        }}
        onApiReady={handleApiReady}
        onReadyToClose={handleReadyToClose}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
};

export default VideoCall; 