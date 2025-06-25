import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LoginModal } from "@/components/login-modal";
import { DynamicIcon } from "lucide-react/dynamic";

const sections = [
  {
    title: "Citas",
    description: "Encuentra y gestiona tus citas románticas",
    icon: "calendar-heart",
    href: "/dates",
  },
  {
    title: "Tareas",
    description: "Organiza tus tareas y actividades",
    icon: "list-checks",
    href: "/todos",
  },
  {
    title: "Cine",
    description: "Descubre películas y eventos cinematográficos",
    icon: "film",
    href: "/cine",
  },
  {
    title: "Chats",
    description: "Mantén conversaciones con tus contactos",
    icon: "message-square-heart",
    href: "/chats",
  },
];

const Page = () => {
  return (
    <div className="container mx-auto py-12">
      <Image
        src="/icon.png"
        alt="Logo"
        className="w-24 h-24 mx-auto mb-12"
        width={100}
        height={100}
      />
      <h1 className="text-3xl font-bold mb-8 text-olive-700 text-center">
        Just the two of us
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className={cn("block", "hover:opacity-90 transition-opacity")}
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <DynamicIcon
                  name={section.icon as any}
                  className="w-8 h-8 text-olive-700"
                />
                <CardTitle className="text-olive-700">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-olive-700">
                  {section.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-5">
        <LoginModal />
      </div>
    </div>
  );
};

export default Page;
