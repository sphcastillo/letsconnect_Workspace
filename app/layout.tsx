import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";


export const metadata: Metadata = {
  title: "ThinkTank",
  description: "Capture your ideas seamlessly, collaborate effortlessly with your team or friends, and harness the power of AI to bring your vision to life—all in one intuitive platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />
          <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide">
              {children}
            </div>

          </div>
          </body>
      </html>
    </ClerkProvider>
  );
}
