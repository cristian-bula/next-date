"use client";
import { onDeleteDate, onEditDate, uploadImage } from "@/lib/data";
import { DateEvent, DateEventPagination, IPagination } from "@/types/date";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Tabs, Tab } from "@heroui/tabs";
import React, { useState, useEffect, useRef, useCallback } from "react";
import AllDatesCard from "./all-dates-card";
import { Images } from "lucide-react";
import { Button } from "./ui/button";
import BackButton from "./back-button";
import { format } from "date-fns";
import toast from "react-hot-toast";

const AllDatesComponent = ({ dates }: { dates: DateEventPagination }) => {
  // Estados independientes para cada tab
  const [withDate, setWithDate] = useState<DateEvent[]>(dates?.data);
  const [withoutDate, setWithoutDate] = useState<DateEvent[]>([]);

  const [paginationWithDate, setPaginationWithDate] = useState(
    dates.pagination
  );
  const [paginationWithoutDate, setPaginationWithoutDate] =
    useState<IPagination>({
      page: 0,
      limit: 10,
      totalPages: 1,
      total: 0,
    });

  // Modal y edición
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingFrom, setEditingFrom] = useState<
    "withDate" | "withoutDate" | null
  >(null);
  const [file, setFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [replaceMode, setReplaceMode] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [editState, setEditState] = useState<{
    date: Date | null;
    description: string;
    photo: string[];
    dressCode: string;
  }>({
    date: null,
    description: "",
    photo: [""],
    dressCode: "",
  });

  // Fetch más citas con fecha
  const fetchMoreWithDate = useCallback(async () => {
    if (paginationWithDate.page >= paginationWithDate.totalPages) return;
    try {
      const nextPage = paginationWithDate.page + 1;
      const res = await fetch(`/api/dates?page=${nextPage}&withDate=true`);
      const newData: DateEventPagination = await res.json();

      setWithDate((prev) => [...prev, ...newData.data]);
      setPaginationWithDate(newData.pagination);
    } catch (err) {
      console.error("Error cargando más citas con fecha:", err);
    }
  }, [paginationWithDate]);

  // Fetch más citas sin fecha
  const fetchMoreWithoutDate = useCallback(async () => {
    try {
      const nextPage = paginationWithoutDate.page + 1;
      const res = await fetch(
        `/api/dates?page=${nextPage}&limit=10&withDate=false`
      );
      const newData: DateEventPagination = await res.json();
      setWithoutDate((prev) => [...prev, ...newData.data]);
      setPaginationWithoutDate(newData.pagination);
    } catch (err) {
      console.error("Error cargando más citas sin fecha:", err);
    }
  }, [paginationWithoutDate]);

  // Editar
  const handleEdit = (index: number, from: "withDate" | "withoutDate") => {
    const dateToEdit =
      from === "withDate" ? withDate[index] : withoutDate[index];
    setEditingIndex(index);
    setEditingFrom(from);
    setEditState({
      date: dateToEdit.date,
      description: dateToEdit.description,
      photo: dateToEdit.photos || [""],
      dressCode: dateToEdit.dressCode || "",
    });
    onOpen();
  };

  const handleSaveEdit = async () => {
    console.log(editState);
    if (
      editingIndex !== null &&
      editingFrom &&
      editState.date &&
      editState.description &&
      editState.dressCode
    ) {
      const createMsg = toast.loading("Cargando...");
      try {
        const currentList = editingFrom === "withDate" ? withDate : withoutDate;
        const currentId = currentList[editingIndex].id;

        const newPhoto = file ? [(await uploadImage(file)) || ""] : [];
        let finalPhotos = replaceMode
          ? newPhoto
          : [...newPhoto, ...editState.photo];

        const updatedDate: DateEvent = {
          ...currentList[editingIndex],
          date: editState.date,
          description: editState.description,
          dressCode: editState.dressCode,
          photos: finalPhotos,
        };

        // Actualiza el estado local
        if (editingFrom === "withDate") {
          setWithDate((prev) =>
            prev.map((item) => (item.id === currentId ? updatedDate : item))
          );
        } else {
          setWithoutDate((prev) =>
            prev.map((item) => (item.id === currentId ? updatedDate : item))
          );
        }

        // Llama al backend
        await onEditDate(currentId, {
          date: editState.date,
          description: editState.description,
          dressCode: editState.dressCode,
          photos: finalPhotos,
        });

        // Toast éxito
        toast.success("Cita actualizada correctamente ✅", { id: createMsg });

        // Limpieza
        setEditingIndex(null);
        setEditingFrom(null);
        setFile(null);
        setPhotoUrl("");
        onOpenChange();
      } catch (error) {
        console.error("Error editando la cita:", error);
        toast.error("Error al actualizar la cita ❌", { id: createMsg });
      } finally {
        toast.dismiss(createMsg);
      }
    }else{
      toast.error("Recuerda completar todos los campos <3");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingFrom(null);
    setFile(null);
    setPhotoUrl("");
    onOpenChange();
  };

  const updateEditField = (field: keyof typeof editState, value: any) => {
    setEditState((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) =>
        event.target?.result && setPhotoUrl(event.target.result as string);
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  // Render de las tarjetas
  const renderCards = (list: DateEvent[], from: "withDate" | "withoutDate") => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((date, index) => (
        <AllDatesCard
          key={date.id}
          date={date}
          handleEdit={handleEdit}
          onDeleteDate={onDeleteDate}
          index={index}
          from={from}
        />
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <BackButton href="/dates" />
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent mb-6">
        Todas nuestras citas
      </h1>

      <Tabs
        onSelectionChange={(index) => {
          if (index === "withoutDate") {
            fetchMoreWithoutDate();
          }
        }}
        aria-label="Opciones de citas"
        variant="underlined"
        fullWidth
      >
        <Tab key="withDate" title="Citas con fecha">
          {renderCards(withDate, "withDate")}
          {paginationWithDate.page < paginationWithDate.totalPages && (
            <Button onClick={fetchMoreWithDate} className="w-full mt-6">
              Cargar más citas
            </Button>
          )}
        </Tab>
        <Tab key="withoutDate" title="Citas sin fecha">
          {renderCards(withoutDate, "withoutDate")}
          {paginationWithoutDate.page < paginationWithoutDate.totalPages && (
            <Button onClick={fetchMoreWithoutDate} className="w-full mt-6">
              Cargar más citas
            </Button>
          )}
        </Tab>
      </Tabs>

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              <Images size={20} /> Actualizar Cita
            </h2>
          </ModalHeader>
          <ModalBody>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={editState.description}
              onChange={(e) => updateEditField("description", e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              rows={3}
            />
            <label className="block mt-4 text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="datetime-local"
              value={
                editState.date
                  ? format(editState.date, "yyyy-MM-dd'T'HH:mm")
                  : ""
              }
              onChange={(e) =>
                updateEditField(
                  "date",
                  e.target.value ? new Date(e.target.value) : null
                )
              }
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
            <label className="block mt-4 text-sm font-medium text-gray-700">
              Dress Code
            </label>
            <select
              value={editState.dressCode}
              onChange={(e) => updateEditField("dressCode", e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Código de vestimenta</option>
              <option value="Formal">Formal</option>
              <option value="Informal">Informal</option>
              <option value="Elegante">Elegante</option>
              <option value="Casual">Casual</option>
              <option value="Deportivo">Deportivo</option>
            </select>
            <label className="block mt-4 text-sm font-medium text-gray-700">
              Foto
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
            {photoUrl && (
              <img
                src={photoUrl}
                alt="Preview"
                className="mt-3 w-full h-32 object-cover rounded-lg"
              />
            )}
            <div className="flex items-center mt-4 gap-2 text-sm">
              <input
                type="checkbox"
                checked={replaceMode}
                onChange={(e) => setReplaceMode(e.target.checked)}
              />
              <span>Reemplazar fotos existentes</span>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleSaveEdit}
                className="bg-primary hover:bg-primary text-white py-2 px-4 rounded-md shadow"
              >
                Guardar
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AllDatesComponent;
