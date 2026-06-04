import Link from "next/link";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { getAllLevels } from "@/lib/mdx/loader";

export default async function CurriculumPage() {
  const levels = await getAllLevels();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-semibold text-white">The full curriculum</h1>
        <p className="mt-2 text-zinc-400">
          14 levels, growing toward ~144 lessons. Each level is a coherent block; you can skip
          levels you already know.
        </p>

        <div className="mt-10 space-y-8">
          {levels.map((lvl) => (
            <section key={lvl.slug}>
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-semibold text-white">
                  <span className="font-mono text-brand-500 mr-2">
                    {String(lvl.ordinal).padStart(2, "0")}
                  </span>
                  {lvl.title}
                </h2>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                    lvl.status === "published"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-ink-700 text-zinc-500"
                  }`}
                >
                  {lvl.status}
                </span>
              </div>
              {lvl.description && (
                <p className="mt-1 text-sm text-zinc-400">{lvl.description}</p>
              )}
              {lvl.lessons.length > 0 ? (
                <ul className="mt-3 space-y-1">
                  {lvl.lessons.map((l) => (
                    <li key={l.slug} className="text-sm">
                      <Link
                        href={`/lessons/${l.slug}`}
                        className="text-zinc-300 hover:text-brand-500"
                      >
                        {String(l.ordinal).padStart(2, "0")} · {l.frontmatter.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm italic text-zinc-500">
                  Lessons not yet written. PRs welcome.
                </p>
              )}
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
