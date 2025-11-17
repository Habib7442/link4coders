import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link4Coders - One Link for Everything You Build",
  description: "Create your developer portfolio in minutes. Showcase your projects, skills, and connect with recruiters using AI-powered voice assistant.",
  keywords: ["developer portfolio", "link in bio", "dev portfolio", "github portfolio", "ai voice assistant"],
  authors: [{ name: "Link4Coders" }],
  openGraph: {
    title: "Link4Coders - Developer Portfolio Builder",
    description: "One link for everything you build. Create stunning developer portfolios with AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Link4Coders - Developer Portfolio Builder",
    description: "One link for everything you build. Create stunning developer portfolios with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
