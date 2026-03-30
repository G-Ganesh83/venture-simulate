"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSimulationStore } from "@/store/useSimulationStore";
import MetricBar from "@/components/MetricBar";

interface ReportData {
  summary: string;
  patterns: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export default function ReportPage() {
  const router = useRouter();
  const decisions = useSimulationStore((s) => s.decisions);
  const metrics = useSimulationStore((s) => s.metrics);
  const resetSimulation = useSimulationStore((s) => s.resetSimulation);

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Initiate AI report generation immediately on load
    const fetchReport = async () => {
      try {
        const response = await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ decisions, metrics }),
        });

        if (!response.ok) throw new Error("Failed to fetch report");

        const data = await response.json();
        setReport(data);
      } catch (err) {
        console.error("Report fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [decisions, metrics]);

  const handleRestart = () => {
    resetSimulation();
    router.push("/");
  };

  // Loading State
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-medium tracking-wide">
          Synthesizing Final Report...
        </h2>
        <p className="text-[var(--muted)] text-sm mt-2">
          Analyzing your strategy patterns and metrics.
        </p>
      </main>
    );
  }

  // Error State
  if (error || !report) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-4 text-rose-400">
          Analysis Failed
        </h2>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">
          We encountered a network glitch while generating your final report.
          Please try finishing the simulation again.
        </p>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
        >
          Return to Start
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16 px-4 flex flex-col items-center">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[0%] left-[20%] h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <p className="text-sm font-bold tracking-widest uppercase text-violet-400">
            Performance Review
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Simulation Analysis
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            A comprehensive breakdown of your founder tendencies, strategic
            decisions, and overall venture health.
          </p>
        </header>

        {/* Top Split: Narrative & Metrics */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          <div className="space-y-8">
            {/* Summary */}
            <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
                Executive Summary
              </h2>
              <p className="text-zinc-300 leading-relaxed text-[15px] sm:text-base">
                {report.summary}
              </p>
            </section>

            {/* Decision Patterns */}
            <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
                Decision Patterns
              </h2>
              <p className="text-zinc-300 leading-relaxed text-[15px] sm:text-base">
                {report.patterns}
              </p>
            </section>
          </div>

          {/* Metrics Column */}
          <aside className="bg-[#111113] border border-[#27272a] rounded-2xl p-6 md:p-8 sticky top-10">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-[#27272a] pb-4">
              Final Metrics
            </h2>
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
          </aside>
        </div>

        {/* Strengths & Weaknesses (2 Col) */}
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Core Strengths
            </h2>
            <ul className="space-y-4">
              {report.strengths.map((str, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-emerald-100/80 text-[15px]"
                >
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">
                    ✦
                  </span>
                  <span className="leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Key Weaknesses
            </h2>
            <ul className="space-y-4">
              {report.weaknesses.map((wk, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 text-rose-100/80 text-[15px]"
                >
                  <span className="text-rose-500 mt-0.5 flex-shrink-0">✦</span>
                  <span className="leading-relaxed">{wk}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Strategic Recommendation (Highlight block) */}
        <section className="bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/30 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full" />
          <h2 className="text-sm font-bold text-violet-300 uppercase tracking-widest mb-6 relative z-10">
            Strategic Recommendation
          </h2>
          <p className="text-violet-50 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto relative z-10">
            "{report.recommendation}"
          </p>
        </section>

        {/* Footer Actions */}
        <div className="flex justify-center pt-8">
          <button
            onClick={handleRestart}
            className="px-8 py-3.5 bg-white text-black font-semibold rounded-xl text-sm transition-all duration-300 hover:bg-zinc-200 active:scale-95 shadow-lg"
          >
            Start New Simulation
          </button>
        </div>
      </div>
    </main>
  );
}
