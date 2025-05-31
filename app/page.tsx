import { Suspense } from "react";
import { getAllDates } from "@/lib/data";
import MainComponet from "@/components/main-component";
import { LoginModal } from "@/components/login-modal";
import { SignupModal } from "@/components/signup-modal";

export default async function DatesPage() {
  try {
    const allDates = await getAllDates();
    const datedDates = allDates?.filter((date) => !!date?.date);

    const pastDates = datedDates
      ?.filter((date) => (date?.date || new Date()) < new Date())
      ?.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

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
        <MainComponet pastDates={pastDates || []} allDates={allDates || []} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error);

    return (
      <div className="min-h-screen flex items-center justify-center bg-olive-50">
        <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-md">
          {/* <p className="text-red-500 text-lg mb-4">
            Sorryyy, no pude cargar las citas. Please, recarga la página.
          </p> */}
          <div className="flex justify-center mt-2 gap-4">
            <LoginModal />
            <SignupModal />
          </div>
        </div>
      </div>
    );
  }
}
