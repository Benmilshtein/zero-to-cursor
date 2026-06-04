import Link from "next/link";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-6 py-12">
        <p className="text-sm">
          <Link href="/" className="text-zinc-400 hover:text-white">
            ← Back to home
          </Link>
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Create your free account</h1>
        <p className="mt-2 text-sm text-zinc-400">Start your first lesson in minutes.</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          <span className="rounded-md bg-emerald-500/30 px-1.5 font-mono">FREE</span>
          All lessons — no credit card, no trial
        </div>

        <div className="mt-6">
          <SignupForm />
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-500 hover:underline">
            Log in
          </Link>
        </p>
      </main>
    </>
  );
}
