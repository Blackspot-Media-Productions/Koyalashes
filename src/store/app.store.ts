import { atom } from "jotai";
import { type Collection } from "~/lib/types";

export const collectionsAtom = atom<Collection[]>([]);
