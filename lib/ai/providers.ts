import type { Provider } from "./byok";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatRequest = {
  provider: Provider;
  apiKey: string;
  model?: string;
  messages: ChatMessage[];
  maxTokens?: number;
};

export type ChatResponse = {
  text: string;
};

const DEFAULTS: Record<Provider, string> = {
  anthropic: "claude-haiku-4-5-20251001",
  openai: "gpt-4o-mini",
};

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  const model = req.model ?? DEFAULTS[req.provider];
  if (req.provider === "anthropic") return chatAnthropic({ ...req, model });
  return chatOpenAI({ ...req, model });
}

async function chatAnthropic(req: ChatRequest & { model: string }): Promise<ChatResponse> {
  const system = req.messages.find((m) => m.role === "system")?.content;
  const rest = req.messages.filter((m) => m.role !== "system");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": req.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: req.model,
      max_tokens: req.maxTokens ?? 1024,
      system,
      messages: rest.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic error ${res.status}: ${body}`);
  }
  const data = await res.json();
  const text = (data.content ?? [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("");
  return { text };
}

async function chatOpenAI(req: ChatRequest & { model: string }): Promise<ChatResponse> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${req.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: req.model,
      max_tokens: req.maxTokens ?? 1024,
      messages: req.messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${body}`);
  }
  const data = await res.json();
  return { text: data.choices?.[0]?.message?.content ?? "" };
}
