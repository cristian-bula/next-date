import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nuestra Próxima Cita",
    short_name: "Nuestra Próxima Cita",
    description: "Contador para nuestra próxima cita romántica",
    start_url: "/",
    display: "standalone",
    background_color: "#7ca659",
    theme_color: "#7ca659",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
