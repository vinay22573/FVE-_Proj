# ReproMitra - Privacy-First Reproductive Health Consultation Platform

ReproMitra is a full-stack web application that provides confidential reproductive health consultation services to underserved populations. The platform emphasizes privacy through pseudonym-based authentication and secure video consultations.

## Features

- 🔒 Privacy-first design with pseudonym-based authentication
- 📱 Mobile-responsive UI with multi-language support (English, Hindi, Odia, Tamil)
- 🏥 Doctor directory with language and specialization filters
- 📅 Appointment booking system
- 🎥 Secure video consultations using Jitsi Meet
- 📄 Digital prescriptions with download and print options
- 👤 User dashboard with appointment history and preferences

## Tech Stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Authentication: Firebase Authentication
- Database: Firebase Firestore
- Storage: Firebase Storage
- Video Calls: Jitsi Meet
- Hosting: Firebase Hosting

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account
- Jitsi Meet account (for video calls)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/repro-mitra.git
   cd repro-mitra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Phone Number provider
3. Create Firestore database with the following collections:
   - users
   - doctors
   - appointments
   - prescriptions
4. Set up Firebase Storage for prescription PDFs
5. Deploy security rules from the `firebase` directory

## Jitsi Meet Setup

1. Create a Jitsi Meet account
2. Configure your Jitsi Meet domain in the video call component
3. Set up custom branding and security settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Ayushmaan Bharat for healthcare integration
- Jitsi Meet for video consultation infrastructure
- Firebase for backend services
- React and Vite communities for frontend tools 