# Installation & First Run Guide

Complete step-by-step guide to get "Lets make CV" running for the first time.

## System Requirements

Before you start, make sure you have:
- ✅ Node.js 16 or higher ([Download](https://nodejs.org))
- ✅ npm (comes with Node.js)
- ✅ A code editor (VSCode recommended - [Download](https://code.visualstudio.com))
- ✅ A Firebase account ([Create free account](https://firebase.google.com))
- ✅ Git (optional but recommended - [Download](https://git-scm.com))

## Step 1: Verify Node.js Installation

Open your terminal and run:

```bash
node --version    # Should show v16.0.0 or higher
npm --version     # Should show 8.0.0 or higher
```

If these commands don't work, [install Node.js first](https://nodejs.org).

## Step 2: Navigate to Project Directory

```bash
cd /Users/thisizzsid/Downloads/cv
```

You should see files like `package.json`, `app.jsx`, etc.

## Step 3: Install Dependencies

This downloads all required libraries:

```bash
npm install
```

⏳ **This will take 2-5 minutes** (first time only)

When done, you should see:
```
added XX packages, and audited XX packages in Xm XXs
```

A new folder `node_modules/` will be created (you can ignore this).

## Step 4: Create Environment File

Create a file named `.env.local` in the project root:

**Option A: Using Command Line**
```bash
cp .env.example .env.local
```

**Option B: Manually**
1. Open the `cv` folder in your editor
2. Create a new file named `.env.local`
3. Copy content from `.env.example`

Your `.env.local` should look like:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

⚠️ **IMPORTANT**: Keep this file private! Don't share it!

## Step 5: Set Up Firebase Project

Follow the complete Firebase setup guide:

👉 **[Open FIREBASE_SETUP.md](FIREBASE_SETUP.md)** and follow all steps.

This will give you the credentials to fill in `.env.local`.

### Quick Firebase Summary:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project (name: "letsmakecv")
3. Enable Email/Password authentication
4. Create Firestore database
5. Copy credentials to `.env.local`

## Step 6: Start Development Server

Once `.env.local` is filled with Firebase credentials:

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

## Step 7: Open in Browser

Click the link or go to: **http://localhost:3000**

Your app should load! 🎉

## Step 8: Test the App

### Test Sign Up
1. Click "Sign Up" tab
2. Enter email: test@example.com
3. Enter password: Test1234!
4. Click "Create Account"

If successful, you'll see the CV editor.

### Test Resume Creation
1. Fill in your name
2. Add email and phone
3. Add some work experience
4. Click "Save Resume"
5. You should see "Resume saved successfully!"

### Test Resume Download
1. Click "Download PDF"
2. PDF should download to your computer

### Test Logout
1. Click "Logout" button (top right)
2. You should return to login screen

If all of these work, **congratulations!** Your app is fully functional. 🎊

---

## Troubleshooting First Run

### Problem: "Cannot find node" or "npm not found"
**Solution**: Node.js is not installed or not in PATH
- [Download and install Node.js](https://nodejs.org)
- Restart your terminal
- Try again

### Problem: "Cannot find module" or "npm ERR!"
**Solution**: Dependencies not installed properly
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Firebase configuration is missing"
**Solution**: `.env.local` file is missing or incomplete
- Make sure `.env.local` exists (not `.env`)
- Copy ALL values from Firebase console
- Restart dev server: `npm run dev`

### Problem: "Connection refused" to Firebase
**Solution**: Firebase credentials are wrong
- Double-check values in `.env.local`
- Verify Firebase project exists
- Make sure Email/Password auth is enabled
- Wait 1-2 minutes for changes to propagate

### Problem: "Failed to sign up" 
**Solution**: Email or password issue
- Use valid email format
- Password must be 6+ characters
- Use strong password
- Check if email already exists

### Problem: App shows blank screen
**Solution**: Browser console error
1. Press F12 to open developer tools
2. Check the Console tab for errors
3. Look for red error messages
4. Google the error message or check Firebase docs

---

## Common Commands

### During Development
```bash
npm run dev        # Start development server
npm run lint       # Check code for errors
```

### Before Deployment
```bash
npm run build      # Create production build
npm run preview    # Test production build
```

### Firebase Deployment
```bash
firebase login     # Login to Firebase
firebase deploy    # Deploy to Firebase Hosting
```

---

## File You Just Created

After this setup, these files should exist in the `cv` folder:

- `.env.local` ← **You created this with Firebase credentials**
- `node_modules/` ← Created by npm install (folder)
- `package-lock.json` ← Created by npm install
- All other files were already there

---

## Next Steps

### If Everything Works ✅
1. Read [README.md](README.md) for full documentation
2. Start building your resume app
3. Customize colors and styling
4. When ready, deploy using [DEPLOYMENT.md](DEPLOYMENT.md)

### If Something Doesn't Work ❌
1. Check [Troubleshooting](#troubleshooting-first-run) section above
2. Read [FIREBASE_SETUP.md](FIREBASE_SETUP.md) carefully
3. Check browser console (F12) for error messages
4. Verify all Firebase credentials are correct

---

## Development Workflow

**Daily workflow after initial setup:**

```bash
# Every morning, start the dev server
npm run dev

# Make changes to code (auto-reloads)
# Test your changes in browser

# When done, press Ctrl+C to stop server
```

**When deploying:**

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

---

## Security Reminders

🔒 **IMPORTANT:**
- ✅ Never commit `.env.local` to git (it's in .gitignore)
- ✅ Never share your Firebase credentials
- ✅ Keep your passwords secure
- ✅ Use strong passwords (12+ characters)
- ✅ Don't post credentials on GitHub/internet

---

## Getting Help

If you get stuck:

1. **Check documentation first:**
   - [README.md](README.md) - Full docs
   - [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Setup help
   - [FILES_REFERENCE.md](FILES_REFERENCE.md) - File descriptions

2. **Google the error message:**
   - Copy the error text
   - Search: `[error text] firebase react`
   - Look on Stack Overflow or Firebase docs

3. **Check Firebase Console:**
   - Go to [firebase.google.com](https://firebase.google.com)
   - Check if your project exists
   - Verify authentication is enabled
   - Check Firestore permissions

4. **Browser Developer Tools:**
   - Press F12
   - Go to Console tab
   - Look for red error messages
   - Copy error and Google it

---

## Quick Reference

| Task | Command | Time |
|------|---------|------|
| Install dependencies | `npm install` | 2-5 min |
| Start dev server | `npm run dev` | 5 sec |
| Build for production | `npm run build` | 30 sec |
| Deploy to Firebase | `firebase deploy` | 1-2 min |

---

## You're All Set! 🚀

Congratulations on getting your resume builder up and running!

**Next:** Read [README.md](README.md) for features and customization options.

**Questions?** Check the documentation files or Firebase docs.

**Ready to deploy?** Follow [DEPLOYMENT.md](DEPLOYMENT.md).

---

Happy resume building! 💼

