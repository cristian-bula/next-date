import { DateEvent } from "@/types/date";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/";

export const getUpcomingDate = async (): Promise<DateEvent | null> => {
  try {
    const res = await fetch(`${API_URL}dates/upcoming`, {
      next: {
        revalidate: 900,
      },
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();

    return {
      ...data,
      date: new Date(data.date),
    };
  } catch (error) {
    console.error("Error al obtener la próxima cita", error);
    return null;
  }
};

export const getPastDates = async (): Promise<DateEvent[]> => {
  try {
    const res = await fetch(`${API_URL}dates/past`, {
      next: {
        revalidate: 900,
      },
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();

    return data.map((item: any) => ({
      ...item,
      date: new Date(item.date),
    }));
  } catch (error) {
    console.error("Error al obtener citas pasadas", error);
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

    return {
      ...data,
      date: new Date(data.date),
    };
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
