# 💰 Allocation Tracker - PWA Learning Project

A Progressive Web App for tracking monthly hire purchase and mortgage allocations.

## 📚 What You've Built

This is a **Progressive Web App (PWA)** - it looks and feels like a native iPhone app, but it's built with web technologies!

### Your Allocations
- **Hire Purchase**: RM 33,000/month
- **Mortgage**: RM 10,000/month

---

## 🎓 Learning Breakdown - What Each File Does

### 1. **index.html** - The Structure
This is your app's skeleton. Key parts:
- `<meta name="viewport">` - Makes it mobile-responsive
- `<link rel="manifest">` - Connects to manifest.json (app config)
- `<meta name="apple-mobile-web-app-capable">` - Tells iOS this can be a standalone app
- Service Worker registration at the bottom - Enables offline mode

### 2. **styles.css** - The Appearance
Makes it look beautiful and professional:
- Mobile-first design (looks great on any screen size)
- Large touch targets (easy to tap on phone)
- Smooth animations and transitions
- Gradient background (feels like a real app)

### 3. **app.js** - The Brain
Handles all the logic:
- **localStorage** - Saves data in the browser so it persists
- **addPayment()** - Validates and records payments
- **updateDisplay()** - Updates the numbers you see
- **resetMonth()** - Clears data for new month

### 4. **manifest.json** - The App Configuration
Tells the phone about your app:
```json
{
  "name": "Allocation Tracker",           // Full name
  "short_name": "Allocations",            // Name under icon
  "display": "standalone",                // No browser UI
  "theme_color": "#4F46E5",              // Status bar color
  "icons": [...]                          // App icons
}
```

### 5. **sw.js** - The Service Worker (The Magic!)
This runs in the background and makes it a PWA:

**Three phases:**
1. **Install**: Downloads all files to cache
2. **Activate**: Manages cache versions
3. **Fetch**: Serves files from cache (offline mode)

**How it works:**
```
User opens app → Service Worker checks cache → 
If in cache: Instant load (even offline!)
If not: Download from internet → Save to cache
```

---

## 🚀 How to Deploy & Install

### Option 1: Free Hosting (Recommended for Learning)

#### A. Using GitHub Pages (Free, Easy, HTTPS included)

1. **Create GitHub account** at github.com

2. **Create new repository** named `allocation-tracker`

3. **Upload these files:**
   - index.html
   - styles.css
   - app.js
   - manifest.json
   - sw.js
   - icon-192.png
   - icon-512.png

4. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: Deploy from main branch
   - Save
   
5. **Your app will be at:**
   `https://your-username.github.io/allocation-tracker`

#### B. Using Netlify (Also Free, Even Easier)

1. Go to netlify.com
2. Drag and drop the `allocation-tracker` folder
3. Done! You get a URL like `https://allocation-tracker-xyz.netlify.app`

---

### 📱 Installing on iPhone (Step-by-Step)

Once deployed, follow these steps on your partner's iPhone:

1. **Open Safari** (must be Safari, not Chrome!)
   - Visit your deployed URL (e.g., `https://your-username.github.io/allocation-tracker`)

2. **Tap the Share button** (square with arrow pointing up)
   - It's at the bottom of the screen (or top right on iPad)

3. **Scroll down and tap "Add to Home Screen"**

4. **Customize (optional):**
   - Edit the name if you want
   - Tap "Add" in the top right

5. **Done!** 🎉
   - App icon appears on home screen
   - Opens like a native app
   - Works offline
   - No browser UI

---

## 🧪 Testing Locally

Want to test before deploying? Run this:

```bash
cd allocation-tracker
python3 server.py
```

Then:
1. Find your computer's IP address:
   - Mac: System Preferences → Network
   - Windows: `ipconfig` in command prompt
   - Example: `192.168.1.100`

2. On your iPhone (connected to same WiFi):
   - Open Safari
   - Go to `http://YOUR-IP:8000`
   - Example: `http://192.168.1.100:8000`

**Note:** Some PWA features only work over HTTPS, so deployment is better for full testing.

---

## 💡 How to Use the App

### Adding Payments
1. Enter payment amount in RM
2. Tap "Add Payment"
3. Watch the remaining balance update

### Viewing History
- Scroll down to see all payments
- Most recent payments appear first
- Shows date, time, and which allocation

### Starting New Month
- Tap "Reset Month" button
- Confirms before deleting
- Clears all payments

### Offline Mode
- After first load, works completely offline
- Data saved in browser storage
- Updates sync when back online (automatically)

---

## 🔧 Customization Ideas

Want to modify it? Try these:

### Change Allocation Amounts
In `app.js`, line 2-11:
```javascript
const ALLOCATIONS = {
    hp: {
        total: 33000,  // Change this
        name: 'Hire Purchase'
    },
    mortgage: {
        total: 10000,  // Change this
        name: 'Mortgage'
    }
};
```

### Add New Allocation Category
1. Add to `ALLOCATIONS` object
2. Duplicate a card in `index.html`
3. Update the `addPayment()` function

### Change Colors
In `styles.css`, line 10:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Try: `#10b981` (green), `#ef4444` (red), `#f59e0b` (orange)

---

## 🐛 Troubleshooting

### App won't install on iPhone
- ✅ Make sure you're using **Safari** (not Chrome)
- ✅ Check the site is using **HTTPS** (look for lock icon)
- ✅ Try clearing Safari cache: Settings → Safari → Clear History

### Offline mode not working
- ✅ Visit the app once while online first
- ✅ Check Service Worker is registered (see browser console)
- ✅ Try force-refreshing: Hold Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)

### Data disappeared
- ✅ Don't clear browser data/cache
- ✅ localStorage is per-browser (data won't sync between Safari and Chrome)
- ✅ Uninstalling app removes data

### "Add to Home Screen" option missing
- ✅ iOS 11.3+ required
- ✅ Must be in Safari (not in-app browser)
- ✅ Some enterprise iPhones have restrictions

---

## 📖 PWA Concepts Explained

### Why HTTPS is Required
PWAs need HTTPS because:
- Service Workers have powerful capabilities
- Could be misused on insecure connections
- GitHub Pages and Netlify provide free HTTPS

### What Makes it "Progressive"
1. **Works everywhere** - Basic website for older browsers
2. **Enhanced on modern browsers** - App-like experience
3. **Offline-first** - Cached content works without internet
4. **Installable** - Can be added to home screen

### Service Worker Lifecycle
```
Install → Activate → Control → Fetch
   ↓         ↓          ↓         ↓
Cache    Clean up   Ready    Serve files
files    old cache          from cache
```

### Cache Strategy Used: "Cache First"
```
Request → Check Cache → If found: Return
                     → If not: Fetch from network → Cache → Return
```

---

## 🎯 What You've Learned

✅ HTML structure for mobile apps  
✅ CSS for responsive, touch-friendly design  
✅ JavaScript state management with localStorage  
✅ PWA manifest configuration  
✅ Service Workers for offline functionality  
✅ iOS-specific PWA considerations  
✅ Deployment to free hosting  
✅ Testing on real devices  

---

## 🚀 Next Steps to Deepen Learning

1. **Add authentication** - Learn about user accounts
2. **Add a database** - Use Firebase or Supabase
3. **Add notifications** - Learn Push API
4. **Add charts** - Visualize spending with Chart.js
5. **Add export** - Download data as CSV/PDF
6. **Add categories** - Break down allocations further

---

## 📚 Resources for Further Learning

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev PWA](https://web.dev/progressive-web-apps/)
- [iOS PWA Support](https://webkit.org/blog/8042/release-notes-for-safari-technology-preview-44/)
- [PWA Builder](https://www.pwabuilder.com/) - Test your PWA

---

## 🤝 Sharing with Your Partner

Your partner can:
- Track their payments throughout the month
- See remaining allocation at a glance  
- Review payment history anytime
- Use it completely offline (flights, remote areas)
- Update it from the home screen like any app

**Pro tip:** Take screenshots of the first install process to help them add it to their home screen!

---

Made with 💜 for learning PWAs
