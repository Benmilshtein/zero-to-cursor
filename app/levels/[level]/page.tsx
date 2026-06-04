import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { getAllLevels } from "@/lib/mdx/loader";

type Params = { level: string };

export async function generateStaticParams() {
  const levels = await getAllLevels();
  return levels.map((l) => ({ level: l.slug }));
}

export default async function LevelPage({ params }: { params: Promise<Params> }) {
  const { level } = await params;
  const levels = await getAllLevels();
  const lvl = levels.find((l) => l.slug === level);
  if (!lvl) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm text-zinc-500">
          Level {String(lvl.ordinal).padStart(2, "0")}
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-white">{lvl.title}</h1>
        {lvl.description && <p className="mt-2 text-zinc-400">{lvl.description}</p>}

        {lvl.lessons.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-ink-500 bg-ink-800 p-8 text-center">
            <p className="text-zinc-300">This level is being written.</p>
            <p className="mt-2 text-sm text-zinc-500">
              Want to help author it?{" "}
              <Link href="/about" className="text-brand-500 hover:underline">
                See the contributor guide
              </Link>
              .
            </p>
          </div>
        ) : (
          <ol className="mt-8 space-y-2">
            {lvl.lessons.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/lessons/${l.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-ink-600 bg-ink-800 p-4 hover:border-brand-500"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-700 font-mono text-sm text-brand-500">
                    {String(l.ordinal).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white group-hover:text-brand-500">
                      {l.frontmatter.title}
                    </p>
                    {l.frontmatter.description && (
                      <p className="mt-0.5 text-xs text-zinc-500">{l.frontmatter.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500">
                    ~{l.frontmatter.estMinutes ?? 3} min
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </main>
    </>
  );
}
