"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);

  const startSimulation = () => {
    setIsSimulationStarted(true);
    router.push("/start");
  };

  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 max-w-3xl mx-auto">
      {/* Badge */}
      <div className="mb-8 animate-fade-in">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-400 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
          </span>
          AI-Powered Simulations
        </span>
      </div>

      {/* Title */}
      <h1 className="animate-fade-in-up text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
        <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
          Venture
        </span>
        <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Simulate
        </span>
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-in-up-delay text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed mb-10 text-balance">
        Decision Training for Future Founders.{" "}
        <span className="text-zinc-500">
          Sharpen your entrepreneurial instincts through AI-driven startup scenarios.
        </span>
      </p>

      {/* CTA Button */}
      <div className="animate-fade-in-up-delay-2">
        <button
          id="start-simulation-btn"
          onClick={startSimulation}
          className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:bg-violet-500 hover:shadow-violet-500/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
        >
          {/* Glow ring */}
          <span className="absolute inset-0 rounded-xl ring-1 ring-white/10 transition-all duration-300 group-hover:ring-white/20" />
          
          {isSimulationStarted ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Launching…
            </>
          ) : (
            <>
              Start Simulation
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Trust indicators */}
      <div className="mt-16 animate-fade-in-up-delay-3 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          No credit card required
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Free to explore
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Built for aspiring founders
        </span>
      </div>

      {/* Inline keyframe animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out both;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }
        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s ease-out 0.15s both;
        }
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.8s ease-out 0.3s both;
        }
        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 0.8s ease-out 0.45s both;
        }
      `}</style>
    </section>
  );
}
