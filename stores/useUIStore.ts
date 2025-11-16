import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isVoiceAssistantOpen: boolean;
  isDarkMode: boolean;
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
  setSidebarOpen: (isOpen: boolean) => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  setVoiceAssistantOpen: (isOpen: boolean) => void;
  setDarkMode: (isDarkMode: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  isVoiceAssistantOpen: false,
  isDarkMode: false,
  toast: null,
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setVoiceAssistantOpen: (isVoiceAssistantOpen) => set({ isVoiceAssistantOpen }),
  setDarkMode: (isDarkMode) => set({ isDarkMode }),
  showToast: (message, type) => set({ toast: { show: true, message, type } }),
  hideToast: () => set({ toast: null }),
}));