import Link from "next/link";
import { SiteHeader } from "@/components/nav/SiteHeader";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-semibold text-white">About Zero to Cursor</h1>

        <h2 className="mt-8 text-xl font-semibold text-white">Why</h2>
        <p className="mt-2 text-zinc-300 leading-7">
          Cursor is the AI-first IDE, but its real power lives in primitives most people never
          discover: Tab, Cmd+K, Composer, Agent mode, project rules, MCP servers. Most tutorials
          are 5-minute YouTube videos. There&apos;s no structured, interactive onramp.
        </p>
        <p className="mt-3 text-zinc-300 leading-7">
          Zero to Cursor is that onramp. It takes you from &quot;what is a code editor&quot; to
          shipping a real app with the Agent — for free, in your browser, with no setup.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-white">How it&apos;s built</h2>
        <ul className="mt-2 list-disc pl-5 space-y-2 text-zinc-300">
          <li>
            <strong>Open source.</strong> MIT license. Run it locally, fork it, self-host it.
          </li>
          <li>
            <strong>Content lives in the repo.</strong> Every lesson is an MDX file under{" "}
            <code>content/lessons/</code>. Contributors PR new lessons like they&apos;d PR code.
          </li>
          <li>
            <strong>BYO API key.</strong> The AI Coach uses your own Anthropic or OpenAI key,
            stored in your browser. Nothing routes through our servers unless you&apos;re on the
            hosted version with a sponsor-funded key.
          </li>
          <li>
            <strong>Inspired by zero2claude.dev.</strong> Same shape, different IDE.
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-white">Contribute</h2>
        <p className="mt-2 text-zinc-300 leading-7">
          See <code>CONTRIBUTING.md</code> in the repo. The fastest paths in:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-2 text-zinc-300">
          <li>Author a lesson in any planned level. Run <code>pnpm new-lesson</code>.</li>
          <li>Add a new activity type to <code>components/activities/</code>.</li>
          <li>Translate the first level into another language.</li>
          <li>File issues for typos, broken activities, or factual errors.</li>
        </ul>

        <p className="mt-10 text-sm text-zinc-500">
          <Link href="/" className="text-brand-500 hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
    </>
  );
}
