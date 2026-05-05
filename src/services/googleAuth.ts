declare global {
  interface Window {
    google: any;
  }
}


export const initGoogleAuth = (callback: (token: string) => void) => {
  /* global google */
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: (response: any) => {
      console.log("GOOGLE RESPONSE FULL:", response);
      if (!response?.credential) {
        console.error("❌ No credential received");
        return;
      }
      callback(response.credential);
    }
  });
};

export const triggerGoogleLogin = () => {
  window.google.accounts.id.prompt();
};