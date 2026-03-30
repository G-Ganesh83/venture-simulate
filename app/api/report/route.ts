import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

// Local network SSL bypass
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Fallback in case of API failure or JSON parse error
const getFallback = () => ({
  summary:
    "Your decisions prioritized rapid expansion over financial stability, leading to a high-risk ecosystem. While impact was notably generated, structural foundations were compromised.",
  patterns:
    "Your choices demonstrate an aggressive growth mindset, leaning towards immediate deployment rather than calculated piloting.",
  strengths: [
    "Willingness to act decisively and take calculated risks.",
    "Strong focus on maximizing reach and impact variables.",
  ],
  weaknesses: [
    "Under-prioritization of sustainable runway and financial health.",
    "A tendency to bypass iterative testing, inviting operational friction.",
  ],
  recommendation:
    "Adopt a more balanced cadence: pilot smaller groups before committing full capital to unproven operational strategies.",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { decisions, metrics } = body;

    if (!decisions || !Array.isArray(decisions) || !metrics) {
      return NextResponse.json(
        { error: "Missing or invalid payload (decisions array and metrics required)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("[Gemini Report API] Missing API Key. Using fallback.");
      return NextResponse.json(getFallback());
    }

    const prompt = `You are a decision analyst evaluating a social entrepreneur.

User decisions:
${decisions.map((d: string, i: number) => `${i + 1}. ${d}`).join("\n")}

Final metrics:
Impact: ${metrics.impact}
Finance: ${metrics.finance}
Risk: ${metrics.risk}
Trust: ${metrics.trust}

Generate a structured report with:
1. Summary (3–4 lines)
2. Decision Pattern (what type of choices they made)
3. Strengths (2 points)
4. Weaknesses (2 points)
5. Recommendation (1 clear advice)

IMPORTANT:
- Be specific
- No generic praise
- No fluff
- Sound like real analysis

Return ONLY JSON exactly matching this format, with no markdown code blocks:
{
  "summary": "...",
  "patterns": "...",
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "recommendation": "..."
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await axios.post(
      endpoint,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        httpsAgent,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 20000, // Generous timeout for heavier report generation
      }
    );

    let text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("[Gemini Report API] Invalid response structure.");
      return NextResponse.json(getFallback());
    }

    // Strip markdown formatting if the model responds with ```json ... ```
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("[Gemini Report API] Failed to parse JSON string:", text);
      return NextResponse.json(getFallback());
    }

    // Validate the parsed structure against expected keys, filling with fallback if deeply broken
    return NextResponse.json({
      summary: parsed.summary || getFallback().summary,
      patterns: parsed.patterns || getFallback().patterns,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : getFallback().strengths,
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : getFallback().weaknesses,
      recommendation: parsed.recommendation || getFallback().recommendation,
    });
  } catch (error: any) {
    console.error(
      "[Gemini Report API] Generator Error:",
      error?.response?.data || error.message
    );
    // Graceful silent fallback on network failure
    return NextResponse.json(getFallback());
  }
}
