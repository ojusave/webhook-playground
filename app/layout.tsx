import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Roboto } from "next/font/google";
import { THEME_STORAGE_KEY } from "@/lib/theme-storage";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  weight: "300",
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/** Inline FOUC script — same logic as `ThemeScript` from render-dds (package is client-only). */
function themeBootstrapScript(storageKey: string): string {
  return `!function(){try{var e=localStorage.getItem(${JSON.stringify(storageKey)}),t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",a=e||t;"dark"===a?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}catch(e){}}();`;
}

export const metadata: Metadata = {
  title: "Webhook Playground",
  description:
    "Capture, inspect, and debug HTTP requests in real time — temporary endpoints, no accounts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${roboto.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript(THEME_STORAGE_KEY) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
