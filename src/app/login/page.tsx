import { LoginModal } from "@/components/login-modal";
import { SignupModal } from "@/components/signup-modal";
import Image from "next/image";
import React from "react";
import icon from "../icon.png";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-olive-50">
      <div className="text-center bg-white p-6 rounded-xl shadow-md max-w-md">
        <Image
          src={icon}
          alt="Logo"
          className="w-24 h-24 mx-auto mb-12"
          width={100}
          height={100}
        />
        <div className="flex justify-center mt-2 gap-4">
          <LoginModal />
          <SignupModal />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
