# Instructions to Run ReproMitra

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Jitsi Meet account

## Step 1: Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd repro-mitra

# Install dependencies
npm install
# or
yarn install
```

## Step 2: Environment Configuration
Create a `.env` file in the root directory with your configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_JITSI_DOMAIN=your_jitsi_domain
```

## Step 3: Firebase Setup
1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password and Google providers
3. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
4. Set up Storage:
   - Go to Storage
   - Create a new storage bucket
5. Update security rules in Firebase Console

## Step 4: Jitsi Meet Setup
1. Create a Jitsi Meet account at https://jitsi.org/
2. Configure your domain
3. Update the Jitsi domain in your `.env` file

## Step 5: Run the Project
```bash
# Start the development server
npm run dev
# or
yarn dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

## Step 6: Build for Production (Optional)
```bash
# Build the project
npm run build
# or
yarn build

# Preview the production build
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

## Troubleshooting
1. If you encounter any Firebase-related errors:
   - Double-check your Firebase configuration in `.env`
   - Verify that all required Firebase services are enabled
   - Check Firebase security rules

2. If video consultations don't work:
   - Verify your Jitsi domain configuration
   - Check browser console for any Jitsi-related errors
   - Ensure your browser has camera and microphone permissions

3. For general issues:
   - Clear browser cache
   - Restart the development server
   - Check the browser console for errors

## Support
For additional support:
- Email: support@repromitra.com
- Open an issue in the repository 