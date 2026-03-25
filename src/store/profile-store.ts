'use client';

import { create } from 'zustand';

type ProfileState = {
  activeProfileId?: string;
  setActiveProfile: (id: string) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  activeProfileId: undefined,
  setActiveProfile: (id) => set({ activeProfileId: id })
}));
