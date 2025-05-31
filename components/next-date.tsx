"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Clock } from "lucide-react";
import { DateEvent } from "@/types/date";
import { useKeenSlider } from "keen-slider/react";

const NextDate = ({ allDates }: { allDates: DateEvent[] }) => {
  const nextDates = allDates?.filter(
    (date) => (date?.date || new Date()) > new Date()
  );

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 8 },
    loop: true,
    slideChanged(slider) {
      setActiveIndex(slider.track.details.rel);
    },
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = nextDates?.[activeIndex]?.date;
      if (!currentDate) return;

      const now = new Date();
      const difference = new Date(currentDate).getTime() - now.getTime();

      if (difference <= 0) {
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
  }, [activeIndex, nextDates]);

  function generateGoogleCalendarLink(date: Date, description: string) {
    const start = formatDateForCalendar(date);
    const end = formatDateForCalendar(
      new Date(date.getTime() + 1 * 60 * 60 * 1000)
    );

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: description,
      dates: `${start}/${end}`,
      details: description,
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
  }

  function formatDateForCalendar(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  }

  return (
    <div ref={sliderRef} className="keen-slider">
      {nextDates?.map((nextDateInfo, index) => {
        const thisDate = new Date(nextDateInfo.date || "");

        return (
          <div key={index} className="keen-slider__slide w-full min-w-full">
            <Card className="bg-white/80 backdrop-blur-sm border-olive-300 shadow-lg mb-8 ">
              <CardContent className="p-6">
                <div className="relative w-full aspect-[3/3] md:aspect-[4/3] mb-6 overflow-hidden rounded-lg border-4 border-olive-300 shadow-md">
                  <PhotoProvider maskOpacity={0.1} bannerVisible={false}>
                    <PhotoView src={nextDateInfo.photos?.[0]}>
                      <img
                        src={nextDateInfo.photos?.[0]}
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
                      {index === activeIndex ? timeLeft.days : "--"}
                    </span>
                    <span className="text-xs text-olive-600">Días</span>
                  </div>
                  <div className="flex flex-col items-center bg-olive-100 rounded-lg p-3">
                    <span className="text-3xl font-bold text-olive-700">
                      {index === activeIndex ? timeLeft.hours : "--"}
                    </span>
                    <span className="text-xs text-olive-600">Horas</span>
                  </div>
                  <div className="flex flex-col items-center bg-olive-100 rounded-lg p-3">
                    <span className="text-3xl font-bold text-olive-700">
                      {index === activeIndex ? timeLeft.minutes : "--"}
                    </span>
                    <span className="text-xs text-olive-600">Minutos</span>
                  </div>
                  <div className="flex flex-col items-center bg-olive-100 rounded-lg p-3">
                    <span className="text-3xl font-bold text-olive-700">
                      {index === activeIndex ? timeLeft.seconds : "--"}
                    </span>
                    <span className="text-xs text-olive-600">Segundos</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-olive-700 italic">
                    Nos veremos el{" "}
                    {thisDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    a las{" "}
                    {thisDate.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {nextDateInfo.description && (
                    <p className="text-olive-600 mt-2 font-medium line-clamp-3 h-[70px]">
                      {nextDateInfo.description}
                    </p>
                  )}
                </div>
                <div className="text-center mt-4">
                  <button
                    onClick={() =>
                      window.open(
                        generateGoogleCalendarLink(
                          thisDate,
                          nextDateInfo.description || "Nuestra siguiente cita"
                        ),
                        "_blank"
                      )
                    }
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition"
                  >
                    Agregar al Calendario
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default NextDate;
