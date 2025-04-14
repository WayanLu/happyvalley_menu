"use client";
import { useState } from "react";
import menuData from "../data.json";
import { Accordion, Button, Form, Modal } from "react-bootstrap";

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

const AdminPage: React.FC = () => {
  const typedMenuData = menuData as MenuData;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    category: string;
    item: MenuItem;
  } | null>(null);

  // Function to handle item deletion
  const handleDeleteItem = () => {
    // Here you would implement the actual deletion logic
    // This is where you'd update your database or state
    console.log(
      `Deleting ${itemToDelete?.item.name} from ${itemToDelete?.category}`,
    );
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Function to prepare item for deletion
  const confirmDelete = (category: string, item: MenuItem) => {
    setItemToDelete({ category, item });
    setShowDeleteModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Menu Admin Panel</h1>

      <Accordion className="mb-4">
        {Object.entries(typedMenuData.menu).map(([category, items], index) => (
          <Accordion.Item
            eventKey={index.toString()}
            key={category}
            className="border rounded-md mb-2"
          >
            <Accordion.Header className="bg-gray-50 hover:bg-gray-100">
              <span className="font-semibold">{category}</span>
            </Accordion.Header>
            <Accordion.Body className="p-0">
              <div className="p-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">
                        $
                        {typeof item.price === "number"
                          ? item.price.toFixed(2)
                          : item.price}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => confirmDelete(category, item)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="p-3">
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="w-full text-green-600 border-green-600 hover:bg-green-50"
                  >
                    + Add New Item to {category}
                  </Button>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <Button
        variant="primary"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + Add New Category
      </Button>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{itemToDelete?.item.name}" from the{" "}
          {itemToDelete?.category} category?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteItem}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPage;
