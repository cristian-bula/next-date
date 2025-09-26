import { IReview } from "./reviews";

export type DateEvent = {
  id: string;
  date: Date | null;
  description: string;
  dressCode: string;
  photos: string[];
  photoFile?: File | null;
  reviews: IReview[];
};

export type DateEventPagination = {
  data: DateEvent[];
  pagination: IPagination;
};

export type IPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export interface ISearchParams {
  page: number;
  limit: number;
  order: "asc" | "desc";
}
