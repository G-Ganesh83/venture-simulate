"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSimulationStore } from "@/store/useSimulationStore";

// ── Question Data ──────────────────────────────────────

interface Question {
  id: "experience" | "context" | "domain";
  label: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: "experience",
    label: "Have you tried building a project?",
    options: ["Yes", "No", "I've thought about it"],
  },
  {
    id: "context",
    label: "What is your current role?",
    options: ["Student", "Working Professional", "Exploring Options"],
  },
  {
    id: "domain",
    label: "Which area interests you most?",
    options: ["Education", "Healthcare", "Environment"],
  },
];

// ── Page Component ─────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const setUserProfile = useSimulationStore((s) => s.setUserProfile);

  const [answers, setAnswers] = useState<Record<string, string>>({
    experience: "",
    context: "",
    domain: "",
  });

  const allAnswered = Object.values(answers).every((v) => v !== "");

  const handleSelect = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleContinue = () => {
    if (!allAnswered) return;
    setUserProfile(answers);
    router.push("/scenario");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[300px] w-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium tracking-widest uppercase text-violet-400 mb-3">
            Getting Started
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Tell us about yourself
          </h1>
          <p className="mt-3 text-[var(--muted)] text-sm leading-relaxed max-w-md mx-auto">
            We&apos;ll tailor your simulation based on your background and
            interests.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {questions.map((q, qIndex) => (
            <div
              key={q.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 transition-all duration-300"
              style={{
                animationDelay: `${qIndex * 100}ms`,
              }}
            >
              {/* Question label */}
              <div className="flex items-start gap-3 mb-5">
                <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/10 text-violet-400 text-xs font-bold">
                  {qIndex + 1}
                </span>
                <h2 className="text-base font-semibold text-white leading-snug pt-0.5">
                  {q.label}
                </h2>
              </div>

              {/* Options */}
              <div className="grid gap-2.5">
                {q.options.map((option) => {
                  const isSelected = answers[q.id] === option;
                  return (
                    <button
                      key={option}
                      id={`option-${q.id}-${option.toLowerCase().replace(/\s+/g, "-").replace(/'/g, "")}`}
                      onClick={() => handleSelect(q.id, option)}
                      className={`
                        group relative w-full text-left px-4 py-3.5 rounded-lg text-sm font-medium
                        transition-all duration-200 cursor-pointer
                        border
                        ${
                          isSelected
                            ? "border-violet-500/60 bg-violet-500/10 text-white shadow-[0_0_20px_rgba(139,92,246,0.08)]"
                            : "border-[var(--border)] bg-white/[0.02] text-[var(--muted)] hover:border-[#3f3f46] hover:bg-white/[0.04] hover:text-white"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {/* Radio indicator */}
                        <span
                          className={`
                            flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all duration-200
                            flex items-center justify-center
                            ${
                              isSelected
                                ? "border-violet-500 bg-violet-500"
                                : "border-zinc-600 group-hover:border-zinc-500"
                            }
                          `}
                        >
                          {isSelected && (
                            <span className="block w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Continue button */}
        <div className="mt-10 flex justify-center">
          <button
            id="continue-btn"
            onClick={handleContinue}
            disabled={!allAnswered}
            className={`
              relative px-10 py-3.5 rounded-xl text-sm font-semibold tracking-wide
              transition-all duration-300 cursor-pointer
              ${
                allAnswered
                  ? "bg-violet-600 text-white hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] active:scale-[0.98]"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }
            `}
          >
            {allAnswered && (
              <span className="absolute inset-0 rounded-xl bg-violet-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            <span className="relative">Continue →</span>
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 flex justify-center gap-1.5">
          {questions.map((q) => (
            <div
              key={q.id}
              className={`h-1 rounded-full transition-all duration-500 ${
                answers[q.id]
                  ? "w-8 bg-violet-500"
                  : "w-4 bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
