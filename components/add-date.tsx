"use client";

import type React from "react";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DateEvent } from "@/types/date";
import { onAddDate } from "@/lib/utils";
import { revalidateClientPath } from "@/lib/actions";
import toast from "react-hot-toast";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
export function AddDateModal() {
  const [date, setDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [dressCode, setDressCode] = useState("No aplica");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isWithoutDate, setIsWithoutDate] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isWithoutDate && !date) {
      return;
    }

    if (!description) {
      return;
    }

    if (photoUrl === "") {
      toast.error("Ups, agrega una foto plis!");
      return;
    }

    const newDate: Omit<DateEvent, "id"> = {
      date: isWithoutDate ? null : date,
      description,
      dressCode: dressCode || "No aplica",
      photos: [photoUrl],
      photoFile: photoFile,
      reviews: [],
    };

    const response = await onAddDate(newDate);
    if (!response) {
      return;
    }
    revalidateClientPath("/dates");

    setDate(null);
    setDescription("");
    setPhotoUrl("");
    setIsWithoutDate(false);
    onOpenChange();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setPhotoFile(e.target.files[0]);
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPhotoUrl(event.target.result as string);
          }
        };
        if (!e.target.files) return;
        reader.readAsDataURL(e.target.files[0]);
        setIsUploading(false);
      }, 1000);
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        className="bg-olive-600 hover:bg-olive-700 text-white"
      >
        Agregar Nueva Cita
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
                Agregar Nueva Cita
              </ModalHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-olive-700">
                    Fecha
                  </Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    disabled={isWithoutDate}
                    onChange={(e) => {
                      setDate(e.target.value ? new Date(e.target.value) : null);
                    }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="withoutDate"
                    checked={isWithoutDate}
                    onCheckedChange={(checked: boolean) => {
                      setIsWithoutDate(checked);
                      if (checked) setDate(null);
                    }}
                  />
                  <Label htmlFor="withoutDate" className="text-olive-700">
                    Sin fecha
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-olive-700">
                    Descripción
                  </Label>
                  <Input
                    id="description"
                    placeholder="Descripción de la cita"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="dressCode" className="text-olive-700">
                    Codigo de vestimenta
                  </Label>
                  <select
                    id="dressCode"
                    value={dressCode}
                    onChange={(e) => setDressCode(e.target.value)}
                    className="bg-white rounded-md px-2 border-1 border-gray-200 py-2 text-sm"
                  >
                    <option value="">Código de vestimenta</option>
                    <option value="Formal">Formal</option>
                    <option value="Informal">Informal</option>
                    <option value="Elegante">Elegante</option>
                    <option value="Casual">Casual</option>
                    <option value="Deportivo">Deportivo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-olive-700">
                    Foto
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <p className="text-sm text-olive-600">Subiendo imagen...</p>
                  )}
                  {photoUrl && (
                    <div className="mt-2">
                      <img
                        src={photoUrl || "/placeholder.svg"}
                        alt="Vista previa"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                    className="border-olive-300 text-olive-700 hover:bg-olive-50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-olive-600 hover:bg-olive-700 text-white"
                  >
                    Guardar
                  </Button>
                </div>
              </form>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
