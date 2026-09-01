# Quick Start Guide

Get "Lets make CV" up and running in 5 minutes!

## Prerequisites
- Node.js 16+ installed
- A Firebase account
- A text editor

## 1. Quick Setup (3 min)

```bash
# Navigate to project
cd /Users/thisizzsid/Downloads/cv

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

## 2. Configure Firebase (2 min)

1. Go to https://console.firebase.google.com
2. Create a new project (or use existing)
3. Go to Project Settings → Web App
4. Copy the configuration values
5. Paste into `.env.local`:

```
VITE_FIREBASE_API_KEY=paste_your_api_key
VITE_FIREBASE_AUTH_DOMAIN=paste_your_auth_domain
VITE_FIREBASE_PROJECT_ID=paste_your_project_id
VITE_FIREBASE_STORAGE_BUCKET=paste_your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=paste_your_sender_id
VITE_FIREBASE_APP_ID=paste_your_app_id
```

## 3. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 4. Create Your First Resume

1. Sign up with your email
2. Fill in your details
3. Click "Save Resume" to save to cloud
4. Click "Download PDF" to get your resume

## Useful Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
firebase deploy      # Deploy to Firebase Hosting
```

## Features Overview

- **Edit View**: Form to fill in resume details
- **Preview View**: Live preview of your resume
- **Save Resume**: Cloud save with Firebase
- **Download PDF**: Professional PDF export
- **ATS Text**: Plain text format for ATS systems
- **Job Matching**: Match your resume to job descriptions
- **Color Themes**: 4 color schemes to choose from

## Common Tasks

### Save a Resume
1. Fill in your information
2. Click "Save Resume" button
3. Confirm save in notification

### Load a Resume
1. Sign in to your account
2. Previously saved resumes appear on sidebar
3. Click to load

### Download PDF
1. Make sure form is filled
2. Click "Download PDF"
3. PDF downloads to your device

### Match Job Description
1. Copy job posting
2. Paste in "Match a job description" section
3. See matching keywords highlighted

## Troubleshooting

### "Firebase configuration is missing"
- Check `.env.local` file exists
- Verify all variables are filled
- Restart dev server

### Can't sign in
- Check email is correct
- Verify password (8+ characters)
- Try signing up instead

### Resume not saving
- Check internet connection
- Verify Firebase project is active
- Check browser console for errors

## Next Steps

1. **Customize branding** in `app.jsx`
2. **Add more features** using Firebase
3. **Deploy to production** (see DEPLOYMENT.md)
4. **Configure custom domain** (see DEPLOYMENT.md)

## Firebase Setup

For detailed Firebase setup, see: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

## Deployment

For deployment instructions, see: [DEPLOYMENT.md](DEPLOYMENT.md)

## Need Help?

1. Check README.md for full documentation
2. Visit Firebase docs: https://firebase.google.com/docs
3. Check browser console for error messages
4. Create an issue in the repository

---

Happy resume building! 🚀
