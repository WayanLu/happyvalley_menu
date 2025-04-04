"use client";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CreateNavbar from "@/components/navbar/Navbar";
import { useState, useEffect } from "react";

const navItems = [
  { name: "About", link: "/about" },
  { name: "Admin", link: "/admin" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We'll still need to measure the navbar for components like CreateMenu
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector(".navbar") as HTMLElement;
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };

    // Initial measurement
    updateNavbarHeight();

    // Update on resize and DOM changes
    window.addEventListener("resize", updateNavbarHeight);
    const observer = new MutationObserver(updateNavbarHeight);
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      observer.observe(navbar, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="fixed top-0 w-full z-50">
          <CreateNavbar
            brandName="Happy Valley Seafood Restaurant"
            items={navItems}
          />
        </header>
        {/* Make navbarHeight available to children via data attribute */}
        <main
          className="flex-grow"
          data-navbar-height={navbarHeight}
          style={{ marginTop: `${navbarHeight}px` }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
