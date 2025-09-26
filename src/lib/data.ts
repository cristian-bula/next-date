import { DateEvent, DateEventPagination } from "@/types/date";
import { ITodo } from "@/types/todo";
import toast from "react-hot-toast";
import { revalidateClientPath } from "./actions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLAUDINARY_NAME || "";
const UPLOAD_PRESET = "VERCEL";

export const getAllDates = async ({
  page = 1,
  limit = 100,
  withDate = false,
}: {
  page?: number;
  limit?: number;
  withDate?: boolean;
}): Promise<DateEventPagination> => {
  try {
    const res = await fetch(
      `${API_URL}dates?page=${page}&limit=${limit}&withDate=${withDate}`,
      {
        next: {
          revalidate: 300,
        },
        method: "GET",
      }
    );
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    if (!data?.data?.length) throw new Error(`Error: ${res.status}`);
    const dates = data?.data;
    return {
      data: dates?.map((item: any) => ({
        ...item,
        date: item.date ? new Date(item.date) : null,
      })),
      pagination: data?.pagination,
    };
  } catch (error) {
    console.error("Error al obtener citas", error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };
  }
};

export const addDate = async (
  newDate: Omit<DateEvent, "id">
): Promise<DateEvent | null> => {
  try {
    const res = await fetch(`${API_URL}dates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDate),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error al añadir nueva cita", error);
    return null;
  }
};

export const updateDate = async (
  dateId: string,
  updatedDate: Partial<DateEvent>
): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}dates/${dateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDate),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error al actualizar cita ${dateId}`, error);
    return false;
  }
};

export const deleteDate = async (dateId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}dates/${dateId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error al eliminar cita ${dateId}`, error);
    return false;
  }
};

export async function uploadImage(file: File): Promise<string | null> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error en la subida: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error subiendo la imagen:", error);
    return null;
  }
}

export async function deleteImage(imageId: string) {
  try {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const response = await fetch(url, {
      method: "DELETE",
      body: `public_id=${imageId}`,
    });
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

export const getAllTodos = async (): Promise<ITodo[]> => {
  try {
    const res = await fetch(`${API_URL}todos`, {
      next: {
        revalidate: 300,
      },
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();
    if (!data.length) throw new Error(`Error: ${res.status}`);
    return data.map((item: any) => ({
      ...item,
      date: item.date ? new Date(item.date) : null,
    }));
  } catch (error) {
    console.error("Error al obtener tareas", error);
    return [];
  }
};

export const addTodo = async (
  newTodo: Omit<ITodo, "id" | "userId" | "updatedAt" | "createdAt">
): Promise<ITodo | null> => {
  try {
    const res = await fetch(`${API_URL}todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error al añadir nueva tarea", error);
    return null;
  }
};

export const updateTodo = async (
  todoId: string,
  updatedTodo: Partial<ITodo>
): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}todos/${todoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error al actualizar todo ${todoId}`, error);
    return false;
  }
};

export const deleteTodo = async (todoId: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}todos/${todoId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error(`Error al eliminar todo ${todoId}`, error);
    return false;
  }
};

export const onDeleteDate = async (id: string) => {
  const createMsg = toast.loading("Cargando...");
  try {
    const response = await deleteDate(id);
    if (!response) return;
    revalidateClientPath("/dates/all-dates");
    revalidateClientPath("/dates");
    toast.success("Date eliminado 💔");
  } catch (error) {
    toast.error("Ups, te fallé Andrea, sorry ❤️");
    console.error(error);
  } finally {
    toast.dismiss(createMsg);
  }
};

export const onEditDate = async (
  id: string,
  updatedDate: Partial<DateEvent>
) => {
  try {
    const response = await updateDate(id, updatedDate);
    if (!response) return;
    revalidateClientPath("/dates/all-dates");
    revalidateClientPath("/dates");
  } catch (error) {
    console.error(error);
  }
};
