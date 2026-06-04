import Link from "next/link";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-3xl font-semibold text-white">Log in</h1>
        <p className="mt-2 text-sm text-zinc-400">Welcome back.</p>
        <div className="mt-6">
          <LoginForm next={sp.next} error={sp.error} />
        </div>
        <p className="mt-6 text-sm text-zinc-400">
          New here?{" "}
          <Link href="/auth/signup" className="text-brand-500 hover:underline">
            Create a free account
          </Link>
        </p>
      </main>
    </>
  );
}
