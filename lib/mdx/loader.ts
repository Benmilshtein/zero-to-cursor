import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type LessonFrontmatter = {
  title: string;
  estMinutes?: number;
  activityTypes?: string[];
  status?: "published" | "planned" | "draft";
  description?: string;
};

export type Lesson = {
  slug: string; // "level-01-cursor-is-not-magic/01-what-is-an-editor"
  levelSlug: string;
  ordinal: number;
  filePath: string;
  source: string;
  frontmatter: LessonFrontmatter;
};

export type LevelMeta = {
  slug: string;
  ordinal: number;
  title: string;
  description?: string;
  status: "published" | "planned" | "draft";
  lessons: Lesson[];
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "lessons");

async function safeReadDir(dir: string) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

export async function getAllLevels(): Promise<LevelMeta[]> {
  const entries = await safeReadDir(CONTENT_ROOT);
  const levelDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  const levels: LevelMeta[] = [];
  for (const slug of levelDirs) {
    const dir = path.join(CONTENT_ROOT, slug);
    const metaPath = path.join(dir, "_meta.json");
    let meta: Omit<LevelMeta, "lessons">;
    try {
      meta = JSON.parse(await fs.readFile(metaPath, "utf8"));
    } catch {
      continue; // missing _meta.json → skip
    }
    const lessons = await loadLessonsInLevel(slug);
    levels.push({ ...meta, slug, lessons });
  }
  levels.sort((a, b) => a.ordinal - b.ordinal);
  return levels;
}

async function loadLessonsInLevel(levelSlug: string): Promise<Lesson[]> {
  const dir = path.join(CONTENT_ROOT, levelSlug);
  const files = await safeReadDir(dir);
  const mdxFiles = files
    .filter((f) => f.isFile() && f.name.endsWith(".mdx") && !f.name.startsWith("_") && f.name !== "TODO.mdx")
    .map((f) => f.name)
    .sort();

  const lessons: Lesson[] = [];
  for (const fileName of mdxFiles) {
    const filePath = path.join(dir, fileName);
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const ordinal = parseInt(fileName.split("-")[0]!, 10);
    const lessonSlug = fileName.replace(/\.mdx$/, "");
    lessons.push({
      slug: `${levelSlug}/${lessonSlug}`,
      levelSlug,
      ordinal,
      filePath,
      source: content,
      frontmatter: data as LessonFrontmatter,
    });
  }
  lessons.sort((a, b) => a.ordinal - b.ordinal);
  return lessons;
}

export async function getLesson(levelSlug: string, lessonSlug: string): Promise<Lesson | null> {
  const filePath = path.join(CONTENT_ROOT, levelSlug, `${lessonSlug}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const ordinal = parseInt(lessonSlug.split("-")[0]!, 10);
    return {
      slug: `${levelSlug}/${lessonSlug}`,
      levelSlug,
      ordinal,
      filePath,
      source: content,
      frontmatter: data as LessonFrontmatter,
    };
  } catch {
    return null;
  }
}

export async function getLessonNeighbors(levelSlug: string, lessonSlug: string) {
  const levels = await getAllLevels();
  const flat = levels.flatMap((lvl) => lvl.lessons);
  const idx = flat.findIndex((l) => l.slug === `${levelSlug}/${lessonSlug}`);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}
