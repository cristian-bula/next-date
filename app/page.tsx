// src/app/page.tsx
import { Suspense } from "react";
import MainComponet from "./components/main-component";
import { getPastDates, getUpcomingDate } from "@/lib/actions";

// Esto es un componente de servidor que carga los datos iniciales
export default async function DatesPage() {
  try {
    const [upcomingDate, pastDates] = await Promise.all([
      getUpcomingDate(),
      getPastDates(),
    ]);

    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-olive-50">
            <div className="text-center">
              <p className="text-olive-700">
                Cargando nuestros momentos especiales...
              </p>
            </div>
          </div>
        }
      >
        <MainComponet
          upcomingDate={upcomingDate || undefined}
          pastDates={pastDates || []}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-olive-50">
        <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-md">
          <p className="text-red-500 text-lg mb-4">
            Sorryyy, no pude cargar las citas. Please, recarga la página.
          </p>
        </div>
      </div>
    );
  }
}
