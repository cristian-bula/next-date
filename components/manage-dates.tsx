"use client";

import { useState } from "react";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateEvent } from "@/types/date";
import toast from "react-hot-toast";
import { deleteDate, deleteImage, updateDate } from "@/lib/data";
import { revalidateClientPath } from "@/lib/actions";

interface ManageDatesModalProps {
  dates: DateEvent[];
}

const onDeleteDate = async (id: string, images: string[]) => {
  const createMsg = toast.loading("Cargando...");
  try {
    // images.forEach(async (image) => {
    //   if (image) {
    //     const imageId = image.split("/").pop() || "";
    //     console.log(imageId);
    //     await deleteImage(imageId);
    //   }
    // });
    const response = await deleteDate(id);
    if (!response) {
      return;
    }
    revalidateClientPath("/");
    toast.success("Date eliminado 💔");
  } catch (error) {
    toast.error("Ups, te fallé Andrea, sorry ❤️");
    console.error(error);
  } finally {
    toast.dismiss(createMsg);
  }
};

const onEditDate = async (id: string, updatedDate: Partial<DateEvent>) => {
  const createMsg = toast.loading("Cargando...");
  try {
    const response = await updateDate(id, updatedDate);
    if (!response) {
      return;
    }
    revalidateClientPath("/");
    toast.success("Date actualizado con exito 🌚");
  } catch (error) {
    toast.error("Ups, te fallé Andrea, sorry ❤️");
    console.error(error);
  } finally {
    toast.dismiss(createMsg);
  }
};

export function ManageDatesModal({ dates }: ManageDatesModalProps) {
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Unified edit state
  const [editState, setEditState] = useState<{
    date: Date | null;
    description: string;
    photo: string;
  }>({
    date: null,
    description: "",
    photo: "",
  });

  const handleEdit = (index: number) => {
    const dateToEdit = dates[index];
    setEditingIndex(index);
    setEditState({
      date: dateToEdit.date,
      description: dateToEdit.description,
      photo: dateToEdit.photos?.[0] || "",
    });
  };

  const handleSaveEdit = (id: string) => {
    if (editingIndex !== null && editState.date && editState.description) {
      onEditDate(id, {
        date: editState.date,
        description: editState.description,
        photos: [editState.photo],
      });
      setEditingIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const updateEditField = (field: keyof typeof editState, value: any) => {
    setEditState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-olive-600 hover:bg-olive-700 text-white"
          onClick={() => setOpen(true)}
        >
          Gestionar Citas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-olive-700 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Gestionar Citas
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 max-h-[70vh] overflow-auto">
          {dates.length === 0 ? (
            <p className="text-center text-olive-600 py-4">
              No hay citas para mostrar
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Fecha</TableHead>
                  <TableHead className="min-w-[180px]">Descripción</TableHead>
                  <TableHead className="min-w-[100px]">Foto</TableHead>
                  <TableHead className="text-right w-[100px]">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dates?.map((date, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {editingIndex === index ? (
                        <input
                          type="date"
                          className="w-full p-1 border rounded"
                          value={
                            editState.date
                              ? format(editState.date, "yyyy-MM-dd")
                              : ""
                          }
                          onChange={(e) =>
                            updateEditField(
                              "date",
                              e.target.value ? new Date(e.target.value) : null
                            )
                          }
                        />
                      ) : date?.date ? (
                        format(date?.date, "dd/MM/yyyy", {
                          locale: es,
                        })
                      ) : (
                        "Aún no definida"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingIndex === index ? (
                        <input
                          type="text"
                          className="w-full p-1 border rounded"
                          value={editState.description}
                          onChange={(e) =>
                            updateEditField("description", e.target.value)
                          }
                        />
                      ) : (
                        date.description
                      )}
                    </TableCell>
                    <TableCell>
                      <img
                        src={date.photos?.[0] || "/placeholder.svg"}
                        alt={date.description}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {editingIndex === index ? (
                        <div className="flex justify-end gap-1">
                          <Button
                            onClick={() => handleSaveEdit(date.id)}
                            size="sm"
                            className="h-8 bg-olive-600 hover:bg-olive-700"
                          >
                            Guardar
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            size="sm"
                            variant="outline"
                            className="h-8 border-olive-300"
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button
                            onClick={() => handleEdit(index)}
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {((date?.date && date?.date > new Date()) ||
                            !!!date.date) && (
                            <Button
                              onClick={() => onDeleteDate(date.id, date.photos)}
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
