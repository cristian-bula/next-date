"use client";

import { useState, useEffect } from "react";
import { Heart, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateEvent } from "@/types/date";
import { AddDateModal } from "./add-date";
import { ManageDatesModal } from "./manage-dates";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

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

  const [currentPastDateIndex, setCurrentPastDateIndex] = useState(0);

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

  const handlePrevDate = () => {
    if (pastDates.length === 0) return;
    setCurrentPastDateIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : pastDates.length - 1
    );
  };

  const handleNextDate = () => {
    if (pastDates.length === 0) return;
    setCurrentPastDateIndex((prevIndex) =>
      prevIndex < pastDates.length - 1 ? prevIndex + 1 : 0
    );
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
        <Card className="bg-white/80 backdrop-blur-sm border-olive-300 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="relative w-full aspect-[3/3] mb-6 overflow-hidden rounded-lg border-4 border-olive-300 shadow-md">
              <img
                src={nextDateInfo.photo}
                alt="Foto de nuestra próxima cita"
                className="object-cover w-full h-full"
              />
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
        {pastDates.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-olive-300 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-olive-700 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                {finalTexts.pastDatesTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Button
                  onClick={handlePrevDate}
                  variant="ghost"
                  size="icon"
                  disabled={pastDates.length <= 1}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <div className="text-center flex-1">
                  <PhotoProvider maskOpacity={0.1} bannerVisible={false}>
                    <PhotoView
                      src={
                        pastDates[currentPastDateIndex]?.photos?.[0] ||
                        undefined
                      }
                    >
                      <img
                        src={
                          pastDates[currentPastDateIndex]?.photos?.[0] ||
                          undefined
                        }
                        alt={
                          pastDates[currentPastDateIndex]?.description ||
                          "Cita pasada"
                        }
                        className="w-full h-48 md:h-96 object-cover rounded-lg mb-4"
                      />
                    </PhotoView>
                    {/* {pastDates[currentPastDateIndex]?.photos
                      ?.slice(1)
                      .map((photo, index) => (
                        <PhotoView key={index} src={photo}>
                          <img
                            src={photo}
                            alt={
                              pastDates[currentPastDateIndex]?.description ||
                              `Cita pasada ${index + 1}`
                            }
                            className="hidden"
                          />
                        </PhotoView>
                      ))} */}
                  </PhotoProvider>
                  <p className="text-olive-700 font-semibold">
                    {pastDates[currentPastDateIndex]?.date?.toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-olive-600">
                    {pastDates[currentPastDateIndex]?.description}
                  </p>
                </div>
                <Button
                  onClick={handleNextDate}
                  variant="ghost"
                  size="icon"
                  disabled={pastDates.length <= 1}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
