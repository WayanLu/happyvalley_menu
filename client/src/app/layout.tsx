"use client";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useState, useEffect } from "react";
import CreateNavbar from "@/components/navbar/Navbar";

// Assuming you have navItems defined somewhere
const navItems = [
  { name: "About", link: "/about" },
  { name: "Admin", link: "/admin" },
]; // Adjust according to your actual navigation items

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navbarHeight, setNavbarHeight] = useState(56);

  useEffect(() => {
    // Function to update navbar height
    const updateNavbarHeight = () => {
      const navbar = document.querySelector(".navbar") as HTMLElement;
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };

    // Initial measurement
    updateNavbarHeight();

    // Update on resize and when DOM changes (navbar toggle)
    window.addEventListener("resize", updateNavbarHeight);

    // Create a MutationObserver to detect navbar height changes
    const observer = new MutationObserver(updateNavbarHeight);
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      observer.observe(navbar, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <html lang="en">
      <body>
        <CreateNavbar
          brandName="Happy Valley Seafood Restaurant"
          items={navItems}
        />
        <div style={{ paddingTop: `${navbarHeight}px` }}>{children}</div>
      </body>
    </html>
  );
}
