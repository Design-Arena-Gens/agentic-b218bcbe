import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar Soaring Wing",
  description:
    "A stylized flying wing aircraft powered by solar cells drifting across the skies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
