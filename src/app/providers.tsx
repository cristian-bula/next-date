"use client";
import { Notifications } from "@/components/notifications";
import React from "react";
import { Toaster } from "react-hot-toast";
import "react-photo-view/dist/react-photo-view.css";
import { HeroUIProvider } from "@heroui/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeroUIProvider>
        {children}
        <Toaster position="bottom-center" reverseOrder={false} />
      </HeroUIProvider>
      <Notifications />
    </>
  );
};

export default Providers;
