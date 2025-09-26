import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LoginModal } from "@/components/login-modal";
import { CalendarHeart, Film, ListChecks, MessageSquareHeart } from "lucide-react";

const sections = [
  {
    title: "Citas",
    Icon: CalendarHeart,
    href: "/dates",
  },
  {
    title: "To do's",
    Icon: ListChecks,
    href: "/todos",
  },
  {
    title: "Peliculas",
    Icon: Film,
    href: "/cine",
  },
  {
    title: "Chats",
    Icon: MessageSquareHeart,
    href: "/chats",
  },
];

const Page = () => {
  return (
    <div className="container mx-auto py-12">
      <Image
        src="/icon.png"
        alt="Logo"
        className="w-24 h-24 mx-auto mb-6"
        width={100}
        height={100}
      />
      <h1 className="text-3xl font-bold mb-6 text-olive-700 text-center">
        Just the two of us
      </h1>
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className={cn("block", "hover:opacity-90 transition-opacity")}
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <section.Icon className="w-8 h-8 text-olive-700" />
                <CardTitle className="text-olive-700">
                  {section.title}
                </CardTitle>
              </CardHeader>
              {/* <CardContent>
                <CardDescription className="text-olive-700">
                  {section.description}
                </CardDescription>
              </CardContent> */}
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
