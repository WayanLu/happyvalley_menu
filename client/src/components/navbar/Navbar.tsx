"use client";
import { Navbar, Nav, Container } from "react-bootstrap";

interface CreateNavbarProps {
  brandName: string;
  items: {
    name: string; // Or label, depending on what you're actually using
    link: string; // Or href, depending on what you're actually using
  }[];
}

const CreateNavbar: React.FC<CreateNavbarProps> = ({ brandName, items }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">{brandName}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {items.map((item, index) => (
              <Nav.Link key={index} href={item.link}>
                {item.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CreateNavbar;
