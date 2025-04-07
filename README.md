# ReproMitra - Reproductive Health Consultation Platform

ReproMitra is a privacy-focused reproductive health consultation platform that connects patients with specialized doctors through secure video consultations.

## Features

- 🔒 Privacy-first approach with pseudonyms
- 👨‍⚕️ Doctor directory with search and filtering
- 📅 Appointment booking system
- 🎥 Secure video consultations
- 📝 Digital prescriptions
- 👤 User profile management
- 🌐 Multi-language support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Jitsi Meet account (for video consultations)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd repro-mitra
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_JITSI_DOMAIN=your_jitsi_domain
```

4. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Set up Storage for prescription files
   - Update security rules in Firebase Console

5. Set up Jitsi Meet:
   - Create a Jitsi Meet account
   - Configure your domain
   - Update the Jitsi domain in your `.env` file

## Running the Project

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

## Building for Production

1. Build the project:
```bash
npm run build
# or
yarn build
```

2. Preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── pages/          # Page components
├── utils/          # Utility functions
├── firebase.js     # Firebase configuration
└── App.jsx         # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@repromitra.com or open an issue in the repository. 