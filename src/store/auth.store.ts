import { atom } from "jotai";
import type { Customer } from "~/lib/types";

export const customerAtom = atom<Customer | null>(null)
