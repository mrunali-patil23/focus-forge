# FocusForge Mobile Setup Guide

Your app is now configured for native mobile development with Capacitor! 🚀

## Quick Overview
- ✅ Capacitor installed and configured
- ✅ Enhanced distraction detection for mobile (detects app switching)
- ✅ Works on both iOS and Android
- ✅ Hot-reload enabled (see changes instantly on your device)

## Testing on Your Device

### Step 1: Transfer to GitHub
1. Click the GitHub button (top right in Lovable)
2. Export your project to your GitHub account

### Step 2: Set Up Locally
```bash
# Clone your repo
git clone [your-repo-url]
cd [your-project]

# Install dependencies
npm install
```

### Step 3: Add iOS and/or Android
```bash
# For iOS (requires Mac with Xcode)
npx cap add ios

# For Android (requires Android Studio)
npx cap add android

# Update native dependencies
npx cap update ios  # or android
```

### Step 4: Build and Sync
```bash
# Build the web assets
npm run build

# Sync to native platforms
npx cap sync
```

### Step 5: Run on Device/Emulator
```bash
# For Android
npx cap run android

# For iOS (Mac only)
npx cap run ios
```

## Development Workflow

Once set up, when you make changes in Lovable:
1. Git pull the latest changes
2. Run `npx cap sync` (only if you changed native code/plugins)
3. The app will hot-reload automatically on your device!

## How Mobile Distraction Detection Works

On native mobile:
- **App Switch**: Detects when user switches to another app
- **Background**: Detects when app goes to background
- **Browser**: Still works in mobile browsers too

All distractions are logged in real-time to your database.

## Need Help?

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Lovable Mobile Guide](https://docs.lovable.dev/tips-tricks/capacitor)
- [FocusForge Setup Blog](https://lovable.dev/blog/mobile-development)

---

**Note**: The app currently uses hot-reload from the Lovable sandbox. For production, you'll need to build and deploy your web app, then update the `server.url` in `capacitor.config.ts` to your production URL (or remove it to use local assets).
