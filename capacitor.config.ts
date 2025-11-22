import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f9ded0dbbb524760ac08e57a839fa443',
  appName: 'FocusForge',
  webDir: 'dist',
  server: {
    url: 'https://f9ded0db-bb52-4760-ac08-e57a839fa443.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    App: {
      appStateChange: true
    }
  }
};

export default config;
