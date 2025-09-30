import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoutes from "./components/ProtectedRoutes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cake Affair - Cake Management Tool",
  description: "Cake Management Tool",
  icons: {
    icon: "/watermark.png",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}
      >
        <ProtectedRoutes>
          <div
            className="fixed inset-0 z-[-1] opacity-5 pointer-events-none"
            style={{
              backgroundImage: "url(/watermark.png)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
          <Header />
          {children}
          <Footer />
        </ProtectedRoutes>
      </body>
    </html>
  );
}
