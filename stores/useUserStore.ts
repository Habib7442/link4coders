import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    avatar_url: string;
    title: string;
    bio: string;
  } | null;
  isAuthenticated: boolean;
  selectedTemplateId: string | null;
  setUser: (user: UserState['user']) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setSelectedTemplateId: (templateId: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      selectedTemplateId: null,
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setSelectedTemplateId: (selectedTemplateId) => set({ selectedTemplateId }),
      logout: () => set({ user: null, isAuthenticated: false, selectedTemplateId: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);