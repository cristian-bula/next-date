"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      {children}
    </>
  );
};

export default Providers;
