import { create } from "zustand";

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

interface SimulationState {
  userProfile: UserProfile;
  scenario: string;
  decisions: string[];
  metrics: Metrics;
}

interface SimulationActions {
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setScenario: (text: string) => void;
  addDecision: (decision: string) => void;
  updateMetrics: (delta: MetricsDelta) => void;
  resetSimulation: () => void;
}

// ── Defaults ───────────────────────────────────────────

const initialState: SimulationState = {
  userProfile: { experience: "", context: "", domain: "" },
  scenario: "",
  decisions: [],
  metrics: { impact: 50, finance: 50, risk: 50, trust: 50 },
};

// ── Helpers ────────────────────────────────────────────

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

// ── Store ──────────────────────────────────────────────

export const useSimulationStore = create<SimulationState & SimulationActions>(
  (set) => ({
    ...initialState,

    setUserProfile: (profile) =>
      set((state) => ({
        userProfile: { ...state.userProfile, ...profile },
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
  })
);
