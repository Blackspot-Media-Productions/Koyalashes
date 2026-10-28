import { atom } from "jotai";
import type { Cart } from "~/lib/types";

export const cartAtom = atom<Cart | null>(null);
