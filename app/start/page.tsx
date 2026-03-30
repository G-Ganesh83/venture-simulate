"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulationStore } from "@/store/useSimulationStore";

// ── Domain Cards Data ──────────────────────────────────
const DOMAINS = [
  {
    id: "education",
    title: "Education",
    emoji: "🎓",
    description: "Transform access to learning for underserved communities",
    accent: "from-violet-500/20 to-indigo-500/10",
    border: "border-violet-500/40",
    glow: "shadow-[0_0_40px_rgba(139,92,246,0.25)]",
    ring: "ring-violet-500/30",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    emoji: "🏥",
    description: "Build solutions that improve health outcomes at scale",
    accent: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/40",
    glow: "shadow-[0_0_40px_rgba(52,211,153,0.25)]",
    ring: "ring-emerald-500/30",
  },
  {
    id: "environment",
    title: "Environment",
    emoji: "🌱",
    description: "Develop sustainable systems for a healthier planet",
    accent: "from-green-500/20 to-lime-500/10",
    border: "border-green-500/40",
    glow: "shadow-[0_0_40px_rgba(34,197,94,0.25)]",
    ring: "ring-green-500/30",
  },
  {
    id: "livelihood",
    title: "Livelihood",
    emoji: "💼",
    description: "Create economic opportunities and financial empowerment",
    accent: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/40",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.25)]",
    ring: "ring-amber-500/30",
  },
];

// ── Experience Levels ──────────────────────────────────
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

// ── Animation Variants ─────────────────────────────────
const pageVariants = {
  enter: { opacity: 0, y: 40 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

const pageTransition = {
  duration: 0.55,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ease: [0.22, 1, 0.36, 1] as any,
};

// ── Page Component ─────────────────────────────────────
export default function StartPage() {
  const router = useRouter();
  const setStartupConfig = useSimulationStore((s) => s.setStartupConfig);

  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState("");
  const [idea, setIdea] = useState("");
  const [budget, setBudget] = useState(500000);
  const [teamSize, setTeamSize] = useState(2);
  const [experience, setExperience] = useState("Beginner");

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Handlers ───────────────────────────────────────────

  const selectDomain = (id: string) => {
    setDomain(id);
    // Brief delay for the selection glow to register visually
    setTimeout(() => setStep(2), 400);
  };

  const goToStep3 = () => {
    if (idea.trim().length > 0) {
      setStep(3);
    }
  };

  const enterSimulation = () => {
    setStartupConfig({ domain, idea, budget, teamSize, experience });
    router.push("/simulation");
  };

  // ── Utility: Format budget value ───────────────────────
  const formatBudget = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${(val / 1000).toFixed(0)}K`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* ── Ambient Background ── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#04040a] via-[#0a0a18] to-[#08061a]" />
        <div className="absolute top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.05] blur-[160px]" />
        <div className="absolute bottom-[10%] right-[15%] h-[400px] w-[400px] rounded-full bg-indigo-600/[0.04] blur-[140px]" />
        <div className="absolute top-[60%] left-[60%] h-[350px] w-[350px] rounded-full bg-purple-500/[0.03] blur-[120px]" />
      </div>

      {/* ── Grid overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Step Progress ── */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`
                w-2 h-2 rounded-full transition-all duration-500
                ${step >= s
                  ? "bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                  : "bg-zinc-700"
                }
              `}
            />
            {s < 3 && (
              <div
                className={`w-8 h-[1px] transition-all duration-500 ${
                  step > s ? "bg-violet-500/40" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Step Content ── */}
      <div className="relative z-10 w-full max-w-4xl px-6 py-20">
        <AnimatePresence mode="wait">

          {/* ════════════════════════════════════════════════
              STEP 1 — DOMAIN SELECTION
              ════════════════════════════════════════════════ */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              {/* Header */}
              <div className="text-center mb-14">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[11px] font-mono text-violet-400/70 uppercase tracking-[0.25em] mb-4"
                >
                  Step 01 — Focus Area
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                >
                  Choose Your Focus Area
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-zinc-500 mt-3 text-lg"
                >
                  Where do you want to create impact?
                </motion.p>
              </div>

              {/* Domain Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {DOMAINS.map((d, i) => {
                  const isSelected = domain === d.id;
                  return (
                    <motion.button
                      key={d.id}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      onClick={() => selectDomain(d.id)}
                      className={`
                        relative text-left rounded-2xl border backdrop-blur-md overflow-hidden
                        transition-all duration-400 cursor-pointer group
                        ${isSelected
                          ? `${d.border} ${d.glow} bg-gradient-to-br ${d.accent}`
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                        }
                      `}
                      whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ perspective: "800px" }}
                    >
                      {/* Pulse glow overlay for selected */}
                      {isSelected && (
                        <motion.div
                          className={`absolute inset-0 rounded-2xl ring-2 ${d.ring}`}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      <div className="relative p-6 md:p-7">
                        <div className="text-3xl mb-3">{d.emoji}</div>
                        <h3 className="text-lg font-bold text-white mb-1.5">{d.title}</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                          {d.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════
              STEP 2 — IDEA CREATION
              ════════════════════════════════════════════════ */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="max-w-2xl mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[11px] font-mono text-violet-400/70 uppercase tracking-[0.25em] mb-4"
                >
                  Step 02 — Define Your Vision
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                >
                  What are you trying to solve?
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-zinc-500 mt-3 text-lg"
                >
                  Define the problem your startup will address
                </motion.p>
              </div>

              {/* Input Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`
                  relative rounded-2xl border backdrop-blur-md transition-all duration-500
                  ${idea.length > 0
                    ? "border-violet-500/30 bg-violet-500/[0.04] shadow-[0_0_30px_rgba(139,92,246,0.08)]"
                    : "border-white/[0.08] bg-white/[0.02]"
                  }
                `}
              >
                <textarea
                  ref={inputRef}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Helping government school students access digital learning..."
                  rows={4}
                  className="w-full bg-transparent text-white text-lg p-6 md:p-8 placeholder:text-zinc-600 resize-none focus:outline-none leading-relaxed"
                  autoFocus
                />

                {/* Character hint */}
                <div className="px-6 pb-4 flex justify-between items-center">
                  <span className={`text-xs font-mono transition-colors ${idea.length > 0 ? "text-violet-400/50" : "text-zinc-700"}`}>
                    {idea.length > 0 ? `${idea.length} characters` : "Start typing..."}
                  </span>
                </div>
              </motion.div>

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mt-10"
              >
                <button
                  onClick={goToStep3}
                  disabled={idea.trim().length === 0}
                  className={`
                    group flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold
                    transition-all duration-400 backdrop-blur-sm
                    ${idea.trim().length > 0
                      ? "bg-violet-600 text-white hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      : "bg-zinc-800/60 text-zinc-600 cursor-not-allowed"
                    }
                  `}
                >
                  Continue
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════
              STEP 3 — REALITY SETUP
              ════════════════════════════════════════════════ */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="max-w-2xl mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[11px] font-mono text-violet-400/70 uppercase tracking-[0.25em] mb-4"
                >
                  Step 03 — Starting Conditions
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                >
                  Set Your Starting Conditions
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-zinc-500 mt-3 text-lg"
                >
                  Every decision depends on your constraints
                </motion.p>
              </div>

              <div className="space-y-10">
                {/* ── Budget Slider ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 md:p-8"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <span className="text-sm font-bold text-white uppercase tracking-widest">Budget</span>
                    </div>
                    <motion.span
                      key={budget}
                      initial={{ scale: 1.2, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xl font-bold text-violet-300 tabular-nums font-mono"
                    >
                      {formatBudget(budget)}
                    </motion.span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={100000}
                      max={1000000}
                      step={50000}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-violet-500
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500
                        [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(139,92,246,0.5)]
                        [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
                        [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-white/20"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                      <span>₹1L</span>
                      <span>₹10L</span>
                    </div>
                  </div>
                </motion.div>

                {/* ── Team Size Slider ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 md:p-8"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👥</span>
                      <span className="text-sm font-bold text-white uppercase tracking-widest">Team Strength</span>
                    </div>
                    <span className="text-xl font-bold text-blue-300 tabular-nums font-mono">
                      {teamSize}
                    </span>
                  </div>
                  {/* Visual team icons */}
                  <div className="flex items-center gap-2 mb-5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <motion.div
                        key={n}
                        animate={{
                          scale: n <= teamSize ? 1 : 0.8,
                          opacity: n <= teamSize ? 1 : 0.2,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`
                          w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors
                          ${n <= teamSize
                            ? "bg-blue-500/20 border border-blue-500/30"
                            : "bg-zinc-800/50 border border-zinc-800"
                          }
                        `}
                      >
                        👤
                      </motion.div>
                    ))}
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                      [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(96,165,250,0.5)]
                      [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
                      [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:border-2
                      [&::-webkit-slider-thumb]:border-white/20"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                    <span>Solo</span>
                    <span>5 Members</span>
                  </div>
                </motion.div>

                {/* ── Experience Level ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🧠</span>
                    <span className="text-sm font-bold text-white uppercase tracking-widest">Experience Level</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {EXPERIENCE_LEVELS.map((level) => {
                      const isActive = experience === level;
                      return (
                        <button
                          key={level}
                          onClick={() => setExperience(level)}
                          className={`
                            relative py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer
                            border overflow-hidden
                            ${isActive
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.12)]"
                              : "bg-white/[0.02] border-white/[0.06] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300"
                            }
                          `}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="experience-indicator"
                              className="absolute inset-0 bg-amber-500/5 rounded-xl"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <span className="relative">{level}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Enter Simulation Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="flex justify-center mt-12"
              >
                <button
                  onClick={enterSimulation}
                  className="group relative flex items-center gap-3 px-10 py-4 rounded-xl text-sm font-bold text-white
                    bg-gradient-to-r from-violet-600 to-indigo-600 cursor-pointer
                    transition-all duration-400
                    hover:from-violet-500 hover:to-indigo-500
                    hover:shadow-[0_0_50px_rgba(139,92,246,0.35)]
                    hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <span className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all" />
                  <span className="relative">Enter Simulation</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="relative transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
