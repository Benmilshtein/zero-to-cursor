"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { loadByok, saveByok, type Provider } from "@/lib/ai/byok";
import { COACH_SYSTEM_PROMPT } from "@/lib/ai/coach-prompts";
import { chat, type ChatMessage } from "@/lib/ai/providers";

type Props = { lessonTitle: string };

export function AICoachPanel({ lessonTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const [provider, setProvider] = useState<Provider>("anthropic");
  const [keyInput, setKeyInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = loadByok();
    if (existing) setProvider(existing.provider);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function send() {
    if (!input.trim() || busy) return;

    const byok = loadByok();
    const hostedEnabled = process.env.NEXT_PUBLIC_HOSTED_AI_ENABLED === "true";

    if (!byok && !hostedEnabled) {
      setNeedsKey(true);
      return;
    }

    const userMsg: ChatMessage = { role: "user", content: input };
    const next: ChatMessage[] = [
      { role: "system", content: `${COACH_SYSTEM_PROMPT}\n\nCurrent lesson: "${lessonTitle}"` },
      ...messages,
      userMsg,
    ];
    setMessages([...messages, userMsg]);
    setInput("");
    setBusy(true);

    try {
      let text: string;
      if (byok) {
        const res = await chat({
          provider: byok.provider,
          apiKey: byok.apiKey,
          messages: next,
        });
        text = res.text;
      } else {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        text = data.text;
      }
      setMessages((m) => [...m, { role: "assistant", content: text }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `⚠️ ${(err as Error).message}` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function saveKey() {
    if (!keyInput.trim()) return;
    saveByok({ provider, apiKey: keyInput.trim() });
    setKeyInput("");
    setNeedsKey(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full shadow-lg transition",
          open ? "bg-ink-700 text-zinc-300" : "bg-brand-500 text-ink hover:bg-brand-600",
        )}
        aria-label="AI Coach"
      >
        {open ? "×" : "🤖"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-[28rem] w-[22rem] flex-col rounded-2xl border border-ink-600 bg-ink-800 shadow-2xl">
          <div className="flex items-center justify-between border-b border-ink-700 p-3">
            <p className="text-sm font-medium text-white">AI Coach</p>
            <span className="text-xs text-zinc-500">on this lesson</span>
          </div>

          {needsKey ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-sm text-zinc-300">
                The AI Coach needs an API key. Paste your own — it stays in this browser and is sent
                directly to the provider, never to us.
              </p>
              <div className="flex gap-2">
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as Provider)}
                  className="rounded-md border border-ink-500 bg-ink-700 px-2 py-1 text-sm text-white"
                >
                  <option value="anthropic">Anthropic</option>
                  <option value="openai">OpenAI</option>
                </select>
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder={provider === "anthropic" ? "sk-ant-…" : "sk-…"}
                  className="flex-1 rounded-md border border-ink-500 bg-ink-700 px-2 py-1 text-sm text-white outline-none focus:border-brand-500"
                />
              </div>
              <button
                type="button"
                onClick={saveKey}
                className="w-full rounded-xl bg-brand-500 px-3 py-2 text-sm font-medium text-ink hover:bg-brand-600"
              >
                Save key
              </button>
              <p className="text-xs text-zinc-500">
                Don&apos;t have one? Get an Anthropic key at console.anthropic.com or an OpenAI key
                at platform.openai.com.
              </p>
            </div>
          ) : (
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-zinc-500">
                  Ask anything about this lesson — concepts, exercises, your code.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm",
                    m.role === "user"
                      ? "ml-6 bg-brand-500/10 text-brand-100"
                      : "mr-6 bg-ink-700 text-zinc-200",
                  )}
                >
                  {m.content}
                </div>
              ))}
              {busy && <p className="text-xs text-zinc-500">Thinking…</p>}
            </div>
          )}

          {!needsKey && (
            <div className="border-t border-ink-700 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask the coach…"
                  className="flex-1 rounded-md border border-ink-500 bg-ink-700 px-3 py-2 text-sm text-white outline-none focus:border-brand-500"
                  disabled={busy}
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={busy || !input.trim()}
                  className="rounded-xl bg-brand-500 px-3 py-2 text-sm font-medium text-ink disabled:opacity-40"
                >
                  Ask
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
