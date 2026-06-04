import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { chat } from "@/lib/ai/providers";

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["system", "user", "assistant"]), content: z.string() }))
    .min(1),
});

// In-memory per-IP daily counter. For real deployments, swap for Redis/Upstash.
const COUNTERS = new Map<string, { day: string; n: number }>();

function bump(ip: string, limit: number): boolean {
  const day = new Date().toISOString().slice(0, 10);
  const cur = COUNTERS.get(ip);
  if (!cur || cur.day !== day) {
    COUNTERS.set(ip, { day, n: 1 });
    return true;
  }
  if (cur.n >= limit) return false;
  cur.n += 1;
  return true;
}

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_HOSTED_AI_ENABLED !== "true") {
    return NextResponse.json(
      { error: "hosted ai disabled — bring your own key" },
      { status: 503 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "no provider key configured" }, { status: 503 });
  }
  const provider = process.env.ANTHROPIC_API_KEY ? "anthropic" : "openai";

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = parseInt(process.env.HOSTED_AI_DAILY_LIMIT ?? "50", 10);
  if (!bump(ip, limit)) {
    return NextResponse.json({ error: "daily limit reached" }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  try {
    const res = await chat({
      provider,
      apiKey,
      messages: parsed.data.messages,
    });
    return NextResponse.json({ text: res.text });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
