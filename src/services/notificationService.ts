import { getToken, onMessage, type MessagePayload } from "firebase/messaging";
import { getFirebaseMessaging } from "../lib/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;

export async function requestNotificationPermission(): Promise<string | null> {
  if (!("Notification" in window)) return null;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    return token ?? null;
  } catch {
    return null;
  }
}

export async function onForegroundMessage(
  callback: (payload: MessagePayload) => void
): Promise<() => void> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
}
