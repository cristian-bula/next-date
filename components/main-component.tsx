import { Heart } from "lucide-react";
import { DateEvent } from "@/types/date";
import { AddDateModal } from "./add-date";
import { ManageDatesModal } from "./manage-dates";
import { LoginModal } from "./login-modal";
import { SignupModal } from "./signup-modal";
import PastDates from "./past-dates";
import NextDate from "./next-date";

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
    <div className="min-h-screen bg-gradient-to-br from-olive-100 to-olive-200 flex flex-col items-center justify-start p-4">
      <div className="max-w-2xl w-full">
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
          <ManageDatesModal dates={allDates} />
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
    </div>
  );
}
