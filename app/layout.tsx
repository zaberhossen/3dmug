import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Mug Designer",
  description:
    "Upload a photo and preview it on a rotating 3D mug. Crop, adjust, and download your mug mockup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
