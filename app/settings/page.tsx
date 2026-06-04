import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { ByokSettings } from "@/components/settings/ByokSettings";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/settings");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-semibold text-white">Settings</h1>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-white">Account</h2>
          <p className="mt-2 text-sm text-zinc-400">Signed in as {user.email}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">AI Coach</h2>
          <p className="mt-2 text-sm text-zinc-400">
            The AI Coach uses your own API key by default. The key is stored in your browser
            (localStorage) and sent directly to the provider — never to our servers.
          </p>
          <div className="mt-4">
            <ByokSettings />
          </div>
        </section>
      </main>
    </>
  );
}
