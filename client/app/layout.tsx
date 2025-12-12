import type { Metadata } from "next";
import "./globals.css";
import { ConditionalNavbar } from "./components/ConditionalNavbar";
import DashboardLayout from "./components/DashboardLayout";
import ChatbotFloat from "./components/ChatbotFloat";

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
      <body style={{ margin: 0, padding: 0, background: 'transparent' }}>
        <ConditionalNavbar />
        <DashboardLayout>{children}</DashboardLayout>
        <ChatbotFloat />
      </body>
    </html>
  );
}
