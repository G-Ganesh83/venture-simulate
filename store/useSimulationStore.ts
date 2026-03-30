import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ──────────────────────────────────────────────

interface UserProfile {
  experience: string;
  context: string;
  domain: string;
}

interface Metrics {
  impact: number;
  finance: number;
  risk: number;
  trust: number;
}

type MetricsDelta = Partial<Metrics>;

interface StartupConfig {
  domain: string;
  idea: string;
  budget: number;
  teamSize: number;
  experience: string;
}

interface SimulationState {
  userProfile: UserProfile;
  startupConfig: StartupConfig;
  scenario: string;
  decisions: string[];
  metrics: Metrics;
}

interface SimulationActions {
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setStartupConfig: (config: Partial<StartupConfig>) => void;
  setScenario: (text: string) => void;
  addDecision: (decision: string) => void;
  updateMetrics: (delta: MetricsDelta) => void;
  resetSimulation: () => void;
}

// ── Defaults ───────────────────────────────────────────

const initialState: SimulationState = {
  userProfile: { experience: "", context: "", domain: "" },
  startupConfig: { domain: "", idea: "", budget: 500000, teamSize: 2, experience: "Beginner" },
  scenario: "",
  decisions: [],
  metrics: { impact: 50, finance: 50, risk: 50, trust: 50 },
};

// ── Helpers ────────────────────────────────────────────

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

// ── Store ──────────────────────────────────────────────

export const useSimulationStore = create<SimulationState & SimulationActions>()(
  persist(
    (set) => ({
      ...initialState,

      setUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),

      setStartupConfig: (config) =>
        set((state) => ({
          startupConfig: { ...state.startupConfig, ...config },
        })),

      setScenario: (text) => set({ scenario: text }),

      addDecision: (decision) =>
        set((state) => ({
          decisions: [...state.decisions, decision],
        })),

      updateMetrics: (delta) =>
        set((state) => ({
          metrics: {
            impact: clamp(state.metrics.impact + (delta.impact ?? 0)),
            finance: clamp(state.metrics.finance + (delta.finance ?? 0)),
            risk: clamp(state.metrics.risk + (delta.risk ?? 0)),
            trust: clamp(state.metrics.trust + (delta.trust ?? 0)),
          },
        })),

      resetSimulation: () => set({ ...initialState }),
    }),
    {
      name: "venture-simulate-store",
      // only standard JSON serializable data is here, so default storage (localStorage) is fine
    }
  )
);
