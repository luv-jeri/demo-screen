import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { SidebarLayout } from "@/components/sidebar-layout";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Osmo Dashboard Replica",
  description: "A pixel-perfect replication of the Osmo Dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}>
        <SidebarLayout>
            {children}
        </SidebarLayout>
      </body>
    </html>
  );
}
