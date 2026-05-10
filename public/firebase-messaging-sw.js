importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyDOAqGYXQj-IzeoDkKbJvbNTm6_12QnBWg",
  authDomain:        "chainloop-notification.firebaseapp.com",
  projectId:         "chainloop-notification",
  storageBucket:     "chainloop-notification.firebasestorage.app",
  messagingSenderId: "814880754106",
  appId:             "1:814880754106:web:3829840590e5ba72213583",
  measurementId:     "G-B1YYSGHED6",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'ChainLoop';
  const body  = payload.notification?.body  ?? '';
  const icon  = payload.notification?.icon  ?? '/favicon.svg';

  self.registration.showNotification(title, {
    body,
    icon,
    badge: '/favicon.svg',
    data: payload.data ?? {},
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const existing = windowClients.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
