"use client";

import { useRouter } from "next/navigation";
import { useSimulationStore } from "@/store/useSimulationStore";

const SCENARIO_TEXT =
  "You are the co-founder of Vidya Connect, a social initiative working to bring structured digital learning to students in government schools. You have just secured initial funding of ₹8,00,000. Your team consists of a tech volunteer and a field coordinator. The schools are eager, but the government liaison is cautious. Expectations are high, resources are limited, and time is running out. Your first major decision is due this week.";

export default function ScenarioPage() {
  const router = useRouter();
  const setScenario = useSimulationStore((s) => s.setScenario);

  const handleStart = () => {
    setScenario(SCENARIO_TEXT);
    router.push("/simulation");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-8 md:p-12 shadow-2xl">
        <div className="space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Vidya Connect
            </h1>
            <h2 className="text-lg text-[var(--muted)] font-medium">
              A digital learning initiative for underserved government schools
            </h2>
          </div>

          <div className="prose prose-invert prose-p:leading-relaxed text-zinc-300 max-w-none">
            <p className="text-base md:text-lg">{SCENARIO_TEXT}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-[var(--border)]">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold">
                Capital
              </p>
              <p className="text-sm font-medium text-white">₹8,00,000</p>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold">
                Team
              </p>
              <p className="text-sm font-medium text-white">3 members</p>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold">
                Domain
              </p>
              <p className="text-sm font-medium text-white">Education</p>
            </div>
            <div className="space-y-1 text-center md:text-left">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold">
                Region
              </p>
              <p className="text-sm font-medium text-white">India</p>
            </div>
          </div>

          <div className="pt-2 flex justify-center md:justify-start">
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-violet-600 text-white rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] active:scale-95"
            >
              Start Simulation
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
