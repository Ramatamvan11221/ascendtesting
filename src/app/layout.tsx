import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ASCEND - Find Your People. Build Your Future.",
    template: "%s | ASCEND",
  },
  description:
    "The Operating System for Ambitious People. Temukan teman seperjuangan, dapatkan AI roadmap, dan bangun masa depanmu bersama komunitas.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="dark">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="animated-bg" />
          {children}
          <Toaster position="top-right" theme="dark" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}