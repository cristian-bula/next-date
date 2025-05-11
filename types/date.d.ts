import { IReview } from "./reviews";

export type DateEvent = {
    id: string;
    date: Date | null;
    description: string;
    photos: string[];
    photoFile?: File | null;
    reviews: IReview[];
  };
  