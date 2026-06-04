import Link from "next/link";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { WelcomeCards } from "@/components/onboarding/WelcomeCards";
import { getAllLevels } from "@/lib/mdx/loader";

export default async function HomePage() {
  const levels = await getAllLevels();
  const totalLessons = levels.reduce((sum, l) => sum + l.lessons.length, 0);
  const publishedLessons = levels
    .filter((l) => l.status === "published")
    .reduce((sum, l) => sum + l.lessons.length, 0);

  return (
    <>
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-ink-700">
        <div className="starfield absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800/70 px-3 py-1 text-xs text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Open source · MIT
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Start learning Cursor
              <br />
              for free. Today.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-zinc-300">
              Tab, Cmd+K, Composer, Agent, rules, MCP — the AI-first IDE has a lot of surface
              area. This is the missing onramp: interactive lessons that teach you by doing,
              right in your browser.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              <li className="flex gap-3">
                <span className="text-brand-500">💯</span>
                <span>
                  <span className="font-semibold text-white">100% free — no catch.</span>{" "}
                  All {totalLessons} lessons across {levels.length} levels. No paywall.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-500">🚀</span>
                <span>
                  <span className="font-semibold text-white">Start in 30 seconds —</span>{" "}
                  no setup, learn in your browser.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-500">🧠</span>
                <span>
                  <span className="font-semibold text-white">AI Coach included —</span>{" "}
                  bring your own API key, get help in every lesson.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-500">🌱</span>
                <span>
                  <span className="font-semibold text-white">Open source —</span>{" "}
                  contribute lessons, fork the platform, self-host.
                </span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/lessons/level-01-cursor-is-not-magic/01-what-is-an-editor"
                className="rounded-xl bg-brand-500 px-5 py-3 font-medium text-ink hover:bg-brand-600"
              >
                Start Lesson 1 →
              </Link>
              <Link
                href="/curriculum"
                className="rounded-xl border border-ink-500 px-5 py-3 font-medium text-zinc-200 hover:bg-ink-700"
              >
                See the curriculum
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              {publishedLessons} lessons published · {totalLessons - publishedLessons} in progress · contributions welcome
            </p>
          </div>
          <div className="flex items-start justify-center lg:justify-end">
            <WelcomeCards />
          </div>
        </div>
      </section>

      <section className="border-b border-ink-700 bg-ink-800/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-white">The 14 levels</h2>
          <p className="mt-2 text-zinc-400">
            From &quot;what is a code editor&quot; to shipping a real app with the Agent.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
            {levels.map((lvl) => (
              <Link
                key={lvl.slug}
                href={`/levels/${lvl.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-ink-600 bg-ink-800 p-4 hover:border-brand-500"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-700 font-mono text-sm text-brand-500">
                  {String(lvl.ordinal).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white group-hover:text-brand-500">{lvl.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {lvl.lessons.length > 0
                      ? `${lvl.lessons.length} lessons`
                      : "Coming soon — help us write it"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                    lvl.status === "published"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-ink-700 text-zinc-500"
                  }`}
                >
                  {lvl.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-700">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-zinc-500">
          <p>
            Zero to Cursor — open source, MIT-licensed. Inspired by{" "}
            <a
              href="https://zero2claude.dev"
              target="_blank"
              rel="noreferrer"
              className="text-brand-500 hover:underline"
            >
              zero2claude.dev
            </a>
            .
          </p>
          <p>
            <Link href="/about" className="hover:text-zinc-300">
              About
            </Link>
            {" · "}
            <a
              href="https://github.com"
              className="hover:text-zinc-300"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
