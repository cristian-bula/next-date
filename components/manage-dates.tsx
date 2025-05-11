"use client";

import { useState } from "react";
import { Calendar, ImagePlus, Pencil, Trash2 } from "lucide-react";
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
import { deleteDate, updateDate, uploadImage } from "@/lib/data";
import { revalidateClientPath } from "@/lib/actions";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";

interface ManageDatesModalProps {
  dates: DateEvent[];
}

const onDeleteDate = async (id: string) => {
  const createMsg = toast.loading("Cargando...");
  try {
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Unified edit state
  const [editState, setEditState] = useState<{
    date: Date | null;
    description: string;
    photo: string[];
  }>({
    date: null,
    description: "",
    photo: [""],
  });

  const handleEdit = (index: number) => {
    const dateToEdit = dates[index];
    setEditingIndex(index);
    setEditState({
      date: dateToEdit.date,
      description: dateToEdit.description,
      photo: dateToEdit.photos || "",
    });
  };

  const handleSaveEdit = async (id: string) => {
    if (editingIndex !== null && editState.date && editState.description) {
      const newPhotos = file ? [(await uploadImage(file)) || ""] : [];
      const currentPhoto = editState.photo;
      onEditDate(id, {
        date: editState.date,
        description: editState.description,
        photos: [...newPhotos, ...currentPhoto],
      });
      setEditingIndex(null);
      setFile(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setFile(null);
    setPhotoUrl("");
  };

  const updateEditField = (field: keyof typeof editState, value: any) => {
    setEditState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        className="bg-olive-600 hover:bg-olive-700 text-white"
      >
        Gestionar Citas
      </Button>
      <Modal
        placement="center"
        size="5xl"
        isOpen={isOpen}
        scrollBehavior="outside"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="py-4">
              <ModalHeader className="text-olive-700 flex items-center gap-2 p-0">
                <Calendar className="h-5 w-5" />
                Gestionar Citas
              </ModalHeader>

              <div className="mt-4 max-h-[70vh] overflow-auto">
                {dates?.length === 0 ? (
                  <p className="text-center text-olive-600 py-4">
                    No hay citas para mostrar
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Fecha</TableHead>
                        <TableHead className="min-w-[180px]">
                          Descripción
                        </TableHead>
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
                                type="datetime-local"
                                className="w-full p-1 border rounded"
                                value={
                                  editState.date
                                    ? format(
                                        editState.date,
                                        "yyyy-MM-dd'T'HH:mm"
                                      )
                                    : ""
                                }
                                onChange={(e) =>
                                  updateEditField(
                                    "date",
                                    e.target.value
                                      ? new Date(e.target.value)
                                      : null
                                  )
                                }
                              />
                            ) : date?.date ? (
                              format(date?.date, "dd/MM/yyyy HH:mm", {
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
                          <TableCell className="flex w-fit gap-2">
                            <PhotoProvider
                              maskOpacity={0.1}
                              bannerVisible={false}
                            >
                              <PhotoView src={date.photos?.[0] || undefined}>
                                <img
                                  src={date.photos?.[0] || "/placeholder.svg"}
                                  alt={date.description}
                                  className="w-12 min-w-12 h-12 min-h-12 object-cover rounded cursor-pointer"
                                />
                              </PhotoView>
                            </PhotoProvider>
                            {editingIndex === index && (
                              <button
                                onClick={() =>
                                  document
                                    .getElementById(`file-input-${index}`)
                                    ?.click()
                                }
                                className="h-12 w-12 justify-center items-center flex border border-olive-600 rounded"
                              >
                                {photoUrl ? (
                                  <img
                                    src={photoUrl || "/placeholder.svg"}
                                    alt="Vista previa"
                                    className="w-full h-12 object-cover rounded-md"
                                  />
                                ) : (
                                  <ImagePlus
                                    size={32}
                                    className="text-olive-600"
                                  />
                                )}

                                <input
                                  id={`file-input-${index}`}
                                  type="file"
                                  accept=".jpg, .jpeg, .png"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                              </button>
                            )}
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
                                    onClick={() => onDeleteDate(date.id)}
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
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
