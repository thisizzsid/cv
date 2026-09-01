# Lets make CV

Free, ATS-friendly resume builder with Firebase backend. Create a professional one-page resume that passes Applicant Tracking Systems and securely store it in the cloud.

## Features

- ✨ **ATS-Friendly**: Clean, standard formatting that every ATS can parse
- 📄 **One-Page Format**: Perfect resume length that fits on a single page
- 🎨 **Multiple Color Themes**: Choose from Pine, Ink, Plum, or Rust color schemes
- 📊 **Resume Strength Scoring**: Get real-time feedback on your resume
- 🎯 **Job Description Matching**: See how well your resume matches a job posting
- 💾 **Cloud Storage**: Save and manage multiple resumes with Firebase
- 🔐 **Secure Authentication**: User accounts with Firebase Authentication
- 📥 **Download Options**: Download as PDF or ATS-compatible text file
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🔒 **Privacy First**: Your data is encrypted and stored securely in Firebase

## Project Structure

```
cv/
├── index.html              # HTML entry point
├── styles.css              # Complete stylesheet
├── main.jsx                # React entry point
├── app.jsx                 # Main CVMaker component
├── LoginPage.jsx           # Authentication component
├── firebase-config.js      # Firebase configuration
├── firebase-auth.js        # Firebase authentication service
├── firebase-service.js     # Firebase database service
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## Installation & Setup

### 1. Clone or download this project
```bash
cd cv
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Set up Firestore Database and Authentication (Email/Password)
- Copy your Firebase configuration

### 4. Create `.env.local` file
```bash
cp .env.example .env.local
```

Then fill in your Firebase credentials:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Set up Firestore Rules
In Firebase Console, set these Firestore Security Rules:
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

## Development

Start the development server:
```bash
npm run dev
```

The app will open in your browser at `http://localhost:3000`

## Building for Production

Create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## How to Use

1. **Sign Up**: Create an account with your email
2. **Fill in Your Information**: Start with your contact details
3. **Add Your Summary**: Write a brief professional summary (2-3 lines)
4. **Add Experience**: List your work experience with quantified achievements
5. **Add Education**: Include your degree and institution
6. **Add Skills**: List tools and skills relevant to your target role
7. **Optional Sections**: Add projects or certifications if relevant
8. **Match Job Descriptions**: Paste a job posting to see how well you match
9. **Save Resume**: Save your resume to your account
10. **Download**: Export as PDF or download as ATS text

## Tips for a Strong Resume

- Start bullets with action verbs (built, designed, increased, reduced, etc.)
- Quantify your achievements (percentages, numbers, time saved)
- Keep it to one page
- Use only relevant skills and experience
- Customize for each job application
- Save multiple versions for different roles

## Technical Stack

- **React 18**: UI framework
- **Vite**: Build tool and development server
- **Firebase**: Backend (Authentication, Firestore, Storage)
- **Lucide React**: Icon library
- **CSS3**: Styling with custom properties

## Keyboard Shortcuts

- **Ctrl/Cmd + P**: Print (Download PDF)
- **Tab**: Navigate through form fields

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Firebase Features

### Authentication
- Email/Password sign up and sign in
- Secure session management
- Password reset functionality

### Database (Firestore)
- Store multiple resume versions
- Auto-sync across devices
- Real-time updates

### Features
- Auto-save every 30 seconds
- Local storage backup
- One-click restore

## License

MIT License - Feel free to use and modify

## Contributing

Found a bug or have a feature request? Feel free to create an issue or submit a pull request.

## Author

Created with ❤️ for job seekers everywhere

## Support

For issues, questions, or suggestions, please create an issue in the repository.

---

Ready to make your CV? Sign up and get started! 🚀
