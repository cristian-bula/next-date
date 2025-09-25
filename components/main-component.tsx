import { Heart } from "lucide-react";
import { DateEvent } from "@/types/date";
import { AddDateModal } from "./add-date";
import { LoginModal } from "./login-modal";
import PastDates from "./past-dates";
import NextDate from "./next-date";
import BackButton from "./back-button";
import { Button } from "./ui/button";
import Link from "next/link";

type CountdownProps = {
  pastDates: DateEvent[];
  allDates: DateEvent[];
};

export default function MainComponet({
  pastDates = [],
  allDates = [],
}: CountdownProps) {
  const finalTexts = {
    title: "Próxima Cita",
    subtitle: "Contando cada segundo hasta volver a verte",
    pastDatesTitle: "Nuestras Citas Anteriores",
    addButtonText: "Agregar Nueva Cita",
    manageButtonText: "Gestionar Citas",
    footerMessage:
      "Cada momento contigo es un tesoro que guardo en mi corazón.",
  };

  return (
    <>
      <BackButton href="/" />
      <div className="max-w-2xl w-full p-4 mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-olive-700 mb-2 flex justify-center items-center gap-3">
            <Heart className="text-white fill-white" />
            {finalTexts.title}
            <Heart className="text-white fill-white" />
          </h1>
          <p className="text-olive-800 text-lg">{finalTexts.subtitle}</p>
        </header>

        {/* Foto y Contador */}
        <NextDate allDates={allDates} />

        {/* Carrusel de citas anteriores */}
        <PastDates pastDates={pastDates} />

        <div className="flex justify-center gap-4">
          <AddDateModal />
          <Link href="/dates/all-dates">
            <Button className="bg-olive-600 hover:bg-olive-700 text-white">
              Gestionar Citas
            </Button>
          </Link>
          {/* <ManageDatesModal dates={allDates} /> */}
        </div>

        <div className="flex justify-center mt-2 gap-4">
          <LoginModal />
          {/* <SignupModal /> */}
        </div>

        <div className="mt-8 text-center">
          <p className="text-olive-700 font-medium">
            {finalTexts.footerMessage}
          </p>
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(5)].map((_, i) => (
              <Heart
                key={i}
                className="h-6 w-6 text-white fill-white animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
