# Deployment Guide

This guide covers how to deploy "Lets make CV" to production.

## Option 1: Firebase Hosting (Recommended)

Firebase Hosting is the easiest option since you're already using Firebase.

### Prerequisites
- Firebase project already created
- Node.js installed
- Firebase CLI: `npm install -g firebase-tools`

### Steps

1. **Initialize Firebase Hosting:**
```bash
firebase init hosting
```

2. **When prompted:**
   - Select your Firebase project
   - Public directory: `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds: `No` (optional)

3. **Build the project:**
```bash
npm run build
```

4. **Deploy:**
```bash
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

## Option 2: Vercel

Vercel provides excellent React/Vite hosting.

### Steps

1. **Push to GitHub** (if not already done)

2. **Go to [Vercel](https://vercel.com)**
   - Click "New Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Environment Variables:**
   - Add all your `.env.local` variables
   - Vercel dashboard → Settings → Environment Variables

4. **Deploy:**
   - Vercel will automatically deploy on git push

## Option 3: Netlify

Another great option for static site hosting.

### Steps

1. **Build locally:**
```bash
npm run build
```

2. **Go to [Netlify](https://netlify.com)**
   - Click "New site from Git"
   - Connect your repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add Environment Variables:**
   - Site settings → Build & deploy → Environment

4. **Deploy:**
   - Netlify will automatically build and deploy

## Option 4: Traditional Server (Node.js)

For hosting on your own server or VPS.

### Prerequisites
- Node.js server
- Nginx or Apache configured as reverse proxy

### Steps

1. **Build locally:**
```bash
npm run build
```

2. **Upload to server:**
```bash
scp -r dist/* your-server:/var/www/letsmakecv/
```

3. **Install dependencies on server:**
```bash
npm install --production
```

4. **Configure reverse proxy (Nginx):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/letsmakecv;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Redirect www to non-www
    if ($host = www.yourdomain.com) {
        return 301 https://yourdomain.com$request_uri;
    }
}
```

5. **Enable HTTPS with Let's Encrypt:**
```bash
sudo certbot --nginx -d yourdomain.com
```

## Environment Variables for Production

Make sure to set these in your hosting platform:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## Performance Optimization

### Before Deployment

1. **Analyze bundle size:**
```bash
npm install -D rollup-plugin-visualizer
```

2. **Enable compression:**
   - Most hosting platforms do this automatically

3. **Set up CDN:**
   - Firebase Hosting: built-in CDN
   - Vercel/Netlify: built-in CDN
   - Custom server: use Cloudflare

### Monitoring

1. **Firebase Console:**
   - Monitor Authentication signups
   - Check Firestore usage
   - Review error logs

2. **Web Analytics:**
   - Add Google Analytics
   - Track user behavior
   - Monitor conversion rates

## Backup Strategy

### Automatic Backups
- Firestore: Automatic daily backups (enable in Console)
- Database export: Monthly export to Cloud Storage

### Manual Backup
```bash
# Export Firestore
firebase firestore:export gs://your-bucket/backup-$(date +%Y%m%d)
```

## Domain Setup

### Using Custom Domain with Firebase Hosting

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Verify domain ownership
5. SSL certificate auto-provisioned

### Using Custom Domain with Vercel/Netlify

1. Update DNS records to point to provider
2. Add domain in dashboard
3. SSL automatically configured

## Monitoring & Analytics

### Set up monitoring
- Google Analytics
- Firebase Console metrics
- Error tracking (Sentry, etc.)

### Key metrics to track
- User signups per day
- Resume saves per day
- Download counts
- Error rates

## Scaling Considerations

### As you grow:

1. **Database:**
   - Monitor Firestore reads/writes
   - Scale read replicas if needed
   - Archive old resumes

2. **Authentication:**
   - Consider OAuth (Google, GitHub)
   - Implement rate limiting
   - Add email verification

3. **Performance:**
   - Monitor page load times
   - Optimize images
   - Enable aggressive caching

## Troubleshooting

### App shows blank page
- Check browser console for errors
- Verify environment variables are set
- Check Firebase connectivity

### Authentication fails
- Verify Firebase config is correct
- Check Firestore rules
- Ensure email/password auth is enabled

### Slow performance
- Check Firestore indexing
- Monitor network requests
- Enable CDN caching

## Security Checklist

- ✅ HTTPS enabled
- ✅ Firestore rules properly configured
- ✅ Environment variables never committed
- ✅ Regular backups enabled
- ✅ Error logging configured
- ✅ Rate limiting considered
- ✅ CORS properly configured

## Rollback Plan

If deployment breaks:

1. **Firebase Hosting:**
   ```bash
   firebase hosting:sites:list
   firebase deploy --only hosting:previous-version
   ```

2. **Vercel/Netlify:**
   - Use dashboard to rollback to previous deployment

3. **Manual server:**
   - Keep previous build backed up
   - Use symbolic links for quick rollback

## Post-Deployment

1. Test all features thoroughly
2. Monitor error logs
3. Get user feedback
4. Plan feature updates
5. Maintain security patches

---

Need help? Check your hosting platform's documentation or Firebase docs.
