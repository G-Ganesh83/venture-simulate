import { getActionsForDomain } from "./domainActions";

export interface Metrics {
  impact: number;
  finance: number;
  risk: number;
  trust: number;
}

export interface ReportData {
  decisionStyle: string;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  score: number;
  patterns: string;
  recommendation: string; // fallback matching interface
}

export function generateReport(domain: string, decisions: string[], metrics: Metrics): ReportData {
  // 1. DECISION STYLE
  const allDomainActions = getActionsForDomain(domain);
  let aggressive = 0;
  let balanced = 0;
  let cautious = 0;

  decisions.forEach((decisionLabel) => {
    const action = allDomainActions.find((a) => a.label === decisionLabel);
    if (action) {
      if (action.tone === "aggressive") aggressive++;
      else if (action.tone === "balanced") balanced++;
      else if (action.tone === "cautious") cautious++;
    }
  });

  let decisionStyle = "Strategic"; // Default to balanced/strategic
  let patterns = "You took a balanced, measured approach to most decisions.";
  
  if (aggressive > balanced && aggressive > cautious) {
    decisionStyle = "Risk-Taker";
    patterns = "You consistently favored aggressive growth and scaling, accepting higher risk for potential rewards.";
  } else if (cautious > balanced && cautious > aggressive) {
    decisionStyle = "Cautious";
    patterns = "Your strategy heavily prioritized safety and incremental progress over aggressive expansion.";
  }

  // 2. STRENGTHS
  const strengths: string[] = [];
  if (metrics.impact > 70) strengths.push("Strong social impact focus");
  if (metrics.trust > 70) strengths.push("Excellent stakeholder management");
  if (metrics.finance > 70) strengths.push("Efficient resource handling");
  
  if (strengths.length === 0) {
    if (metrics.risk < 50) strengths.push("Maintained safe operational bounds");
    else strengths.push("Required standard operational execution");
  }

  // 3. WEAKNESSES
  const weaknesses: string[] = [];
  if (metrics.risk > 70) weaknesses.push("Takes excessive risks");
  if (metrics.trust < 30) weaknesses.push("Weak stakeholder trust");
  if (metrics.finance < 30) weaknesses.push("Poor financial control");

  if (weaknesses.length === 0) {
    if (metrics.impact < 50) weaknesses.push("Struggled to scale impact efficiently");
    else weaknesses.push("Growth lacked aggressive momentum");
  }

  // 4. SCORE
  const score = Math.round((metrics.impact + metrics.finance + metrics.trust + metrics.risk) / 4);

  // 5. SUMMARY
  const compareMetrics = {
    Impact: metrics.impact,
    Finance: metrics.finance,
    "Stakeholder Trust": metrics.trust,
    Risk: metrics.risk,
  };

  let strongestMetric = Object.keys(compareMetrics).reduce((a, b) => compareMetrics[a as keyof typeof compareMetrics] > compareMetrics[b as keyof typeof compareMetrics] ? a : b);
  let weakestMetric = Object.keys(compareMetrics).reduce((a, b) => compareMetrics[a as keyof typeof compareMetrics] < compareMetrics[b as keyof typeof compareMetrics] ? a : b);

  if (strongestMetric === weakestMetric) {
    strongestMetric = "balanced execution";
    weakestMetric = "breaking out of safe patterns";
  }

  const summary = `You showed a ${decisionStyle} approach. You performed well in ${strongestMetric} but struggled with ${weakestMetric}.`;

  return {
    decisionStyle,
    strengths,
    weaknesses,
    summary,
    score,
    patterns,
    recommendation: "", // keep for type compatibility if needed
  };
}
