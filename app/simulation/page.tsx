"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSimulationStore } from "@/store/useSimulationStore";
import MetricBar from "@/components/MetricBar";

const MAX_ROUNDS = 4;

const MOCK_SITUATION =
  "Your field coordinator suggests launching in 2 schools first instead of all 5 to reduce risk. The schools are eager, but the government liaison is cautious. Resources are limited.";

const MOCK_OPTIONS = [
  "Launch in all 5 schools immediately",
  "Start with 2 schools as pilot",
  "Delay launch and collect more data",
];

const MOCK_CONSEQUENCE =
  "The pilot approach proves wise. You effectively manage your resources and the initial feedback is quite positive, although your overall timeline and potential early scale take a slight hit.";

const MOCK_METRIC_CHANGES = { impact: 5, finance: -5, risk: -10, trust: 10 };

export default function SimulationPage() {
  const router = useRouter();

  const metrics = useSimulationStore((s) => s.metrics);
  const addDecision = useSimulationStore((s) => s.addDecision);
  const updateMetrics = useSimulationStore((s) => s.updateMetrics);

  const [currentRound, setCurrentRound] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [consequence, setConsequence] = useState<string>("");

  // End simulation condition
  useEffect(() => {
    if (currentRound > MAX_ROUNDS) {
      router.push("/report");
    }
  }, [currentRound, router]);

  // Don't render content during the redirect cycle
  if (currentRound > MAX_ROUNDS) return null;

  const handleSelect = async (option: string) => {
    if (selectedOption !== null || loading) return; // Ignore if already selected or loading

    setSelectedOption(option);
    setLoading(true);

    try {
      const response = await fetch("/api/consequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics, decision: option }),
      });

      const data = await response.json();

      setConsequence(data.narrative);
      updateMetrics({
        impact: data.impact,
        finance: data.finance,
        risk: data.risk,
        trust: data.trust,
      });
      addDecision(option);
    } catch (error) {
      console.error("Failed to fetch consequence:", error);
      // Ensure UI doesn't break
      setConsequence("An unexpected network error occurred. Please proceed.");
      updateMetrics({ impact: 0, finance: 0, risk: 0, trust: 0 });
      addDecision(option);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Reset local UI state
    setSelectedOption(null);
    setConsequence("");
    setCurrentRound((prev) => prev + 1);
  };

  return (
    <main className="relative min-h-screen py-10 px-4 flex flex-col items-center">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[60%] h-[400px] w-[600px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute top-[60%] left-[20%] h-[300px] w-[500px] rounded-full bg-indigo-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-[1fr_300px] gap-8 items-start">
        {/* Left Column: Flow & Decisions */}
        <div className="space-y-6">
          {/* Top Section — Header */}
          <div className="flex justify-between items-center bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl px-6 py-4">
            <div>
              <p className="text-xs text-violet-400 uppercase tracking-widest font-bold">
                Round {currentRound} of {MAX_ROUNDS}
              </p>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-[var(--muted)] text-sm font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                Analyzing Option...
              </div>
            )}
          </div>

          {/* Top Section — Situation */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
            <h2 className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest mb-4">
              Current Situation
            </h2>
            <p className="text-zinc-200 text-lg leading-relaxed">
              {MOCK_SITUATION}
            </p>
          </div>

          {/* Decision Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest px-2">
              Your Options
            </h3>
            <div className="grid gap-3">
              {MOCK_OPTIONS.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isDisabled = selectedOption !== null && !isSelected;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option)}
                    disabled={selectedOption !== null}
                    className={`
                      w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 relative group overflow-hidden
                      ${
                        isSelected
                          ? "bg-violet-500/10 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.15)] opacity-100"
                          : isDisabled
                          ? "bg-black/20 border-[#27272a] opacity-30 cursor-not-allowed"
                          : "bg-[#111113] border-[#27272a] hover:border-[#3f3f46] hover:bg-white/[0.04] text-[var(--muted)] cursor-pointer"
                      }
                    `}
                  >
                    {/* Hover Glow */}
                    {!isSelected && !isDisabled && (
                      <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}

                    <div className="relative flex items-center gap-4">
                      {/* Letter Icon */}
                      <div
                        className={`
                          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors duration-300
                          ${
                            isSelected
                              ? "bg-violet-500 text-white shadow-lg"
                              : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
                          }
                        `}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>

                      {/* Option Text */}
                      <span
                        className={`font-medium transition-colors duration-300 ${
                          isSelected
                            ? "text-violet-100"
                            : "text-zinc-400 group-hover:text-zinc-200"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Consequence Block (shown after loading completes) */}
          <div
            className={`
              transition-all duration-700 overflow-hidden outline outline-1 -outline-offset-1 rounded-2xl
              ${
                consequence
                  ? "opacity-100 scale-100 bg-violet-500/10 outline-violet-500/30 p-6 md:p-8"
                  : "opacity-0 scale-95 h-0 p-0 outline-transparent pointer-events-none"
              }
            `}
          >
            <h3 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Consequence Result
            </h3>
            <p className="text-violet-100 text-[15px] sm:text-base leading-relaxed mb-8">
              {consequence}
            </p>

            <div className="flex justify-end border-t border-violet-500/20 pt-6">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-violet-600 text-white font-semibold rounded-lg text-sm transition-all duration-300 hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 active:translate-y-0"
              >
                {currentRound === MAX_ROUNDS
                  ? "View Final Report"
                  : "Next Decision →"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Metrics */}
        <aside className="sticky top-10 space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest mb-6 border-b border-[#27272a] pb-4">
              Company Metrics
            </h3>
            <div className="space-y-7">
              <MetricBar
                label="Impact"
                value={metrics.impact}
                colorClass="bg-blue-400"
              />
              <MetricBar
                label="Finance"
                value={metrics.finance}
                colorClass="bg-emerald-400"
              />
              <MetricBar
                label="Risk"
                value={metrics.risk}
                colorClass="bg-rose-500"
              />
              <MetricBar
                label="Trust"
                value={metrics.trust}
                colorClass="bg-amber-400"
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
