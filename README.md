# UpNext - Patient Queue Management System

A modern, real-time patient queue management system built with React, Firebase, and Tailwind CSS.

## Features

- **Real-time Queue Management**: Live updates using Firebase Firestore
- **Patient Registration**: Simple form for patients to join the queue
- **Admin Dashboard**: Comprehensive management interface for clinic staff
- **QR Code Generation**: Easy patient access via QR code scanning
- **Responsive Design**: Works perfectly on all devices
- **Toast Notifications**: Real-time feedback for all actions

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Build Tool**: Vite
- **Icons**: Lucide React
- **QR Code**: QRCode.js
- **Notifications**: React Hot Toast

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication with Email/Password
4. Get your Firebase config from Project Settings

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Security Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /patients/{document} {
      allow read, write: if true;
    }
  }
}
```

### 4. Create Admin User

1. Go to Firebase Console > Authentication
2. Add a new user with email and password
3. Use these credentials to log into the admin dashboard

### 5. Install and Run

```bash
npm install
npm run dev
```

## Usage

### For Patients
1. Visit the main page
2. Fill out the registration form
3. Wait for your turn in the queue

### For Clinic Staff
1. Navigate to `/admin`
2. Log in with admin credentials
3. Manage the queue in real-time
4. Download QR code for patient access

## Admin Dashboard Features

- **Queue Overview**: See all patients in real-time
- **Patient Management**: Skip, edit, remove, or mark as served
- **Statistics**: Track daily patient flow
- **QR Code Generator**: Create printable QR codes

## Deployment

This app is ready for deployment on Vercel:

1. Push your code to a Git repository
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Demo Credentials

- **Admin Email**: admin@upnext.com
- **Admin Password**: admin123

## Security Considerations

- Update Firebase security rules for production
- Use environment variables for all sensitive data
- Implement proper user roles and permissions
- Enable Firebase security features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.#   u p n x t  
 