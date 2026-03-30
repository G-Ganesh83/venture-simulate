import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Missing API Key" },
        { status: 500 }
      );
    }

    // Using the exact flash alias discovered from your API key's model list
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await axios.post(
      endpoint,
      {
        contents: [
          {
            parts: [{ text: "Say hello in one short sentence." }],
          },
        ],
      },
      {
        httpsAgent,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Invalid response format" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      text,
    });
  } catch (error: any) {
    console.error("Gemini Error:", error?.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        error: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
