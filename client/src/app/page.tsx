"use client";
import { useEffect, useState, useRef } from "react";
import menuData from "./data.json";
import { Row, Col, Container } from "react-bootstrap";

interface MenuItem {
  id: number;
  name: string;
  price: number | string;
}

interface MenuData {
  menu: {
    [category: string]: MenuItem[];
  };
}

const CreateMenu: React.FC = () => {
  const typedMenuData = menuData as MenuData;
  const [navbarHeight, setNavbarHeight] = useState(56); // Default navbar height
  const categoryTabRef = useRef<HTMLDivElement>(null);
  const [categoryTabHeight, setCategoryTabHeight] = useState(64); // Default (h-16)

  useEffect(() => {
    // Function to update heights
    const updateHeights = () => {
      // Get navbar height
      const navbar = document.querySelector(".navbar") as HTMLElement;
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }

      // Get category tab height
      if (categoryTabRef.current) {
        setCategoryTabHeight(categoryTabRef.current.offsetHeight);
      }
    };

    // Initial update
    updateHeights();

    // Update on resize and when DOM changes
    window.addEventListener("resize", updateHeights);

    // Create MutationObserver for navbar
    const navbarObserver = new MutationObserver(updateHeights);
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      navbarObserver.observe(navbar, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    return () => {
      window.removeEventListener("resize", updateHeights);
      navbarObserver.disconnect();
    };
  }, []);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      // Get the current scroll container
      const scrollContainer = document.querySelector(".overflow-y-auto");

      // Calculate the offset (navbar + category tab height on mobile)
      const isMobile = window.innerWidth < 640; // sm breakpoint is 640px
      const offset = isMobile ? navbarHeight + categoryTabHeight : 0;

      if (scrollContainer && isMobile) {
        // For mobile: we need to scroll the overflowing container
        const elementPosition = element.offsetTop;
        scrollContainer.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      } else {
        // For desktop: we can use the standard scrollIntoView with an offset
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        window.scrollTo({
          top: absoluteElementTop - offset,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen overflow-hidden">
      {/* Categories - Fixed at top on mobile (below navbar), left side on larger screens */}
      <div
        ref={categoryTabRef}
        style={{ top: `${navbarHeight}px` }}
        className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 border-b sm:border-b-0 sm:border-r border-gray-200 
        h-16 sm:h-screen 
        fixed sm:static left-0 right-0 z-10
        overflow-x-auto sm:overflow-y-auto bg-white
        flex sm:block"
      >
        <div className="flex sm:flex-col py-1 sm:py-4 w-full">
          {Object.entries(typedMenuData.menu).map(([category, items]) => (
            <div
              key={category}
              className="whitespace-nowrap sm:whitespace-normal px-3 py-2 sm:py-2 sm:px-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => scrollToCategory(category)}
            >
              <p className="text-sm sm:text-base text-gray-600 hover:text-gray-900">
                {category}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items - Scrollable area */}
      <div
        style={{
          paddingTop: `calc(${navbarHeight}px + ${categoryTabHeight}px)`,
        }}
        className="w-full sm:w-2/3 md:w-3/4 lg:w-4/5 flex-1 overflow-y-auto sm:pt-0"
      >
        <div className="py-3 sm:py-4 px-4 sm:px-6">
          {Object.entries(typedMenuData.menu).map(([category, items]) => (
            <div id={category} key={category} className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                {category}
              </h1>
              <div className="space-y-2 sm:space-y-3">
                {items.map((item) => (
                  <Row key={item.id} className="py-2 border-b border-gray-100">
                    <Col xs={7} sm={8}>
                      <p className="text-sm sm:text-base font-medium">
                        {item.name}
                      </p>
                    </Col>
                    <Col xs={5} sm={4} className="text-right">
                      <p className="text-sm sm:text-base text-gray-700">
                        $
                        {typeof item.price === "number"
                          ? item.price.toFixed(2)
                          : item.price}
                      </p>
                    </Col>
                  </Row>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateMenu;
