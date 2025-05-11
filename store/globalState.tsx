import { IUser } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GlobalState {
  user: IUser | null;
}

interface GlobalActions {
  setUser: (user: IUser) => void;
}

export const useStore = create<
  GlobalState & GlobalActions,
  [["zustand/persist", Partial<GlobalState>]]
>(
  persist(
    (set) => ({
      user: null,
      setUser: (user: IUser) => set({ user }),
    }),
    {
      name: "gotuuri-agencies-web",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
