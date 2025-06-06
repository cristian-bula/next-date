self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/app/favicon.ico",
      badge: "/app/favicon.ico",
      tag: "date-notification",
      requireInteraction: true,
      actions: [
        {
          action: "view",
          title: "Ver fecha",
          icon: "/app/favicon.ico",
        },
      ],
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((windowClients) => {
          let matchingClient;

          for (let i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i];
            if (windowClient.url === "/" && "focus" in windowClient) {
              matchingClient = windowClient;
              break;
            }
          }

          if (matchingClient) {
            return matchingClient.focus();
          } else {
            return clients.openWindow("/");
          }
        })
    );
  }
});
