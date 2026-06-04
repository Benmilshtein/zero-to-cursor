"use client";

import { useEffect, useState } from "react";
import { clearByok, loadByok, saveByok, type Provider } from "@/lib/ai/byok";

export function ByokSettings() {
  const [provider, setProvider] = useState<Provider>("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const existing = loadByok();
    if (existing) {
      setProvider(existing.provider);
      setHasKey(true);
    }
  }, []);

  function save() {
    if (!apiKey.trim()) return;
    saveByok({ provider, apiKey: apiKey.trim() });
    setApiKey("");
    setSaved(true);
    setHasKey(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function remove() {
    clearByok();
    setHasKey(false);
    setApiKey("");
  }

  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-800 p-5">
      {hasKey && (
        <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">
          A {provider === "anthropic" ? "Anthropic" : "OpenAI"} key is saved in this browser.{" "}
          <button onClick={remove} className="underline underline-offset-2 hover:text-emerald-200">
            Remove
          </button>
        </div>
      )}
      <label className="block text-sm text-zinc-400">Provider</label>
      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value as Provider)}
        className="mt-1 w-full rounded-md border border-ink-500 bg-ink-700 px-3 py-2 text-white"
      >
        <option value="anthropic">Anthropic (Claude)</option>
        <option value="openai">OpenAI (GPT)</option>
      </select>

      <label className="mt-4 block text-sm text-zinc-400">
        {hasKey ? "Replace key" : "API key"}
      </label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder={provider === "anthropic" ? "sk-ant-…" : "sk-…"}
        className="mt-1 w-full rounded-md border border-ink-500 bg-ink-700 px-3 py-2 text-white outline-none focus:border-brand-500"
      />

      <button
        type="button"
        onClick={save}
        disabled={!apiKey.trim()}
        className="mt-4 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-ink hover:bg-brand-600 disabled:opacity-40"
      >
        {hasKey ? "Replace key" : "Save key"}
      </button>
      {saved && <span className="ml-3 text-sm text-emerald-400">Saved.</span>}
    </div>
  );
}
