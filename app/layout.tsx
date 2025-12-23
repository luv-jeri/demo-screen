import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const hafferXH = localFont({
  src: [
    {
      path: "../Haffer-Font/HafferXH-TRIAL-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../Haffer-Font/HafferXH-TRIAL-Heavy.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-heading",
});

const hafferSans = localFont({
  src: [
    {
      path: "../Haffer-Font/Haffer-TRIAL-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../Haffer-Font/Haffer-TRIAL-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../Haffer-Font/Haffer-TRIAL-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "V2 / OSMO INSPIRED",
  description: "A premium visual overhaul.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts for extended typography options */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        suppressHydrationWarning
        className={`${hafferXH.variable} ${hafferSans.variable} antialiased bg-background text-foreground selection:bg-accent selection:text-accent-foreground`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
