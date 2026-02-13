import type { Metadata } from "next";
import "./globals.css";
import { ConditionalNavbar } from "./components/ConditionalNavbar";
import DashboardLayout from "./components/DashboardLayout";
import ChatbotFloat from "./components/ChatbotFloat";
import { ToastProvider } from "./components/Toast";
import AuthGuard from "./components/AuthHelper";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "Warmly Intro Assistant",
  description: "Generate customized intros for your startups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-linear-to-br from-gray-950 via-slate-800 to-blue-950 text-white antialiased">
        <AuthGuard />
        <ConditionalNavbar />
        <DashboardLayout><ToastProvider>{children}</ToastProvider></DashboardLayout>
        <ChatbotFloat />
      </body>
    </html>
  );
}
