import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@probable/ui";
import { ThemeProvider, ThemeToggle } from "@probable/ui/theme";
import { Toaster } from "@probable/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.NODE_ENV === "production"
      ? "https://probablepitcher.com"
      : "http://localhost:3000",
  ),
  title: "Probable Pitcher",
  description: "The best way to keep up with MLB pitching updates",
  openGraph: {
    title: "Probable Pitcher",
    description: "The best way to keep up with MLB pitching updates",
    url: "https://probablepitcher.com",
    siteName: "Probable Pitcher",
  },
  //twitter: {
  //  card: "summary_large_image",
  //  site: "",
  //  creator: "",
  //},
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
