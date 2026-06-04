import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllLevels, getLesson, getLessonNeighbors } from "@/lib/mdx/loader";
import { mdxComponents } from "@/lib/mdx/components";
import { LessonShell } from "@/components/lesson/LessonShell";
import { createClient } from "@/lib/supabase/server";

type Params = { level: string; lesson: string };

export async function generateStaticParams() {
  const levels = await getAllLevels();
  return levels.flatMap((lvl) =>
    lvl.lessons.map((l) => ({
      level: lvl.slug,
      lesson: l.slug.split("/").pop()!,
    })),
  );
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { level, lesson } = await params;
  const data = await getLesson(level, lesson);
  if (!data) notFound();

  const levels = await getAllLevels();
  const levelData = levels.find((l) => l.slug === level);
  if (!levelData) notFound();

  const neighbors = await getLessonNeighbors(level, lesson);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <LessonShell
      lesson={{
        slug: data.slug,
        title: data.frontmatter.title,
        estMinutes: data.frontmatter.estMinutes ?? 3,
        levelSlug: levelData.slug,
        levelTitle: levelData.title,
        ordinalInLevel: data.ordinal,
        totalInLevel: levelData.lessons.length,
      }}
      prev={
        neighbors.prev
          ? { slug: neighbors.prev.slug, title: neighbors.prev.frontmatter.title }
          : null
      }
      next={
        neighbors.next
          ? { slug: neighbors.next.slug, title: neighbors.next.frontmatter.title }
          : null
      }
      isAuthenticated={!!user}
    >
      <MDXRemote source={data.source} components={mdxComponents} />
    </LessonShell>
  );
}
