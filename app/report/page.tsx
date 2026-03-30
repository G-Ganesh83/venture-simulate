"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSimulationStore } from "@/store/useSimulationStore";
import { generateReport, ReportData } from "@/lib/reportGenerator";

// ── Components ────────────────────────────────────────────────

function CircularScore({ score }: { score: number }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1500;
    let startTime: number | null = null;
    
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayScore(Math.floor(easeProgress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center mx-auto mb-10 group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all duration-700" />
      
      <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="transparent"
          stroke="url(#scoreGlow)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
        <defs>
          <linearGradient id="scoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400">
          {displayScore}
        </span>
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">
          / 100
        </span>
      </div>
    </div>
  );
}

function MetricAnimatedBar({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-bold text-white uppercase tracking-widest">{label}</span>
        <span className="text-sm font-mono text-zinc-300">{Math.round(value)}</span>
      </div>
      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────

export default function ReportPage() {
  const router = useRouter();
  const decisions = useSimulationStore((s) => s.decisions);
  const metrics = useSimulationStore((s) => s.metrics);
  const startupConfig = useSimulationStore((s) => s.startupConfig);
  const resetSimulation = useSimulationStore((s) => s.resetSimulation);

  // Generate logic-based report instantly
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    try {
      const data = generateReport(startupConfig.domain || "education", decisions, metrics);
      setReport(data);
    } catch (err) {
      console.error(err);
    }
  }, [decisions, metrics, startupConfig.domain]);

  const handleRestart = () => {
    resetSimulation();
    router.push("/");
  };

  if (!report) return null; // Safe fallback

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <main className="min-h-screen bg-[#040406] text-white selection:bg-violet-500/30 overflow-x-hidden relative pb-20">
      {/* ── Background Elements ── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-violet-600/5 blur-[120px] rounded-[100%]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-indigo-600/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20">
        
        {/* ── TOP SECTION ── */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-[10px] font-mono tracking-widest text-violet-300 uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Simulation Analysis
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Your decision-making profile
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto text-lg mb-12">
            A comprehensive breakdown of how you navigated risk, resources, and social capital.
          </p>

          <CircularScore score={report.score} />
        </motion.header>

        {/* ── IDENTITY SYSTEM SECTION ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="relative max-w-3xl mx-auto mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-indigo-500/20 to-violet-600/20 blur-xl rounded-3xl" />
          <div className="relative p-10 md:p-14 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 text-center overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-50" />
            
            <span className="text-sm font-bold tracking-[0.2em] text-violet-400 uppercase mb-4 block">
              You are...
            </span>
            <div className="text-6xl md:text-7xl mb-6">
              {report.identityIcon}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              {report.identityTitle}
            </h2>
            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
              "{report.identityDescription}"
            </p>
          </div>
        </motion.div>

        {/* ── DASHBOARD GRID ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* SECTION 1: DECISION STYLE */}
          <motion.div variants={itemVariants} className="lg:col-span-8 group">
            <div className="w-full h-full relative rounded-3xl bg-white/[0.02] border border-white/[0.05] p-8 md:p-10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:bg-white/[0.03] hover:border-violet-500/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover:bg-violet-500/20" />
              <div className="relative z-10">
                <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-4 block">
                  01 // Decision Style
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                  You are a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{report.decisionStyle}</span> Decision Maker
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                  {report.patterns}
                </p>
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: METRICS OVERVIEW */}
          <motion.div variants={itemVariants} className="lg:col-span-4 group">
            <div className="w-full h-full rounded-3xl bg-white/[0.02] border border-white/[0.05] p-8 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.03] hover:border-white/10">
              <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-8 block">
                02 // Final Metrics
              </span>
              <div className="space-y-6">
                <MetricAnimatedBar label="Impact" value={metrics.impact} colorClass="bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                <MetricAnimatedBar label="Finance" value={metrics.finance} colorClass="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                <MetricAnimatedBar label="Risk" value={metrics.risk} colorClass="bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                <MetricAnimatedBar label="Trust" value={metrics.trust} colorClass="bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              </div>
            </div>
          </motion.div>

          {/* SECTION 3: STRENGTHS */}
          <motion.div variants={itemVariants} className="lg:col-span-6 group">
            <div className="w-full h-full rounded-3xl bg-emerald-500/[0.02] border border-emerald-500/10 p-8 md:p-10 backdrop-blur-xl transition-all duration-500 hover:bg-emerald-500/[0.04] hover:border-emerald-500/30">
              <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-500/70 uppercase mb-6 block">
                03 // Performance Highlights
              </span>
              <ul className="space-y-4">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-emerald-100/80 text-lg">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/30 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-snug">{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* SECTION 4: WEAKNESSES */}
          <motion.div variants={itemVariants} className="lg:col-span-6 group">
            <div className="w-full h-full rounded-3xl bg-rose-500/[0.02] border border-rose-500/10 p-8 md:p-10 backdrop-blur-xl transition-all duration-500 hover:bg-rose-500/[0.04] hover:border-rose-500/30">
              <span className="text-[10px] font-mono tracking-[0.2em] text-rose-500/70 uppercase mb-6 block">
                04 // Areas of Exposure
              </span>
              <ul className="space-y-4">
                {report.weaknesses.map((wk, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-rose-100/80 text-lg">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm border border-rose-500/30 mt-0.5">
                      !
                    </span>
                    <span className="leading-snug">{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* SECTION 5: SUMMARY */}
          <motion.div variants={itemVariants} className="lg:col-span-12 group">
            <div className="relative w-full rounded-3xl bg-zinc-900/40 border border-zinc-800 p-8 md:p-12 backdrop-blur-xl text-center overflow-hidden transition-all duration-500 hover:bg-zinc-900/60">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-4xl mx-auto">
                <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-6 block">
                  05 // System Synthesis
                </span>
                <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-medium">
                  "{report.summary}"
                </p>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex justify-center mt-16"
        >
          <button
            onClick={handleRestart}
            className="group relative flex items-center gap-3 px-10 py-4 rounded-xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-2xl hover:shadow-white/5 active:scale-95 transition-all duration-300"
          >
            <span>Start New Simulation</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </motion.div>

      </div>
    </main>
  );
}
