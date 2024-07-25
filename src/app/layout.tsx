import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import { SessionProvider } from 'next-auth/react';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TodoWay",
  description: "TodoWay is your ultimate guide to exploring and understanding all aspects of groups everywhere. From specific interest groups to global communities, TodoWay offers detailed insights, practical resources, and inspiring stories to connect people and share knowledge on a variety of topics. Discover new communities, learn about different cultures, and find your place in the groups that shape our world, all in one place: TodoWay.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <SessionProvider session={session}>
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
