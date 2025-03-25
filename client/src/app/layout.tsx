import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import CreateNavbar from "@/components/navbar/Navbar";
import CreateMenu from "@/app/page";

const navItems = [
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Admin",
    link: "/admin",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CreateNavbar
          brandName="Happy Valley Seafood Restaurant"
          items={navItems}
        />
        {children}
      </body>
    </html>
  );
}
