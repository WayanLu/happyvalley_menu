"use client";
import menuData from "./data.json";
import { Row, Col, Container } from "react-bootstrap";
//import { useRef, useEffect } from "react";

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
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="flex flex-col sm:flex-row h-screen overflow-hidden pt-[56px]">
      {/* Add pt-[56px] to create space for the navbar */}

      {/* Categories - Fixed at top on mobile (below navbar), left side on larger screens */}
      <div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 border-b sm:border-b-0 sm:border-r border-gray-200 h-16 sm:h-[calc(100vh-56px)] sticky top-[56px] z-10 sm:static overflow-x-auto sm:overflow-y-auto bg-white flex sm:block">
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

      {/* Menu Items - Scrollable area with padding at top on mobile */}
      <div className="w-full sm:w-2/3 md:w-3/4 lg:w-4/5 flex-1 overflow-y-auto pt-16 sm:pt-0">
        {/* Added pt-16 to push content below the category bar on mobile */}
        <div className="py-3 sm:py-4 px-4 sm:px-6">
          {Object.entries(typedMenuData.menu).map(([category, items]) => (
            <div
              id={category}
              key={category}
              className="mb-6 sm:mb-8 scroll-mt-[72px] sm:scroll-mt-[56px]"
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
