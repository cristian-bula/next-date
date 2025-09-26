import TodoComponent from "@/components/todo-component";
import { getAllTodos } from "@/lib/data";
import React, { Suspense } from "react";

const Page = async () => {
  try {
    const allTodos = await getAllTodos();
    return (
      <Suspense
        fallback={
          <div className="text-center h-screen flex items-center justify-center">
            <p className="text-olive-700">
              Cargando tareas...
            </p>
          </div>
        }
      >
        <TodoComponent todos={allTodos || []} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error);

    return (
      <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-md">
        <p className="text-red-500 text-lg mb-4">
          Sorryyy, no pude cargar las citas. Please, recarga la página.
        </p>
      </div>
    );
  }
};

export default Page;
