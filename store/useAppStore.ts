import { create } from "zustand";

interface AppState {
  isSimulationStarted: boolean;
  startSimulation: () => void;
  resetSimulation: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSimulationStarted: false,

  startSimulation: () => {
    set({ isSimulationStarted: true });

    // Simulate loading then reset after 2 seconds
    setTimeout(() => {
      set({ isSimulationStarted: false });
    }, 2000);
  },

  resetSimulation: () => {
    set({ isSimulationStarted: false });
  },
}));
