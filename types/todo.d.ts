import { IUser } from "./user";

export type ITodo = {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  user?: IUser;
  createdAt: Date;
  updatedAt: Date;
};
