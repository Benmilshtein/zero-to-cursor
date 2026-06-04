import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-500 text-ink font-mono">
            Z
          </span>
          <span>Zero to Cursor</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-zinc-300">
          <Link href="/curriculum" className="hover:text-white">
            Curriculum
          </Link>
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <Link
                href="/settings"
                className="hover:text-white"
              >
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-white">
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-brand-500 px-3 py-1.5 font-medium text-ink hover:bg-brand-600"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
