import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Just the two of us",
    short_name: "Just the two of us",
    description: "Bitacora de citas, tareas, cine, chats y más",
    start_url: "/",
    display: "standalone",
    background_color: "#b0c29a",
    theme_color: "#e2e8cf",
    icons: [
      {
        src: "icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
