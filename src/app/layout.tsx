import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Just the two of us",
  description: "Bitacora de citas, tareas, cine, chats y más",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen items-center justify-center bg-gradient-to-br from-olive-100 to-olive-200 w-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
