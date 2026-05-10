import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, type Analytics } from "firebase/analytics";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

export const analytics: Analytics = getAnalytics(app);

export function trackEvent(name: string, params?: Record<string, unknown>) {
  logEvent(analytics, name, params);
}

export function trackPageView(path: string) {
  logEvent(analytics, "page_view", { page_path: path });
}

let _messaging: Messaging | null = null;
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (_messaging) return _messaging;
  const supported = await isSupported();
  if (!supported) return null;
  _messaging = getMessaging(app);
  return _messaging;
}
