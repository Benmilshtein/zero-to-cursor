import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zero to Cursor — Learn the AI-First IDE from Scratch",
  description:
    "An open, interactive course that takes anyone from absolute zero to shipping with Cursor — the AI-first code editor.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
