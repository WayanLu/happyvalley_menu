"use client";
import { useEffect, useState, useRef } from "react";
import menuData from "./data.json";
import { Row, Col } from "react-bootstrap";

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
  const [navbarHeight, setNavbarHeight] = useState(0);
  const categoryTabRef = useRef<HTMLDivElement>(null);
  const [categoryTabHeight, setCategoryTabHeight] = useState(0);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Function to measure heights accurately
  const updateMeasurements = () => {
    // Get navbar height from data attribute on main element
    const main = document.querySelector("main");
    if (main) {
      const height = main.getAttribute("data-navbar-height");
      setNavbarHeight(height ? parseInt(height, 10) : 56);
    }

    // Measure category tab height
    if (categoryTabRef.current) {
      const height = categoryTabRef.current.getBoundingClientRect().height;
      setCategoryTabHeight(height);
    }

    // Update mobile state
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);
  };

  // Simplified scroll function without focus feature
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(category);
    const menuContainer = menuContainerRef.current;

    if (element && menuContainer) {
      // Just set active category
      setActiveCategory(category);

      if (isMobile) {
        // Get the element position
        const elementPosition = element.offsetTop;

        // Calculate target scroll position with a safety check for negative values
        const targetScrollPosition = Math.max(
          0,
          elementPosition - (navbarHeight + categoryTabHeight),
        );

        // Scroll to position the element just below the headers
        menuContainer.scrollTo({
          top: targetScrollPosition,
          behavior: "smooth",
        });
      } else {
        // For desktop view - simple scroll into view with margin
        const scrollMargin = navbarHeight + 10; // Adding a small extra margin for better visibility
        menuContainer.scrollTo({
          top: element.offsetTop - scrollMargin,
          behavior: "smooth",
        });
      }
    }
  };

  // Update menu position based on category sidebar width
  useEffect(() => {
    const updateMenuPosition = () => {
      if (!isMobile && categoryTabRef.current && menuContainerRef.current) {
        const sidebarWidth = categoryTabRef.current.offsetWidth;
        if (menuContainerRef.current) {
          menuContainerRef.current.style.left = `${sidebarWidth}px`;
        }
      }
    };

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [isMobile]);

  useEffect(() => {
    // Initial measurement with a slight delay to ensure DOM is fully rendered
    setTimeout(updateMeasurements, 100);

    // Update on resize
    window.addEventListener("resize", updateMeasurements);

    // Create MutationObserver for navbar changes
    const mainObserver = new MutationObserver(updateMeasurements);
    const main = document.querySelector("main");
    if (main) {
      mainObserver.observe(main, {
        attributes: true,
        childList: false,
        subtree: false,
      });
    }

    // Prevent body scrolling on desktop
    const preventBodyScroll = () => {
      if (!isMobile) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    preventBodyScroll();
    window.addEventListener("resize", preventBodyScroll);

    return () => {
      window.removeEventListener("resize", updateMeasurements);
      window.removeEventListener("resize", preventBodyScroll);
      document.body.style.overflow = ""; // Reset on component unmount
      mainObserver.disconnect();
    };
  }, [isMobile]);

  // Simplified scroll tracking without focus feature
  useEffect(() => {
    const handleScroll = () => {
      if (!menuContainerRef.current) return;

      // Throttle the scroll event for better performance
      if (!handleScroll.ticking) {
        window.requestAnimationFrame(() => {
          // Get all category elements
          const categoryElements = Object.entries(typedMenuData.menu)
            .map(([category]) => ({
              id: category,
              element: document.getElementById(category),
            }))
            .filter((item) => item.element !== null);

          // Get current scroll position
          const scrollTop = menuContainerRef.current!.scrollTop;
          const containerHeight = menuContainerRef.current!.clientHeight;
          const offset = isMobile
            ? navbarHeight + categoryTabHeight
            : navbarHeight;

          // Find which category is most visible
          let mostVisibleCategory = null;
          let maxVisibleHeight = 0;

          for (const { id, element } of categoryElements) {
            if (!element) continue;

            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const elementBottom = elementTop + elementHeight;

            // For determining visibility, consider the viewport bounds
            const visibleTop = Math.max(elementTop, scrollTop + offset);
            const visibleBottom = Math.min(
              elementBottom,
              scrollTop + containerHeight,
            );
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            if (visibleHeight > maxVisibleHeight) {
              maxVisibleHeight = visibleHeight;
              mostVisibleCategory = id;
            }
          }

          // Update active category if it changed - without centering
          if (mostVisibleCategory && mostVisibleCategory !== activeCategory) {
            setActiveCategory(mostVisibleCategory);
          }

          handleScroll.ticking = false;
        });

        handleScroll.ticking = true;
      }
    };

    // Add property to function for throttling
    handleScroll.ticking = false;

    const container = menuContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [
    activeCategory,
    isMobile,
    navbarHeight,
    categoryTabHeight,
    typedMenuData.menu,
  ]);

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Categories tab */}
      <div
        ref={categoryTabRef}
        className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 border-b sm:border-b-0 sm:border-r border-gray-200 
        h-16 sm:h-auto
        fixed sm:fixed left-0 right-0 z-10
        overflow-x-auto sm:overflow-y-auto bg-white
        flex sm:block"
        style={{
          top: `${navbarHeight}px`,
          height: isMobile ? "64px" : `calc(100vh - ${navbarHeight}px)`,
        }}
      >
        <div className="flex sm:flex-col py-1 sm:py-4 w-full">
          {Object.entries(typedMenuData.menu).map(([category, items]) => (
            <div
              key={category}
              ref={(el) => {
                categoryRefs.current[category] = el;
              }}
              className={`whitespace-nowrap sm:whitespace-normal px-3 py-2 sm:py-2 sm:px-4 
              hover:bg-gray-100 cursor-pointer transition-colors duration-200 
              ${activeCategory === category ? "bg-gray-100 text-gray-900 font-medium" : ""}`}
              onClick={() => scrollToCategory(category)}
            >
              <p
                className={`text-sm sm:text-base ${activeCategory === category ? "text-gray-900" : "text-gray-600"} hover:text-gray-900`}
              >
                {category}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div
        ref={menuContainerRef}
        className="w-full sm:w-2/3 md:w-3/4 lg:w-4/5 overflow-y-auto"
        style={{
          position: "fixed",
          top: isMobile
            ? `${navbarHeight + categoryTabHeight}px`
            : `${navbarHeight}px`,
          bottom: "0",
          right: "0",
          left: isMobile ? "0" : "auto", // Will be set dynamically by the effect
          paddingBottom: "20px",
        }}
      >
        <div className="py-3 sm:py-4 px-4 sm:px-6">
          {Object.entries(typedMenuData.menu).map(([category, items]) => (
            <div
              id={category}
              key={category}
              className="mb-6 sm:mb-8"
              style={{
                scrollMarginTop: isMobile
                  ? `${navbarHeight + categoryTabHeight}px`
                  : `${navbarHeight}px`,
              }}
            >
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
