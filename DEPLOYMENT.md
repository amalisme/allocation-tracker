# 🚀 Deployment Checklist

## Pre-Deployment
- [ ] All files present (index.html, styles.css, app.js, manifest.json, sw.js, icons)
- [ ] Test locally using `python3 server.py`
- [ ] Verify on phone connected to same WiFi
- [ ] Check console for errors (Safari → Develop → iPhone → Console)

## Deployment Options

### Option 1: GitHub Pages (Recommended)
- [ ] Create GitHub account
- [ ] Create new repository: `allocation-tracker`
- [ ] Upload all files
- [ ] Enable Pages: Settings → Pages → Deploy from main
- [ ] Wait 2-3 minutes for deployment
- [ ] Test URL: `https://your-username.github.io/allocation-tracker`

### Option 2: Netlify
- [ ] Go to netlify.com
- [ ] Drag and drop `allocation-tracker` folder
- [ ] Get instant URL: `https://allocation-tracker-xyz.netlify.app`
- [ ] (Optional) Custom domain in settings

### Option 3: Vercel
- [ ] Go to vercel.com
- [ ] Connect GitHub repo or upload folder
- [ ] Auto-deploys on every change

## Post-Deployment

### Test the PWA
- [ ] Visit URL on iPhone Safari
- [ ] Check all features work
- [ ] Verify Service Worker installed (Safari Console)
- [ ] Test offline mode (Airplane mode)

### Install on iPhone
- [ ] Open URL in Safari
- [ ] Tap Share button
- [ ] Tap "Add to Home Screen"
- [ ] Verify icon appears
- [ ] Open app (no browser UI should show)
- [ ] Test all features
- [ ] Close app and reopen (should load instantly)

### Verify Offline Functionality
- [ ] Open app while online
- [ ] Enable Airplane mode
- [ ] Close app completely
- [ ] Reopen app
- [ ] Should work perfectly offline!

## Sharing with Partner

### Send them:
1. The direct URL
2. Installation instructions:
   ```
   1. Open this link in Safari: [YOUR-URL]
   2. Tap the Share button (square with arrow)
   3. Scroll down, tap "Add to Home Screen"
   4. Tap "Add"
   Done! It's now on your home screen.
   ```
3. Optional: Screenshots of the install process

### What to tell them:
- "It works offline after first load"
- "Your data stays on your phone"
- "Tap 'Reset Month' at the end of each month"
- "Add payments as you make them"

## Troubleshooting Tips

### If "Add to Home Screen" doesn't appear:
- Make sure using Safari (not Chrome/Firefox)
- Check URL starts with https://
- Try refreshing the page
- Clear Safari cache if needed

### If offline mode doesn't work:
- Visit site once while online first
- Check Service Worker in Safari Console
- Try closing and reopening app

### If data disappears:
- Don't clear browser cache/data
- Each browser has separate storage
- Uninstalling removes data

## Update Process

When you make changes:
1. Edit files
2. Push to GitHub / re-upload to Netlify
3. Users: Close app → Clear Safari cache → Reopen
4. New version will be cached

### Force update:
Change version in sw.js:
```javascript
const CACHE_NAME = 'allocation-tracker-v2'; // Increment version
```

## Success Indicators ✅

You'll know it's working when:
- Icon appears on home screen
- Opens without Safari UI
- Loads instantly (after first visit)
- Works in airplane mode
- Data persists between sessions

---

**Ready to deploy? Pick your option above and follow the steps!**
