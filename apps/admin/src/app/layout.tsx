import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mantua Admin Dashboard",
  description: "Apple-designed admin dashboard for Mantua e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
