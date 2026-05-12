import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conscious Cooper",
  description: "Personal brand website for Conscious Cooper.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
