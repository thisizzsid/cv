# Firebase Setup Guide

This guide will help you set up Firebase for the "Lets make CV" application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "letsmakecv" (or your preferred name)
4. Accept the default settings and click "Create project"
5. Wait for the project to be created

## Step 2: Set Up Firebase Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. In "Sign-in method," enable "Email/Password"
4. Click "Save"

## Step 3: Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Start in **Production mode**
4. Choose your database location (e.g., us-central1)
5. Click "Create"

## Step 4: Set Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /resumes/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under "General" tab, scroll down to find your apps
3. Click on the web app (or create one with `</>`  icon)
4. Copy the Firebase configuration object (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "letsmakecv.firebaseapp.com",
  projectId: "letsmakecv",
  storageBucket: "letsmakecv.appspot.com",
  messagingSenderId: "123456789...",
  appId: "1:123456789:web:abc123def456"
};
```

## Step 6: Configure Your Application

1. In the project root, create a `.env.local` file:
```bash
cp .env.example .env.local
```

2. Add your Firebase credentials to `.env.local`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace with your actual values from Step 5.

## Step 7: Install Dependencies

```bash
npm install
```

## Step 8: Run the Application

```bash
npm run dev
```

The app should now run at `http://localhost:3000`

## Firestore Database Structure

Your resumes will be stored with this structure:

```
resumes/
├── {resumeId1}/
│   ├── userId: "user_id"
│   ├── personal: { name, email, phone, title, location, link }
│   ├── summary: "Professional summary..."
│   ├── experience: [{ role, company, location, start, end, bullets }]
│   ├── education: [{ degree, school, location, start, end, score }]
│   ├── skills: ["skill1", "skill2"]
│   ├── projects: [{ name, description, link }]
│   ├── certifications: [{ name, issuer, year }]
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
└── {resumeId2}/
    └── ...
```

## Troubleshooting

### "PERMISSION_DENIED" Error
- Check your Firestore Rules are correctly set
- Make sure you're logged in
- Verify the userId matches in the database

### "Firebase configuration is missing"
- Make sure `.env.local` file exists
- Verify all environment variables are set correctly
- Restart the dev server after adding `.env.local`

### Authentication not working
- Check that Email/Password is enabled in Firebase Authentication
- Clear browser cache and cookies
- Try in an incognito/private window

## Production Deployment

When deploying to production:

1. Update environment variables in your hosting platform
2. Ensure Firestore rules are properly set
3. Enable CORS if needed for your domain
4. Monitor Firebase usage in Console

## Security Checklist

- ✅ Firestore rules restrict data access by userId
- ✅ Authentication enabled for Email/Password
- ✅ Environment variables not committed to git
- ✅ HTTPS enabled for production
- ✅ Regular backups of Firestore data

## Support

For Firebase issues, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Console Help](https://support.google.com/firebase)
