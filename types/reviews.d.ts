import { IUser } from "./user";

export type IReview = {
  id: string;
  rating: number;
  comment: string;
  dateId: string;
  userId: string;
  user?: IUser;
};
