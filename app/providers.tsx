"use client";
import { Notifications } from "@/components/notifications";
import React from "react";
import { Toaster } from "react-hot-toast";
import "react-photo-view/dist/react-photo-view.css";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      {children}
      <Notifications />
    </>
  );
};

export default Providers;
