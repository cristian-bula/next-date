import { Suspense } from "react";
import { getAllDates } from "@/lib/data";
import MainComponet from "@/components/main-component";
import { LoginModal } from "@/components/login-modal";
import { SignupModal } from "@/components/signup-modal";
import BackButton from "@/components/back-button";
import { ISearchParams } from "@/types/date";

type SearchParams = Promise<ISearchParams>;
export default async function DatesPage(props: { searchParams: SearchParams }) {
  try {
    const params = await props.searchParams;

    const allDates = await getAllDates({
      page: Number(params.page || 1),
      limit: Number(params.limit || 1000),
      withDate: true,
    });
    const pastDates = allDates?.data
      ?.filter((date) => (date?.date || new Date()) < new Date())
      ?.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
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
        <MainComponet
          pastDates={pastDates || []}
          allDates={allDates?.data || []}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error);

    return (
      <>
        <BackButton href="/" />
        <div className="text-center h-screen flex items-center justify-center bg-white p-6 rounded-lg shadow-md max-w-md">
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
}
