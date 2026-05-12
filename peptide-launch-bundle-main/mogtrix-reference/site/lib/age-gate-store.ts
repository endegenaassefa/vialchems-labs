"use client";

import { create } from "zustand";

const STORAGE_KEY = "mogtrix-age-gate";

type AgeGateState = {
  accepted: boolean;
  hydrated: boolean;
  hydrate: () => void;
  accept: () => void;
};

export const useAgeGateStore = create<AgeGateState>((set) => ({
  accepted: false,
  hydrated: false,
  hydrate: () => {
    const accepted = window.localStorage.getItem(STORAGE_KEY) === "accepted";
    set({ accepted, hydrated: true });
  },
  accept: () => {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    set({ accepted: true, hydrated: true });
  }
}));
