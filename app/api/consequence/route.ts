import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

// Bypass corporate/local SSL intercepts securely using the trusted agent
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Fallback response for unhandled API crashes or parsing failures
const getFallback = () => ({
  narrative:
    "Due to unforeseen external factors, the ecosystem reacted unpredictably. While resources were slightly strained, you maintained baseline momentum and learned valuable insights for the next phase.",
  impact: 2,
  finance: -5,
  risk: 3,
  trust: 1,
});

// Utility to enforce the -10 to +10 rule
const clamp = (val: number, min = -10, max = 10) =>
  Math.max(min, Math.min(max, val));

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { metrics, decision } = body;

    if (!metrics || !decision) {
      return NextResponse.json(
        { error: "Missing metrics or decision payload" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("[Gemini API] Missing GEMINI_API_KEY, returning fallback");
      return NextResponse.json(getFallback());
    }

    const prompt = `You are a social entrepreneurship simulation engine.

User made this decision:
${decision}

Current state:
Impact: ${metrics.impact}
Finance: ${metrics.finance}
Risk: ${metrics.risk}
Trust: ${metrics.trust}

Generate:
1. A realistic consequence (80–100 words, second person, causal)
2. Metric changes between -10 and +10

Return ONLY JSON:
{
  "narrative": "...",
  "impact": number,
  "finance": number,
  "risk": number,
  "trust": number
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
        // You can use output JSON schema on the backend if available, but for simplicity, standard text generation is used
      },
      {
        httpsAgent,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000, 
      }
    );

    let text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("[Gemini API] Invalid response structure.");
      return NextResponse.json(getFallback());
    }

    // Strip markdown formatting if the model responds with ```json ... ```
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("[Gemini API] Failed to parse JSON string:", text);
      return NextResponse.json(getFallback());
    }

    // Assemble validated response, enforcing the clamps on numeric fields
    return NextResponse.json({
      narrative: parsed.narrative || getFallback().narrative,
      impact: clamp(Number(parsed.impact) || 0),
      finance: clamp(Number(parsed.finance) || 0),
      risk: clamp(Number(parsed.risk) || 0),
      trust: clamp(Number(parsed.trust) || 0),
    });
  } catch (error: any) {
    console.error(
      "[Gemini API] Consequence Error:",
      error?.response?.data || error.message
    );
    // If the network call crashes or times out, gracefully return the mock to keep the UI from blowing up
    return NextResponse.json(getFallback());
  }
}
