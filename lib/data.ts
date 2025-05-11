import { DateEvent } from "@/types/date";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLAUDINARY_NAME || "";
const UPLOAD_PRESET = "VERCEL";

export const getAllDates = async (): Promise<DateEvent[]> => {
  try {
    const res = await fetch(`${API_URL}dates`, {
      next: {
        revalidate: 300,
      },
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    
    const data = await res.json();

    return data.map((item: any) => ({
      ...item,
      date: item.date ? new Date(item.date) : null,
    }));
  } catch (error) {
    console.error("Error al obtener citas", error);
    return [];
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
