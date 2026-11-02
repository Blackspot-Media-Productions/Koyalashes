import { atom } from "jotai";
import type { Cart } from "~/lib/types";

export const prevCartLengthAtom = atom<number>(0);

export const cartAtom = atom<Cart | null>(null);
