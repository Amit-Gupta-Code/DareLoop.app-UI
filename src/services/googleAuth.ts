declare global {
  interface Window {
    google: any;
  }
}


export const initGoogleAuth = (callback: (token: string) => void) => {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    use_fedcm_for_prompt: false,
    callback: (response: any) => {
      if (!response?.credential) {
        console.error("❌ No credential received");
        return;
      }
      callback(response.credential);
    },
  });
};

export const renderGoogleButton = (element: HTMLElement) => {
  window.google.accounts.id.renderButton(element, {
    type: "standard",
    theme: "outline",
    size: "large",
  });
};