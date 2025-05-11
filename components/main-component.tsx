"use client";

import { useState, useEffect } from "react";
import { Heart, Clock } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DateEvent } from "@/types/date";
import { AddDateModal } from "./add-date";
import { ManageDatesModal } from "./manage-dates";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { LoginModal } from "./login-modal";
import { SignupModal } from "./signup-modal";
import PastDates from "./past-dates";

type CountdownProps = {
  upcomingDate: DateEvent;
  pastDates: DateEvent[];
  allDates: DateEvent[];
};

export default function MainComponet({
  upcomingDate,
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

  const [nextDate, setNextDate] = useState<Date>(
    upcomingDate?.date ||
      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
  );

  const [nextDateInfo, setNextDateInfo] = useState<{
    description: string;
    photo: string;
  }>({
    description: upcomingDate?.description || "",
    photo: upcomingDate?.photos?.[0] || "",
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (upcomingDate?.date) {
      setNextDate(upcomingDate.date);
      setNextDateInfo({
        description: upcomingDate.description,
        photo: upcomingDate.photos?.[0],
      });
    }

    const timer = setInterval(() => {
      const now = new Date();
      const difference = nextDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextDate, upcomingDate]);

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
        <Card className="bg-white/80 backdrop-blur-sm border-olive-300 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="relative w-full aspect-[3/3] md:aspect-[4/3] mb-6 overflow-hidden rounded-lg border-4 border-olive-300 shadow-md">
              <PhotoProvider maskOpacity={0.1} bannerVisible={false}>
                <PhotoView src={nextDateInfo.photo}>
                  <img
                    src={nextDateInfo.photo}
                    alt="Foto de nuestra próxima cita"
                    className="object-cover w-full h-full cursor-pointer"
                  />
                </PhotoView>
              </PhotoProvider>
            </div>
            <CardTitle className="text-olive-700 flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-olive-600" />
              Cuenta Regresiva
            </CardTitle>
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="flex flex-col items-center bg-olive-100 rounded-lg p-3">
                <span className="text-3xl font-bold text-olive-700">
                  {timeLeft.days}
                </span>
                <span className="text-xs text-olive-600">Días</span>
              </div>
              <div className="flex flex-col items-center bg-olive-100 rounded-lg p-3">
                <span className="text-3xl font-bold text-olive-700">
                  {timeLeft.hours}
                </span>
                <span className="text-xs text-olive-600">Horas</span>
              </div>
              <div className="flex flex-col items-center bg-olive-100 rounded-lg p-3">
                <span className="text-3xl font-bold text-olive-700">
                  {timeLeft.minutes}
                </span>
                <span className="text-xs text-olive-600">Minutos</span>
              </div>
              <div className="flex flex-col items-center bg-olive-100 rounded-lg p-3">
                <span className="text-3xl font-bold text-olive-700">
                  {timeLeft.seconds}
                </span>
                <span className="text-xs text-olive-600">Segundos</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-olive-700 italic">
                Nos veremos el{" "}
                {nextDate?.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                a las{" "}
                {nextDate?.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {nextDateInfo.description && (
                <p className="text-olive-600 mt-2 font-medium">
                  {nextDateInfo.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Carrusel de citas anteriores */}
        <PastDates pastDates={pastDates} />

        <div className="flex justify-center gap-4">
          <AddDateModal />
          <ManageDatesModal dates={allDates} />
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
