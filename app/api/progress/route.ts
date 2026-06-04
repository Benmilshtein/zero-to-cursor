import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { markLessonComplete } from "@/lib/progress/tracker";

const Body = z.object({
  lessonSlug: z.string().min(3),
  score: z.number().int().min(0).max(100),
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const result = await markLessonComplete(parsed.data.lessonSlug, parsed.data.score);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
