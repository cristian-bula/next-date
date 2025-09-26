import { useEffect } from "react";

export function Notifications() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("Push notifications are not supported");
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
        if (registration.pushManager) {
          const subscription = await registration.pushManager.getSubscription();

          if (!subscription) {
            const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!publicKey) {
              console.error("VAPID public key not found");
              return;
            }
            const convertedVapidKey = urlBase64ToUint8Array(publicKey);
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey,
            });

            // Send subscription to your server
            await fetch("/api/notifications/subscribe", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ subscription }),
            });
          }
        }
      } catch (error) {
        // console.error("Error registering service worker:", error);
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
