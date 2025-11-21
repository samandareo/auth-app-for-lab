import "./globals.css";
import "./animations.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cyber Auth App",
  description: "samandareo x zynx",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <footer style={{
          position: "fixed",
          bottom: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.75rem",
          color: "white",
          fontFamily: "var(--font-mono)",
          opacity: "0.4",
          zIndex: "1000",
          transition: "opacity 0.3s ease"
        }}>
          samandareo x zynx
        </footer>
      </body>
    </html>
  );
}