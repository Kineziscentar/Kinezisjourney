import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinezis Journey",
  description: "Goal-centered coaching platform for Kinezis members.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
