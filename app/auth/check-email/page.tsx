import { SiteHeader } from "@/components/nav/SiteHeader";

export default function CheckEmailPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold text-white">Check your email</h1>
        <p className="mt-3 text-zinc-400">
          We sent you a confirmation link. Click it to finish creating your account, then come
          back here.
        </p>
      </main>
    </>
  );
}
