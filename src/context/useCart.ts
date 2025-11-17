import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem as CartItemType } from "@/types";

// Tipo local do carrinho (compatível com CartItem de types)
type CartItem = CartItemType;

type State = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (_id: string) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i._id === item._id);
        if (idx >= 0) {
          items[idx].qty += item.qty;
        } else {
          items.push(item);
        }
        set({ items });
      },
      remove: (_id) => set({ items: get().items.filter((i) => i._id !== _id) }),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    {
      name: "cart-storage",
    }
  )
);
