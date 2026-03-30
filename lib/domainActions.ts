// ══════════════════════════════════════════════════════════
// Domain-Driven Action System for VentureSimulate
// ══════════════════════════════════════════════════════════

export type ActionTone = "aggressive" | "balanced" | "cautious";
export type ActionCategory = "resource" | "stakeholder" | "growth" | "risk";

export interface DomainAction {
  id: string;
  icon: string;
  label: string;
  intent: string;
  hint: string; // hover tooltip
  category: ActionCategory;
  tone: ActionTone;
  baseDelta: { impact: number; finance: number; risk: number; trust: number };
  consequences: string[];
  reactions: string[];
}

// ── Category Styling ───────────────────────────────────
export const CATEGORY_STYLES: Record<ActionCategory, { label: string; color: string; bg: string; border: string }> = {
  resource:    { label: "Resource",    color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30" },
  stakeholder: { label: "Stakeholder", color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30" },
  growth:      { label: "Growth",      color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  risk:        { label: "Risk",        color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/30" },
};

export const TONE_COLORS: Record<ActionTone, { node: string; border: string; glow: string; text: string }> = {
  aggressive: { node: "bg-rose-500/20",    border: "border-rose-500/50",    glow: "rgba(244,63,94,0.3)",   text: "text-rose-400" },
  balanced:   { node: "bg-blue-500/20",    border: "border-blue-500/50",    glow: "rgba(96,165,250,0.3)",  text: "text-blue-400" },
  cautious:   { node: "bg-emerald-500/20", border: "border-emerald-500/50", glow: "rgba(52,211,153,0.3)",  text: "text-emerald-400" },
};

// ═══════════════════════════════════════════════════════
// EDUCATION ACTIONS
// ═══════════════════════════════════════════════════════
const EDUCATION_ACTIONS: DomainAction[] = [
  {
    id: "edu_partner_schools",
    icon: "🏫",
    label: "Partner with Schools",
    intent: "Onboard government schools for pilot deployment",
    hint: "Builds trust and reach — requires negotiation effort",
    category: "stakeholder",
    tone: "balanced",
    baseDelta: { impact: 6, finance: -3, risk: -4, trust: 8 },
    consequences: [
      "3 district schools agreed to pilot. Principals request teacher training support.",
      "School board approved your proposal. Teachers are cautiously optimistic.",
      "Partnership formalized — 8 schools in your network. Demand grows.",
      "New school batch onboarded. A teacher reports early engagement improvements.",
    ],
    reactions: [
      "🏫 Institutional partnership established — credibility rising",
      "📋 Compliance requirements noted — ensure curriculum alignment",
      "🤝 Government school network expanding steadily",
      "✅ School adoption rate increasing — monitor teacher bandwidth",
    ],
  },
  {
    id: "edu_invest_content",
    icon: "📚",
    label: "Invest in Content",
    intent: "Build high-quality digital learning materials",
    hint: "High impact on engagement — costs money upfront",
    category: "resource",
    tone: "balanced",
    baseDelta: { impact: 7, finance: -6, risk: -2, trust: 4 },
    consequences: [
      "Content team produced 20 interactive modules. Student feedback is positive.",
      "Bilingual content launched — regional students can now access materials.",
      "Video-based learning modules ready. Early testing shows 40% higher retention.",
      "Content library expanding. Subject matter experts have reviewed quality.",
    ],
    reactions: [
      "📚 Learning content deployed — engagement metrics rising",
      "🎓 Content quality flagged as superior by reviewers",
      "📊 Student retention data looks promising after content update",
      "💡 Interactive modules showing measurable learning gains",
    ],
  },
  {
    id: "edu_hire_teachers",
    icon: "👩‍🏫",
    label: "Hire Field Trainers",
    intent: "Recruit trained educators for on-ground delivery",
    hint: "Essential for scale — heavy recurring cost",
    category: "resource",
    tone: "aggressive",
    baseDelta: { impact: 5, finance: -8, risk: 3, trust: 5 },
    consequences: [
      "4 trainers hired across districts. Salary commitments stretch the budget.",
      "Experienced educators on board — they flag logistic challenges immediately.",
      "Hiring spree adds capacity but pushes monthly costs 30% higher.",
      "Trainers deployed to rural zones. Initial community response is warm.",
    ],
    reactions: [
      "👩‍🏫 Team expansion — operational capacity increased",
      "💵 Recurring salary commitment detected — burn rate elevated",
      "📈 Ground coverage improving with new hires",
      "⚠ HR costs now represent 45% of monthly spending",
    ],
  },
  {
    id: "edu_buy_equipment",
    icon: "💻",
    label: "Buy Learning Devices",
    intent: "Purchase tablets and projectors for classrooms",
    hint: "Unlocks digital access — large one-time cost, adds risk",
    category: "resource",
    tone: "aggressive",
    baseDelta: { impact: 8, finance: -9, risk: 5, trust: 2 },
    consequences: [
      "30 tablets deployed. 2 were damaged in transit — need better logistics.",
      "Projectors installed in 5 schools. Teachers struggle with setup.",
      "Hardware deployed successfully. Students interact with digital learning for the first time.",
      "Devices operational. Maintenance costs emerging as an unexpected burden.",
    ],
    reactions: [
      "💻 Hardware deployment detected — infrastructure expanding",
      "⚠ Asset management required — damage and theft risks exist",
      "📦 Capital expenditure spike — runway impacted significantly",
      "🔧 Maintenance schedule needed for deployed equipment",
    ],
  },
  {
    id: "edu_awareness",
    icon: "📢",
    label: "Run Awareness Campaign",
    intent: "Promote digital learning in local communities",
    hint: "Boosts trust and visibility — low risk move",
    category: "growth",
    tone: "cautious",
    baseDelta: { impact: 3, finance: -2, risk: -3, trust: 7 },
    consequences: [
      "Community meet held in 3 villages. Parents show interest but want proof.",
      "Local newspaper covered your initiative. Inbound inquiries from 2 new schools.",
      "Awareness drive reached 500+ families. Social media mentions trending locally.",
      "Campaign builds grassroots support. A local leader endorses your program.",
    ],
    reactions: [
      "📢 Community awareness elevated — brand visibility increasing",
      "🌐 Social reach expanding — organic mentions growing",
      "🤝 Grassroots trust established in target communities",
      "📰 Media coverage amplifying your mission narrative",
    ],
  },
];

// ═══════════════════════════════════════════════════════
// HEALTHCARE ACTIONS
// ═══════════════════════════════════════════════════════
const HEALTHCARE_ACTIONS: DomainAction[] = [
  {
    id: "health_setup_clinics",
    icon: "🏥",
    label: "Setup Mobile Clinics",
    intent: "Deploy health camps in underserved areas",
    hint: "Direct impact on lives — operationally heavy",
    category: "growth",
    tone: "aggressive",
    baseDelta: { impact: 9, finance: -8, risk: 5, trust: 4 },
    consequences: [
      "2 mobile clinics launched. First week: 120 patients screened, 15 referrals.",
      "Clinic setup in remote tribal area. Community is grateful but infrastructure is poor.",
      "Health camps operational. One clinic faces staffing shortages during peak hours.",
      "Mobile units covering 3 villages weekly. Patients returning for follow-ups.",
    ],
    reactions: [
      "🏥 Health infrastructure deployed — operational complexity rising",
      "🩺 Patient volume exceeding initial forecasts",
      "⚠ Staffing gaps detected at mobile clinic sites",
      "📊 Community health data now being collected systematically",
    ],
  },
  {
    id: "health_hire_doctors",
    icon: "👨‍⚕️",
    label: "Recruit Health Workers",
    intent: "Hire community health workers and nurses",
    hint: "Critical for service delivery — high recurring cost",
    category: "resource",
    tone: "balanced",
    baseDelta: { impact: 5, finance: -7, risk: -2, trust: 6 },
    consequences: [
      "6 ASHA workers recruited. Training begins next week.",
      "Experienced nurse practitioner joins. She identifies 3 process improvements.",
      "Health worker network growing. Community trusts familiar faces more.",
      "Team at capacity. Workers provide door-to-door screening services.",
    ],
    reactions: [
      "👨‍⚕️ Medical staff onboarded — care delivery capacity expanding",
      "💵 Personnel costs represent largest expense category now",
      "🤝 Community-health worker trust bond forming quickly",
      "📋 Training and certification compliance underway",
    ],
  },
  {
    id: "health_buy_equipment",
    icon: "🩺",
    label: "Purchase Medical Gear",
    intent: "Acquire diagnostic tools and medication supplies",
    hint: "Enables treatment — expensive, fragile assets",
    category: "resource",
    tone: "aggressive",
    baseDelta: { impact: 7, finance: -9, risk: 4, trust: 3 },
    consequences: [
      "Diagnostic kits ordered. Delivery delayed by 2 weeks due to vendor issues.",
      "BP monitors and glucometers deployed to all clinics. Accuracy validated.",
      "Medication supply secured for 3 months. Cold chain logistics need work.",
      "Equipment operational. Two units require calibration — minor delay.",
    ],
    reactions: [
      "🩺 Medical equipment procurement — diagnostic capability upgrading",
      "📦 Supply chain dependency identified — monitor vendor reliability",
      "⚠ Equipment maintenance schedule critical for sustainability",
      "💊 Medication inventory management system needed",
    ],
  },
  {
    id: "health_partner_ngo",
    icon: "🤝",
    label: "Partner with NGOs",
    intent: "Collaborate with established health organizations",
    hint: "Builds network and credibility — slow but steady",
    category: "stakeholder",
    tone: "cautious",
    baseDelta: { impact: 4, finance: -2, risk: -5, trust: 9 },
    consequences: [
      "MOU signed with district health NGO. Shared resources reduce redundancy.",
      "NGO partner shares patient database. Targeting becomes more precise.",
      "Joint health drive with partner org reaches 800 beneficiaries in one day.",
      "NGO introduces you to government health ministry contacts.",
    ],
    reactions: [
      "🤝 NGO alliance formed — shared resources and knowledge",
      "🏛️ Institutional credibility rising with government bodies",
      "🔗 Network effects — partner referrals bringing new opportunities",
      "📊 Data sharing agreement unlocking better targeting",
    ],
  },
  {
    id: "health_awareness",
    icon: "📋",
    label: "Health Awareness Drive",
    intent: "Educate communities on preventive healthcare",
    hint: "Low cost, builds long-term trust",
    category: "stakeholder",
    tone: "cautious",
    baseDelta: { impact: 3, finance: -1, risk: -4, trust: 8 },
    consequences: [
      "Nutrition workshops held in 4 villages. Mothers learn infant care practices.",
      "Hygiene campaign reaches schools. Hand-washing compliance improves visibly.",
      "Mental health awareness session — first of its kind in the district.",
      "Community health education reduces misconceptions about vaccinations.",
    ],
    reactions: [
      "📋 Preventive health education deployed — long-term impact seeds planted",
      "🌐 Community health literacy improving measurably",
      "✅ Low-cost, high-trust initiative showing results",
      "🫂 Behavioral change markers detected in target population",
    ],
  },
];

// ═══════════════════════════════════════════════════════
// ENVIRONMENT ACTIONS
// ═══════════════════════════════════════════════════════
const ENVIRONMENT_ACTIONS: DomainAction[] = [
  {
    id: "env_waste_collection",
    icon: "♻️",
    label: "Setup Waste Collection",
    intent: "Build a door-to-door segregated collection system",
    hint: "Foundation for your operation — needs ground staff",
    category: "growth",
    tone: "balanced",
    baseDelta: { impact: 6, finance: -5, risk: -3, trust: 6 },
    consequences: [
      "Collection routes designed for 3 wards. Segregation compliance at 60%.",
      "Residents appreciate the service but some resist segregation mandates.",
      "Daily collection operational. 12 tons of waste processed weekly.",
      "System running smoothly. Municipal body notices and requests a pilot partnership.",
    ],
    reactions: [
      "♻️ Waste collection system live — processing capacity growing",
      "📊 Segregation compliance metrics being tracked",
      "🏘️ Community adoption rate steady at target wards",
      "🤝 Municipal interest detected — potential government partnership",
    ],
  },
  {
    id: "env_awareness_campaign",
    icon: "📢",
    label: "Run Green Campaign",
    intent: "Educate communities about environmental responsibility",
    hint: "Builds public support and trust — low financial risk",
    category: "stakeholder",
    tone: "cautious",
    baseDelta: { impact: 3, finance: -2, risk: -4, trust: 8 },
    consequences: [
      "Workshop in 5 schools — students created eco-pledge wall.",
      "Green campaign trended on local social media. 200+ shares organically.",
      "Community cleanup drive. 40 volunteers participated. Press covered event.",
      "Campaign builds brand as a trusted environment initiative in the district.",
    ],
    reactions: [
      "📢 Environmental awareness reaching critical mass",
      "🌐 Social media engagement spiking on sustainability content",
      "🌱 Community eco-consciousness measurably increasing",
      "📰 Positive media coverage attracting attention from funders",
    ],
  },
  {
    id: "env_govt_partner",
    icon: "🏛️",
    label: "Partner with Government",
    intent: "Collaborate with municipal bodies on waste policy",
    hint: "Opens doors to scale — bureaucratic process, slow",
    category: "stakeholder",
    tone: "cautious",
    baseDelta: { impact: 4, finance: -1, risk: -6, trust: 9 },
    consequences: [
      "Ward councillor supports your pitch. Proposal forwarded to committee.",
      "Government grants conditional support — they want data from your existing operations.",
      "Municipality integrates your model into their annual solid waste plan.",
      "Official partnership signed. Access to government collection vehicles granted.",
    ],
    reactions: [
      "🏛️ Government partnership unlocked — institutional validation",
      "📋 Bureaucratic processes underway — patience required",
      "🔗 Municipal infrastructure access expanding operations",
      "✅ Official recognition elevates credibility significantly",
    ],
  },
  {
    id: "env_buy_machinery",
    icon: "🚛",
    label: "Acquire Processing Equipment",
    intent: "Buy composting units, shredders, or recycling machinery",
    hint: "Scales processing capacity — heavy capital outlay, risky",
    category: "resource",
    tone: "aggressive",
    baseDelta: { impact: 8, finance: -9, risk: 6, trust: 2 },
    consequences: [
      "Composting unit installed. Processing 5 tons/day — breakeven in 8 months.",
      "Shredder purchased. Plastic recycling capability now available.",
      "Equipment deployed but power supply issues in the area cause frequent downtime.",
      "Machinery operational. Revenue from compost sales starting to offset costs.",
    ],
    reactions: [
      "🚛 Industrial processing equipment deployed — capacity scaled",
      "⚠ Capital expenditure heavy — monitor ROI timeline closely",
      "🔧 Equipment maintenance and power infrastructure are now critical",
      "💰 Revenue generation potential from processed materials",
    ],
  },
  {
    id: "env_expand_zones",
    icon: "🗺️",
    label: "Expand to New Zones",
    intent: "Scale operations to neighboring areas",
    hint: "Aggressive growth — stretches team thin, high impact",
    category: "growth",
    tone: "aggressive",
    baseDelta: { impact: 7, finance: -7, risk: 7, trust: 3 },
    consequences: [
      "Expanded to 2 adjacent wards. New areas have lower awareness — adoption is slow.",
      "New zones onboarded. Logistics costs increase by 35%.",
      "Expansion attracts a corporate CSR partner willing to fund specific zones.",
      "Growth is visible but ground team is thin — quality risk in new zones.",
    ],
    reactions: [
      "🗺️ Territorial expansion initiated — coverage area growing",
      "📊 Operational load increasing — team capacity under pressure",
      "⚡ Growth rate exceeds sustainable pace — monitoring needed",
      "💵 Unit economics shifting with expanded coverage",
    ],
  },
];

// ═══════════════════════════════════════════════════════
// LIVELIHOOD ACTIONS
// ═══════════════════════════════════════════════════════
const LIVELIHOOD_ACTIONS: DomainAction[] = [
  {
    id: "live_skill_training",
    icon: "🎯",
    label: "Launch Skill Training",
    intent: "Conduct vocational workshops for job-seekers",
    hint: "Core offering — moderate cost, high trust",
    category: "growth",
    tone: "balanced",
    baseDelta: { impact: 7, finance: -5, risk: -3, trust: 7 },
    consequences: [
      "First batch of 25 trainees enrolled. Stitching and tailoring programs launched.",
      "Training center operational. Employers express interest in certified graduates.",
      "Completion rate at 80%. 5 trainees already placed in local businesses.",
      "Skill program expanded to include digital literacy. Demand rising.",
    ],
    reactions: [
      "🎯 Skill training program launched — enrollment growing",
      "📊 Trainee completion rates look promising",
      "💼 Employer interest signals market validation",
      "📈 Impact-per-rupee ratio improving with scale",
    ],
  },
  {
    id: "live_micro_loans",
    icon: "💳",
    label: "Setup Micro-Lending",
    intent: "Provide small loans for micro-enterprises",
    hint: "High impact but financial risk — default possibility",
    category: "risk",
    tone: "aggressive",
    baseDelta: { impact: 8, finance: -7, risk: 8, trust: 4 },
    consequences: [
      "₹50K disbursed across 10 borrowers. First repayments expected in 30 days.",
      "Micro-loans fueling small shops. One borrower already doubled their income.",
      "Loan default by 2 borrowers. Collection process needs strengthening.",
      "Lending program gains traction. Local SHGs request group lending options.",
    ],
    reactions: [
      "💳 Micro-lending portfolio initiated — financial risk exposure growing",
      "⚠ Default risk monitoring critical — establish collection protocols",
      "📊 Repayment rates will define program sustainability",
      "🏦 Financial inclusion metrics improving in target communities",
    ],
  },
  {
    id: "live_employer_connect",
    icon: "🤝",
    label: "Build Employer Network",
    intent: "Connect trained workers with hiring companies",
    hint: "Creates job pipeline — builds trust, low cost",
    category: "stakeholder",
    tone: "cautious",
    baseDelta: { impact: 5, finance: -2, risk: -4, trust: 9 },
    consequences: [
      "3 local factories sign up for your placement program.",
      "Employer meet organized — 8 companies express hiring interest.",
      "First batch of 12 candidates placed. Employer satisfaction at 4.2/5.",
      "Word-of-mouth referrals from placed candidates bringing new enrollments.",
    ],
    reactions: [
      "🤝 Employer partnerships expanding placement pipeline",
      "💼 Job placement infrastructure strengthening",
      "🔗 Network effects — placed candidates becoming ambassadors",
      "✅ Employer satisfaction metrics favorable",
    ],
  },
  {
    id: "live_market_linkage",
    icon: "🛒",
    label: "Create Market Linkage",
    intent: "Connect artisans and producers to buyers",
    hint: "Revenue potential — logistics complexity increases",
    category: "growth",
    tone: "balanced",
    baseDelta: { impact: 6, finance: -4, risk: 3, trust: 5 },
    consequences: [
      "Online marketplace pilot launched. 15 artisan products listed.",
      "First 20 orders fulfilled. Packaging and delivery need improvement.",
      "Market linkage with urban retailers established — bulk orders possible.",
      "Artisans report 30% income increase. Logistics costs eat into margins.",
    ],
    reactions: [
      "🛒 Market access channels opening for producers",
      "📦 Supply chain and logistics complexity increasing",
      "💰 Revenue streams diversifying through sales commission",
      "📊 Artisan income data showing positive trajectory",
    ],
  },
  {
    id: "live_community_center",
    icon: "🏠",
    label: "Open Community Hub",
    intent: "Establish a physical center for services and networking",
    hint: "Anchor point for trust — high setup cost",
    category: "resource",
    tone: "aggressive",
    baseDelta: { impact: 5, finance: -8, risk: 4, trust: 8 },
    consequences: [
      "Community center inaugurated. 50 residents attended the opening.",
      "Hub operational — hosting daily workshops, placements, and micro-lending.",
      "Center becomes a known landmark. Footfall increasing weekly.",
      "Rent and maintenance costs accumulating — need sustainable revenue model.",
    ],
    reactions: [
      "🏠 Physical hub established — community anchor point created",
      "💵 Recurring infrastructure costs now fixed overhead",
      "🫂 Trust deepening through consistent physical presence",
      "📈 Multi-service delivery from single location improving efficiency",
    ],
  },
];

// ═══════════════════════════════════════════════════════
// DOMAIN REGISTRY
// ═══════════════════════════════════════════════════════
const DOMAIN_ACTIONS: Record<string, DomainAction[]> = {
  education:   EDUCATION_ACTIONS,
  healthcare:  HEALTHCARE_ACTIONS,
  environment: ENVIRONMENT_ACTIONS,
  livelihood:  LIVELIHOOD_ACTIONS,
};

/**
 * Returns the action set for the given domain.
 * Falls back to education if domain is unknown.
 */
export function getActionsForDomain(domain: string): DomainAction[] {
  const key = domain.toLowerCase().trim();
  return DOMAIN_ACTIONS[key] ?? EDUCATION_ACTIONS;
}

// ═══════════════════════════════════════════════════════
// DYNAMIC EFFECT CALCULATOR
// ═══════════════════════════════════════════════════════
/**
 * Applies dynamic modifiers based on current metrics state.
 * - Low finance → higher risk penalty
 * - Low trust → reduced impact gains
 * - High risk → amplified negative effects
 */
export function calculateDynamicDelta(
  baseDelta: DomainAction["baseDelta"],
  currentMetrics: { impact: number; finance: number; risk: number; trust: number }
): { impact: number; finance: number; risk: number; trust: number } {
  let { impact, finance, risk, trust } = { ...baseDelta };

  // Low finance → risky moves cost more
  if (currentMetrics.finance < 30) {
    risk = Math.min(risk + 3, 10);
    finance = Math.max(finance - 2, -10);
  }

  // Low trust → impact gains are weaker
  if (currentMetrics.trust < 30) {
    impact = Math.max(Math.floor(impact * 0.6), -10);
  }

  // High risk → all negative effects amplified
  if (currentMetrics.risk > 70) {
    if (finance < 0) finance = Math.max(finance - 2, -10);
    if (trust < 0) trust = Math.max(trust - 1, -10);
  }

  // Very high impact → diminishing returns
  if (currentMetrics.impact > 80 && impact > 0) {
    impact = Math.max(Math.floor(impact * 0.5), 1);
  }

  // Add slight randomness (±1) for organic feel
  const jitter = () => Math.floor(Math.random() * 3) - 1;
  impact += jitter();
  finance += jitter();
  risk += jitter();
  trust += jitter();

  // Clamp to [-10, 10]
  const clamp = (v: number) => Math.max(-10, Math.min(10, v));
  return {
    impact: clamp(impact),
    finance: clamp(finance),
    risk: clamp(risk),
    trust: clamp(trust),
  };
}

/**
 * Generates a contextual feed message for the given action and its computed delta.
 */
export function generateFeedMessage(action: DomainAction, delta: DomainAction["baseDelta"]): string {
  const positives: string[] = [];
  const negatives: string[] = [];

  if (delta.impact > 0) positives.push("impact grew");
  if (delta.trust > 0) positives.push("trust improved");
  if (delta.finance > 0) positives.push("finances stabilized");
  if (delta.risk < 0) positives.push("risk reduced");

  if (delta.impact < 0) negatives.push("impact took a hit");
  if (delta.trust < 0) negatives.push("trust slipped");
  if (delta.finance < 0) negatives.push("costs increased");
  if (delta.risk > 0) negatives.push("risk exposure grew");

  const posStr = positives.length > 0 ? positives.slice(0, 2).join(" and ") : "";
  const negStr = negatives.length > 0 ? negatives.slice(0, 2).join(" and ") : "";

  if (posStr && negStr) return `You chose to ${action.label.toLowerCase()}. ${posStr.charAt(0).toUpperCase() + posStr.slice(1)}, but ${negStr}.`;
  if (posStr) return `You chose to ${action.label.toLowerCase()}. ${posStr.charAt(0).toUpperCase() + posStr.slice(1)}.`;
  if (negStr) return `You chose to ${action.label.toLowerCase()}. However, ${negStr}.`;
  return `You chose to ${action.label.toLowerCase()}. The situation remains stable.`;
}

// ═══════════════════════════════════════════════════════
// CRISIS EVENTS SYSTEM
// ═══════════════════════════════════════════════════════
export type CrisisSeverity = "minor" | "moderate" | "severe" | "critical";

export interface CrisisEvent {
  id: string;
  icon: string;
  title: string;
  description: string;
  severity: CrisisSeverity;
  delta: { impact: number; finance: number; risk: number; trust: number };
}

export const CRISIS_SEVERITY_STYLES: Record<CrisisSeverity, { color: string; bg: string; border: string; glow: string }> = {
  minor:    { color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30",  glow: "rgba(251,191,36,0.15)" },
  moderate: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", glow: "rgba(251,146,60,0.2)" },
  severe:   { color: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/30",   glow: "rgba(244,63,94,0.25)" },
  critical: { color: "text-red-400",    bg: "bg-red-500/15",    border: "border-red-500/40",    glow: "rgba(239,68,68,0.35)" },
};

const CRISIS_POOL: CrisisEvent[] = [
  // Minor
  { id: "cr_vendor_delay",     icon: "📦", title: "Vendor Delay",             description: "Key supplier delays delivery by 2 weeks. Operations disrupted.", severity: "minor",    delta: { impact: -2, finance: -1, risk: 2, trust: -1 } },
  { id: "cr_staff_sick",       icon: "🤒", title: "Team Health Issue",        description: "Two team members fall ill. Project velocity drops.", severity: "minor",    delta: { impact: -1, finance: 0, risk: 1, trust: -2 } },
  { id: "cr_internet_outage",  icon: "📡", title: "Connectivity Issues",      description: "Internet outage in operations area. Digital services disrupted.", severity: "minor",    delta: { impact: -2, finance: 0, risk: 2, trust: -1 } },
  { id: "cr_bad_weather",      icon: "🌧️", title: "Weather Disruption",       description: "Heavy rains halt field operations for a week.", severity: "minor",    delta: { impact: -2, finance: -1, risk: 1, trust: 0 } },

  // Moderate
  { id: "cr_negative_press",   icon: "📰", title: "Negative Media Coverage",  description: "A local newspaper publishes a critical article about your initiative.", severity: "moderate", delta: { impact: -3, finance: 0, risk: 4, trust: -6 } },
  { id: "cr_cost_spike",       icon: "💸", title: "Cost Overrun",             description: "Unexpected expenses surge. Monthly costs jump 25%.", severity: "moderate", delta: { impact: 0, finance: -6, risk: 3, trust: -2 } },
  { id: "cr_team_conflict",    icon: "⚡", title: "Internal Conflict",        description: "Disagreement between co-founders. Team morale drops.", severity: "moderate", delta: { impact: -2, finance: 0, risk: 3, trust: -5 } },
  { id: "cr_regulatory",       icon: "📋", title: "Regulatory Hurdle",        description: "New compliance requirements demand immediate attention and resources.", severity: "moderate", delta: { impact: -1, finance: -4, risk: 4, trust: -2 } },

  // Severe
  { id: "cr_member_leaves",    icon: "🚪", title: "Key Member Leaves",        description: "Your most experienced team member resigns. Critical knowledge lost.", severity: "severe",   delta: { impact: -5, finance: -2, risk: 6, trust: -4 } },
  { id: "cr_fund_withdrawal",  icon: "🏦", title: "Funder Pulls Out",         description: "Major funder withdraws commitment citing 'shifting priorities'.", severity: "severe",   delta: { impact: -3, finance: -8, risk: 5, trust: -5 } },
  { id: "cr_user_complaint",   icon: "😤", title: "Beneficiary Backlash",     description: "Community members file formal complaints about service quality.", severity: "severe",   delta: { impact: -6, finance: -1, risk: 5, trust: -7 } },
  { id: "cr_data_breach",      icon: "🔓", title: "Data Incident",            description: "Sensitive beneficiary data exposed due to system vulnerability.", severity: "severe",   delta: { impact: -4, finance: -3, risk: 7, trust: -6 } },

  // Critical
  { id: "cr_legal_threat",     icon: "⚖️", title: "Legal Action Filed",       description: "A stakeholder initiates legal proceedings against your operations.", severity: "critical", delta: { impact: -5, finance: -6, risk: 8, trust: -8 } },
  { id: "cr_total_fund_crisis",icon: "🔥", title: "Financial Emergency",      description: "Bank account frozen for audit. All operations halted.", severity: "critical", delta: { impact: -7, finance: -9, risk: 9, trust: -5 } },
  { id: "cr_govt_shutdown",    icon: "🏛️", title: "Government Shutdown Order", description: "Authorities issue temporary shutdown notice pending inspection.", severity: "critical", delta: { impact: -8, finance: -4, risk: 8, trust: -7 } },
  { id: "cr_partner_betrayal", icon: "🗡️", title: "Partner Betrayal",         description: "Trusted partner diverts shared resources. Relationship collapsing.", severity: "critical", delta: { impact: -5, finance: -5, risk: 7, trust: -9 } },
];

/**
 * Returns a random crisis event based on current month (difficulty scaling).
 * Higher months → higher severity probability.
 * Returns null if no crisis triggers this round.
 */
export function rollForCrisis(
  month: number,
  currentMetrics: { impact: number; finance: number; risk: number; trust: number }
): CrisisEvent | null {
  // Base chance: 25% in month 1, scaling up to 65% by month 5
  const baseChance = 0.20 + (month - 1) * 0.10;
  // Increased chance if metrics are poor
  const riskBonus = currentMetrics.risk > 60 ? 0.10 : 0;
  const financeBonus = currentMetrics.finance < 30 ? 0.10 : 0;
  const totalChance = Math.min(baseChance + riskBonus + financeBonus, 0.75);

  if (Math.random() > totalChance) return null;

  // Determine severity tier based on month
  const severityRoll = Math.random();
  let severity: CrisisSeverity;
  if (month <= 2) {
    // Early: mostly minor/moderate
    severity = severityRoll < 0.55 ? "minor" : severityRoll < 0.85 ? "moderate" : "severe";
  } else if (month <= 3) {
    // Mid: balanced
    severity = severityRoll < 0.30 ? "minor" : severityRoll < 0.65 ? "moderate" : severityRoll < 0.90 ? "severe" : "critical";
  } else {
    // Late: severe/critical more likely
    severity = severityRoll < 0.15 ? "minor" : severityRoll < 0.40 ? "moderate" : severityRoll < 0.75 ? "severe" : "critical";
  }

  const pool = CRISIS_POOL.filter((c) => c.severity === severity);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ═══════════════════════════════════════════════════════
// WARNING SYSTEM
// ═══════════════════════════════════════════════════════
export interface MetricWarning {
  id: string;
  icon: string;
  message: string;
  severity: "caution" | "danger";
}

export function checkForWarnings(
  metrics: { impact: number; finance: number; risk: number; trust: number }
): MetricWarning[] {
  const warnings: MetricWarning[] = [];

  if (metrics.risk > 75) {
    warnings.push({ id: "warn_risk_critical", icon: "🔴", message: "CRITICAL: Risk level dangerously high — collapse imminent", severity: "danger" });
  } else if (metrics.risk > 60) {
    warnings.push({ id: "warn_risk_high", icon: "🟠", message: "WARNING: Risk exposure elevated — consider mitigating actions", severity: "caution" });
  }

  if (metrics.finance < 15) {
    warnings.push({ id: "warn_finance_critical", icon: "🔴", message: "CRITICAL: Funds nearly depleted — venture at risk of shutdown", severity: "danger" });
  } else if (metrics.finance < 30) {
    warnings.push({ id: "warn_finance_low", icon: "🟠", message: "WARNING: Budget running low — conserve or seek funding", severity: "caution" });
  }

  if (metrics.trust < 15) {
    warnings.push({ id: "warn_trust_critical", icon: "🔴", message: "CRITICAL: Trust collapsed — stakeholders withdrawing support", severity: "danger" });
  } else if (metrics.trust < 30) {
    warnings.push({ id: "warn_trust_low", icon: "🟠", message: "WARNING: Trust declining — community confidence wavering", severity: "caution" });
  }

  if (metrics.impact < 15) {
    warnings.push({ id: "warn_impact_critical", icon: "🔴", message: "CRITICAL: Impact negligible — mission viability questioned", severity: "danger" });
  } else if (metrics.impact < 25) {
    warnings.push({ id: "warn_impact_low", icon: "🟠", message: "WARNING: Impact below expectations — reassess strategy", severity: "caution" });
  }

  return warnings;
}

// ═══════════════════════════════════════════════════════
// DYNAMIC DIFFICULTY SCALING
// ═══════════════════════════════════════════════════════
/**
 * Applies month-based difficulty scaling to the dynamic delta.
 * Later months → effects amplified, more punishing.
 */
export function applyDifficultyScaling(
  delta: { impact: number; finance: number; risk: number; trust: number },
  month: number,
): { impact: number; finance: number; risk: number; trust: number } {
  // Scaling factor: 1.0 at month 1, up to 1.3 at month 5
  const scale = 1.0 + (month - 1) * 0.075;

  // Negative effects scale up more aggressively
  const scaleValue = (v: number) => {
    if (v < 0) return Math.round(v * (scale + 0.05));
    return Math.round(v * scale);
  };

  const clamp = (v: number) => Math.max(-10, Math.min(10, v));

  return {
    impact: clamp(scaleValue(delta.impact)),
    finance: clamp(scaleValue(delta.finance)),
    risk: clamp(scaleValue(delta.risk)),
    trust: clamp(scaleValue(delta.trust)),
  };
}

// ── Month Labels ───────────────────────────────────────
export const MONTH_LABELS = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5"];
export const MAX_MONTHS = 5;
