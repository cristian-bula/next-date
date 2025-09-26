import React from "react";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";

const BackButton = ({ href = "#" }: { href: string }) => {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Link href={href}>
        <CircleArrowLeft className="h-8 w-8 text-olive-700" />
      </Link>
    </div>
  );
};

export default BackButton;
