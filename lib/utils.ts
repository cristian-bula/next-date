import { DateEvent } from "@/types/date";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDate, uploadImage } from "./data";
import toast from "react-hot-toast";
import Cryptr from "cryptr";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const onAddDate = async (e: Omit<DateEvent, "id">) => {
  const createMsg = toast.loading("Cargando...");
  try {
    let imageUrl: string = " ";
    if (e?.photoFile) {
      imageUrl = (await uploadImage(e?.photoFile)) || "";
    }
    const newDate = { ...e, photos: [imageUrl] };
    const response = await addDate(newDate);
    toast.success("Date creado con exito 🌚");
    return response;
  } catch (e) {
    toast.error("Ups, te fallé Andrea, sorry ❤️");
    return null;
  } finally {
    toast.dismiss(createMsg);
  }
};

export const encryptPassword = function (password: string) {
  const cryptr = new Cryptr(process.env.NEXT_SECRET_KEY || "secret_key");
  return cryptr.encrypt(password);
};

export const comparePassword = function (
  password: string,
  encryptedPassword: string
) {
  const cryptr = new Cryptr(process.env.NEXT_SECRET_KEY || "secret_key");
  return cryptr.decrypt(encryptedPassword) === password;
};
