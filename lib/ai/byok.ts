"use client";

const STORAGE_KEY = "z2c.byok";

export type Provider = "anthropic" | "openai";

export type ByokConfig = {
  provider: Provider;
  apiKey: string;
};

export function loadByok(): ByokConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ByokConfig;
  } catch {
    return null;
  }
}

export function saveByok(config: ByokConfig) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearByok() {
  window.localStorage.removeItem(STORAGE_KEY);
}
