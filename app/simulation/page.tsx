"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSimulationStore } from "@/store/useSimulationStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  getActionsForDomain,
  calculateDynamicDelta,
  generateFeedMessage,
  CATEGORY_STYLES,
  TONE_COLORS,
  // newly added imports for crisis and pressure
  rollForCrisis,
  checkForWarnings,
  applyDifficultyScaling,
  CRISIS_SEVERITY_STYLES,
  MONTH_LABELS,
  MAX_MONTHS,
  type DomainAction,
  type ActionTone,
  type CrisisEvent,
  type MetricWarning,
} from "@/lib/domainActions";

// ── Types ──────────────────────────────────────────────
interface FlowNode {
  id: number;
  round: number;
  icon: string;
  label: string;
  tone: ActionTone;
  consequence: string;
}

interface MetricBurst {
  id: number;
  label: string;
  value: number;
  x: number;
  y: number;
}

// ── Flow Map Component ─────────────────────────────────
function FlowMap({ nodes }: { nodes: FlowNode[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [nodes]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-zinc-800">
      <div className="flex flex-col items-center gap-0">
        {/* Start Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full border-2 border-zinc-700 bg-zinc-900/80 flex items-center justify-center text-lg backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.03)]">
            🎯
          </div>
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.15em] mt-2">
            Launch
          </span>
        </motion.div>

        {/* Decision Nodes */}
        {nodes.map((node) => {
          const colors = TONE_COLORS[node.tone];
          return (
            <div key={node.id} className="flex flex-col items-center">
              {/* Animated connecting line */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 48, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-[2px] bg-gradient-to-b from-zinc-700 to-transparent relative overflow-hidden"
              >
                <motion.div
                  initial={{ top: "-100%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute w-full h-4 bg-gradient-to-b from-transparent via-violet-400/60 to-transparent"
                />
              </motion.div>

              {/* Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
                className="relative flex flex-col items-center"
              >
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-40"
                  style={{ background: `radial-gradient(circle, ${colors.glow}, transparent 70%)`, width: 80, height: 80, left: -10, top: -10 }}
                />

                <div
                  className={`relative w-14 h-14 rounded-full border-2 ${colors.border} ${colors.node} backdrop-blur-sm flex items-center justify-center text-lg cursor-default transition-all hover:scale-110`}
                  style={{ boxShadow: `0 0 20px ${colors.glow}` }}
                >
                  {node.icon}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 max-w-[200px] text-center"
                >
                  <span className={`text-[10px] font-mono uppercase tracking-[0.1em] ${colors.text}`}>
                    M{node.round}
                  </span>
                  <p className="text-[11px] font-semibold text-zinc-300 mt-0.5 leading-tight">
                    {node.label}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1 leading-snug">
                    {node.consequence}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Floating Metric Burst ──────────────────────────────
function MetricBurstOverlay({ bursts }: { bursts: MetricBurst[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{ opacity: 1, y: 0, x: burst.x, scale: 0.8 }}
            animate={{ opacity: 0, y: -60, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute"
            style={{ top: burst.y, left: burst.x }}
          >
            <span
              className={`text-sm font-bold font-mono px-3 py-1 rounded-full backdrop-blur-sm border ${
                burst.value > 0
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                  : "text-rose-400 bg-rose-500/10 border-rose-500/30"
              }`}
            >
              {burst.value > 0 ? "+" : ""}{burst.value} {burst.label} {burst.value > 0 ? "↑" : "↓"}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── System Reaction Bar ────────────────────────────────
function SystemReactionBar({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-md"
        >
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-violet-500/20 bg-black/80 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <div className="w-1 h-8 rounded-full bg-violet-500" />
            <span className="text-xs text-zinc-300 leading-relaxed font-medium">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Resource Bar Metric ────────────────────────────────
function ResourceMetric({
  label, value, icon, color, glowColor,
  pulsate = false
}: {
  label: string; value: number; icon: string; color: string; glowColor: string; pulsate?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <motion.div
      animate={pulsate ? { boxShadow: [`0 0 15px ${glowColor}`, `0 0 35px ${glowColor}`, `0 0 15px ${glowColor}`] } : {}}
      transition={pulsate ? { duration: 1.5, repeat: Infinity } : {}}
      className={`flex-1 min-w-[140px] rounded-xl border backdrop-blur-md px-4 py-3 bg-white/[0.03] ${color} transition-shadow duration-500`}
      style={!pulsate ? { boxShadow: `0 0 15px ${glowColor}` } : {}}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.12em]">{label}</span>
        </div>
        <motion.span
          key={clamped}
          initial={{ scale: 1.4, opacity: 0.3 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-sm font-bold tabular-nums text-white"
        >
          {Math.round(clamped)}
        </motion.span>
      </div>
      <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={false}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            background: glowColor.replace("0.08", "0.7").replace("0.15", "0.8").replace("0.2", "0.8"), // Adjusted for warning colors
            boxShadow: `0 0 8px ${glowColor.replace("0.08", "0.5").replace("0.15", "0.5").replace("0.2", "0.5")}`,
          }}
        />
      </div>
    </motion.div>
  );
}

// ── Action Card Component (with category tag + hover hint) ──
function ActionCard({
  action,
  isLocked,
  index,
  onClick,
}: {
  action: DomainAction;
  isLocked: boolean;
  index: number;
  onClick: () => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const toneColor = TONE_COLORS[action.tone];
  const catStyle = CATEGORY_STYLES[action.category];

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06 }}
      whileHover={!isLocked ? { scale: 1.02, x: -3 } : {}}
      whileTap={!isLocked ? { scale: 0.97 } : {}}
      onMouseEnter={() => !isLocked && setShowHint(true)}
      onMouseLeave={() => setShowHint(false)}
      className={`
        w-full relative text-left rounded-xl border backdrop-blur-md overflow-hidden
        transition-all duration-300 cursor-pointer group
        ${isLocked
          ? "opacity-25 cursor-not-allowed border-white/[0.04] bg-black/20"
          : "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]"
        }
      `}
    >
      {!isLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="relative p-4 flex items-center gap-4">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl ${toneColor.node} border ${toneColor.border} flex items-center justify-center text-xl flex-shrink-0`}>
          {action.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-white group-hover:text-violet-100 transition-colors truncate">
              {action.label}
            </h3>
            {/* Category tag */}
            <span className={`text-[8px] font-mono uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-md ${catStyle.bg} ${catStyle.color} ${catStyle.border} border flex-shrink-0`}>
              {catStyle.label}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-snug group-hover:text-zinc-400 transition-colors">
            {action.intent}
          </p>
        </div>

        {/* Arrow */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-zinc-700 group-hover:text-zinc-400 transition-colors flex-shrink-0">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>

      {/* Hover hint tooltip */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="px-4 pb-3 pt-0"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] text-zinc-500">💡</span>
              <span className="text-[10px] text-zinc-400 italic leading-snug">
                {action.hint}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Crisis Popup Notification ────────────────────────────
function CrisisModal({ crisis, onAcknowledge }: { crisis: CrisisEvent | null; onAcknowledge: () => void }) {
  if (!crisis) return null;
  const style = CRISIS_SEVERITY_STYLES[crisis.severity];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border ${style.border} bg-[#0A0A0A] shadow-2xl`}
        style={{ boxShadow: `0 20px 50px -12px ${style.glow}` }}
      >
        {/* Header pattern */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${style.bg.replace('/10', '/80')}`} />
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full ${style.bg} ${style.border} border flex items-center justify-center text-2xl`}>
              {crisis.icon}
            </div>
            <div>
              <div className={`text-[10px] font-mono uppercase tracking-[0.15em] ${style.color} mb-1`}>
                {crisis.severity} Event
              </div>
              <h2 className="text-xl font-bold text-white">{crisis.title}</h2>
            </div>
          </div>
          
          <p className="text-zinc-400 leading-relaxed mb-6">
            {crisis.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
             {Object.entries(crisis.delta).map(([key, value]) => {
                if (value === 0) return null;
                const isPositive = value > 0;
                return (
                  <div key={key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-xs text-zinc-500 capitalize">{key}</span>
                    <span className={`text-sm font-bold font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? '+' : ''}{value}
                    </span>
                  </div>
                );
             })}
          </div>

          <button
            onClick={onAcknowledge}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${style.bg} ${style.color} hover:bg-white/[0.1] border ${style.border}`}
          >
            Acknowledge
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════
export default function SimulationPage() {
  const router = useRouter();

  const metrics = useSimulationStore((s) => s.metrics);
  const startupConfig = useSimulationStore((s) => s.startupConfig);
  const addDecision = useSimulationStore((s) => s.addDecision);
  const updateMetrics = useSimulationStore((s) => s.updateMetrics);

  const [currentRound, setCurrentRound] = useState(1);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>([]);
  const [metricBursts, setMetricBursts] = useState<MetricBurst[]>([]);
  const [showGlow, setShowGlow] = useState(false);
  
  // Feed & Reactions
  const [systemReaction, setSystemReaction] = useState("");
  const [showReaction, setShowReaction] = useState(false);
  const [feedLines, setFeedLines] = useState<{ id: number; text: string }[]>([]);
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Pressure System State
  const [activeWarnings, setActiveWarnings] = useState<MetricWarning[]>([]);
  const [activeCrisis, setActiveCrisis] = useState<CrisisEvent | null>(null);

  // Get domain-specific actions
  const domain = startupConfig.domain || "education";
  const domainActions = getActionsForDomain(domain);

  // Seed initial feed line
  useEffect(() => {
    const budgetStr = startupConfig.budget ? `₹${(startupConfig.budget / 100000).toFixed(1)}L` : "₹5.0L";
    const team = startupConfig.teamSize || 2;
    setFeedLines([
      { id: Date.now(), text: `System initialized — ${domain} venture, ${budgetStr} budget, team of ${team}` },
    ]);
  }, [startupConfig, domain]);

  // Check warnings initially and on metric change
  useEffect(() => {
    setActiveWarnings(checkForWarnings(metrics));
  }, [metrics]);

  // Auto-scroll micro-feed
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feedLines]);

  // End simulation
  useEffect(() => {
    if (currentRound > MAX_MONTHS) {
      router.push("/report");
    }
  }, [currentRound, router]);

  if (currentRound > MAX_MONTHS) return null;

  // ── Spawn metric bursts ──────────────────────────────
  const spawnBursts = (delta: { impact: number; finance: number; risk: number; trust: number }) => {
    const entries: MetricBurst[] = [];
    const labels: [string, number][] = [
      ["Impact", delta.impact],
      ["Finance", delta.finance],
      ["Risk", delta.risk],
      ["Trust", delta.trust],
    ];

    labels.forEach(([label, value], i) => {
      if (value !== 0) {
        entries.push({
          id: Date.now() + i,
          label,
          value,
          x: 200 + i * 160 + Math.random() * 40,
          y: 140 + Math.random() * 30,
        });
      }
    });

    setMetricBursts(entries);
    setTimeout(() => setMetricBursts([]), 1500);
  };

  // ── Handle Action ────────────────────────────────────
  const handleAction = async (action: DomainAction) => {
    if (locked || loading) return;

    setLocked(true);
    setLoading(true);
    addDecision(action.label);

    // Processing delay
    await new Promise((r) => setTimeout(r, 1800));

    // Calculate dynamic effects based on current metrics
    const dynamicDelta = calculateDynamicDelta(action.baseDelta, metrics);
    
    // Apply Difficulty Scaling (Pressure System)
    const scaledDelta = applyDifficultyScaling(dynamicDelta, currentRound);

    // Pick consequence from domain action pool
    const consequence = action.consequences[(currentRound - 1) % action.consequences.length];

    // Generate contextual feed message
    const feedMsg = generateFeedMessage(action, scaledDelta);

    // Add flow node
    setFlowNodes((prev) => [
      ...prev,
      {
        id: Date.now(),
        round: currentRound,
        icon: action.icon,
        label: action.label,
        tone: action.tone,
        consequence,
      },
    ]);

    // Add consequence + summary to micro-feed
    setFeedLines((prev) => [
      ...prev,
      { id: Date.now() + 1, text: consequence },
      { id: Date.now() + 2, text: feedMsg },
    ]);

    // Update metrics with dynamic scaled delta
    updateMetrics(scaledDelta);

    // Spawn floating metric indicators
    spawnBursts(scaledDelta);

    // Screen pulse
    setShowGlow(true);
    setTimeout(() => setShowGlow(false), 600);

    // System reaction bar
    const reaction = action.reactions[(currentRound - 1) % action.reactions.length];
    setSystemReaction(reaction);
    setShowReaction(true);
    setTimeout(() => setShowReaction(false), 3000);

    setLoading(false);

    // Roll for crisis after action effects process
    setTimeout(() => {
        // Evaluate metrics AFTER the update has settled using slightly delayed state reading or calculating new state
        const newMetrics = {
            impact: Math.max(0, Math.min(100, metrics.impact + scaledDelta.impact)),
            finance: Math.max(0, Math.min(100, metrics.finance + scaledDelta.finance)),
            risk: Math.max(0, Math.min(100, metrics.risk + scaledDelta.risk)),
            trust: Math.max(0, Math.min(100, metrics.trust + scaledDelta.trust)),
        };

        const crisis = rollForCrisis(currentRound, newMetrics);
        if (crisis) {
            setActiveCrisis(crisis);
            // Time will advance after crisis is dismissed
        } else {
            setLocked(false);
            setCurrentRound((prev) => prev + 1);
        }
    }, 2800);
  };

  // ── Handle Crisis Acknowledgment ───────────────────────
  const handleAcknowledgeCrisis = () => {
    if (!activeCrisis) return;
    
    // Apply crisis delta
    updateMetrics(activeCrisis.delta);
    
    // Feed updates
    setFeedLines(prev => [
      ...prev,
      { id: Date.now(), text: `CRISIS EVENT: ${activeCrisis.title} - ${activeCrisis.description}` }
    ]);
    
    // Spawn bursts for crisis impact
    spawnBursts(activeCrisis.delta);

    // Screen flash for crisis
    setShowGlow(true);
    setTimeout(() => setShowGlow(false), 600);

    setActiveCrisis(null);
    
    // Advance time
    setTimeout(() => {
      setLocked(false);
      setCurrentRound((prev) => prev + 1);
    }, 1000);
  };

  // Determine global visual states based on warnings
  const isHighRisk = activeWarnings.some(w => w.id.includes('risk'));
  const isLowBudget = activeWarnings.some(w => w.id.includes('finance_critical'));

  return (
    <main className={`relative min-h-screen overflow-hidden flex flex-col transition-colors duration-1000 ${isLowBudget ? 'bg-black opacity-90' : ''}`}>
      {/* ── Ambient Background ── */}
      <div className="pointer-events-none fixed inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ${
          isHighRisk ? 'from-[#1a0505] via-[#100508] to-[#0a0204]' : 'from-[#04040a] via-[#0a0a18] to-[#08061a]'
        }`} />
        <motion.div
          className="absolute top-[5%] right-[10%] h-[500px] w-[500px] rounded-full blur-[150px]"
          animate={{
            background: showGlow ? (activeCrisis || isHighRisk ? "rgba(244, 63, 94, 0.15)" : "rgba(139, 92, 246, 0.08)") : (isHighRisk ? "rgba(244, 63, 94, 0.05)" : "rgba(139, 92, 246, 0.03)"),
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[5%] h-[400px] w-[400px] rounded-full blur-[120px]"
          animate={{
            background: showGlow ? (activeCrisis || isHighRisk ? "rgba(225, 29, 72, 0.1)" : "rgba(99, 102, 241, 0.06)") : (isHighRisk ? "rgba(225, 29, 72, 0.03)" : "rgba(99, 102, 241, 0.02)"),
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Screen pulse flash */}
      <AnimatePresence>
        {showGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`pointer-events-none fixed inset-0 z-40 ${activeCrisis || isHighRisk ? 'bg-rose-500/[0.08]' : 'bg-violet-500/[0.06]'}`}
          />
        )}
      </AnimatePresence>

      {/* Floating metric bursts - keep above backdrop but below modals */}
      <div className="z-40 pointer-events-none absolute inset-0">
          <MetricBurstOverlay bursts={metricBursts} />
      </div>

      {/* Warning/Crisis Overlays */}
      <AnimatePresence>
        {activeCrisis && (
          <CrisisModal crisis={activeCrisis} onAcknowledge={handleAcknowledgeCrisis} />
        )}
      </AnimatePresence>

      {/* System Reaction Bar */}
      <SystemReactionBar message={systemReaction} visible={showReaction} />

      {/* ════════════════════════════════════════════════════
          WARNING BANNER (If Active)
          ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeWarnings.length > 0 && !activeCrisis && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-30 bg-rose-500/10 border-b border-rose-500/20 backdrop-blur-md overflow-hidden"
          >
            <div className="max-w-[1800px] mx-auto px-6 py-2 flex items-center justify-between overflow-x-auto gap-4 scrollbar-none">
               <div className="flex items-center gap-6">
                 {activeWarnings.map(warn => (
                    <div key={warn.id} className="flex items-center gap-2 flex-shrink-0">
                      <span>{warn.icon}</span>
                      <span className={`text-xs font-semibold ${warn.severity === 'danger' ? 'text-red-400' : 'text-orange-400'}`}>
                        {warn.message}
                      </span>
                    </div>
                 ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ════════════════════════════════════════════════════
          TOP — RESOURCE BAR (sticky)
          ════════════════════════════════════════════════════ */}
      <div className="relative z-20 sticky top-0 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${locked ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${locked ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              </span>
              <span className={`text-[11px] font-mono uppercase tracking-[0.15em] ${locked ? 'text-amber-400/80' : 'text-emerald-400/80'}`}>
                {locked ? "Processing" : "Simulation Active"}
              </span>
              <span className="text-zinc-700">|</span>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-[0.15em]">
                {domain.charAt(0).toUpperCase() + domain.slice(1)} Initiative
              </span>
            </div>
            <div className="flex items-center gap-4">
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
                  <span className="text-[10px] font-mono text-violet-400/80 uppercase tracking-wide">Simulating Month...</span>
                </motion.div>
              )}
              <span className="text-[11px] font-mono text-zinc-500">
                TIMELINE: <span className="text-white font-bold">{MONTH_LABELS[currentRound - 1]}</span>
                <span className="text-zinc-700"> / {MAX_MONTHS}</span>
              </span>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            <ResourceMetric 
              label="Impact" 
              value={metrics.impact} 
              icon="📈" 
              color={activeWarnings.some(w => w.id.includes('impact')) ? "border-rose-500/30 bg-rose-500/5" : "border-emerald-500/20"} 
              glowColor={activeWarnings.some(w => w.id.includes('impact')) ? "rgba(244, 63, 94, 0.15)" : "rgba(52, 211, 153, 0.08)"} 
              pulsate={activeWarnings.some(w => w.id.includes('impact_critical'))}
            />
            <ResourceMetric 
              label="Finance" 
              value={metrics.finance} 
              icon="💰" 
              color={activeWarnings.some(w => w.id.includes('finance')) ? "border-rose-500/30 bg-rose-500/5" : "border-blue-500/20"} 
              glowColor={activeWarnings.some(w => w.id.includes('finance')) ? "rgba(244, 63, 94, 0.15)" : "rgba(96, 165, 250, 0.08)"} 
              pulsate={activeWarnings.some(w => w.id.includes('finance_critical'))}
            />
            <ResourceMetric 
              label="Risk" 
              value={metrics.risk} 
              icon="⚠️" 
              color={activeWarnings.some(w => w.id.includes('risk')) ? "border-rose-500/30 bg-rose-500/5" : "border-rose-500/20"} 
              glowColor={activeWarnings.some(w => w.id.includes('risk')) ? "rgba(244, 63, 94, 0.2)" : "rgba(244, 63, 94, 0.08)"} 
              pulsate={activeWarnings.some(w => w.id.includes('risk_critical'))}
            />
            <ResourceMetric 
              label="Trust" 
              value={metrics.trust} 
              icon="🛡️" 
              color={activeWarnings.some(w => w.id.includes('trust')) ? "border-rose-500/30 bg-rose-500/5" : "border-amber-500/20"} 
              glowColor={activeWarnings.some(w => w.id.includes('trust')) ? "rgba(244, 63, 94, 0.15)" : "rgba(251, 191, 36, 0.08)"} 
              pulsate={activeWarnings.some(w => w.id.includes('trust_critical'))}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          MAIN — 3-Column: Feed | Flow Map | Actions
          ════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 max-w-[1800px] mx-auto w-full px-6 py-4">
        <div className="grid lg:grid-cols-[1fr_280px_1fr] gap-5 h-full min-h-[calc(100vh-180px)]">

          {/* ──── LEFT: Micro-Feed ──── */}
          <div className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/60" />
                <span className="w-2 h-2 rounded-full bg-amber-500/60" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] ml-2">Event Log</span>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800">
              <AnimatePresence mode="popLayout">
                {feedLines.map((line, idx) => {
                  const isLatest = idx === feedLines.length - 1;
                  const isCrisis = line.text.startsWith("CRISIS");
                  return (
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, x: -15, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className={`relative pl-4 border-l-2 py-1 ${isLatest && !isCrisis ? "border-violet-500/60" : isCrisis ? "border-rose-500" : "border-zinc-800"}`}
                    >
                      {isLatest && !isCrisis && <span className="absolute left-[-4px] top-2 w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
                      {isCrisis && <span className="absolute left-[-4px] top-2 w-1.5 h-1.5 rounded-full bg-rose-500" />}
                      <p className={`text-xs leading-relaxed ${isLatest && !isCrisis ? "text-zinc-200" : isCrisis ? "text-rose-300 font-medium" : "text-zinc-600"}`}>
                        {line.text}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={feedEndRef} />
            </div>
          </div>

          {/* ──── CENTER: Flow Map ──── */}
          <div className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.01] backdrop-blur-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Decision Flow</span>
            </div>
            <FlowMap nodes={flowNodes} />
          </div>

          {/* ──── RIGHT: Action Console ──── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-zinc-500" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
                {domain.charAt(0).toUpperCase() + domain.slice(1)} Actions
              </span>
            </div>

            <div className={`space-y-2.5 flex-1 overflow-y-auto content-start scrollbar-thin scrollbar-thumb-zinc-800 pr-1 transition-opacity ${locked && !loading && !activeCrisis ? "opacity-50" : ""}`}>
              {domainActions.map((action, idx) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  isLocked={locked}
                  index={idx}
                  onClick={() => handleAction(action)}
                />
              ))}
            </div>

            {/* Loading state */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-3 flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-violet-400"
                        animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide">Evaluating impact...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next phase status */}
            <AnimatePresence>
              {!loading && locked && !activeCrisis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center justify-center gap-2 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-wide">
                    Advancing Timeline...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Crisis Pending Status */}
            <AnimatePresence>
              {!loading && locked && activeCrisis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-500/30 bg-rose-500/[0.08] animate-pulse"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-mono text-rose-400 capitalize tracking-wide">
                    Action Required: Resolve Crisis
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
