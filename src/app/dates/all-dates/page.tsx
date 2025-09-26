import AllDatesComponent from "@/components/all-dates-component";
import BackButton from "@/components/back-button";
import { LoginModal } from "@/components/login-modal";
import { SignupModal } from "@/components/signup-modal";
import { getAllDates } from "@/lib/data";
import React, { Suspense } from "react";

const AllDatesPage = async () => {
  try {
    const allDates = await getAllDates({
      page: 1,
      limit: 10,
      withDate: true,
    });

    return (
      <Suspense
        fallback={
          <div className="text-center h-screen flex items-center justify-center">
            <p className="text-olive-700">
              Cargando nuestros momentos especiales...
            </p>
          </div>
        }
      >
        <AllDatesComponent dates={allDates} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error);

    return (
      <>
        <BackButton href="/" />
        <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-md">
          <p className="text-red-500 text-lg mb-4">
            Sorryyy, no pude cargar las citas. Please, recarga la página.
          </p>
          <div className="flex justify-center mt-2 gap-4">
            <LoginModal />
            <SignupModal />
          </div>
        </div>
      </>
    );
  }
};

export default AllDatesPage;
